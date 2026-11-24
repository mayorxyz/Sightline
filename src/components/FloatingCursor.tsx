import React, {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {useReducedMotion} from '../hooks/useReducedMotion';

export interface CursorConfig {
  id: string;
  initial: string;
  label: string;
  color: string;
  isChatBubble?: boolean;
  waypoints: {x: number[]; y: number[]};
  duration: number;
  delay: number;
  staticPos: {x: number; y: number};
}

interface FloatingCursorProps {
  config: CursorConfig;
  active: boolean;
}

export const FloatingCursor: React.FC<FloatingCursorProps> = ({config, active}) => {
  const reducedMotion = useReducedMotion();
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    if (!config.isChatBubble || reducedMotion) {
      setShowChat(true);
      return;
    }

    const interval = setInterval(() => {
      setShowChat((prev) => !prev);
    }, 6000);

    return () => clearInterval(interval);
  }, [config.isChatBubble, reducedMotion]);

  if (!active && !reducedMotion) return null;

  return (
    <motion.div
      className="pointer-events-none absolute top-0 left-0 z-20 will-change-transform"
      initial={
        reducedMotion
          ? {x: config.staticPos.x, y: config.staticPos.y, opacity: 1}
          : {x: config.waypoints.x[0], y: config.waypoints.y[0], opacity: 0}
      }
      animate={
        reducedMotion
          ? {x: config.staticPos.x, y: config.staticPos.y, opacity: 1}
          : {
              x: config.waypoints.x,
              y: config.waypoints.y,
              opacity: 1,
            }
      }
      transition={
        reducedMotion
          ? {duration: 0}
          : {
              x: {
                duration: config.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: config.delay,
                times: config.waypoints.x.map((_, i) => i / (config.waypoints.x.length - 1)),
              },
              y: {
                duration: config.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: config.delay,
                times: config.waypoints.y.map((_, i) => i / (config.waypoints.y.length - 1)),
              },
              opacity: {duration: 0.4, delay: config.delay + 0.3},
            }
      }
    >
      {/* Pointer Arrow */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.22)]"
      >
        <path
          d="M2 2L15.5 7.2L9.4 9.6L7.1 15.6L2 2Z"
          fill={config.color}
          stroke="#FFFFFF"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>

      {/* Avatar + Name Chip / Chat Bubble */}
      <div className="ml-3 -mt-0.5 flex items-center">
        {config.isChatBubble ? (
          <AnimatePresence mode="wait">
            {showChat ? (
              <motion.div
                key="chat-open"
                initial={reducedMotion ? {opacity: 1} : {opacity: 0, scale: 0.92, y: 2}}
                animate={{opacity: 1, scale: 1, y: 0}}
                exit={reducedMotion ? {opacity: 1} : {opacity: 0, scale: 0.92, y: 2}}
                transition={{duration: 0.28}}
                className="inline-flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-[#0B2FA8] text-white shadow-[0_6px_16px_rgba(10,31,107,0.3)] border border-white/25 whitespace-nowrap"
              >
                <span
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold text-white shrink-0 border border-white/70"
                  style={{backgroundColor: config.color}}
                >
                  {config.initial}
                </span>
                <span className="text-[11px] font-medium tracking-[-0.01em]">
                  {config.label}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="chat-avatar"
                initial={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.9}}
                transition={{duration: 0.2}}
                className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-semibold text-white shadow-md border-2 border-white"
                style={{backgroundColor: config.color}}
              >
                {config.initial}
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <div
            className="inline-flex items-center gap-1.5 pl-1 pr-2 py-0.5 rounded-full text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-white/70 whitespace-nowrap"
            style={{backgroundColor: config.color}}
          >
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-[9px] font-semibold">
              {config.initial}
            </span>
            <span className="text-[11px] font-medium leading-none">{config.label}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
