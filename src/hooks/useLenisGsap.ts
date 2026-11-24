import {useEffect} from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let activeLenis: Lenis | null = null;

export function scrollToTopSmooth(reducedMotion = false) {
  if (activeLenis && !reducedMotion) {
    activeLenis.scrollTo(0, {duration: 1.0});
    return;
  }
  window.scrollTo({top: 0, behavior: reducedMotion ? 'auto' : 'smooth'});
}

export function useLenisGsap(disabled: boolean) {
  useEffect(() => {
    if (disabled) {
      activeLenis = null;
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    activeLenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      if (activeLenis === lenis) {
        activeLenis = null;
      }
    };
  }, [disabled]);
}
