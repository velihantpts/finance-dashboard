'use client';

import { LogOut } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

interface LogoutModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ onClose, onConfirm }: LogoutModalProps) {
  const { trans } = useLanguage();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl shadow-2xl p-6">
        <div className="w-12 h-12 rounded-2xl bg-red-400/10 flex items-center justify-center mx-auto mb-4">
          <LogOut size={22} className="text-red-400" />
        </div>
        <h2 className="text-base font-semibold text-[var(--text-primary)] text-center mb-2">{trans.logout.title}</h2>
        <p className="text-sm text-[var(--text-muted)] text-center mb-6">{trans.logout.message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-9 rounded-lg border border-[var(--border)] text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors">
            {trans.logout.cancel}
          </button>
          <button onClick={onConfirm} className="flex-1 h-9 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors">
            {trans.logout.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
