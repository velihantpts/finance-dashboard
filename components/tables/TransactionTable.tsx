'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Download, Check, Plus, Pencil, Trash2, CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useLanguage } from '@/providers/LanguageProvider';
import { useCurrency } from '@/providers/CurrencyProvider';
import { useTransactions } from '@/hooks/useApi';
import type { TransactionRow } from '@/hooks/useApi';
import TransactionModal from '@/components/ui/TransactionModal';
import EmptyState from '@/components/ui/EmptyState';
import StatusBadge from './StatusBadge';
import RiskBadge from './RiskBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function TransactionTable() {
  const { trans } = useLanguage();
  const { format: formatCur } = useCurrency();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') ?? '');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [filterType, setFilterType] = useState('');
  const [exported, setExported] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTxn, setEditTxn] = useState<TransactionRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TransactionRow | null>(null);
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const filterRef = useRef<HTMLDivElement>(null);

  const { data: transactions, total, totalPages, loading, refetch } = useTransactions({
    search: searchQuery,
    status: filterStatus,
    risk: filterRisk,
    type: filterType,
    page,
    limit: 10,
    dateFrom: dateFrom ? format(dateFrom, 'yyyy-MM-dd') : '',
    dateTo: dateTo ? format(dateTo, 'yyyy-MM-dd') : '',
  });

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [searchQuery, filterStatus, filterRisk, filterType, dateFrom, dateTo]);

  const hasActiveFilter = filterStatus || filterRisk || filterType;
  const hasDateFilter = dateFrom || dateTo;

  const clearFilters = () => { setFilterStatus(''); setFilterRisk(''); setFilterType(''); };
  const clearDates = () => { setDateFrom(undefined); setDateTo(undefined); };

  const handleExport = () => {
    if (!transactions.length) { toast.error(trans.table.noResults); return; }
    const headers = [trans.table.headers.id, trans.table.headers.client, trans.table.headers.type, trans.table.headers.asset, trans.table.headers.amount, trans.table.headers.risk, trans.table.headers.status, trans.table.headers.date];
    const rows = transactions.map((t) => [t.txnId, t.client, t.type, t.asset, t.amount, t.risk, t.status, new Date(t.date).toLocaleDateString()]);
    const csv = '\uFEFF' + [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    toast.success(trans.table.exported);
    setTimeout(() => setExported(false), 2000);
  };

  const openCreate = () => { setEditTxn(null); setModalOpen(true); };
  const openEdit = (txn: TransactionRow) => { setEditTxn(txn); setModalOpen(true); };

  const handleSaved = () => {
    setModalOpen(false);
    const wasEdit = !!editTxn;
    setEditTxn(null);
    refetch();
    wasEdit ? toast.success('Transaction updated') : toast.success('Transaction created');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    const res = await fetch(`/api/transactions/${deleteTarget.id}`, { method: 'DELETE' });
    setDeletingId(null);
    setDeleteTarget(null);
    if (res.ok) { refetch(); toast.success(trans.table.deleted); }
    else { toast.error(trans.table.deleteFailed); }
  };

  // Pagination range
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <>
      <div className="card">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{trans.table.recentTransactions}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">{trans.table.latestActivity}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={trans.table.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-44 sm:w-52 pl-8 text-xs"
              />
            </div>

            {/* Date Range */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={hasDateFilter ? 'secondary' : 'outline'}
                  size="sm"
                  className={`h-8 gap-1.5 text-xs ${hasDateFilter ? 'text-primary border-primary/40' : ''}`}
                >
                  <CalendarIcon size={12} />
                  {hasDateFilter
                    ? `${dateFrom ? format(dateFrom, 'MMM d') : '...'} - ${dateTo ? format(dateTo, 'MMM d') : '...'}`
                    : trans.table.dateRange}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="flex flex-col sm:flex-row">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                  />
                </div>
                {hasDateFilter && (
                  <div className="p-2 border-t border-border">
                    <Button variant="ghost" size="sm" className="w-full h-7 text-xs" onClick={clearDates}>
                      {trans.table.clearDates}
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {/* Filter */}
            <div className="relative" ref={filterRef}>
              <Button
                variant={hasActiveFilter ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setFilterOpen((o) => !o)}
                className={`h-8 gap-1.5 text-xs ${hasActiveFilter ? 'text-primary border-primary/40' : ''}`}
              >
                <Filter size={12} />
                {trans.table.filter}
                {hasActiveFilter && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </Button>
              {filterOpen && (
                <div className="absolute right-0 top-9 z-50 w-56 bg-card border border-border rounded-xl shadow-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-foreground">{trans.filter.title}</p>
                  <div className="space-y-1">
                    <p className="text-[11px] text-muted-foreground">{trans.filter.status}</p>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={trans.filter.all} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{ trans.filter.all}</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] text-muted-foreground">{trans.filter.risk}</p>
                    <Select value={filterRisk} onValueChange={setFilterRisk}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={trans.filter.all} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{trans.filter.all}</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] text-muted-foreground">{trans.filter.type}</p>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={trans.filter.all} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{trans.filter.all}</SelectItem>
                        <SelectItem value="Buy">Buy</SelectItem>
                        <SelectItem value="Sell">Sell</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {hasActiveFilter && (
                    <Button variant="ghost" size="sm" className="w-full h-8 text-xs" onClick={clearFilters}>
                      {trans.filter.clear}
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Export */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className={`h-8 gap-1.5 text-xs ${exported ? 'text-emerald-400 border-emerald-500/30' : ''}`}
            >
              {exported ? <Check size={12} /> : <Download size={12} />}
              {exported ? trans.table.exported : trans.table.export}
            </Button>

            {/* Add */}
            <Button size="sm" onClick={openCreate} className="h-8 gap-1.5 text-xs">
              <Plus size={13} />
              Add
            </Button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            title={trans.table.emptyTitle}
            description={trans.table.emptyDesc}
            actionLabel="Add Transaction"
            onAction={openCreate}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[11px] uppercase tracking-widest">{trans.table.headers.id}</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-widest">{trans.table.headers.client}</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-widest hidden md:table-cell">{trans.table.headers.type}</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-widest hidden lg:table-cell">{trans.table.headers.asset}</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-widest">{trans.table.headers.amount}</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-widest hidden lg:table-cell">{trans.table.headers.risk}</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-widest">{trans.table.headers.status}</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-widest hidden md:table-cell">{trans.table.headers.date}</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((txn) => (
                    <TableRow key={txn.id} className="group">
                      <TableCell>
                        <span className="text-xs font-mono font-medium text-primary">{txn.txnId}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-medium">{txn.client}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className={`text-xs font-medium ${txn.type === 'Buy' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {txn.type}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">{txn.asset}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-semibold">{formatCur(txn.amount)}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <RiskBadge risk={txn.risk as 'Low' | 'Medium' | 'High'} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={txn.status as 'Completed' | 'Pending' | 'Failed'} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {new Date(txn.date).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-primary"
                            onClick={() => openEdit(txn)}
                          >
                            <Pencil size={11} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => setDeleteTarget(txn)}
                            disabled={deletingId === txn.id}
                          >
                            <Trash2 size={11} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  {trans.table.page} {page} {trans.table.of} {totalPages} ({total})
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft size={14} />
                  </Button>
                  {getPageNumbers().map((p) => (
                    <Button
                      key={p}
                      variant={p === page ? 'default' : 'outline'}
                      size="icon"
                      className="h-7 w-7 text-xs"
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{trans.table.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {trans.table.deleteMessage}
              {deleteTarget && (
                <span className="block mt-2 font-mono text-xs text-foreground">{deleteTarget.txnId} — {deleteTarget.client}</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{trans.table.deleteCancel}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>{trans.table.deleteConfirm}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {modalOpen && (
        <TransactionModal
          transaction={editTxn}
          onClose={() => { setModalOpen(false); setEditTxn(null); }}
          onSave={handleSaved}
        />
      )}
    </>
  );
}
