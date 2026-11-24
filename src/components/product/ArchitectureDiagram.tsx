import React, {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {ARCHITECTURE_EDGES, ARCHITECTURE_NODES} from '../../lib/productContent';
import {useInView} from '../../hooks/useInView';
import {useReducedMotion} from '../../hooks/useReducedMotion';

export const ArchitectureDiagram: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const {ref, inView} = useInView<HTMLElement>({threshold: 0.06, once: true});
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [packets, setPackets] = useState<{x: number; y: number}[]>([]);

  useEffect(() => {
    if (reducedMotion || !inView) return;

    let rafId = 0;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = (now - start) / 1000;
      const nextPts: {x: number; y: number}[] = [];

      // Drive 3 staggered packets along the pipeline
      const edgeSets = [
        [0, 1, 2, 5],
        [0, 1, 3, 6],
        [0, 1, 4, 7],
      ];

      edgeSets.forEach((chain, cIdx) => {
        const total = chain.length;
        const t = (elapsed * 0.65 + cIdx * 0.33) % total;
        const segIdx = Math.floor(t);
        const segProgress = t - segIdx;
        const pathEl = pathRefs.current[chain[segIdx]];
        if (pathEl) {
          const len = pathEl.getTotalLength();
          const pt = pathEl.getPointAtLength(segProgress * len);
          nextPts.push({x: pt.x, y: pt.y});
        }
      });

      setPackets(nextPts);
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [inView, reducedMotion]);

  const hoveredNode = ARCHITECTURE_NODES.find((n) => n.id === hoveredId) ?? null;

  return (
    <section
      ref={ref}
      className="mx-1.5 sm:mx-5 mt-3 sm:mt-6 mb-3 sm:mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10"
    >
      <div className="w-full max-w-[1360px] mx-auto min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-2 sm:gap-4 mb-4 sm:mb-8 min-w-0">
          <div className="min-w-0">
            <h2 className="headline-display text-[24px] leading-[1.12] sm:text-[44px] text-[#0B0B0B]">
              The platform in <span className="headline-serif-accent">one</span> picture
            </h2>
            <p className="mt-1.5 sm:mt-3 text-[13px] sm:text-[16px] leading-[1.45] sm:leading-[1.5] text-[#0B0B0B]/70 max-w-[560px]">
              Tap or hover any stage to inspect how agent spans move from your SDK into live
              evals, cost attribution, and incident channels.
            </p>
          </div>
          <span className="font-mono text-[10.5px] sm:text-[12px] text-[#0B0B0B]/60 shrink-0">
            
          </span>
        </div>

        <div className="w-full min-w-0 relative rounded-[6px] sm:rounded-[8px] bg-[#0A1F6B] p-3 sm:p-8 overflow-x-auto">
          <div className="min-w-[640px] sm:min-w-[760px] relative aspect-[900/290]">
            <svg
              viewBox="0 0 900 290"
              className="w-full h-full overflow-visible"
              role="img"
              aria-label="Sightline platform data flow architecture"
            >
              {/* Edges */}
              {ARCHITECTURE_EDGES.map((edge, idx) => (
                <motion.path
                  key={edge.id}
                  ref={(el) => {
                    pathRefs.current[idx] = el;
                  }}
                  d={edge.d}
                  fill="none"
                  stroke="rgba(217,196,168,0.4)"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  initial={reducedMotion ? {pathLength: 1} : {pathLength: 0}}
                  animate={inView || reducedMotion ? {pathLength: 1} : {pathLength: 0}}
                  transition={{duration: 0.7, delay: idx * 0.06}}
                />
              ))}

              {/* Flowing Packets */}
              {!reducedMotion &&
                packets.map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.x} cy={pt.y} r="7" fill="rgba(217,196,168,0.28)" />
                    <circle cx={pt.x} cy={pt.y} r="3.5" fill="#D9C4A8" />
                  </g>
                ))}
            </svg>

            {/* Interactive Node Cards */}
            {ARCHITECTURE_NODES.map((node) => {
              const isHovered = hoveredId === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId((prev) => (prev === node.id ? null : prev))}
                  onFocus={() => setHoveredId(node.id)}
                  onBlur={() => setHoveredId((prev) => (prev === node.id ? null : prev))}
                  onClick={() => setHoveredId((prev) => (prev === node.id ? null : node.id))}
                  style={{
                    left: `${(node.x / 900) * 100}%`,
                    top: `${(node.y / 290) * 100}%`,
                    width: `${(node.w / 900) * 100}%`,
                    height: `${(node.h / 290) * 100}%`,
                  }}
                  className={`absolute rounded-[5px] sm:rounded-[6px] px-2 sm:px-3 py-1 sm:py-2 text-left flex flex-col justify-center transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D9C4A8] ${
                    isHovered
                      ? 'bg-[#D9C4A8] text-[#0B0B0B] -translate-y-0.5 shadow-xl'
                      : 'bg-white text-[#0B0B0B] shadow-md hover:bg-[#F5EFE6]'
                  }`}
                >
                  <span className="font-mono text-[8.5px] sm:text-[9.5px] leading-tight uppercase tracking-[0.06em] text-[#0B2FA8] truncate">
                    {node.tier}
                  </span>
                  <span className="text-[11px] sm:text-[13px] font-medium tracking-[-0.01em] leading-tight truncate">
                    {node.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation Footer Bar */}
          <div className="mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-white/15 min-h-[34px] sm:min-h-[38px] flex items-center min-w-0">
            <AnimatePresence mode="wait">
              {hoveredNode ? (
                <motion.div
                  key={hoveredNode.id}
                  initial={{opacity: 0, y: 4}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -4}}
                  transition={{duration: 0.16}}
                  className="text-[11.5px] sm:text-[13.5px] leading-snug text-white flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0"
                >
                  <span className="px-1.5 sm:px-2 py-0.5 rounded-[2px] bg-[#D9C4A8] text-[#0B0B0B] font-mono text-[10px] sm:text-[11px] font-semibold shrink-0">
                    {hoveredNode.label}
                  </span>
                  <span className="text-white/90 min-w-0">{hoveredNode.explanation}</span>
                </motion.div>
              ) : (
                <motion.span
                  key="hint"
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  className="text-[11px] sm:text-[13px] font-mono text-white/55 break-words"
                >
                  SDK → Collector → Trace Store → Evals / Cost / Alerts → Dashboard, Slack, PagerDuty
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};