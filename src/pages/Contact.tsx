import React, {useEffect, useRef, useState} from 'react';
import {Check} from 'lucide-react';
import {PageHeader} from '../components/PageHeader';
import {Footer} from '../components/Footer';
import {Faq} from './pricing/pricing  components/Faq';
import {ContactForm} from '../components/company/ContactForm';
import {ContactCard} from '../components/company/ContactCard';
import {HubClock} from '../components/company/HubClock';
import {CONTACT_CHANNELS, CONTACT_FAQS} from '../lib/companyContent';

export const Contact: React.FC = () => {
  const [toastEmail, setToastEmail] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopied = (email: string) => {
    setToastEmail(email);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToastEmail(null), 2400);
  };

  return (
    <main className="pb-4">
      <PageHeader
        tag="Contact"
        lines={[
          <>
            Talk To A <span className="headline-serif-accent">Human</span>
          </>,
        ]}
        subtitle="Questions about pricing, OpenTelemetry collectors, or enterprise VPC reviews? Reach our engineering team directly."
      />

      {toastEmail && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-[4px] bg-[#0A1F6B] text-white border border-[#D9C4A8]/40 px-4 py-2.5 text-[13px] shadow-lg"
        >
          <Check className="w-4 h-4 text-[#D9C4A8]" />
          <span>Copied {toastEmail}</span>
        </div>
      )}

      {/* Two Columns: Contact Form + Direct Channels & Live Hubs */}
      <section className="mx-3 sm:mx-5 mt-6 mb-6 border border-[#0B0B0B]/20 py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 lg:self-start lg:sticky lg:top-24">
            <ContactForm />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-5">
            {CONTACT_CHANNELS.map((channel) => (
              <ContactCard key={channel.id} channel={channel} onCopied={handleCopied} />
            ))}
            <HubClock />
          </div>
        </div>
      </section>

      <Faq
        items={CONTACT_FAQS}
        title={
          <h2 className="headline-display text-[36px] sm:text-[44px] text-[#0B0B0B]">
            Support &amp; <span className="headline-serif-accent">response</span> FAQ
          </h2>
        }
      />

      <Footer />
    </main>
  );
};

export default Contact;
