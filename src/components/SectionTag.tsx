import React from 'react';
import {Sparkles} from 'lucide-react';

interface SectionTagProps {
  label: string;
  className?: string;
}

export const SectionTag: React.FC<SectionTagProps> = ({label, className = ''}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 bg-[#0B2FA8] text-white rounded-[2px] px-2.5 py-1.5 text-[13px] font-medium tracking-[-0.01em] whitespace-nowrap shrink-0 ${className}`}
    >
      <span className="inline-flex items-center justify-center w-5 h-5 bg-[#D9C4A8] text-[#0B2FA8] rounded-[2px]">
        <Sparkles className="w-3.5 h-3.5" strokeWidth={2.2} />
      </span>
      <span>{label}</span>
    </div>
  );
};
