import React, {useEffect, useState} from 'react';
import {useReducedMotion} from '../hooks/useReducedMotion';

export const ScrollProgress: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(1, Math.max(0, window.scrollY / docHeight)));
    };

    update();
    window.addEventListener('scroll', update, {passive: true});
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  if (reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-[2.5px] pointer-events-none bg-transparent"
    >
      <div
        style={{
          transform: `scaleX(${progress})`,
          transformOrigin: 'left center',
        }}
        className="h-full w-full bg-[#0B2FA8] will-change-transform"
      />
    </div>
  );
};
