'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/LanguageProvider';

interface TourStep {
  selector: string;
  title: { en: string; tr: string };
  description: { en: string; tr: string };
}

const STEPS: TourStep[] = [
  {
    selector: '[data-tour="sidebar"]',
    title: { en: 'Navigation', tr: 'Navigasyon' },
    description: {
      en: 'Use the sidebar to navigate between Dashboard, Analytics, Transactions, Reports, Risk Management, and Settings.',
      tr: 'Kenar çubuğunu kullanarak Panel, Analitik, İşlemler, Raporlar, Risk Yönetimi ve Ayarlar arasında gezinin.',
    },
  },
  {
    selector: '[data-tour="kpi"]',
    title: { en: 'Key Metrics', tr: 'Temel Metrikler' },
    description: {
      en: 'These KPI cards show your most important financial metrics at a glance — AUM, Revenue, Clients, and Transactions.',
      tr: 'KPI kartları en önemli finansal metriklerinizi gösterir — AUM, Gelir, Müşteriler ve İşlemler.',
    },
  },
  {
    selector: '[data-tour="charts"]',
    title: { en: 'Charts & Visualizations', tr: 'Grafikler & Görselleştirmeler' },
    description: {
      en: 'Interactive charts display revenue trends, portfolio allocation, and profit analysis to help you make informed decisions.',
      tr: 'Etkileşimli grafikler gelir trendlerini, portföy dağılımını ve kâr analizini gösterir.',
    },
  },
  {
    selector: '[data-tour="table"]',
    title: { en: 'Transaction Management', tr: 'İşlem Yönetimi' },
    description: {
      en: 'View, search, filter, and manage all your transactions. Export data as CSV or PDF with a single click.',
      tr: 'Tüm işlemlerinizi görüntüleyin, arayın, filtreleyin ve yönetin. Verileri CSV veya PDF olarak dışa aktarın.',
    },
  },
  {
    selector: '[data-tour="notifications"]',
    title: { en: 'Real-time Notifications', tr: 'Gerçek Zamanlı Bildirimler' },
    description: {
      en: 'Stay informed with real-time alerts for risk thresholds, completed transactions, and compliance updates.',
      tr: 'Risk eşikleri, tamamlanan işlemler ve uyumluluk güncellemeleri için gerçek zamanlı uyarılarla bilgilenin.',
    },
  },
  {
    selector: '[data-tour="search"]',
    title: { en: 'Quick Search', tr: 'Hızlı Arama' },
    description: {
      en: 'Press Ctrl+K to open the command palette. Use keyboard shortcuts like G→D for Dashboard, G→A for Analytics.',
      tr: 'Komut paletini açmak için Ctrl+K tuşlayın. G→D Panel, G→A Analitik gibi klavye kısayollarını kullanın.',
    },
  },
  {
    selector: '[data-tour="theme"]',
    title: { en: 'Customize Your Experience', tr: 'Deneyiminizi Özelleştirin' },
    description: {
      en: 'Toggle between dark and light themes, switch languages, and personalize your dashboard in Settings.',
      tr: 'Karanlık ve aydınlık temalar arasında geçiş yapın, dil değiştirin ve paneli Ayarlar\'da kişiselleştirin.',
    },
  },
];

interface OnboardingTourProps {
  active: boolean;
  step: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onFinish: () => void;
}

export default function OnboardingTour({ active, step, onNext, onPrev, onSkip, onFinish }: OnboardingTourProps) {
  const { lang } = useLanguage();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateTargetRect = useCallback(() => {
    if (!active || step >= STEPS.length) return;
    const el = document.querySelector(STEPS[step].selector);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setTargetRect(null);
    }
  }, [active, step]);

  useEffect(() => {
    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);
    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [updateTargetRect]);

  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSkip();
      if (e.key === 'ArrowRight') {
        if (step < STEPS.length - 1) onNext();
        else onFinish();
      }
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, step, onNext, onPrev, onSkip, onFinish]);

  if (!mounted || !active || step >= STEPS.length) return null;

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const padding = 8;

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const tooltipWidth = 340;
    const tooltipHeight = 200;
    const gap = 16;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Prefer placing below
    if (targetRect.bottom + gap + tooltipHeight < vh) {
      return {
        top: targetRect.bottom + gap,
        left: Math.min(Math.max(16, targetRect.left), vw - tooltipWidth - 16),
      };
    }
    // Try above
    if (targetRect.top - gap - tooltipHeight > 0) {
      return {
        top: targetRect.top - gap - tooltipHeight,
        left: Math.min(Math.max(16, targetRect.left), vw - tooltipWidth - 16),
      };
    }
    // Try right
    if (targetRect.right + gap + tooltipWidth < vw) {
      return {
        top: Math.min(Math.max(16, targetRect.top), vh - tooltipHeight - 16),
        left: targetRect.right + gap,
      };
    }
    // Fallback: center
    return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  };

  const overlay = (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Dark overlay with hole */}
          <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            <defs>
              <mask id="tour-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                {targetRect && (
                  <rect
                    x={targetRect.left - padding}
                    y={targetRect.top - padding}
                    width={targetRect.width + padding * 2}
                    height={targetRect.height + padding * 2}
                    rx="12"
                    fill="black"
                  />
                )}
              </mask>
            </defs>
            <rect
              x="0" y="0" width="100%" height="100%"
              fill="rgba(0,0,0,0.6)"
              mask="url(#tour-mask)"
              style={{ pointerEvents: 'auto' }}
              onClick={onSkip}
            />
          </svg>

          {/* Spotlight border */}
          {targetRect && (
            <motion.div
              className="absolute rounded-xl border-2 border-primary/60 shadow-[0_0_30px_rgba(99,102,241,0.3)]"
              style={{
                top: targetRect.top - padding,
                left: targetRect.left - padding,
                width: targetRect.width + padding * 2,
                height: targetRect.height + padding * 2,
                pointerEvents: 'none',
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Tooltip */}
          <motion.div
            className="absolute w-[340px] bg-card border border-border rounded-2xl shadow-2xl p-5"
            style={{ ...getTooltipStyle(), zIndex: 10000 }}
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles size={14} className="text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground">{currentStep.title[lang]}</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onSkip}>
                <X size={12} />
              </Button>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              {currentStep.description[lang]}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === step ? 'bg-primary' : i < step ? 'bg-primary/40' : 'bg-muted-foreground/20'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">
                  {step + 1} / {STEPS.length}
                </span>
                {step > 0 && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={onPrev}>
                    <ChevronLeft size={12} />
                  </Button>
                )}
                {isLast ? (
                  <Button size="sm" className="h-7 text-xs px-3" onClick={onFinish}>
                    {lang === 'tr' ? 'Bitir' : 'Finish'}
                  </Button>
                ) : (
                  <Button size="sm" className="h-7 text-xs px-3 gap-1" onClick={onNext}>
                    {lang === 'tr' ? 'İleri' : 'Next'}
                    <ChevronRight size={12} />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(overlay, document.body);
}
