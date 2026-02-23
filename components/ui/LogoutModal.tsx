'use client';

import { LogOut } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LogoutModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ onClose, onConfirm }: LogoutModalProps) {
  const { trans } = useLanguage();
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-2">
            <LogOut size={22} className="text-destructive" />
          </div>
          <DialogTitle>{trans.logout.title}</DialogTitle>
          <DialogDescription>{trans.logout.message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row gap-3 sm:justify-center">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {trans.logout.cancel}
          </Button>
          <Button variant="destructive" className="flex-1" onClick={onConfirm}>
            {trans.logout.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
