import React, {useEffect, useMemo, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {createInitialStreamSeries, StreamPoint} from '../../lib/mockData';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface StreamChartProps {
  inView: boolean;
  delayIdx: number;
  subscribe: (intervalMs: number, cb: () => void) => () => void;
}

const CHART_W = 640;
const CHART_H = 220;
const PAD_L = 34;
const PAD_R = 10;
const PAD_T = 12;
const PAD_B = 18;

export const StreamChart: React.FC<StreamChartProps> = React.memo(
  ({inView, delayIdx, subscribe}) => {
    const reducedMotion = useReducedMotion();
    const cardRef = useRef<HTMLDivElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    const [tilt, setTilt] = useState({rx: 0, ry: 0});
    const [series, setSeries] = useState<StreamPoint[]>(() => createInitialStreamSeries());
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    // Every 1s: shift left, append new point (base ~380 with noise, 5% spike chance)
    useEffect(() => {
      return subscribe(1000, () => {
        setSeries((prev) => {
          const last = prev[prev.length - 1];
          const isSpike = Math.random() < 0.05;
          const noise = (Math.random() - 0.5) * 34;
          const nextTraces = Math.max(
            260,
            Math.min(540, Math.round(last.traces * 0.35 + 380 * 0.65 + noise + (isSpike ? 95 : 0)))
          );
          const nextErrors = isSpike
            ? Math.round(8 + Math.random() * 14)
            : Math.random() < 0.14
              ? Math.round(1 + Math.random() * 3)
              : 0;

          const nowStr = new Date().toTimeString().slice(0, 8);
          return [...prev.slice(1), {time: nowStr, traces: nextTraces, errors: nextErrors}];
        });
      });
    }, [subscribe]);

    const {traceLine, traceArea, errorLine, coords, yTicks} = useMemo(() => {
      const plotW = CHART_W - PAD_L - PAD_R;
      const plotH = CHART_H - PAD_T - PAD_B;
      const yMax = 550;

      const pts = series.map((pt, i) => {
        const x = PAD_L + (i / Math.max(1, series.length - 1)) * plotW;
        const yTrace = PAD_T + (1 - Math.min(1, pt.traces / yMax)) * plotH;
        const yError = PAD_T + plotH - Math.min(1, pt.errors / 40) * (plotH * 0.35);
        return {x, yTrace, yError, pt};
      });

      const tLine = pts
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.yTrace.toFixed(1)}`)
        .join(' ');
      const tArea = `${tLine} L ${(PAD_L + plotW).toFixed(1)} ${(PAD_T + plotH).toFixed(1)} L ${PAD_L} ${(PAD_T + plotH).toFixed(1)} Z`;
      const eLine = pts
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.yError.toFixed(1)}`)
        .join(' ');

      const ticks = [0, 200, 400, 550].map((val) => ({
        val,
        y: PAD_T + (1 - val / yMax) * plotH,
      }));

      return {traceLine: tLine, traceArea: tArea, errorLine: eLine, coords: pts, yTicks: ticks};
    }, [series]);

    const updateIndexFromClientX = (clientX: number) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const relX = ((clientX - rect.left) / rect.width) * CHART_W;
      const plotW = CHART_W - PAD_L - PAD_R;
      const clamped = Math.max(0, Math.min(1, (relX - PAD_L) / plotW));
      setHoverIndex(Math.round(clamped * (series.length - 1)));
    };

    const handleSvgMove = (e: React.MouseEvent<SVGSVGElement>) => {
      updateIndexFromClientX(e.clientX);
    };

    const handleSvgTouch = (e: React.TouchEvent<SVGSVGElement>) => {
      if (e.touches.length > 0) {
        updateIndexFromClientX(e.touches[0].clientX);
      }
    };

    const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion || window.innerWidth < 768 || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({
        rx: Number((-ny * 4).toFixed(2)),
        ry: Number((nx * 4).toFixed(2)),
      });
    };

    const hovered = hoverIndex !== null ? coords[hoverIndex] : null;

    return (
      <motion.div
        ref={cardRef}
        onMouseMove={handleCardMove}
        onMouseLeave={() => setTilt({rx: 0, ry: 0})}
        initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
        animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
        transition={{
          duration: reducedMotion ? 0 : 0.6,
          delay: reducedMotion ? 0 : delayIdx * 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          transform: reducedMotion
            ? undefined
            : `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="col-span-2 md:col-span-12 h-full w-full min-w-0 bg-white/5 border border-white/10 rounded-[6px] p-2.5 sm:p-5 text-white flex flex-col justify-between will-change-transform"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-3 min-w-0">
          <div className="min-w-0">
            <span className="block text-[11px] sm:text-[12px] font-medium tracking-[0.08em] uppercase text-[#D9C4A8] truncate">
              REQUESTS PER SECOND
            </span>
            <span className="block font-mono text-[10.5px] sm:text-[12px] text-white/65 tabular-nums truncate">
              60s streaming telemetry
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto sm:shrink-0">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-[4px] bg-white/5 border border-white/15 text-[10px] sm:text-[11px] font-mono tabular-nums whitespace-nowrap">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#D9C4A8] shrink-0" />
              <span>Traces ({series[series.length - 1].traces}/s)</span>
            </span>
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-[4px] bg-white/5 border border-white/15 text-[10px] sm:text-[11px] font-mono tabular-nums whitespace-nowrap">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#F87171] shrink-0" />
              <span>Errors ({series[series.length - 1].errors}/s)</span>
            </span>
          </div>
        </div>

        <div className="relative w-full min-w-0 overflow-hidden">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            onMouseMove={handleSvgMove}
            onMouseLeave={() => setHoverIndex(null)}
            onTouchStart={handleSvgTouch}
            onTouchMove={handleSvgTouch}
            onTouchEnd={() => setHoverIndex(null)}
            className="block w-full h-[168px] sm:h-[250px] overflow-hidden cursor-crosshair touch-pan-y"
            role="img"
            aria-label="Streaming requests per second area and line chart"
          >
            <defs>
              <linearGradient id="stream-cobalt-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0B2FA8" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#0B2FA8" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Y-axis Gridlines */}
            {yTicks.map((tick) => (
              <g key={tick.val}>
                <line
                  x1={PAD_L}
                  y1={tick.y}
                  x2={CHART_W - PAD_R}
                  y2={tick.y}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
                <text
                  x={PAD_L - 6}
                  y={tick.y + 3}
                  textAnchor="end"
                  fill="rgba(255,255,255,0.5)"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {tick.val}
                </text>
              </g>
            ))}

            {/* Traces Area & Sand Line */}
            <path d={traceArea} fill="url(#stream-cobalt-fill)" />
            <path
              d={traceLine}
              fill="none"
              stroke="#D9C4A8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Errors Red Line */}
            <path
              d={errorLine}
              fill="none"
              stroke="#F87171"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Hover Vertical Crosshair */}
            {hovered && (
              <g>
                <line
                  x1={hovered.x}
                  y1={PAD_T}
                  x2={hovered.x}
                  y2={CHART_H - PAD_B}
                  stroke="rgba(255,255,255,0.35)"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <circle
                  cx={hovered.x}
                  cy={hovered.yTrace}
                  r="4"
                  fill="#D9C4A8"
                  stroke="#0A1F6B"
                  strokeWidth="1.5"
                />
                <circle
                  cx={hovered.x}
                  cy={hovered.yError}
                  r="3.5"
                  fill="#F87171"
                  stroke="#0A1F6B"
                  strokeWidth="1.5"
                />
              </g>
            )}
          </svg>

          {/* Hover Tooltip */}
          {hovered && (
            <div
              style={{
                left: `${Math.min(76, Math.max(14, (hovered.x / CHART_W) * 100))}%`,
              }}
              className="pointer-events-none absolute top-1.5 sm:top-2 -translate-x-1/2 z-20 bg-[#0B0B0B] border border-white/20 rounded-[4px] px-2 py-1 sm:px-2.5 sm:py-1.5 text-[10px] sm:text-[11px] font-mono tabular-nums shadow-xl whitespace-nowrap"
            >
              <div className="text-white/60 mb-0.5">{hovered.pt.time}</div>
              <div className="text-[#D9C4A8]">traces: {hovered.pt.traces}/s</div>
              <div className="text-[#F87171]">errors: {hovered.pt.errors}/s</div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);

StreamChart.displayName = 'StreamChart';