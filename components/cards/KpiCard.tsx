'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import type { ComponentType } from 'react';
import { useLanguage } from '@/providers/LanguageProvider';
import { Card, CardContent } from '@/components/ui/card';

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  trend: 'up' | 'down';
  accent: string;
  index?: number;
}

function AnimatedValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  // Extract numeric part for animation
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
    >
      <Card className="group hover:-translate-y-0.5 transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                {title}
              </p>
              <p className="text-[28px] font-bold text-foreground leading-none tracking-tight">
                <AnimatedValue value={value} />
              </p>
            </div>
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${accent}15`, color: accent }}
            >
              <Icon size={22} />
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
