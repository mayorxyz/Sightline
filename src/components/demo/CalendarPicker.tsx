import React, {useMemo, useRef, useState} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';

interface CalendarPickerProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateIso: string) => void;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function toIsoDate(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({selectedDate, onSelectDate}) => {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const initialView = useMemo(() => {
    if (selectedDate) {
      const [y, m] = selectedDate.split('-').map(Number);
      if (y && m) return new Date(y, m - 1, 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }, [selectedDate, today]);

  const [viewMonth, setViewMonth] = useState<Date>(initialView);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(viewMonth);

  const canGoPrev =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth());

  const cells: (null | {
    day: number;
    iso: string;
    disabled: boolean;
    isToday: boolean;
  })[] = useMemo(() => {
    const list: (null | {day: number; iso: string; disabled: boolean; isToday: boolean})[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) list.push(null);

    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(year, month, d);
      const dayOfWeek = dt.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isPast = dt.getTime() < today.getTime();
      const iso = toIsoDate(year, month, d);
      list.push({
        day: d,
        iso,
        disabled: isWeekend || isPast,
        isToday: dt.getTime() === today.getTime(),
      });
    }
    return list;
  }, [daysInMonth, firstDayOfWeek, month, today, year]);

  const moveFocusByDays = (currentDay: number, delta: number) => {
    let candidate = currentDay + delta;
    while (candidate >= 1 && candidate <= daysInMonth) {
      const dt = new Date(year, month, candidate);
      const isWeekend = dt.getDay() === 0 || dt.getDay() === 6;
      const isPast = dt.getTime() < today.getTime();
      if (!isWeekend && !isPast) {
        const iso = toIsoDate(year, month, candidate);
        const btn = gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${iso}"]`);
        btn?.focus();
        return;
      }
      candidate += delta > 0 ? 1 : -1;
    }
  };

  return (
    <div className="rounded-[6px] border border-[#0B0B0B]/15 bg-[#F8F7F5] p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] sm:text-[14px] font-medium tracking-[-0.01em] text-[#0B0B0B]">
          {monthLabel}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={!canGoPrev}
            onClick={() => setViewMonth(new Date(year, month - 1, 1))}
            aria-label="Previous month"
            className="w-7 h-7 inline-flex items-center justify-center rounded-[2px] border border-[#0B0B0B]/15 bg-white text-[#0B0B0B] disabled:opacity-35 disabled:cursor-not-allowed hover:border-[#0B2FA8] cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMonth(new Date(year, month + 1, 1))}
            aria-label="Next month"
            className="w-7 h-7 inline-flex items-center justify-center rounded-[2px] border border-[#0B0B0B]/15 bg-white text-[#0B0B0B] hover:border-[#0B2FA8] cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="text-center font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.06em] text-[#0B0B0B]/45 py-1"
          >
            {wd}
          </div>
        ))}
      </div>

      <div
        ref={gridRef}
        role="grid"
        aria-label="Choose demo date"
        className="grid grid-cols-7 gap-1"
      >
        {cells.map((cell, idx) => {
          if (!cell) {
            return <div key={`empty-${idx}`} className="h-8 sm:h-9" aria-hidden="true" />;
          }
          const isSelected = selectedDate === cell.iso;
          return (
            <button
              key={cell.iso}
              type="button"
              data-date={cell.iso}
              disabled={cell.disabled}
              aria-selected={isSelected}
              aria-label={`${cell.iso}${cell.disabled ? ' unavailable' : ''}`}
              onClick={() => onSelectDate(cell.iso)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  moveFocusByDays(cell.day, 1);
                } else if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  moveFocusByDays(cell.day, -1);
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  moveFocusByDays(cell.day, 7);
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  moveFocusByDays(cell.day, -7);
                }
              }}
              className={`h-8 sm:h-9 rounded-[3px] font-mono text-[11px] sm:text-[12px] tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-[#0B2FA8] ${
                cell.disabled
                  ? 'text-[#0B0B0B]/25 cursor-not-allowed bg-transparent'
                  : isSelected
                    ? 'bg-[#0B2FA8] text-white font-semibold cursor-pointer'
                    : cell.isToday
                      ? 'bg-[#D9C4A8]/55 text-[#0B0B0B] border border-[#0B2FA8]/40 hover:bg-[#0B2FA8]/12 cursor-pointer'
                      : 'bg-white text-[#0B0B0B] border border-[#0B0B0B]/10 hover:border-[#0B2FA8] cursor-pointer'
              }`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
};