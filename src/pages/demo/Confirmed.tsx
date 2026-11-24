import React from 'react';
import {Link, Navigate, useLocation, useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import {ArrowUpRight, CalendarPlus, Check, ClipboardList, Compass, FileText, RefreshCw} from 'lucide-react';
import {DemoBookingData} from '../../lib/demoContent';
import {buildGoogleCalendarUrl, formatReadableDate} from '../../lib/ics';
import {IcsButton} from '../../components/demo/IcsButton';
import {SectionTag} from '../../components/SectionTag';
import {Footer} from '../../components/Footer';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface ConfirmedState {
  booking?: DemoBookingData;
}

const WHILE_YOU_WAIT = [
  {
    icon: Compass,
    title: 'Try the sandbox',
    description: 'Explore preloaded agent traces, run an eval suite, and simulate live alerts.',
    to: '/demo/sandbox',
    cta: 'Open Sandbox',
  },
  {
    icon: FileText,
    title: 'Read the Tracing guide',
    description: 'See how span trees, retries, and OpenTelemetry context work under the hood.',
    to: '/product/tracing',
    cta: 'Explore Tracing',
  },
  {
    icon: ClipboardList,
    title: 'Prep checklist',
    description: 'Review the 4 optional items to have handy before joining your engineer.',
    to: '/demo#prep',
    cta: 'View Checklist',
  },
];

export const Confirmed: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  const state = (location.state as ConfirmedState | null) ?? null;
  const booking = state?.booking;

  if (!booking) {
    return <Navigate to="/demo" replace />;
  }

  const googleCalUrl = buildGoogleCalendarUrl(booking);

  return (
    <main className="pb-4 pt-24">
      <section className="mx-3 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-14 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[920px] mx-auto">
          {/* Animated Checkmark + Ring Burst */}
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
            {!reducedMotion && (
              <motion.svg
                viewBox="0 0 80 80"
                className="absolute inset-0 w-20 h-20"
                aria-hidden="true"
              >
                <motion.circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="#0B2FA8"
                  strokeWidth="2"
                  initial={{scale: 0.6, opacity: 0.85}}
                  animate={{scale: 1.18, opacity: 0}}
                  transition={{duration: 0.9, ease: [0.16, 1, 0.3, 1]}}
                />
              </motion.svg>
            )}
            <motion.div
              initial={reducedMotion ? {scale: 1} : {scale: 0.6, opacity: 0}}
              animate={{scale: 1, opacity: 1}}
              transition={{duration: reducedMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1]}}
              className="w-14 h-14 rounded-[6px] bg-[#0B2FA8] text-[#D9C4A8] flex items-center justify-center shadow-lg"
            >
              <Check className="w-7 h-7" strokeWidth={2.5} />
            </motion.div>
          </div>

          <SectionTag label="Walkthrough Confirmed" />

          <h1 className="mt-4 headline-display text-[44px] sm:text-[64px] text-[#0B0B0B]">
            You&rsquo;re <span className="headline-serif-accent">Booked</span>
          </h1>
          <p className="mt-3 text-[16px] leading-[1.6] text-[#0B0B0B]/70 max-w-[540px]">
            We sent a calendar invitation to{' '}
            <span className="font-medium text-[#0B0B0B]">{booking.workEmail}</span>. Your
            solutions engineer has received your stack notes.
          </p>

          {/* Summary Card */}
          <div className="mt-8 rounded-[8px] bg-white border border-[#0B0B0B]/15 p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-6 border-b border-[#0B0B0B]/10">
              <div>
                <span className="block font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#0B0B0B]/50">
                  Attendee
                </span>
                <span className="mt-1 block text-[16px] font-medium text-[#0B0B0B]">
                  {booking.fullName}
                </span>
                <span className="text-[13px] text-[#0B0B0B]/65">
                  {booking.role} · {booking.company}
                </span>
              </div>

              <div>
                <span className="block font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#0B0B0B]/50">
                  Date &amp; Time
                </span>
                <span className="mt-1 block text-[16px] font-medium text-[#0B0B0B] tabular-nums">
                  {formatReadableDate(booking.dateIso)}
                </span>
                <span className="font-mono text-[13px] text-[#0B2FA8] tabular-nums">
                  {booking.timeSlot} (30 min)
                </span>
              </div>

              <div>
                <span className="block font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#0B0B0B]/50">
                  Timezone &amp; Stack
                </span>
                <span className="mt-1 block font-mono text-[13px] text-[#0B0B0B]">
                  {booking.timezone}
                </span>
                <span className="text-[13px] text-[#0B0B0B]/65">
                  {booking.framework} · {booking.monthlyTraces}
                </span>
              </div>
            </div>

            <div className="pt-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#0B0B0B]/50 mr-1">
                  Goals:
                </span>
                {booking.goals.map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-1 rounded-[3px] bg-[#D9C4A8]/55 text-[#0A1F6B] font-mono text-[11px] font-medium"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-6 border-t border-[#0B0B0B]/10 flex flex-wrap items-center gap-3">
              <a
                href={googleCalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-[#0B2FA8] hover:bg-[#0A1F6B] text-white text-[14px] font-medium px-5 py-3 transition-colors whitespace-nowrap"
              >
                <CalendarPlus className="w-4 h-4 text-[#D9C4A8]" />
                <span>Add to Google Calendar</span>
              </a>

              <IcsButton booking={booking} />

              <button
                type="button"
                onClick={() => navigate('/demo#book', {state: {reschedule: booking}})}
                className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-[#0B0B0B]/20 bg-[#F8F7F5] hover:bg-[#0B0B0B]/5 text-[#0B0B0B] text-[14px] font-medium px-5 py-3 transition-colors cursor-pointer whitespace-nowrap"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reschedule</span>
              </button>
            </div>
          </div>

          {/* While You Wait Row */}
          <div className="mt-12">
            <span className="block font-mono text-[11px] uppercase tracking-[0.08em] text-[#0B2FA8] mb-4">
              While you wait
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {WHILE_YOU_WAIT.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.title}
                    to={card.to}
                    className="group rounded-[8px] bg-white border border-[#0B0B0B]/12 hover:border-[#0B2FA8] p-6 flex flex-col justify-between gap-4 transition-colors"
                  >
                    <div>
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-[3px] bg-[#0B2FA8] text-white mb-4">
                        <Icon className="w-4 h-4" />
                      </span>
                      <h2 className="text-[19px] font-medium tracking-[-0.02em] text-[#0B0B0B]">
                        {card.title}
                      </h2>
                      <p className="mt-2 text-[13.5px] leading-[1.55] text-[#0B0B0B]/70">
                        {card.description}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[12px] text-[#0B2FA8] group-hover:translate-x-0.5 transition-transform">
                      <span>{card.cta}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Confirmed;
