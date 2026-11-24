import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {PageHeader} from '../components/PageHeader';
import {PathChooser} from '../components/demo/PathChooser';
import {BookingWizard} from '../components/demo/BookingWizard';
import {AgentRunTerminal} from '../components/demo/AgentRunTerminal';
import {SessionChecklist} from '../components/demo/SessionChecklist';
import {Steps} from '../components/demo/Steps';
import {Team} from '../components/demo/Team';
import {PrepChecklist} from '../components/demo/PrepChecklist';
import {Faq} from './pricing/pricing  components/Faq';
import {Footer} from '../components/Footer';
import {DEMO_PAGE_FAQS, DemoBookingData, DemoGoal} from '../lib/demoContent';
import {useReducedMotion} from '../hooks/useReducedMotion';

interface DemoLocationState {
  reschedule?: DemoBookingData;
}

export const Demo: React.FC = () => {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const state = (location.state as DemoLocationState | null) ?? null;

  const [selectedGoals, setSelectedGoals] = useState<DemoGoal[]>(
    state?.reschedule?.goals ?? ['Debugging', 'Evals']
  );

  const scrollToBook = () => {
    const el = document.getElementById('book');
    el?.scrollIntoView({behavior: reducedMotion ? 'auto' : 'smooth', block: 'start'});
  };

  useEffect(() => {
    if (state?.reschedule) {
      const t = setTimeout(scrollToBook, 120);
      return () => clearTimeout(t);
    }
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const t = setTimeout(() => {
        const el = document.getElementById(targetId);
        el?.scrollIntoView({behavior: reducedMotion ? 'auto' : 'smooth', block: 'start'});
      }, 120);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [location.hash, reducedMotion, state?.reschedule]);

  return (
    <main className="pb-4">
      <PageHeader
        tag="Demo"
        lines={[
          <>See Sightline On</>,
          <>
            <span className="headline-serif-accent">Your Agents</span>
          </>,
        ]}
        subtitle="Try it now, or book 30 minutes with an engineer."
      />

      <PathChooser onBookScroll={scrollToBook} />

      {/* Two Columns: 3-Step Booking Wizard Left, Sticky Navy Terminal + Live Checklist Right */}
      <section
        id="book"
        className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10 scroll-mt-24"
      >
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-6">
            <BookingWizard
              initialBooking={state?.reschedule}
              initialStep={state?.reschedule ? 3 : 1}
              onGoalsChange={setSelectedGoals}
            />
          </div>

          <div className="lg:col-span-6 lg:sticky lg:top-24 flex flex-col gap-3 sm:gap-5 rounded-[6px] sm:rounded-[8px] bg-[#0A1F6B] p-3 sm:p-6 min-w-0">
            <AgentRunTerminal />
            <SessionChecklist goals={selectedGoals} />
          </div>
        </div>
      </section>

      <Steps />
      <Team />
      <PrepChecklist />

      <Faq
        items={DEMO_PAGE_FAQS}
        title={
          <h2 className="headline-display text-[28px] sm:text-[44px] leading-tight text-[#0B0B0B]">
            Demo <span className="headline-serif-accent">questions</span>
          </h2>
        }
      />

      <Footer />
    </main>
  );
};

export default Demo;