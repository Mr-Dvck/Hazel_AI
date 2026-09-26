'use client';

import React, { useEffect, useRef } from 'react';
import { VibeTheme } from '@/types';

interface DynamicNeonBackgroundProps {
  theme?: VibeTheme;
}

export const DynamicNeonBackground: React.FC<DynamicNeonBackgroundProps> = ({
  theme = 'cyber-pink',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Subtle drifting starlight particles
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.6,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));

    let step = 0;

    const render = () => {
      step += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Draw flowing ambient starlight particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dynamicAlpha = p.alpha + Math.sin(step * 2 + p.x) * 0.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, dynamicAlpha))})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  // Dynamic theme gradients
  const getThemeGradients = () => {
    switch (theme) {
      case 'cyber-blue':
        return {
          glow1: 'from-cyan-500/20 via-blue-600/15 to-transparent',
          glow2: 'from-indigo-600/20 via-sky-500/10 to-transparent',
          glow3: 'from-teal-400/15 via-blue-500/10 to-transparent',
        };
      case 'cosmic-emerald':
        return {
          glow1: 'from-emerald-500/20 via-teal-600/15 to-transparent',
          glow2: 'from-cyan-600/15 via-green-500/10 to-transparent',
          glow3: 'from-lime-400/10 via-emerald-700/15 to-transparent',
        };
      case 'sunset-violet':
        return {
          glow1: 'from-purple-600/25 via-pink-600/15 to-transparent',
          glow2: 'from-amber-500/15 via-purple-800/15 to-transparent',
          glow3: 'from-fuchsia-600/20 via-indigo-600/15 to-transparent',
        };
      case 'cyber-pink':
      default:
        return {
          glow1: 'from-pink-600/25 via-purple-700/20 to-transparent',
          glow2: 'from-cyan-500/20 via-blue-700/15 to-transparent',
          glow3: 'from-fuchsia-500/20 via-purple-900/20 to-transparent',
        };
    }
  };

  const gradients = getThemeGradients();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#07070b]">
      {/* Aurora orb 1 - Top Left */}
      <div
        className={`absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br ${gradients.glow1} blur-[120px] animate-pulse-slow`}
      />

      {/* Aurora orb 2 - Bottom Right */}
      <div
        className={`absolute -bottom-40 -right-40 w-[680px] h-[680px] rounded-full bg-gradient-to-tl ${gradients.glow2} blur-[140px] animate-pulse-slow delay-1000`}
      />

      {/* Aurora orb 3 - Center subtle drift */}
      <div
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] rounded-full bg-gradient-to-r ${gradients.glow3} blur-[150px] opacity-70 animate-float`}
      />

      {/* Canvas particle stars */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-80" />

      {/* Fine grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
};
