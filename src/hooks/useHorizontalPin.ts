import {RefObject, useEffect, useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseHorizontalPinOptions {
  sectionRef: RefObject<HTMLElement | null>;
  pinRef: RefObject<HTMLDivElement | null>;
  trackRef: RefObject<HTMLDivElement | null>;
  cardRefs: RefObject<(HTMLDivElement | null)[]>;
  cardCount: number;
  reducedMotion: boolean;
}

export function useHorizontalPin({
  sectionRef,
  pinRef,
  trackRef,
  cardRefs,
  cardCount,
  reducedMotion,
}: UseHorizontalPinOptions) {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(() =>
    Array.from({length: cardCount}, (_, i) => i === 0)
  );

  // Track viewport breakpoint (<768px mobile vs desktop)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Reduced motion: static vertical stack, all cards immediately visible
  useEffect(() => {
    if (reducedMotion) {
      setVisibleCards(Array.from({length: cardCount}, () => true));
      setProgress(1);
      setActiveIndex(0);
      setIsScrubbing(false);
    }
  }, [reducedMotion, cardCount]);

  // Desktop GSAP ScrollTrigger pinned horizontal scroll + containerAnimation triggers
  useEffect(() => {
    if (reducedMotion || isMobile) return;
    const section = sectionRef.current;
    const pinEl = pinRef.current;
    const track = trackRef.current;
    if (!section || !pinEl || !track) return;

    let scrubTimeout: ReturnType<typeof setTimeout> | undefined;

    const markCardVisible = (idx: number) => {
      setVisibleCards((prev) => {
        if (prev[idx]) return prev;
        const next = [...prev];
        next[idx] = true;
        return next;
      });
    };

    const ctx = gsap.context(() => {
      const getMaxTranslate = () =>
        Math.max(0, track.scrollWidth - pinEl.clientWidth);

      const tween = gsap.to(track, {
        x: () => -getMaxTranslate(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinEl,
          start: 'top top+=48',
          end: () => `+=${Math.max(track.scrollWidth * 3, window.innerWidth * 2.4)}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => {
            markCardVisible(0);
          },
          onUpdate: (self) => {
            setProgress(self.progress);
            setIsScrubbing(true);
            if (scrubTimeout) clearTimeout(scrubTimeout);
            scrubTimeout = setTimeout(() => setIsScrubbing(false), 160);

            // Determine active card closest to left-center focal point + >60% visibility check
            const cards = cardRefs.current || [];
            const containerRect = pinEl.getBoundingClientRect();
            const focalX = containerRect.left + containerRect.width * 0.34;

            let closestIdx = 0;
            let minDistance = Infinity;

            cards.forEach((cardEl, idx) => {
              if (!cardEl) return;
              const rect = cardEl.getBoundingClientRect();
              const cardCenter = rect.left + rect.width / 2;
              const dist = Math.abs(cardCenter - focalX);
              if (dist < minDistance) {
                minDistance = dist;
                closestIdx = idx;
              }

              // Check >60% horizontal visibility inside viewport
              const visibleLeft = Math.max(rect.left, 0);
              const visibleRight = Math.min(rect.right, window.innerWidth);
              const visibleWidth = Math.max(0, visibleRight - visibleLeft);
              if (rect.width > 0 && visibleWidth / rect.width >= 0.6) {
                markCardVisible(idx);
              }
            });

            setActiveIndex(closestIdx);
          },
        },
      });

      // Also attach ScrollTrigger containerAnimation per card for precise >60% horizontal entrance
      const cards = cardRefs.current || [];
      cards.forEach((cardEl, idx) => {
        if (!cardEl) return;
        if (idx === 0) {
          ScrollTrigger.create({
            trigger: pinEl,
            start: 'top 72%',
            onEnter: () => markCardVisible(0),
          });
        } else {
          ScrollTrigger.create({
            trigger: cardEl,
            containerAnimation: tween,
            start: 'left 68%',
            onEnter: () => markCardVisible(idx),
          });
        }
      });
    }, sectionRef);

    const rafRefresh = requestAnimationFrame(() => ScrollTrigger.refresh());
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(rafRefresh);
      if (scrubTimeout) clearTimeout(scrubTimeout);
      ctx.revert();
    };
  }, [isMobile, reducedMotion, sectionRef, pinRef, trackRef, cardRefs]);

  // Mobile (<768px): native horizontal scroll-snap observer (no pin)
  useEffect(() => {
    if (reducedMotion || !isMobile) return;
    const track = trackRef.current;
    const cards = cardRefs.current || [];
    if (!track) return;

    const handleScroll = () => {
      const maxScroll = Math.max(1, track.scrollWidth - track.clientWidth);
      const p = Math.min(1, Math.max(0, track.scrollLeft / maxScroll));
      setProgress(p);

      const trackRect = track.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      cards.forEach((c, i) => {
        if (!c) return;
        const r = c.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - center);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      });
      setActiveIndex(bestIdx);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = cards.findIndex((c) => c === entry.target);
          if (idx !== -1 && entry.intersectionRatio >= 0.6) {
            setVisibleCards((prev) => {
              if (prev[idx]) return prev;
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }
        });
      },
      {root: track, threshold: [0.6]}
    );

    cards.forEach((c) => c && observer.observe(c));
    track.addEventListener('scroll', handleScroll, {passive: true});
    handleScroll();

    return () => {
      observer.disconnect();
      track.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, reducedMotion, trackRef, cardRefs]);

  return {
    isMobile,
    progress,
    activeIndex,
    isScrubbing,
    visibleCards,
  };
}
