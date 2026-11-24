import React, {useState} from 'react';
import {ArrowRight, Check} from 'lucide-react';

export const NewsletterBand: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid work email.');
      return;
    }
    setError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10">
      <div className="max-w-[1360px] mx-auto rounded-[6px] sm:rounded-[8px] bg-[#D9C4A8] border border-[#0B0B0B]/15 p-5 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
        <div>
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#0B2FA8]">
            Monthly Dispatch
          </span>
          <h2 className="mt-1.5 sm:mt-2 text-[22px] sm:text-[30px] lg:text-[34px] leading-[1.1] font-medium tracking-[-0.03em] text-[#0B0B0B]">
            Get release notes and trace patterns
          </h2>
          <p className="mt-2 text-[13px] sm:text-[14px] lg:text-[14.5px] leading-[1.6] text-[#0B0B0B]/75 max-w-[480px]">
            One concise email per month covering SDK updates, eval benchmarks, and real production postmortems.
          </p>
        </div>

        <div className="w-full lg:w-[400px] shrink-0">
          {subscribed ? (
            <div className="inline-flex items-center gap-2 rounded-[4px] bg-[#0A1F6B] text-white px-4 py-3 text-[12px] sm:text-[13px] w-full sm:w-auto justify-center sm:justify-start">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D9C4A8] shrink-0" />
              <span>Subscribed. Next issue arrives next month.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="you@company.com"
                  aria-label="Work email for resources newsletter"
                  className="flex-1 min-w-0 rounded-[2px] border border-[#0B0B0B]/20 bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 text-[13px] sm:text-[14px] text-[#0B0B0B] focus:outline-none focus:border-[#0B2FA8]"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-[2px] bg-[#0B2FA8] hover:bg-[#0A1F6B] text-white px-4 sm:px-5 py-2 sm:py-2.5 text-[13px] sm:text-[13.5px] font-medium transition-colors cursor-pointer w-full sm:w-auto shrink-0"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
              {error && <span className="text-[11px] sm:text-[12px] text-red-700 font-medium">{error}</span>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};