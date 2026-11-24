import React, {useEffect, useState} from 'react';
import {ThumbsDown, ThumbsUp} from 'lucide-react';

interface FeedbackProps {
  docSlug: string;
}

export const Feedback: React.FC<FeedbackProps> = ({docSlug}) => {
  const [vote, setVote] = useState<'yes' | 'no' | null>(null);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    setVote(null);
    setToast(false);
  }, [docSlug]);

  const handleVote = (choice: 'yes' | 'no') => {
    setVote(choice);
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  };

  return (
    <div className="pt-5 sm:pt-6 border-t border-[#0B0B0B]/15 flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3 sm:gap-4">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <span className="text-[14px] font-medium text-[#0B0B0B]">Was this helpful?</span>
        <button
          type="button"
          onClick={() => handleVote('yes')}
          aria-pressed={vote === 'yes'}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] border text-[12px] font-mono cursor-pointer transition-colors ${
            vote === 'yes'
              ? 'bg-[#0B2FA8] text-white border-[#0B2FA8]'
              : 'bg-white border-[#0B0B0B]/20 text-[#0B0B0B]/75 hover:border-[#0B2FA8]'
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>Yes</span>
        </button>

        <button
          type="button"
          onClick={() => handleVote('no')}
          aria-pressed={vote === 'no'}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] border text-[12px] font-mono cursor-pointer transition-colors ${
            vote === 'no'
              ? 'bg-[#0A1F6B] text-white border-[#0A1F6B]'
              : 'bg-white border-[#0B0B0B]/20 text-[#0B0B0B]/75 hover:border-[#0B2FA8]'
          }`}
        >
          <ThumbsDown className="w-3.5 h-3.5" />
          <span>No</span>
        </button>
      </div>

      {toast && (
        <span role="status" className="font-mono text-[12px] text-[#0B2FA8]">
          Thanks for the feedback.
        </span>
      )}
    </div>
  );
};
