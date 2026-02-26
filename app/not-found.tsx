import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid404" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid404)" />
        </svg>
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-1/3 -left-32 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 -right-32 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="text-center max-w-lg relative z-10">
        {/* Glitch-style 404 */}
        <div className="relative mb-6">
          <h1 className="text-[120px] sm:text-[160px] font-black text-foreground/[0.04] leading-none tracking-tighter select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Search size={28} className="text-primary" />
              </div>
              <div className="text-left">
                <span className="text-xs font-mono text-primary/60 bg-primary/5 px-2 py-0.5 rounded">404</span>
                <h2 className="text-xl font-bold text-foreground tracking-tight mt-1">Page Not Found</h2>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Check the URL or navigate back to the dashboard.
        </p>

        {/* Quick Links */}
        <div className="flex gap-3 justify-center mb-8">
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/"><ArrowLeft size={15} /> Go Back</Link>
          </Button>
          <Button className="gap-2" asChild>
            <Link href="/"><Home size={15} /> Dashboard</Link>
          </Button>
        </div>

        {/* Helpful links */}
        <div className="border-t border-border pt-6">
          <p className="text-[11px] text-muted-foreground mb-3">Quick navigation</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: 'Analytics', href: '/analytics' },
              { label: 'Transactions', href: '/transactions' },
              { label: 'Reports', href: '/reports' },
              { label: 'Risk', href: '/risk' },
              { label: 'Settings', href: '/settings' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-primary bg-muted/50 hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-primary/20"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
