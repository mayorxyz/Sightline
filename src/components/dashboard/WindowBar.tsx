import React from 'react';

interface WindowBarProps {
  liveActive: boolean;
}

export const WindowBar: React.FC<WindowBarProps> = ({liveActive}) => {
  return (
    <div className="flex items-center justify-between gap-1.5 sm:gap-3 pb-2.5 sm:pb-4 mb-2.5 sm:mb-4 border-b border-white/10 min-w-0">
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0" aria-hidden="true">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/25" />
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/25" />
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/25" />
        </div>
        <span className="font-mono text-[10.5px] sm:text-[12px] text-white/80 tracking-[-0.01em] truncate">
          Sightline / production
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/10 border border-white/15 text-[10px] sm:text-[11px] font-mono text-white whitespace-nowrap">
          <span
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#22C55E] shrink-0 ${
              liveActive ? 'animate-pulse' : ''
            }`}
          />
          <span>Live</span>
        </span>
        <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-[4px] bg-white/5 border border-white/10 text-[10px] sm:text-[11px] font-mono text-[#D9C4A8] whitespace-nowrap">
          Last 1h
        </span>
      </div>
    </div>
  );
};