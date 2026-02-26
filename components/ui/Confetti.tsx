'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
}

const COLORS = ['#6366f1', '#22d3ee', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];

function createParticles(x: number, y: number, count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x,
    y,
    vx: (Math.random() - 0.5) * 12,
    vy: Math.random() * -14 - 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: Math.random() * 6 + 3,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    life: 1,
  }));
}

function ConfettiCanvas({ origin, onDone }: { origin: { x: number; y: number }; onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = createParticles(origin.x, origin.y, 80);
    let animId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.rotationSpeed;
        p.life -= 0.012;
        p.vx *= 0.99;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }

      if (alive) {
        animId = requestAnimationFrame(animate);
      } else {
        onDone();
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [origin, onDone]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[99999] pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}

// Global trigger
let triggerFn: ((x: number, y: number) => void) | null = null;

export function fireConfetti(x?: number, y?: number) {
  triggerFn?.(x ?? window.innerWidth / 2, y ?? window.innerHeight / 2);
}

export default function ConfettiProvider() {
  const [burst, setBurst] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const trigger = useCallback((x: number, y: number) => {
    setBurst({ x, y });
  }, []);

  useEffect(() => {
    triggerFn = trigger;
    return () => { triggerFn = null; };
  }, [trigger]);

  // Listen for custom events
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      trigger(detail?.x ?? window.innerWidth / 2, detail?.y ?? window.innerHeight / 2);
    };
    window.addEventListener('fire-confetti', handler);
    return () => window.removeEventListener('fire-confetti', handler);
  }, [trigger]);

  if (!mounted) return null;

  return createPortal(
    <>
      {burst && (
        <ConfettiCanvas
          origin={burst}
          onDone={() => setBurst(null)}
        />
      )}
    </>,
    document.body,
  );
}
