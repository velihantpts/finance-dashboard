import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <FileQuestion size={36} className="text-primary" />
        </div>

        <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
        <h2 className="text-lg font-semibold text-foreground mb-2">Page Not Found</h2>
        <p className="text-sm text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/"><ArrowLeft size={16} /> Go Back</Link>
          </Button>
          <Button className="gap-2" asChild>
            <Link href="/"><Home size={16} /> Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
