'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Filter, Download, Check } from 'lucide-react';
import { transactions } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/providers/LanguageProvider';
import StatusBadge from './StatusBadge';
import RiskBadge from './RiskBadge';

export default function TransactionTable() {
  const { trans } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [filterType, setFilterType] = useState('');
  const [exported, setExported] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        t.client.toLowerCase().includes(q) ||
        t.asset.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q);
      const matchesStatus = !filterStatus || t.status === filterStatus;
      const matchesRisk = !filterRisk || t.risk === filterRisk;
      const matchesType = !filterType || t.type === filterType;
      return matchesSearch && matchesStatus && matchesRisk && matchesType;
    });
  }, [searchQuery, filterStatus, filterRisk, filterType]);

  const hasActiveFilter = filterStatus || filterRisk || filterType;

  const clearFilters = () => {
    setFilterStatus('');
    setFilterRisk('');
    setFilterType('');
  };

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const tableHeaders = [
    trans.table.headers.id,
    trans.table.headers.client,
    trans.table.headers.type,
    trans.table.headers.asset,
    trans.table.headers.amount,
    trans.table.headers.risk,
    trans.table.headers.status,
    trans.table.headers.date,
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{trans.table.recentTransactions}</h3>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{trans.table.latestActivity}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder={trans.table.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-48 pl-8 pr-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-[11px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
            />
          </div>
          {/* Filter */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className={`h-8 px-3 rounded-lg border text-[11px] flex items-center gap-1.5 transition-colors ${
                hasActiveFilter
                  ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400'
                  : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <Filter size={12} />
              {trans.table.filter}
              {hasActiveFilter && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-9 z-50 w-56 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-[var(--text-primary)]">{trans.filter.title}</p>
                <div>
                  <label className="text-[11px] text-[var(--text-muted)] block mb-1">{trans.filter.status}</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full h-8 px-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-[11px] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                  >
                    <option value="">{trans.filter.all}</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-[var(--text-muted)] block mb-1">{trans.filter.risk}</label>
                  <select
                    value={filterRisk}
                    onChange={(e) => setFilterRisk(e.target.value)}
                    className="w-full h-8 px-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-[11px] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                  >
                    <option value="">{trans.filter.all}</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-[var(--text-muted)] block mb-1">{trans.filter.type}</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full h-8 px-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-[11px] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                  >
                    <option value="">{trans.filter.all}</option>
                    <option value="Buy">Buy</option>
                    <option value="Sell">Sell</option>
                  </select>
                </div>
                {hasActiveFilter && (
                  <button
                    onClick={clearFilters}
                    className="w-full h-8 rounded-lg text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    {trans.filter.clear}
                  </button>
                )}
              </div>
            )}
          </div>
          {/* Export */}
          <button
            onClick={handleExport}
            className={`h-8 px-3 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-all ${
              exported
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20'
            }`}
          >
            {exported ? <Check size={12} /> : <Download size={12} />}
            {exported ? trans.table.exported : trans.table.export}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {tableHeaders.map((h) => (
                <th
                  key={h}
                  className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] font-medium text-left py-3.5 px-4 first:pl-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-[var(--text-muted)]">
                  {trans.table.noResults}
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn) => (
                <tr
                  key={txn.id}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <td className="py-3.5 px-4 pl-0">
                    <span className="text-xs font-mono font-medium text-indigo-400">{txn.id}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-medium text-[var(--text-primary)]">{txn.client}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-xs font-medium ${txn.type === 'Buy' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs text-[var(--text-secondary)]">{txn.asset}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      {formatCurrency(txn.amount)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <RiskBadge risk={txn.risk} />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={txn.status} />
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs text-[var(--text-muted)]">{txn.date}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
