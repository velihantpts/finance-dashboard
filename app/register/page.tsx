'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? 'Registration failed.'); }
    else { router.push('/login'); }
  };

  const fields = [
    { label: 'Full Name', type: 'text', value: name, set: setName, placeholder: 'John Doe' },
    { label: 'Email', type: 'email', value: email, set: setEmail, placeholder: 'you@example.com' },
    { label: 'Password', type: 'password', value: password, set: setPassword, placeholder: '••••••••' },
    { label: 'Confirm Password', type: 'password', value: confirm, set: setConfirm, placeholder: '••••••••' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Activity size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">FinanceHub</h1>
          <p className="text-sm text-muted-foreground mt-1">Create your account</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-foreground mb-1">Create Account</h2>
          <p className="text-xs text-muted-foreground mb-6">Fill in the details below to register</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ label, type, value, set, placeholder }) => (
              <div key={label} className="space-y-1.5">
                <Label>{label}</Label>
                <Input
                  type={type}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  placeholder={placeholder}
                  required
                />
              </div>
            ))}

            <Button type="submit" className="w-full gap-2 mt-2" disabled={loading}>
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <><UserPlus size={15} /> Create Account</>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:text-primary/80 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
