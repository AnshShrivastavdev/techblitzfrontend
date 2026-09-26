'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselItem {
  image: string;
  alt?: string;
}

export interface DepthCarouselProps {
  items?: CarouselItem[];
  depth?: number;
  spread?: number;
  tilt?: number;
  tiltDirection?: 'left' | 'right';
  perspective?: number;
  visibleCards?: number;
  falloff?: number;
  blur?: number;
  autoplay?: boolean;
  loop?: boolean;
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  tint?: string;
  duration?: number;
  ease?: string;
  autoplayDelay?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function DepthCarousel({
  items = [],
  depth = 220,
  spread = 90,
  tilt = 60,
  tiltDirection = 'right',
  perspective = 1400,
  visibleCards = 4,
  falloff = 0.29,
  blur = 12,
  autoplay = false,
  loop = true,
  cardWidth = 300,
  cardHeight = 380,
  radius = 18,
  tint = '#05060a',
  duration = 700,
  ease = 'cubic-bezier(0.25, 1, 0.5, 1)',
  autoplayDelay = 3200,
  showControls = true,
  showIndicators = true,
  className = '',
  style = {},
}: DepthCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const total = items.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev + 1 >= total) {
        return loop ? 0 : prev;
      }
      return prev + 1;
    });
  }, [total, loop]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev - 1 < 0) {
        return loop ? total - 1 : prev;
      }
      return prev - 1;
    });
  }, [total, loop]);

  // Autoplay handler
  useEffect(() => {
    if (!autoplay || isHovered || total <= 1) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, autoplayDelay);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoplay, autoplayDelay, isHovered, nextSlide, total]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  };

  if (!items || items.length === 0) return null;

  const dirSign = tiltDirection === 'left' ? -1 : 1;

  let transitionTiming = ease;
  if (ease === 'power3.out' || ease === 'power2.out') {
    transitionTiming = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
  } else if (ease === 'power1.out') {
    transitionTiming = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }

  return (
    <div
      className={`depth-carousel-container relative w-full h-full flex flex-col items-center justify-center select-none ${className}`}
      style={{
        perspective: `${perspective}px`,
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="3D Depth Image Carousel"
    >
      {/* 3D Stage */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          transformStyle: 'preserve-3d',
        }}
      >
        {items.map((item, index) => {
          let offset = index - activeIndex;

          if (loop && total > 1) {
            if (offset < 0 && Math.abs(offset) > total / 2) {
              offset += total;
            } else if (offset > 0 && offset > total / 2) {
              offset -= total;
            }
          }

          const isVisible = offset >= 0 && offset < visibleCards;
          const isPrevious = offset === -1 && loop;

          let transform = '';
          let opacity = 0;
          let filter = 'none';
          let zIndex = 0;
          let tintOpacity = 0;

          if (isVisible) {
            const i = offset;
            const xOffset = dirSign * i * spread;
            const zOffset = -i * depth;
            const yRotation = i === 0 ? 0 : -dirSign * (tilt * Math.max(0.4, 1 - i * 0.18));
            const cardScale = Math.pow(1 - falloff, i);

            transform = `translate3d(${xOffset}px, 0px, ${zOffset}px) rotateY(${yRotation}deg) scale(${cardScale})`;
            opacity = Math.max(0, 1 - i * (falloff * 0.9));
            zIndex = visibleCards - i;
            filter = i > 0 ? `blur(${i * (blur / visibleCards)}px)` : 'none';
            tintOpacity = i === 0 ? 0 : Math.min(0.85, i * falloff * 1.5);
          } else if (isPrevious) {
            const xOffset = -dirSign * spread * 0.8;
            const zOffset = -depth * 0.8;
            const yRotation = dirSign * (tilt * 0.6);
            const cardScale = 1 - falloff;

            transform = `translate3d(${xOffset}px, 0px, ${zOffset}px) rotateY(${yRotation}deg) scale(${cardScale})`;
            opacity = 0;
            zIndex = 0;
            filter = `blur(${blur}px)`;
            tintOpacity = 0.8;
          } else {
            transform = `translate3d(${dirSign * visibleCards * spread}px, 0px, ${-visibleCards * depth}px) scale(${Math.pow(1 - falloff, visibleCards)})`;
            opacity = 0;
            zIndex = 0;
            filter = `blur(${blur}px)`;
          }

          return (
            <div
              key={index}
              onClick={() => {
                if (offset !== 0) setActiveIndex(index);
              }}
              className="absolute inset-0 cursor-pointer overflow-hidden shadow-2xl transition-transform"
              style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                borderRadius: `${radius}px`,
                transform,
                opacity,
                filter,
                zIndex,
                transition: `all ${duration}ms ${transitionTiming}`,
                transformOrigin: dirSign > 0 ? 'left center' : 'right center',
                border: offset === 0 ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow:
                  offset === 0
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 35px rgba(56, 189, 248, 0.25)'
                    : '0 20px 30px -10px rgba(0, 0, 0, 0.7)',
              }}
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.alt || `TechBlitz Gallery ${index + 1}`}
                className="w-full h-full object-cover select-none pointer-events-none"
                loading="lazy"
                draggable={false}
              />

              {/* Tint overlay for receding depth effect */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{
                  backgroundColor: tint,
                  opacity: tintOpacity,
                }}
              />

              {/* Subtle gradient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

              {/* Card Label / Alt Info on front card */}
              {item.alt && (
                <div
                  className={`absolute bottom-0 inset-x-0 p-4 transition-opacity duration-300 ${
                    offset === 0 ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-[10px] font-mono text-cyan-300 tracking-wider mb-1">
                    TECHBLITZ ARCHIVE
                  </div>
                  <p className="text-white text-sm font-semibold truncate drop-shadow-md">
                    {item.alt}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      {showControls && (
        <div className="flex items-center gap-4 mt-8 z-30">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="w-10 h-10 rounded-full bg-neutral-900/80 hover:bg-cyan-950/80 border border-white/15 hover:border-cyan-400/50 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-md shadow-lg"
          >
            <ChevronLeft size={18} className="text-cyan-400" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="w-10 h-10 rounded-full bg-neutral-900/80 hover:bg-cyan-950/80 border border-white/15 hover:border-cyan-400/50 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-md shadow-lg"
          >
            <ChevronRight size={18} className="text-cyan-400" />
          </button>
        </div>
      )}

      {/* Dot Indicators */}
      {showIndicators && (
        <div className="flex items-center gap-2 mt-4 z-30">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-6 bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]'
                  : 'w-1.5 bg-white/20 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
