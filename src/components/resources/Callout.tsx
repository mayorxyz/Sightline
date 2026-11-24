import React from 'react';
import {Info, Sparkles} from 'lucide-react';

interface CalloutProps {
  type: 'note' | 'tip';
  title: string;
  body: string;
}

export const Callout: React.FC<CalloutProps> = ({type, title, body}) => {
  const isTip = type === 'tip';
  return (
    <div
      className={`rounded-[6px] border p-4 flex items-start gap-3 ${
        isTip
          ? 'bg-[#D9C4A8]/45 border-[#0B2FA8]/30 text-[#0B0B0B]'
          : 'bg-white border-[#0B0B0B]/15 text-[#0B0B0B]'
      }`}
    >
      <span className="mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-[2px] bg-[#0B2FA8] text-white shrink-0">
        {isTip ? <Sparkles className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
      </span>
      <div>
        <span className="block font-mono text-[11px] uppercase tracking-[0.06em] text-[#0B2FA8] font-semibold">
          {type} · {title}
        </span>
        <p className="mt-1 text-[13.5px] leading-[1.55] text-[#0B0B0B]/80">{body}</p>
      </div>
    </div>
  );
};
