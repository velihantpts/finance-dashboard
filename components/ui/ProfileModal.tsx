'use client';

import { useState } from 'react';
import { X, Check, Camera } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

interface ProfileModalProps {
  onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const { trans } = useLanguage();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: 'Velihan',
    lastName: 'T.',
    email: 'velihan@financehub.io',
    role: 'Administrator',
    phone: '+90 555 123 4567',
  });

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1500);
  };

  const inputClass = 'w-full h-9 px-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all';
  const labelClass = 'text-[11px] text-[var(--text-muted)] font-medium block mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">{trans.profile.title}</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-[var(--bg-tertiary)] flex items-center justify-center transition-colors">
            <X size={14} className="text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex justify-center pt-6 pb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              VT
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg hover:bg-indigo-600 transition-colors">
              <Camera size={12} />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>{trans.profile.firstName}</label>
              <input className={inputClass} value={form.firstName} onChange={update('firstName')} />
            </div>
            <div>
              <label className={labelClass}>{trans.profile.lastName}</label>
              <input className={inputClass} value={form.lastName} onChange={update('lastName')} />
            </div>
          </div>
          <div>
            <label className={labelClass}>{trans.profile.email}</label>
            <input className={inputClass} value={form.email} onChange={update('email')} type="email" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>{trans.profile.role}</label>
              <input className={inputClass} value={form.role} onChange={update('role')} />
            </div>
            <div>
              <label className={labelClass}>{trans.profile.phone}</label>
              <input className={inputClass} value={form.phone} onChange={update('phone')} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 h-9 rounded-lg border border-[var(--border)] text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors">
              {trans.profile.cancel}
            </button>
            <button
              onClick={handleSave}
              className={`flex-1 h-9 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
            >
              {saved ? <><Check size={13} /> {trans.profile.saved}</> : trans.profile.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
