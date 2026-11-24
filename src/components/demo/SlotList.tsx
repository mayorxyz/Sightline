import React, {useMemo, useRef} from 'react';

interface SlotListProps {
  selectedDate: string;
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
}

const ALL_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
];

function hashDateSlot(dateIso: string, slot: string): number {
  const input = `${dateIso}-${slot}`;
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export const SlotList: React.FC<SlotListProps> = ({
  selectedDate,
  selectedSlot,
  onSelectSlot,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const slotsWithAvailability = useMemo(() => {
    const seedDate = selectedDate || 'default';
    return ALL_SLOTS.map((slot) => {
      const disabled = hashDateSlot(seedDate, slot) % 4 === 0;
      return {slot, disabled};
    });
  }, [selectedDate]);

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') {
      return;
    }
    e.preventDefault();
    const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1;
    let next = idx + dir;
    while (next >= 0 && next < slotsWithAvailability.length) {
      if (!slotsWithAvailability[next].disabled) {
        const target = containerRef.current?.querySelectorAll<HTMLButtonElement>('button[data-slot]')[next];
        target?.focus();
        return;
      }
      next += dir;
    }
  };

  return (
    <div
      ref={containerRef}
      role="listbox"
      aria-label="Available 30-minute time slots"
      className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2 max-h-[240px] sm:max-h-[272px] overflow-y-auto pr-0.5"
    >
      {slotsWithAvailability.map(({slot, disabled}, idx) => {
        const isSelected = selectedSlot === slot;
        return (
          <button
            key={slot}
            type="button"
            data-slot={slot}
            role="option"
            aria-selected={isSelected}
            disabled={disabled}
            onClick={() => onSelectSlot(slot)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className={`py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-[3px] font-mono text-[11px] sm:text-[12px] tabular-nums border transition-colors focus-visible:outline-2 focus-visible:outline-[#0B2FA8] ${
              disabled
                ? 'bg-[#0B0B0B]/[0.03] border-[#0B0B0B]/8 text-[#0B0B0B]/25 line-through cursor-not-allowed'
                : isSelected
                  ? 'bg-[#0B2FA8] border-[#0B2FA8] text-white font-semibold cursor-pointer'
                  : 'bg-white border-[#0B0B0B]/15 text-[#0B0B0B] hover:border-[#0B2FA8] cursor-pointer'
            }`}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
};