'use client';

import React, { useEffect, useRef } from 'react';

export interface GlowCursorProps {
  color?: string;
  secondaryColor?: string;
  trailLength?: number;
  trailWidth?: number;
  trailTaper?: number;
  followSpeed?: number;
  glowIntensity?: number;
  glowSpread?: number;
  hotspot?: number;
  brightness?: number;
  opacity?: number;
  pulseSpeed?: number;
  noiseStrength?: number;
  idleFade?: boolean;
  idleTimeout?: number;
  fadeDuration?: number;
  blendMode?: GlobalCompositeOperation | string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

// Convert hex color to rgba
function hexToRgba(hex: string, alpha: number): string {
  if (typeof hex === 'string' && hex.startsWith('#')) {
    let c = hex.slice(1);
    if (c.length === 3) {
      c = c.split('').map((ch) => ch + ch).join('');
    }
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
  }
  return hex;
}

export function GlowCursor({
  color = '#67E8F9',
  secondaryColor = '#A78BFA',
  trailLength = 28,
  trailWidth = 7,
  trailTaper = 0.85,
  followSpeed = 1.0, // 1.0 = instant head response with zero sluggish input lag
  glowIntensity = 1.8,
  glowSpread = 1.1,
  hotspot = 0.7,
  brightness = 1.2,
  opacity = 1,
  pulseSpeed = 1.0,
  idleFade = true,
  idleTimeout = 600,
  fadeDuration = 800,
  blendMode = 'screen',
  children,
  className = '',
  style = {},
}: GlowCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; moved: boolean }>({
    x: -2000,
    y: -2000,
    moved: false,
  });
  const historyRef = useRef<TrailPoint[]>([]);
  const lastMoveTimeRef = useRef<number>(0);
  const alphaRef = useRef<number>(0);

  useEffect(() => {
    const onPointerMove = (e: MouseEvent | PointerEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.moved = true;
      lastMoveTimeRef.current = performance.now();
    };

    const onMouseLeave = () => {
      if (idleFade) {
        lastMoveTimeRef.current = performance.now() - idleTimeout;
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [idleFade, idleTimeout]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let isRunning = true;
    let dpr = 1;

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
    };

    onResize();
    window.addEventListener('resize', onResize);

    const render = (time: number) => {
      if (!isRunning) return;

      const now = performance.now();
      const timeSinceMove = now - lastMoveTimeRef.current;

      // Ultra-smooth alpha transitions
      if (mouseRef.current.moved) {
        if (idleFade && timeSinceMove > idleTimeout) {
          const elapsed = timeSinceMove - idleTimeout;
          alphaRef.current = Math.max(0, 1 - elapsed / fadeDuration);
        } else {
          alphaRef.current = Math.min(1, alphaRef.current + 0.15);
        }
      }

      const globalAlpha = alphaRef.current * opacity;

      // Reset transform and clear with scaled canvas dimensions for 0 pixel remnants
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (globalAlpha > 0.005 && mouseRef.current.moved) {
        ctx.scale(dpr, dpr);
        ctx.save();
        ctx.globalCompositeOperation = (blendMode as GlobalCompositeOperation) || 'screen';

        const mouse = mouseRef.current;
        const history = historyRef.current;

        // Push current point with zero latency
        history.unshift({ x: mouse.x, y: mouse.y, age: 0 });

        // Maintain maximum trail length
        if (history.length > trailLength) {
          history.length = trailLength;
        }

        // Age existing points
        for (let i = 0; i < history.length; i++) {
          history[i].age = i / history.length;
        }

        const len = history.length;
        const pulse = 1.0 + Math.sin(time * 0.003 * pulseSpeed) * 0.08;

        // Draw Liquid Fluid Ribbon Mesh
        if (len > 2) {
          const leftCoords: { x: number; y: number }[] = [];
          const rightCoords: { x: number; y: number }[] = [];

          for (let i = 0; i < len; i++) {
            const p = history[i];
            const prev = history[Math.max(0, i - 1)];
            const next = history[Math.min(len - 1, i + 1)];

            const dx = next.x - prev.x;
            const dy = next.y - prev.y;
            const dist = Math.hypot(dx, dy) || 1;
            const nx = -dy / dist;
            const ny = dx / dist;

            const t = i / (len - 1);
            // Smooth natural taper
            const halfW = Math.max(
              0.1,
              (trailWidth * (1 - t * trailTaper) * pulse * brightness) / 2
            );

            leftCoords.push({
              x: p.x + nx * halfW,
              y: p.y + ny * halfW,
            });
            rightCoords.push({
              x: p.x - nx * halfW,
              y: p.y - ny * halfW,
            });
          }

          const head = history[0];
          const tail = history[len - 1];

          // Linear gradient matching user specs
          const grad = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
          grad.addColorStop(0, hexToRgba(color, 0.9 * globalAlpha));
          grad.addColorStop(0.35, hexToRgba(color, 0.75 * globalAlpha));
          grad.addColorStop(0.7, hexToRgba(secondaryColor, 0.45 * globalAlpha));
          grad.addColorStop(1, hexToRgba(secondaryColor, 0));

          // 1. Soft Outer Atmospheric Glow Pass (Smooth 144 FPS batched render)
          ctx.save();
          ctx.shadowBlur = Math.round(glowSpread * 20 * pulse);
          ctx.shadowColor = hexToRgba(color, 0.7 * globalAlpha * glowIntensity);
          ctx.fillStyle = grad;

          ctx.beginPath();
          ctx.moveTo(leftCoords[0].x, leftCoords[0].y);
          for (let i = 1; i < len - 1; i++) {
            const midX = (leftCoords[i].x + leftCoords[i + 1].x) / 2;
            const midY = (leftCoords[i].y + leftCoords[i + 1].y) / 2;
            ctx.quadraticCurveTo(leftCoords[i].x, leftCoords[i].y, midX, midY);
          }
          ctx.lineTo(tail.x, tail.y);
          for (let i = len - 1; i > 0; i--) {
            const midX = (rightCoords[i].x + rightCoords[i - 1].x) / 2;
            const midY = (rightCoords[i].y + rightCoords[i - 1].y) / 2;
            ctx.quadraticCurveTo(rightCoords[i].x, rightCoords[i].y, midX, midY);
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          // 2. Crisp Inner Plasma Core Ribbon Pass
          ctx.save();
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(leftCoords[0].x, leftCoords[0].y);
          for (let i = 1; i < len - 1; i++) {
            const midX = (leftCoords[i].x + leftCoords[i + 1].x) / 2;
            const midY = (leftCoords[i].y + leftCoords[i + 1].y) / 2;
            ctx.quadraticCurveTo(leftCoords[i].x, leftCoords[i].y, midX, midY);
          }
          ctx.lineTo(tail.x, tail.y);
          for (let i = len - 1; i > 0; i--) {
            const midX = (rightCoords[i].x + rightCoords[i - 1].x) / 2;
            const midY = (rightCoords[i].y + rightCoords[i - 1].y) / 2;
            ctx.quadraticCurveTo(rightCoords[i].x, rightCoords[i].y, midX, midY);
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // 3. Instant Zero-Latency Glowing Hotspot at exact mouse tip
        const head = history[0];
        if (head) {
          const coreRadius = (trailWidth * 2.2 + pulse * 2.0) * glowSpread;
          const flare = ctx.createRadialGradient(
            head.x,
            head.y,
            0,
            head.x,
            head.y,
            coreRadius * 2.5
          );

          flare.addColorStop(0, `rgba(255, 255, 255, ${Math.min(1, hotspot * globalAlpha * brightness)})`);
          flare.addColorStop(0.2, hexToRgba(color, Math.min(1, 0.95 * globalAlpha * glowIntensity)));
          flare.addColorStop(0.55, hexToRgba(secondaryColor, Math.min(1, 0.45 * globalAlpha * glowIntensity)));
          flare.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          ctx.arc(head.x, head.y, coreRadius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = flare;
          ctx.shadowBlur = Math.round(glowSpread * 24 * glowIntensity * pulse);
          ctx.shadowColor = hexToRgba(color, 0.95 * globalAlpha);
          ctx.fill();

          // Precise pinpoint core dot
          ctx.beginPath();
          ctx.arc(head.x, head.y, Math.max(1.8, trailWidth * 0.35), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, globalAlpha * brightness)})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ffffff';
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, [
    color,
    secondaryColor,
    trailLength,
    trailWidth,
    trailTaper,
    glowIntensity,
    glowSpread,
    hotspot,
    brightness,
    opacity,
    pulseSpeed,
    idleFade,
    idleTimeout,
    fadeDuration,
    blendMode,
  ]);

  return (
    <div className={`relative w-full ${className}`} style={style}>
      {/* Zero-latency Hardware-Accelerated Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9999] w-full h-full block"
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />
      {children}
    </div>
  );
}

export default GlowCursor;
