'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Download, Check, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTransactions } from '@/hooks/useApi';
import type { TransactionRow } from '@/hooks/useApi';
import TransactionModal from '@/components/ui/TransactionModal';
import StatusBadge from './StatusBadge';
import RiskBadge from './RiskBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TransactionTable() {
  const { trans } = useLanguage();
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
  const filterRef = useRef<HTMLDivElement>(null);

  const { data: transactions, loading, refetch } = useTransactions({
    search: searchQuery,
    status: filterStatus,
    risk: filterRisk,
    type: filterType,
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

  const hasActiveFilter = filterStatus || filterRisk || filterType;

  const clearFilters = () => { setFilterStatus(''); setFilterRisk(''); setFilterType(''); };

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

  const handleDelete = async (txn: TransactionRow) => {
    if (!confirm(`Delete transaction ${txn.txnId}?`)) return;
    setDeletingId(txn.id);
    const res = await fetch(`/api/transactions/${txn.id}`, { method: 'DELETE' });
    setDeletingId(null);
    if (res.ok) { refetch(); toast.success('Transaction deleted'); }
    else { toast.error('Failed to delete transaction'); }
  };

  return (
    <>
      <div className="card">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{trans.table.recentTransactions}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">{trans.table.latestActivity}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={trans.table.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-52 pl-8 text-xs"
              />
            </div>

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
                        <SelectItem value="">{trans.filter.all}</SelectItem>
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
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-widest">{trans.table.headers.id}</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-widest">{trans.table.headers.client}</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-widest">{trans.table.headers.type}</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-widest">{trans.table.headers.asset}</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-widest">{trans.table.headers.amount}</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-widest">{trans.table.headers.risk}</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-widest">{trans.table.headers.status}</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-widest">{trans.table.headers.date}</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-8 text-center text-xs text-muted-foreground">
                      {trans.table.noResults}
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((txn) => (
                    <TableRow key={txn.id} className="group">
                      <TableCell>
                        <span className="text-xs font-mono font-medium text-primary">{txn.txnId}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-medium">{txn.client}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs font-medium ${txn.type === 'Buy' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {txn.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">{txn.asset}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-semibold">{formatCurrency(txn.amount)}</span>
                      </TableCell>
                      <TableCell>
                        <RiskBadge risk={txn.risk as 'Low' | 'Medium' | 'High'} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={txn.status as 'Completed' | 'Pending' | 'Failed'} />
                      </TableCell>
                      <TableCell>
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
                            onClick={() => handleDelete(txn)}
                            disabled={deletingId === txn.id}
                          >
                            <Trash2 size={11} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

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
