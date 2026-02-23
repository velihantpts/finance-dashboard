'use client';

import { useState } from 'react';
import { Check, Camera } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{trans.profile.title}</DialogTitle>
        </DialogHeader>

        {/* Avatar */}
        <div className="flex justify-center py-2">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              VT
            </div>
            <Button
              size="icon"
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
            >
              <Camera size={12} />
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{trans.profile.firstName}</Label>
              <Input value={form.firstName} onChange={update('firstName')} />
            </div>
            <div className="space-y-1.5">
              <Label>{trans.profile.lastName}</Label>
              <Input value={form.lastName} onChange={update('lastName')} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{trans.profile.email}</Label>
            <Input type="email" value={form.email} onChange={update('email')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{trans.profile.role}</Label>
              <Input value={form.role} onChange={update('role')} />
            </div>
            <div className="space-y-1.5">
              <Label>{trans.profile.phone}</Label>
              <Input value={form.phone} onChange={update('phone')} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              {trans.profile.cancel}
            </Button>
            <Button
              className={`flex-1 gap-2 ${saved ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}
              onClick={handleSave}
            >
              {saved ? <><Check size={13} /> {trans.profile.saved}</> : trans.profile.save}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
