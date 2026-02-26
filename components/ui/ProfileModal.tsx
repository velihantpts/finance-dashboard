'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, Camera, Loader2 } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useProfile } from '@/hooks/useApi';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileModalProps {
  onClose: () => void;
  onProfileUpdated?: () => void;
}

export default function ProfileModal({ onClose, onProfileUpdated }: ProfileModalProps) {
  const { trans, lang } = useLanguage();
  const { data: profile, loading: profileLoading, updateProfile, uploadAvatar } = useProfile();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    phone: '',
  });

  useEffect(() => {
    if (profile) {
      const nameParts = (profile.name || '').split(' ');
      setForm({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: profile.email || '',
        role: profile.role || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const fullName = `${form.firstName} ${form.lastName}`.trim();
      await updateProfile({
        name: fullName,
        email: form.email,
        phone: form.phone,
      });
      setSaved(true);
      onProfileUpdated?.();
      toast.success(lang === 'tr' ? 'Profil güncellendi' : 'Profile updated');
      setTimeout(() => { setSaved(false); onClose(); }, 1200);
    } catch {
      toast.error(lang === 'tr' ? 'Profil güncellenemedi' : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      await uploadAvatar(file);
      onProfileUpdated?.();
      toast.success(lang === 'tr' ? 'Fotoğraf güncellendi' : 'Photo updated');
    } catch {
      toast.error(lang === 'tr' ? 'Fotoğraf yüklenemedi' : 'Failed to upload photo');
      setAvatarPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const initials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  const avatarSrc = avatarPreview || profile?.image;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{trans.profile.title}</DialogTitle>
        </DialogHeader>

        {profileLoading ? (
          <div className="space-y-4 py-2">
            <div className="flex justify-center">
              <Skeleton className="w-20 h-20 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
            <Skeleton className="h-9" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
          </div>
        ) : (
          <>
            {/* Avatar */}
            <div className="flex justify-center py-2">
              <div className="relative">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                    {initials}
                  </div>
                )}
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
                  onClick={handleAvatarClick}
                  disabled={uploading}
                >
                  {uploading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleFileChange}
                />
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
                  <Input value={form.role} readOnly className="opacity-60 cursor-not-allowed" />
                </div>
                <div className="space-y-1.5">
                  <Label>{trans.profile.phone}</Label>
                  <Input value={form.phone} onChange={update('phone')} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={onClose} disabled={saving}>
                  {trans.profile.cancel}
                </Button>
                <Button
                  className={`flex-1 gap-2 ${saved ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}
                  onClick={handleSave}
                  disabled={saving || saved}
                >
                  {saving ? (
                    <><Loader2 size={13} className="animate-spin" /> {lang === 'tr' ? 'Kaydediliyor...' : 'Saving...'}</>
                  ) : saved ? (
                    <><Check size={13} /> {trans.profile.saved}</>
                  ) : (
                    trans.profile.save
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
