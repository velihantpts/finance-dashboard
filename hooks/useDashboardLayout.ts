'use client';

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'dashboard_layout_order';

const DEFAULT_ORDER = [
  'kpi-grid',
  'charts-row-1',
  'charts-row-2',
  'charts-row-3',
];

export function useDashboardLayout() {
  const [order, setOrder] = useState<string[]>(DEFAULT_ORDER);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        // Ensure all default items are present
        const valid = parsed.filter((id) => DEFAULT_ORDER.includes(id));
        const missing = DEFAULT_ORDER.filter((id) => !valid.includes(id));
        setOrder([...valid, ...missing]);
      }
    } catch {
      // use default
    }
  }, []);

  const updateOrder = useCallback((newOrder: string[]) => {
    setOrder(newOrder);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
  }, []);

  const resetLayout = useCallback(() => {
    setOrder(DEFAULT_ORDER);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const toggleEditMode = useCallback(() => setEditMode((e) => !e), []);

  return { order, updateOrder, editMode, toggleEditMode, resetLayout };
}
