import React, {useEffect, useRef, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {FloatingCursor, CursorConfig} from './FloatingCursor';
import {useReducedMotion} from '../hooks/useReducedMotion';

interface TraceNode {
  id: string;
  label: string;
  dotColor: string;
  latency: string;
  tokens: string;
  cost: string;
  status: string;
  x: number; // left px in 520x360 coordinate space
  y: number; // top px in 520x360 coordinate space
  w: number;
  h: number;
}

const NODES: TraceNode[] = [
  {
    id: 'input',
    label: 'User Input',
    dotColor: '#7C3AED',
    latency: '12ms',
    tokens: '142 tok',
    cost: '$0.0002',
    status: '200 OK',
    x: 26,
    y: 34,
    w: 158,
    h: 58,
  },
  {
    id: 'planner',
    label: 'Planner',
    dotColor: '#D9731A',
    latency: '48ms',
    tokens: '384 tok',
    cost: '$0.0008',
    status: 'routed (3)',
    x: 26,
    y: 162,
    w: 158,
    h: 58,
  },
  {
    id: 'tool',
    label: 'Tool: search_kb',
    dotColor: '#0B0B0B',
    latency: '312ms',
    tokens: '1,120 tok',
    cost: '$0.0004',
    status: 'cached',
    x: 244,
    y: 44,
    w: 168,
    h: 58,
  },
  {
    id: 'llm',
    label: 'LLM: claude-sonnet',
    dotColor: '#0B0B0B',
    latency: '1.2s',
    tokens: '2,410 tok',
    cost: '$0.0026',
    status: 'verified',
    x: 244,
    y: 136,
    w: 168,
    h: 58,
  },
  {
    id: 'guardrail',
    label: 'Guardrail',
    dotColor: '#0B0B0B',
    latency: '9ms',
    tokens: '96 tok',
    cost: '$0.0001',
    status: 'passed',
    x: 244,
    y: 228,
    w: 168,
    h: 58,
  },
  {
    id: 'output',
    label: 'Output',
    dotColor: '#0B0B0B',
    latency: '4ms',
    tokens: '418 tok',
    cost: '$0.0001',
    status: 'streamed',
    x: 332,
    y: 304,
    w: 158,
    h: 54,
  },
];

interface TraceEdge {
  id: string;
  d: string;
  toNodeId: string;
}

const EDGES: TraceEdge[] = [
  {id: 'e-input-planner', d: 'M 105 92 L 105 162', toNodeId: 'planner'},
  {id: 'e-planner-tool', d: 'M 184 191 C 216 191, 212 73, 244 73', toNodeId: 'tool'},
  {id: 'e-planner-llm', d: 'M 184 191 C 214 191, 214 165, 244 165', toNodeId: 'llm'},
  {id: 'e-planner-guardrail', d: 'M 184 191 C 216 191, 212 257, 244 257', toNodeId: 'guardrail'},
  {id: 'e-tool-output', d: 'M 412 73 C 458 73, 458 331, 490 331', toNodeId: 'output'},
  {id: 'e-llm-output', d: 'M 412 165 C 446 165, 446 331, 490 331', toNodeId: 'output'},
  {id: 'e-guardrail-output', d: 'M 328 286 L 328 331 L 332 331', toNodeId: 'output'},
];

const CURSORS: CursorConfig[] = [
  {
    id: 'ada',
    initial: 'A',
    label: 'Ada',
    color: '#0B2FA8',
    waypoints: {x: [148, 225, 225, 165, 148], y: [74, 52, 132, 92, 74]},
    duration: 10.5,
    delay: 0.4,
    staticPos: {x: 158, y: 74},
  },
  {
    id: 'tunde',
    initial: 'T',
    label: 'Tunde',
    color: '#D9731A',
    waypoints: {x: [68, 128, 128, 86, 68], y: [228, 206, 250, 238, 228]},
    duration: 12.2,
    delay: 1.0,
    staticPos: {x: 78, y: 224},
  },
  {
    id: 'kemi',
    initial: 'K',
    label: 'nice trace!',
    color: '#2E8B57',
    isChatBubble: true,
    waypoints: {x: [358, 305, 305, 368, 358], y: [182, 164, 240, 202, 182]},
    duration: 13.4,
    delay: 0.8,
    staticPos: {x: 344, y: 184},
  },
];

const AVATARS = [
  {initial: 'A', bg: '#0B2FA8'},
  {initial: 'T', bg: '#D9731A'},
  {initial: 'K', bg: '#2E8B57'},
];

interface AgentTraceProps {
  inView: boolean;
}

export const AgentTrace: React.FC<AgentTraceProps> = ({inView}) => {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const [tilt, setTilt] = useState({rx: 0, ry: 0});
  const [pathsDrawn, setPathsDrawn] = useState(reducedMotion);
  const [activeEdgeIdx, setActiveEdgeIdx] = useState<number>(0);
  const [packetPos, setPacketPos] = useState<{x: number; y: number} | null>(null);
  const [pulsingNodeId, setPulsingNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [toolBadgeState, setToolBadgeState] = useState<'none' | 'retry' | 'resolved'>('none');

  useEffect(() => {
    if (reducedMotion) {
      setPathsDrawn(true);
      return;
    }
    if (!inView) return;
    const t = setTimeout(() => setPathsDrawn(true), 820);
    return () => clearTimeout(t);
  }, [inView, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !pathsDrawn) return;

    let rafId = 0;
    let cancelled = false;
    let currentIdx = 0;
    let segmentStart = performance.now();
    let pauseUntil = 0;
    const segmentDuration = 780;

    const step = (now: number) => {
      if (cancelled) return;

      if (now < pauseUntil) {
        rafId = requestAnimationFrame(step);
        return;
      }

      const pathEl = pathRefs.current[currentIdx];
      if (!pathEl) {
        rafId = requestAnimationFrame(step);
        return;
      }

      const totalLength = pathEl.getTotalLength();
      const progress = Math.min(1, (now - segmentStart) / segmentDuration);
      const pt = pathEl.getPointAtLength(progress * totalLength);
      setPacketPos({x: pt.x, y: pt.y});
      setActiveEdgeIdx(currentIdx);

      if (progress >= 1) {
        const targetNode = EDGES[currentIdx].toNodeId;
        setPulsingNodeId(targetNode);

        if (targetNode === 'tool') {
          setToolBadgeState('retry');
          setTimeout(() => {
            if (!cancelled) setToolBadgeState('resolved');
          }, 520);
          setTimeout(() => {
            if (!cancelled) setToolBadgeState('none');
          }, 1450);
        }

        setTimeout(() => {
          if (!cancelled) setPulsingNodeId((prev) => (prev === targetNode ? null : prev));
        }, 1000);

        currentIdx = (currentIdx + 1) % EDGES.length;
        pauseUntil = now + 260;
        segmentStart = pauseUntil;
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [pathsDrawn, reducedMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-ny * 8).toFixed(2)),
      ry: Number((nx * 8).toFixed(2)),
    });
  };

  const handleMouseLeave = () => {
    setTilt({rx: 0, ry: 0});
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: reducedMotion
          ? undefined
          : `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="relative bg-[#D9C4A8] rounded-[6px] p-3 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.22)] will-change-transform"
    >
      {/* White Header Bar */}
      <div className="bg-white rounded-[4px] px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between shadow-[0_1px_2px_rgba(11,11,11,0.06)]">
        <span className="text-[12px] sm:text-[14px] font-medium tracking-[-0.01em] text-[#0B0B0B]">
          Agent Trace
        </span>
        <div className="flex items-center" aria-label="Active reviewers">
          {AVATARS.map((av, idx) => (
            <span
              key={av.initial}
              style={{backgroundColor: av.bg}}
              className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-[10px] sm:text-[11px] font-semibold text-white ring-2 ring-white ${
                idx > 0 ? '-ml-1.5 sm:-ml-2' : ''
              }`}
            >
              {av.initial}
            </span>
          ))}
        </div>
      </div>

      {/* Node Graph Canvas */}
      <div className="relative mt-3 sm:mt-4 w-full aspect-[520/380] overflow-visible select-none">
        {/* SVG Edges + Packet */}
        <svg
          viewBox="0 0 520 380"
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
          aria-hidden="true"
        >
          {EDGES.map((edge, idx) => (
            <motion.path
              key={edge.id}
              ref={(el) => {
                pathRefs.current[idx] = el;
              }}
              d={edge.d}
              fill="none"
              stroke={
                activeEdgeIdx === idx && pathsDrawn && !reducedMotion
                  ? 'rgba(11,47,168,0.45)'
                  : 'rgba(11,11,11,0.16)'
              }
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reducedMotion ? {pathLength: 1} : {pathLength: 0}}
              animate={pathsDrawn || reducedMotion ? {pathLength: 1} : {pathLength: 0}}
              transition={{
                duration: reducedMotion ? 0 : 0.55,
                delay: reducedMotion ? 0 : idx * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ))}

          {/* Animated Cobalt Packet */}
          {packetPos && !reducedMotion && (
            <g>
              <circle cx={packetPos.x} cy={packetPos.y} r="6.5" fill="rgba(11,47,168,0.2)" />
              <circle cx={packetPos.x} cy={packetPos.y} r="3.5" fill="#0B2FA8" />
            </g>
          )}
        </svg>

        {/* Nodes */}
        {NODES.map((node, idx) => {
          const isPulsing = pulsingNodeId === node.id;
          const isHovered = hoveredNodeId === node.id;
          const isTool = node.id === 'tool';

          return (
            <motion.div
              key={node.id}
              style={{
                left: `${(node.x / 520) * 100}%`,
                top: `${(node.y / 380) * 100}%`,
                width: `${(node.w / 520) * 100}%`,
                height: `${(node.h / 380) * 100}%`,
              }}
              initial={reducedMotion ? {scale: 1, opacity: 1} : {scale: 0.9, opacity: 0}}
              animate={
                inView || reducedMotion
                  ? {
                      scale: isPulsing && !reducedMotion ? 1.03 : 1,
                      opacity: 1,
                      y: isHovered ? -4 : 0,
                    }
                  : {scale: 0.9, opacity: 0}
              }
              transition={{
                scale: {
                  duration: 0.38,
                  delay: inView && !pathsDrawn && !reducedMotion ? idx * 0.12 : 0,
                  ease: [0.16, 1, 0.3, 1],
                },
                opacity: {duration: 0.35, delay: reducedMotion ? 0 : idx * 0.12},
                y: {duration: 0.18, ease: [0.16, 1, 0.3, 1]},
              }}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              onFocus={() => setHoveredNodeId(node.id)}
              onBlur={() => setHoveredNodeId(null)}
              tabIndex={0}
              role="button"
              aria-label={`${node.label}, latency ${node.latency}, ${node.tokens}`}
              className={`absolute bg-white rounded-[4px] sm:rounded-[6px] px-2 sm:px-3 py-1.5 sm:py-2 flex flex-col justify-center cursor-pointer outline-none transition-shadow duration-200 focus-visible:ring-2 focus-visible:ring-[#0B2FA8] ${
                isPulsing
                  ? 'shadow-[0_0_0_2px_rgba(11,47,168,0.45),0_10px_22px_rgba(10,31,107,0.18)]'
                  : 'shadow-[0_4px_12px_rgba(11,11,11,0.08)]'
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span
                  className="w-2 h-2 sm:w-3 sm:h-3 rounded-full shrink-0"
                  style={{backgroundColor: node.dotColor}}
                />
                <div className="flex-1 min-w-0">
                  <div className="h-[4px] sm:h-[5px] w-3/4 rounded-full bg-[#0B0B0B]/15 mb-1" />
                  <div className="text-[8px] sm:text-[10px] font-medium text-[#0B0B0B]/80 truncate leading-tight">
                    {node.label}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isPulsing && !reducedMotion && (
                  <motion.span
                    initial={{opacity: 0, y: 4, scale: 0.9}}
                    animate={{opacity: 1, y: 0, scale: 1}}
                    exit={{opacity: 0, y: -3, scale: 0.9}}
                    transition={{duration: 0.2}}
                    className="absolute -top-2 right-1 sm:right-1.5 px-1 sm:px-1.5 py-0.5 rounded-[3px] bg-[#0B2FA8] text-white font-mono text-[8px] sm:text-[9px] font-medium tabular-nums shadow-sm"
                  >
                    {node.latency}
                  </motion.span>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isTool && toolBadgeState !== 'none' && !reducedMotion && (
                  <motion.span
                    key={toolBadgeState}
                    initial={{opacity: 0, scale: 0.88}}
                    animate={{opacity: 1, scale: 1}}
                    exit={{opacity: 0, scale: 0.88}}
                    transition={{duration: 0.18}}
                    className={`absolute -bottom-2 right-1 sm:right-1.5 px-1 sm:px-1.5 py-0.5 rounded-[3px] text-white font-mono text-[8px] sm:text-[9px] font-medium shadow-sm ${
                      toolBadgeState === 'retry' ? 'bg-[#DC2626]' : 'bg-[#16A34A]'
                    }`}
                  >
                    {toolBadgeState === 'retry' ? 'retry' : 'resolved'}
                  </motion.span>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{opacity: 0, y: 6}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 4}}
                    transition={{duration: 0.16}}
                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+6px)] z-30 w-max min-w-[120px] sm:min-w-[148px] bg-[#0B0B0B] text-white rounded-[4px] px-2 sm:px-2.5 py-1.5 sm:py-2 shadow-xl text-[9px] sm:text-[10px] font-mono tabular-nums"
                  >
                    <div className="font-sans font-semibold text-[10px] sm:text-[11px] text-[#D9C4A8] mb-1">
                      {node.label}
                    </div>
                    <div className="flex justify-between gap-3 text-white/85">
                      <span>tokens</span>
                      <span>{node.tokens}</span>
                    </div>
                    <div className="flex justify-between gap-3 text-white/85">
                      <span>cost</span>
                      <span>{node.cost}</span>
                    </div>
                    <div className="flex justify-between gap-3 text-white/85">
                      <span>status</span>
                      <span className="text-[#86EFAC]">{node.status}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Floating Collaborator Cursors */}
        {CURSORS.map((cursor) => (
          <FloatingCursor key={cursor.id} config={cursor} active={inView} />
        ))}
      </div>
    </div>
  );
};