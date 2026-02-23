'use client';

import { useState, useEffect } from 'react';
import type { TransactionRow } from '@/hooks/useApi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TransactionModalProps {
  transaction?: TransactionRow | null;
  onClose: () => void;
  onSave: () => void;
}

const BLANK = { client: '', type: 'Buy', asset: '', amount: '', status: 'Pending', risk: 'Low', date: '' };

export default function TransactionModal({ transaction, onClose, onSave }: TransactionModalProps) {
  const [form, setForm] = useState(BLANK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!transaction;

  useEffect(() => {
    if (transaction) {
      setForm({
        client: transaction.client,
        type: transaction.type,
        asset: transaction.asset,
        amount: String(transaction.amount),
        status: transaction.status,
        risk: transaction.risk,
        date: transaction.date.slice(0, 10),
      });
    } else {
      setForm(BLANK);
    }
  }, [transaction]);

  const set = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.client || !form.asset || !form.amount || !form.date) {
      setError('All fields are required');
      return;
    }
    if (parseFloat(form.amount) <= 0) {
      setError('Amount must be positive');
      return;
    }

    setLoading(true);
    const url = isEdit ? `/api/transactions/${transaction!.id}` : '/api/transactions';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
    });
    setLoading(false);

    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? 'Something went wrong');
      return;
    }
    onSave();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Transaction' : 'New Transaction'}</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="px-3 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Client</Label>
              <Input value={form.client} onChange={(e) => set('client', e.target.value)} placeholder="Client name" />
            </div>
            <div className="space-y-1.5">
              <Label>Asset</Label>
              <Input value={form.asset} onChange={(e) => set('asset', e.target.value)} placeholder="e.g. AAPL" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => set('type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Buy">Buy</SelectItem>
                  <SelectItem value="Sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Amount (USD)</Label>
              <Input type="number" value={form.amount} onChange={(e) => set('amount', e.target.value)} placeholder="0" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Risk</Label>
              <Select value={form.risk} onValueChange={(v) => set('risk', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading
                ? <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                : isEdit ? 'Save Changes' : 'Create'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
