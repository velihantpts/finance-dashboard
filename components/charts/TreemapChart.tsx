'use client';

import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { usePortfolio } from '@/hooks/useApi';
import { useLanguage } from '@/providers/LanguageProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface TreemapNode {
  name: string;
  size: number;
  fill: string;
  [key: string]: string | number;
}

function CustomContent({ x, y, width, height, name, fill }: { x: number; y: number; width: number; height: number; name: string; fill: string }) {
  if (width < 40 || height < 30) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={8} fill={fill} fillOpacity={0.85} stroke={fill} strokeWidth={1.5} strokeOpacity={0.3} />
      <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={600}>{name}</text>
      <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="#ffffffaa" fontSize={10}></text>
    </g>
  );
}

export default function TreemapChart() {
  const { data, loading } = usePortfolio();
  const { lang } = useLanguage();

  if (loading || !data) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-40 mb-4" />
          <Skeleton className="h-[220px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  const treemapData: TreemapNode[] = data.map((item) => ({
    name: item.name,
    size: item.value,
    fill: item.color,
  }));

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-1">
          {lang === 'tr' ? 'Portföy Treemap' : 'Portfolio Treemap'}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          {lang === 'tr' ? 'Varlık dağılımı görselleştirmesi' : 'Asset allocation visualization'}
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <Treemap
            data={treemapData}
            dataKey="size"
            nameKey="name"
            content={<CustomContent x={0} y={0} width={0} height={0} name="" fill="" />}
          >
            <Tooltip
              formatter={(value) => [`${value}%`, '']}
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
            />
          </Treemap>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
