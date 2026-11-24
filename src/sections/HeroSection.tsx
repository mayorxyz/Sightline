import React, {useEffect, useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {HeroCanvas} from '../components/HeroCanvas';
import {LogoMarquee} from '../components/LogoMarquee';
import {useReducedMotion} from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const artRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !artRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(artRef.current, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="p-3 sm:p-4 pb-0">
      <div className="relative w-full h-[520px] sm:h-[600px] lg:h-[640px] rounded-[24px] overflow-hidden bg-[#0A1F6B]">
        {/* Parallax wrapper moving hero art at ~0.6x scroll speed */}
        <div
          ref={artRef}
          className="absolute inset-0 -top-8 -bottom-16 will-change-transform"
        >
          <HeroCanvas />

          {/* Crescent Moon top right */}
          <svg
            viewBox="0 0 64 64"
            className="pointer-events-none absolute top-10 right-10 sm:top-12 sm:right-20 w-10 h-10 sm:w-12 sm:h-12 drop-shadow-[0_0_16px_rgba(255,244,224,0.65)]"
            aria-hidden="true"
          >
            <path
              d="M36 10C24 12 16 22 18 35C20 47 31 54 44 52C34 50 28 42 28 31C28 21 32 14 36 10Z"
              fill="#F5ECE0"
            />
          </svg>

          {/* Vertical Lamppost Beacon Silhouette centered */}
          <div className="pointer-events-none absolute inset-x-0 bottom-12 flex justify-center">
            <svg
              width="96"
              height="290"
              viewBox="0 0 96 290"
              fill="none"
              aria-hidden="true"
              className="w-[74px] sm:w-[92px] h-auto"
            >
              <defs>
                <radialGradient id="beaconGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFF7E2" stopOpacity="0.95" />
                  <stop offset="45%" stopColor="#F3DCBA" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#D9C4A8" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* Soft Lantern Glow */}
              <circle cx="48" cy="54" r="46" fill="url(#beaconGlow)" />
              {/* Finial Spire */}
              <path d="M48 12L50.5 24H45.5L48 12Z" fill="#0B0B0B" />
              {/* Lantern Cap */}
              <path d="M35 28L48 22L61 28H35Z" fill="#0B0B0B" />
              {/* Lantern Glass Cage */}
              <path d="M38 28H58L55 58H41L38 28Z" fill="#FFF7DF" fillOpacity="0.9" />
              <path
                d="M38 28H58L55 58H41L38 28Z"
                stroke="#0B0B0B"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <line x1="45" y1="28" x2="45.5" y2="58" stroke="#0B0B0B" strokeWidth="1.4" />
              <line x1="51" y1="28" x2="50.5" y2="58" stroke="#0B0B0B" strokeWidth="1.4" />
              {/* Collar & Crossbar */}
              <rect x="40" y="58" width="16" height="5" rx="1" fill="#0B0B0B" />
              <rect x="38" y="65" width="20" height="3" rx="1" fill="#0B0B0B" />
              {/* Tapered Pole */}
              <path d="M45 68H51L53 240H43L45 68Z" fill="#0B0B0B" />
              {/* Fluted Pedestal Base */}
              <path d="M41 240H55L57 265H39L41 240Z" fill="#0B0B0B" />
              <rect x="35" y="265" width="26" height="25" rx="1" fill="#0B0B0B" />
            </svg>
          </div>
        </div>

        {/* Bottom Logo Marquee Strip */}
        <div className="absolute inset-x-0 bottom-4 sm:bottom-6 px-3 sm:px-6 z-10">
          <LogoMarquee />
        </div>
      </div>
    </section>
  );
};
