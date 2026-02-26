'use client';

import { useEffect, useRef, useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, Copy } from 'lucide-react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import type { ComponentType } from 'react';
import { useLanguage } from '@/providers/LanguageProvider';
import { Card, CardContent } from '@/components/ui/card';
import { copyToClipboard } from '@/lib/clipboard';

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  trend: 'up' | 'down';
  accent: string;
  index?: number;
}

// Generate sparkline data based on trend
function useSparklineData(trend: 'up' | 'down') {
  return useMemo(() => {
    const points: number[] = [];
    let val = 50;
    for (let i = 0; i < 12; i++) {
      val += (Math.random() - (trend === 'up' ? 0.35 : 0.65)) * 15;
      val = Math.max(10, Math.min(90, val));
      points.push(val);
    }
    // Ensure final trend direction
    if (trend === 'up') points[11] = Math.max(points[11], 65);
    else points[11] = Math.min(points[11], 35);
    return points;
  }, [trend]);
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const width = 80;
  const height = 28;
  const padding = 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${width - padding},${height} L ${padding},${height} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#spark-${color.replace('#', '')})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AnimatedValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  const numericMatch = value.match(/([\d,.]+)/);
  const numericValue = numericMatch ? parseFloat(numericMatch[1].replace(/,/g, '')) : 0;
  const prefix = value.slice(0, value.indexOf(numericMatch?.[1] ?? ''));
  const suffix = value.slice((value.indexOf(numericMatch?.[1] ?? '') + (numericMatch?.[1]?.length ?? 0)));

  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) => {
    if (numericValue >= 1000) {
      return v.toLocaleString('en-US', { minimumFractionDigits: numericValue % 1 !== 0 ? 1 : 0, maximumFractionDigits: 1 });
    }
    return v.toLocaleString('en-US');
  });

  useEffect(() => {
    if (isInView) spring.set(numericValue);
  }, [isInView, spring, numericValue]);

  if (!numericMatch) return <span>{value}</span>;

  return (
    <span ref={ref}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

export default function KpiCard({ title, value, change, icon: Icon, trend, accent, index = 0 }: KpiCardProps) {
  const { trans } = useLanguage();
  const sparkData = useSparklineData(trend);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
    >
      <Card className="group hover:-translate-y-0.5 transition-all duration-300 relative">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                {title}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-[28px] font-bold text-foreground leading-none tracking-tight">
                  <AnimatedValue value={value} />
                </p>
                {/* Copy button */}
                <button
                  onClick={() => copyToClipboard(value, title)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                  title="Copy value"
                >
                  <Copy size={11} className="text-muted-foreground" />
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${accent}15`, color: accent }}
              >
                <Icon size={22} />
              </div>
              {/* Sparkline */}
              <Sparkline data={sparkData} color={accent} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4">
            {trend === 'up' ? (
              <ArrowUpRight size={14} className="text-emerald-400" />
            ) : (
              <ArrowDownRight size={14} className="text-red-400" />
            )}
            <span className={`text-xs font-medium ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
              {change}
            </span>
            <span className="text-[11px] text-muted-foreground">{trans.kpi.vsLastMonth}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
