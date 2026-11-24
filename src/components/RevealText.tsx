import React from 'react';
import {motion} from 'framer-motion';
import {useReducedMotion} from '../hooks/useReducedMotion';

interface RevealTextProps {
  lines: React.ReactNode[];
  visible?: boolean;
  delayBase?: number;
  lineClassName?: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

export const RevealText: React.FC<RevealTextProps> = ({
  lines,
  visible = true,
  delayBase = 0.08,
  lineClassName = '',
  as: Tag = 'h1',
  className = '',
}) => {
  const reducedMotion = useReducedMotion();

  return (
    <Tag className={`headline-display ${className}`}>
      {lines.map((line, idx) => (
        <span key={idx} className={`block overflow-hidden pb-[0.08em] -mb-[0.08em] ${lineClassName}`}>
          <motion.span
            className="block will-change-transform"
            initial={reducedMotion ? {y: 0, opacity: 1} : {y: '105%', opacity: 0}}
            animate={
              visible || reducedMotion
                ? {y: '0%', opacity: 1}
                : {y: '105%', opacity: 0}
            }
            transition={{
              duration: reducedMotion ? 0 : 0.65,
              delay: reducedMotion ? 0 : delayBase + idx * 0.09,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};
