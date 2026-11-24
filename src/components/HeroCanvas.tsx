import React, {useEffect, useRef} from 'react';
import {perlin2} from '../lib/noise';

interface Particle {
  x: number; // px
  y: number; // px
  len: number;
  width: number;
  tone: number;
  speed: number;
  life: number; // seconds elapsed
  maxLife: number;
}

const DESKTOP_COUNT = 2200;
const MOBILE_COUNT = Math.round(DESKTOP_COUNT * 0.4);

interface HeroCanvasProps {
  density?: number;
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({density = 1}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', {alpha: false});
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let rafId = 0;
    let last = performance.now();
    let clock = 0;
    let visible = true;

    let targetVx = 0.5;
    let targetVy = 0.56;
    let vx = 0.5;
    let vy = 0.56;

    const spawn = (p?: Particle, scatterLife = false): Particle => {
      const o: Particle = p ?? {
        x: 0, y: 0, len: 0, width: 0, tone: 0, speed: 0, life: 0, maxLife: 0,
      };
      o.x = Math.random() * width;
      o.y = Math.random() * height;
      o.len = 7 + Math.random() * 15;
      o.width = 1.4 + Math.random() * 2.1;
      o.tone = Math.random();
      o.speed = 0.6 + Math.random() * 0.9;
      o.maxLife = 4 + Math.random() * 6;
      o.life = scatterLife ? Math.random() * o.maxLife : 0;
      return o;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      const base = width < 768 ? MOBILE_COUNT : DESKTOP_COUNT;
      const count = Math.max(120, Math.round(base * density));
      particles = Array.from({length: count}, () => spawn(undefined, true));
    };

    const colorFor = (p: Particle, normDist: number) => {
      const lowerOrCenter = (p.y / height) * 0.65 + (1 - normDist) * 0.45;
      if (lowerOrCenter > 0.62) {
        if (p.tone < 0.42) return 'rgb(232,217,196)';
        if (p.tone < 0.75) return 'rgb(217,196,168)';
        if (p.tone < 0.9) return 'rgb(10,31,107)';
        return 'rgb(255,250,242)';
      }
      if (p.tone < 0.38) return 'rgb(10,31,107)';
      if (p.tone < 0.72) return 'rgb(30,74,214)';
      if (p.tone < 0.9) return 'rgb(217,196,168)';
      return 'rgb(147,180,255)';
    };

    const draw = (dt: number) => {
      clock += dt * 0.35;
      const t = clock;

      ctx.save();
      ctx.scale(dpr, dpr);

      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, '#071F78');
      bg.addColorStop(0.38, '#0B2FA8');
      bg.addColorStop(0.68, '#5E72A8');
      bg.addColorStop(0.88, '#CEB99C');
      bg.addColorStop(1, '#D9C4A8');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Breathing vortex center
      const cx = vx * width + Math.sin(t * 0.5) * width * 0.012;
      const cy = vy * height + Math.cos(t * 0.4) * height * 0.012;

      const pulse = 1 + Math.sin(t * 0.9) * 0.05;
      const glowR = Math.max(width, height) * 0.48 * pulse;
      const glow = ctx.createRadialGradient(cx, cy, 8, cx, cy, glowR);
      glow.addColorStop(0, 'rgba(244,232,214,0.72)');
      glow.addColorStop(0.28, 'rgba(217,196,168,0.42)');
      glow.addColorStop(0.62, 'rgba(11,47,168,0.14)');
      glow.addColorStop(1, 'rgba(10,31,107,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      ctx.lineCap = 'round';
      const maxDim = Math.max(width, height);
      const swirlBreath = Math.sin(t * 0.35) * 0.18;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.hypot(dx, dy);
        const normDist = Math.min(1, dist / (maxDim * 0.65));

        const nVal = perlin2(p.x * 0.004 + t * 0.12, p.y * 0.004 - t * 0.09);
        const angle =
          Math.atan2(dy, dx) + 1.28 - normDist * 0.35 + swirlBreath + nVal * 0.95;

        // Advance along field; faster near the vortex
        const vel = p.speed * (28 + 90 * (1 - normDist)) * 0.35;
        p.x += Math.cos(angle) * vel * dt;
        p.y += Math.sin(angle) * vel * dt;
        p.life += dt;

        if (
          p.life > p.maxLife ||
          p.x < -20 || p.x > width + 20 ||
          p.y < -20 || p.y > height + 20 ||
          dist < 6
        ) {
          spawn(p);
          continue;
        }

        // Fade in / out over life
        const k = p.life / p.maxLife;
        const alpha = Math.min(1, k * 6, (1 - k) * 6) * 0.85;

        const half = (p.len * (0.8 + vel / 220)) * 0.5;
        const c = Math.cos(angle);
        const s = Math.sin(angle);

        ctx.globalAlpha = alpha;
        ctx.strokeStyle = colorFor(p, normDist);
        ctx.lineWidth = p.width;
        ctx.beginPath();
        ctx.moveTo(p.x - c * half, p.y - s * half);
        ctx.lineTo(p.x + c * half, p.y + s * half);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible) {
        vx += (targetVx - vx) * 0.05;
        vy += (targetVy - vy) * 0.05;
        draw(dt);
      }
      rafId = requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      const nx = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      const ny = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
      targetVx = 0.35 + nx * 0.3;
      targetVy = 0.4 + ny * 0.32;
    };
    const onPointerLeave = () => {
      targetVx = 0.5;
      targetVy = 0.56;
    };

    resize();

    last = performance.now();
    rafId = requestAnimationFrame(tick);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      {threshold: 0}
    );
    io.observe(canvas);

    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block"
      aria-label="Generative cobalt and sand vortex flow field"
    />
  );
};