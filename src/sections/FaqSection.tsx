import React, {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Plus} from 'lucide-react';
import {SectionTag} from '../components/SectionTag';
import {RevealText} from '../components/RevealText';
import {Button} from '../components/Button';
import {useInView} from '../hooks/useInView';
import {useReducedMotion} from '../hooks/useReducedMotion';

const HOME_FAQS = [
  {
    question: 'What is a trace?',
    answer:
      'A trace captures the complete tree of execution for a single agent run—including user prompt, planner decisions, tool calls, retries, model completions, guardrails, latency, and token cost.',
  },
  {
    question: 'Which frameworks are supported?',
    answer:
      'Sightline works out of the box with LangChain, LangGraph, LlamaIndex, CrewAI, OpenAI Agents SDK, and custom Python or TypeScript agent loops via OpenTelemetry.',
  },
  {
    question: 'How is data secured?',
    answer:
      'We are SOC 2 Type II certified with TLS 1.3 in transit, AES-256 at rest, automatic edge PII redaction before storage, and configurable US or EU data residency.',
  },
  {
    question: 'Can I self-host?',
    answer:
      'Yes. Enterprise plans support private VPC deployment in your own AWS, GCP, or Azure account so prompt and completion payloads never leave your network boundary.',
  },
  {
    question: 'How is pricing calculated?',
    answer:
      'Starter is free up to 50K monthly traces. Team is $49/seat monthly ($39 yearly) with 5M included traces and transparent $2.50 per 1M trace overages.',
  },
  {
    question: 'How fast is setup?',
    answer:
      'Install our lightweight SDK, add your API key, and wrap your agent function with a single decorator or helper—most teams see live traces in under 5 minutes.',
  },
];

const FaqSection: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const {ref, inView} = useInView<HTMLElement>({threshold: 0.06, once: true});
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      ref={ref}
      id="faq"
      className="mx-1.5 sm:mx-5 mb-3 sm:mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10"
    >
      <div className="w-full max-w-[1360px] mx-auto min-w-0 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-10 items-start">
        {/* Left Column */}
        <div className="lg:col-span-5 w-full min-w-0">
          <motion.div
            initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
          >
            <SectionTag label="FAQ" />
          </motion.div>

          <div className="mt-3 sm:mt-6 flex flex-wrap items-end justify-between gap-3 sm:block">
            <RevealText
              as="h2"
              visible={inView}
              delayBase={0.1}
              className="text-[26px] leading-[1.12] sm:text-[54px] lg:text-[64px] text-[#0B0B0B]"
              lines={[
                <>Questions,</>,
                <>
                  <span className="headline-serif-accent">Answered</span>
                </>,
              ]}
            />

            <motion.div
              initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
              animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
              transition={{duration: 0.5, delay: reducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1]}}
              className="sm:mt-8 shrink-0"
            >
              <Button label="Talk to us" variant="primary" to="/demo" />
            </motion.div>
          </div>
        </div>

        {/* Right Column Accordion */}
        <motion.div
          initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
          animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
          transition={{duration: 0.55, delay: reducedMotion ? 0 : 0.14, ease: [0.16, 1, 0.3, 1]}}
          className="lg:col-span-7 w-full min-w-0 flex flex-col divide-y divide-[#0B0B0B]/15 border-y border-[#0B0B0B]/15"
        >
          {HOME_FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.question} className="py-2.5 sm:py-4">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-3 sm:gap-4 text-left py-1 sm:py-1.5 cursor-pointer group focus-visible:outline-2 focus-visible:outline-[#0B2FA8] min-w-0"
                >
                  <span className="text-[15px] sm:text-[19px] font-medium tracking-[-0.02em] leading-snug text-[#0B0B0B] group-hover:text-[#0B2FA8] transition-colors min-w-0">
                    {item.question}
                  </span>
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-[2px] border border-[#0B0B0B]/15 transition-transform duration-200 shrink-0 ${
                      isOpen
                        ? 'rotate-45 bg-[#0B2FA8] text-white border-[#0B2FA8]'
                        : 'bg-white text-[#0B0B0B]'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={
                        reducedMotion ? {opacity: 1, height: 'auto'} : {opacity: 0, height: 0}
                      }
                      animate={{opacity: 1, height: 'auto'}}
                      exit={reducedMotion ? {opacity: 0} : {opacity: 0, height: 0}}
                      transition={{duration: reducedMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1]}}
                      className="overflow-hidden"
                    >
                      <p className="pt-1.5 sm:pt-2 pb-1 text-[13.5px] sm:text-[15px] leading-[1.52] sm:leading-[1.6] text-[#0B0B0B]/70 max-w-[600px]">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;