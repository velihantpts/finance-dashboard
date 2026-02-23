'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Generic fetcher ─────────────────────────────────────────────────────────

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((r) => { setData(r.data); setError(null); })
      .catch(() => setError('Failed to fetch'))
      .finally(() => setLoading(false));
  }, [url]);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, error, refetch };
}

// ─── KPI ─────────────────────────────────────────────────────────────────────

export interface KpiMetric {
  id: string;
  key: string;
  value: string;
  change: string;
  trend: string;
}

export function useKpi() {
  return useFetch<KpiMetric[]>('/api/kpi');
}

// ─── Revenue ─────────────────────────────────────────────────────────────────

export interface RevenueRow {
  id: string;
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export function useRevenue() {
  return useFetch<RevenueRow[]>('/api/revenue');
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

export interface PortfolioItem {
  id: string;
  name: string;
  value: number;
  color: string;
}

export function usePortfolio() {
  return useFetch<PortfolioItem[]>('/api/portfolio');
}

// ─── Risk Scores ──────────────────────────────────────────────────────────────

export interface RiskScoreRow {
  id: string;
  category: string;
  score: number;
  previous: number;
}

export function useRiskScores() {
  return useFetch<RiskScoreRow[]>('/api/risk-scores');
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface StatsData {
  avgTransaction: number;
  settlementRate: number;
  completed: number;
  pending: number;
  failed: number;
  total: number;
}

export function useStats() {
  return useFetch<StatsData>('/api/stats');
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export interface TransactionRow {
  id: string;
  txnId: string;
  client: string;
  type: string;
  asset: string;
  amount: number;
  status: string;
  risk: string;
  date: string;
}

export interface TransactionParams {
  search?: string;
  status?: string;
  risk?: string;
  type?: string;
  page?: number;
}

export function useTransactions(params: TransactionParams = {}) {
  const { search = '', status = '', risk = '', type = '', page = 1 } = params;

  const [data, setData] = useState<TransactionRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildUrl = useCallback(() => {
    const q = new URLSearchParams();
    if (search) q.set('search', search);
    if (status) q.set('status', status);
    if (risk)   q.set('risk', risk);
    if (type)   q.set('type', type);
    q.set('page', String(page));
    return `/api/transactions?${q.toString()}`;
  }, [search, status, risk, type, page]);

  const refetch = useCallback(() => {
    setLoading(true);
    fetch(buildUrl())
      .then((r) => r.json())
      .then((r) => { setData(r.data ?? []); setTotal(r.total ?? 0); setError(null); })
      .catch(() => setError('Failed to fetch transactions'))
      .finally(() => setLoading(false));
  }, [buildUrl]);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, total, loading, error, refetch };
}
