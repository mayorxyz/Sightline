import React, {useEffect, useState} from 'react';
import {Globe} from 'lucide-react';
import {OFFICE_HUBS} from '../../lib/companyContent';
import {useInView} from '../../hooks/useInView';
import {useLiveTicker} from '../../hooks/useLiveTicker';

function formatHubTime(timeZone: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());
  } catch {
    return '--:--:--';
  }
}

function getAllTimes(): Record<string, string> {
  const next: Record<string, string> = {};
  for (const hub of OFFICE_HUBS) {
    next[hub.city] = formatHubTime(hub.timezone);
  }
  return next;
}

export const HubClock: React.FC = () => {
  const {ref, inView} = useInView<HTMLDivElement>({threshold: 0.06});
  const {subscribe} = useLiveTicker(inView);
  const [times, setTimes] = useState<Record<string, string>>(() => getAllTimes());

  useEffect(() => {
    if (!inView) return;
    setTimes(getAllTimes());
    return subscribe(1000, () => {
      setTimes(getAllTimes());
    });
  }, [inView, subscribe]);

  return (
    <div
      ref={ref}
      className="w-full min-w-0 rounded-[6px] sm:rounded-[8px] bg-[#0A1F6B] text-white p-3.5 sm:p-6 flex flex-col gap-3 sm:gap-4"
    >
      <div className="flex items-center justify-between gap-2 min-w-0">
        <span className="inline-flex items-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#D9C4A8] min-w-0">
          <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span className="truncate">Engineering Hubs</span>
        </span>
        <span className="font-mono text-[10px] sm:text-[11px] text-white/60 shrink-0">
          Live local time
        </span>
      </div>

      <div className="flex flex-col divide-y divide-white/15 min-w-0">
        {OFFICE_HUBS.map((hub) => (
          <div
            key={hub.city}
            className="py-2.5 sm:py-3 first:pt-0.5 sm:first:pt-1 last:pb-0.5 sm:last:pb-1 flex items-center justify-between gap-2.5 sm:gap-4 min-w-0"
          >
            <div className="min-w-0">
              <div className="text-[13.5px] sm:text-[15px] font-medium leading-snug text-white truncate">
                {hub.city}
                <span className="text-white/55 font-normal"> · {hub.country}</span>
              </div>
              <div className="font-mono text-[10px] sm:text-[11px] text-white/55 truncate">
                {hub.hours}
              </div>
            </div>
            <span className="font-mono text-[13.5px] sm:text-[15px] font-medium tabular-nums text-[#D9C4A8] shrink-0">
              {times[hub.city] ?? '--:--:--'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};