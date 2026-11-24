import React from 'react';
import {motion} from 'framer-motion';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface CategoryChipsProps<T extends string> {
  categories: readonly T[];
  selected: T;
  onSelect: (category: T) => void;
  layoutGroupId: string;
}

export function CategoryChips<T extends string>({
  categories,
  selected,
  onSelect,
  layoutGroupId,
}: CategoryChipsProps<T>) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter categories">
      {categories.map((cat) => {
        const active = selected === cat;
        return (
          <button
            key={cat}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(cat)}
            className={`relative px-3.5 py-1.5 rounded-[3px] font-mono text-[12px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0B2FA8] ${
              active ? 'text-white' : 'bg-white border border-[#0B0B0B]/15 text-[#0B0B0B]/75 hover:border-[#0B2FA8]'
            }`}
          >
            {active && (
              <motion.span
                layoutId={layoutGroupId}
                transition={
                  reducedMotion
                    ? {duration: 0}
                    : {type: 'spring', stiffness: 420, damping: 32}
                }
                className="absolute inset-0 rounded-[3px] bg-[#0B2FA8]"
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        );
      })}
    </div>
  );
}
