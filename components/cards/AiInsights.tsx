'use client';

import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface Insight {
  id: string;
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  metric?: string;
}

export default function AiInsights() {
  const { lang } = useLanguage();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/insights')
      .then((r) => r.json())
      .then((r) => setInsights(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'positive': return <TrendingUp size={14} className="text-emerald-400" />;
      case 'negative': return <TrendingDown size={14} className="text-red-400" />;
      default: return <Minus size={14} className="text-amber-400" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'positive': return 'default' as const;
      case 'negative': return 'destructive' as const;
      default: return 'secondary' as const;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-32 mb-4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 mb-3">
              <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-3 w-3/4 mb-1.5" />
                <Skeleton className="h-2.5 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
            <Sparkles size={16} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {lang === 'tr' ? 'AI Insights' : 'AI Insights'}
            </h3>
            <p className="text-[10px] text-muted-foreground">
              {lang === 'tr' ? 'Otomatik pattern analizi' : 'Automated pattern analysis'}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {insights.map((insight) => (
            <div key={insight.id} className="flex gap-3 p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="mt-0.5">{getIcon(insight.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium text-foreground truncate">{insight.title}</span>
                  {insight.metric && (
                    <Badge variant={getBadgeVariant(insight.type)} className="text-[9px] h-4 px-1.5 shrink-0">
                      {insight.metric}
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                  {insight.description}
                </p>
              </div>
            </div>
          ))}
          {insights.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              {lang === 'tr' ? 'Henüz insight yok' : 'No insights available'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
