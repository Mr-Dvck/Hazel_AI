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

        // Theme-distinct ambient particles: Scarlet embers for Neon Red vs electric bubblegum for Neon Pink
        let particleColor = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, dynamicAlpha))})`;
        if (theme === 'neon-red' || theme === 'sunset-violet') {
          // Menacing blood-orange & scarlet embers with zero pink/purple
          particleColor = Math.sin(step + p.x) > 0
            ? `rgba(255, 30, 30, ${Math.max(0.2, Math.min(1, dynamicAlpha))})`
            : `rgba(255, 90, 20, ${Math.max(0.15, Math.min(0.9, dynamicAlpha))})`;
        } else if (theme === 'neon-pink' || theme === 'cyber-pink') {
          // Electric bubblegum hot magenta & bright violet
          particleColor = Math.sin(step + p.x) > 0
            ? `rgba(255, 42, 157, ${Math.max(0.2, Math.min(1, dynamicAlpha))})`
            : `rgba(215, 100, 255, ${Math.max(0.15, Math.min(0.9, dynamicAlpha))})`;
        } else if (theme === 'electric-blue' || theme === 'cyber-blue') {
          particleColor = `rgba(0, 240, 255, ${Math.max(0.2, Math.min(1, dynamicAlpha))})`;
        } else if (theme === 'neon-yellow' || theme === 'cosmic-emerald') {
          particleColor = `rgba(255, 230, 0, ${Math.max(0.2, Math.min(1, dynamicAlpha))})`;
        }

        ctx.fillStyle = particleColor;
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
      case 'neon-yellow':
      case 'cosmic-emerald':
        return {
          glow1: 'from-[#ffe600]/40 via-amber-500/25 to-transparent',
          glow2: 'from-amber-400/35 via-yellow-600/20 to-transparent',
          glow3: 'from-[#ffe600]/25 via-orange-600/15 to-transparent',
          baseBg: 'bg-[#090802]',
        };
      case 'electric-blue':
      case 'cyber-blue':
        return {
          glow1: 'from-[#00f0ff]/40 via-blue-600/25 to-transparent',
          glow2: 'from-sky-500/35 via-indigo-600/20 to-transparent',
          glow3: 'from-[#00f0ff]/25 via-cyan-600/15 to-transparent',
          baseBg: 'bg-[#02070e]',
        };
      case 'neon-red':
      case 'sunset-violet':
        // Pure menacing blood-crimson / scarlet FNAF red with dark blood-orange embers & zero pink/purple
        return {
          glow1: 'from-[#ff0033]/45 via-red-700/35 to-transparent',
          glow2: 'from-[#dc2626]/40 via-orange-700/25 to-transparent',
          glow3: 'from-[#ff1a1a]/35 via-red-950/40 to-transparent',
          baseBg: 'bg-[#0a0203]',
        };
      case 'neon-pink':
      case 'cyber-pink':
      default:
        // Electric bubblegum / vibrant hot neon magenta with bright violet/fuchsia ambient radiance
        return {
          glow1: 'from-[#ff2a9d]/45 via-fuchsia-600/30 to-transparent',
          glow2: 'from-[#ff1493]/35 via-purple-700/25 to-transparent',
          glow3: 'from-[#ff2a9d]/30 via-violet-950/35 to-transparent',
          baseBg: 'bg-[#08020a]',
        };
    }
  };

  const gradients = getThemeGradients();

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${gradients.baseBg} transition-colors duration-700`}>
      {/* Aurora orb 1 - Top Left */}
      <div
        className={`absolute -top-32 -left-32 w-[680px] h-[680px] rounded-full bg-gradient-to-br ${gradients.glow1} blur-[120px] animate-pulse-slow`}
      />

      {/* Aurora orb 2 - Bottom Right */}
      <div
        className={`absolute -bottom-40 -right-40 w-[740px] h-[740px] rounded-full bg-gradient-to-tl ${gradients.glow2} blur-[130px] animate-pulse-slow delay-1000`}
      />

      {/* Aurora orb 3 - Center subtle drift */}
      <div
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[520px] rounded-full bg-gradient-to-r ${gradients.glow3} blur-[140px] opacity-80 animate-float`}
      />

      {/* Canvas particle stars */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-85" />

      {/* Fine grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
};
