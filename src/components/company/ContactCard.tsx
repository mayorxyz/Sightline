import React, {useEffect, useRef, useState} from 'react';
import {Check, Copy, Mail} from 'lucide-react';
import {ContactChannel} from '../../lib/companyContent';

interface ContactCardProps {
  channel: ContactChannel;
  onCopied?: (email: string) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({channel, onCopied}) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(channel.email);
    } catch {
      // Fallback gracefully if clipboard API is unavailable
    }
    setCopied(true);
    onCopied?.(channel.email);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full w-full min-w-0 rounded-[6px] sm:rounded-[8px] bg-white border border-[#0B0B0B]/15 p-3.5 sm:p-5 flex flex-col justify-between gap-2.5 sm:gap-3">
      <div className="flex flex-col gap-2 sm:gap-2.5 min-w-0">
        <div className="flex items-start sm:items-center justify-between gap-1.5 sm:gap-2 min-w-0">
          <span className="inline-flex items-center gap-1.5 sm:gap-2 text-[14.5px] sm:text-[16px] font-medium tracking-[-0.02em] leading-snug text-[#0B0B0B] min-w-0">
            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0B2FA8] shrink-0" />
            <span className="truncate">{channel.label}</span>
          </span>
          <span className="shrink-0 px-1.5 sm:px-2 py-0.5 rounded-[2px] bg-[#D9C4A8]/55 text-[#0A1F6B] font-mono text-[9.5px] sm:text-[10.5px] font-medium whitespace-nowrap">
            {channel.responseChip}
          </span>
        </div>

        <p className="text-[12.5px] sm:text-[13.5px] leading-[1.48] sm:leading-[1.55] text-[#0B0B0B]/70">
          {channel.description}
        </p>
      </div>

      <div className="pt-2 sm:pt-2.5 border-t border-[#0B0B0B]/10 flex items-center justify-between gap-2 min-w-0">
        <span className="font-mono text-[11.5px] sm:text-[12.5px] text-[#0B2FA8] truncate min-w-0">
          {channel.email}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${channel.email}`}
          className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-[2px] font-mono text-[10.5px] sm:text-[11px] transition-colors cursor-pointer shrink-0 ${
            copied
              ? 'bg-[#0B2FA8] text-white'
              : 'bg-[#E9E8E6] hover:bg-[#0B2FA8] hover:text-white text-[#0B0B0B]'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D9C4A8] shrink-0" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};