import React, {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {ArrowLeft, Check, RotateCcw} from 'lucide-react';
import {
  QUIZ_QUESTIONS,
  QUIZ_RECOMMENDATIONS,
  QuizOption,
} from '../../../lib/pricingContent';
import {Button} from '../../../components/Button';
import {useReducedMotion} from '../../../hooks/useReducedMotion';

type TierKey = 'starter' | 'team' | 'enterprise';

export const PlanQuiz: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, QuizOption>>({});
  const [direction, setDirection] = useState<1 | -1>(1);
  const [finished, setFinished] = useState<boolean>(false);

  const currentQuestion = QUIZ_QUESTIONS[stepIndex];

  const handleSelectOption = (opt: QuizOption) => {
    const updated = {...answers, [currentQuestion.id]: opt};
    setAnswers(updated);
    setDirection(1);
    if (stepIndex < QUIZ_QUESTIONS.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  };

  const handleBack = () => {
    if (finished) {
      setDirection(-1);
      setFinished(false);
      return;
    }
    if (stepIndex > 0) {
      setDirection(-1);
      setStepIndex((i) => i - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setStepIndex(0);
    setFinished(false);
  };

  // Compute recommended tier and runner-up
  const scores: Record<TierKey, number> = {starter: 0, team: 0, enterprise: 0};
  Object.values(answers).forEach((opt) => {
    scores.starter += opt.points.starter;
    scores.team += opt.points.team;
    scores.enterprise += opt.points.enterprise;
  });

  const ranked = (Object.entries(scores) as [TierKey, number][]).sort((a, b) => b[1] - a[1]);
  const winnerKey = ranked[0][0];
  const runnerUpKey = ranked[1][0];
  const winner = QUIZ_RECOMMENDATIONS[winnerKey];
  const runnerUp = QUIZ_RECOMMENDATIONS[runnerUpKey];

  const progressPct = finished
    ? 100
    : Math.round(((stepIndex + 1) / QUIZ_QUESTIONS.length) * 100);

  return (
    <div className="w-full min-w-0 max-w-[820px] mx-auto bg-white rounded-[6px] sm:rounded-[8px] border border-[#0B0B0B]/15 p-3.5 sm:p-10">
      {/* Progress Bar Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex items-center justify-between gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#0B0B0B]/55 mb-1.5 sm:mb-2">
          <span className="truncate">
            {finished
              ? 'Recommendation Ready'
              : `Question 0${stepIndex + 1} / 0${QUIZ_QUESTIONS.length}`}
          </span>
          <span className="tabular-nums shrink-0">{progressPct}%</span>
        </div>
        <div className="h-1 sm:h-1.5 w-full rounded-[2px] bg-[#0B0B0B]/10 overflow-hidden">
          <div
            style={{width: `${progressPct}%`}}
            className="h-full bg-[#0B2FA8] transition-all duration-300"
          />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {!finished ? (
          <motion.div
            key={currentQuestion.id}
            initial={reducedMotion ? {opacity: 1, x: 0} : {opacity: 0, x: direction * 20}}
            animate={{opacity: 1, x: 0}}
            exit={reducedMotion ? {opacity: 0} : {opacity: 0, x: direction * -20}}
            transition={{duration: reducedMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1]}}
            className="min-w-0"
          >
            <h2 className="text-[20px] sm:text-[32px] font-medium tracking-[-0.03em] leading-[1.15] sm:leading-[1.1] text-[#0B0B0B] mb-4 sm:mb-6">
              {currentQuestion.question}
            </h2>

            <div
              className="flex flex-col gap-2 sm:gap-3"
              role="radiogroup"
              aria-label={currentQuestion.question}
            >
              {currentQuestion.options.map((opt) => {
                const selected = answers[currentQuestion.id]?.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full min-w-0 text-left rounded-[6px] border p-3.5 sm:p-5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0B2FA8] ${
                      selected
                        ? 'bg-[#0B2FA8] text-white border-[#0B2FA8]'
                        : 'bg-[#F8F7F5] text-[#0B0B0B] border-[#0B0B0B]/15 hover:border-[#0B2FA8] hover:bg-[#D9C4A8]/25'
                    }`}
                  >
                    <div className="flex items-start sm:items-center justify-between gap-2.5 sm:gap-3 min-w-0">
                      <span className="text-[15px] sm:text-[18px] font-medium tracking-[-0.02em] leading-snug min-w-0">
                        {opt.label}
                      </span>
                      <span
                        className={`mt-0.5 sm:mt-0 w-4 h-4 sm:w-5 sm:h-5 rounded-[3px] border inline-flex items-center justify-center shrink-0 ${
                          selected
                            ? 'bg-[#D9C4A8] border-[#D9C4A8] text-[#0A1F6B]'
                            : 'border-[#0B0B0B]/25 bg-white text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={2.5} />
                      </span>
                    </div>
                    <p
                      className={`mt-1 sm:mt-1.5 text-[12px] sm:text-[13.5px] leading-snug ${
                        selected ? 'text-white/80' : 'text-[#0B0B0B]/65'
                      }`}
                    >
                      {opt.hint}
                    </p>
                  </button>
                );
              })}
            </div>

            {stepIndex > 0 && (
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#0B0B0B]/10">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] font-medium text-[#0B0B0B]/70 hover:text-[#0B0B0B] cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span>Previous question</span>
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="quiz-result"
            initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 14}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: reducedMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1]}}
            className="flex flex-col gap-4 sm:gap-6 min-w-0"
          >
            <div className="rounded-[6px] sm:rounded-[8px] bg-[#0A1F6B] text-white p-4 sm:p-8 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-[2px] bg-[#D9C4A8] text-[#0A1F6B] font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.06em]">
                  Recommended Plan
                </span>
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-[2px] bg-white/10 border border-white/15 font-mono text-[10px] sm:text-[11px] text-white/80">
                  Runner-up: {runnerUp.name}
                </span>
              </div>

              <div className="flex flex-wrap items-baseline justify-between gap-2 sm:gap-3">
                <h2 className="text-[26px] sm:text-[44px] font-medium tracking-[-0.03em] leading-none">
                  {winner.name}
                </h2>
                <span className="font-mono text-[16px] sm:text-[20px] text-[#D9C4A8] tabular-nums">
                  {winner.priceLabel}
                </span>
              </div>
              <p className="mt-1.5 sm:mt-2 text-[13px] sm:text-[15px] leading-snug text-white/75">
                {winner.tagline}
              </p>

              <ul className="mt-4 sm:mt-6 flex flex-col gap-2 sm:gap-2.5 pt-3.5 sm:pt-5 border-t border-white/15">
                {winner.reasons.map((r) => (
                  <li
                    key={r}
                    className="flex items-start gap-2 sm:gap-2.5 text-[13px] sm:text-[14px] leading-snug min-w-0"
                  >
                    <span className="mt-0.5 inline-flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[2px] bg-[#D9C4A8] text-[#0A1F6B] shrink-0">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2.5} />
                    </span>
                    <span className="text-white/90 min-w-0">{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Button label={winner.ctaLabel} variant="primary" to={winner.ctaTo} />
                <Button label="Compare All Plans" variant="secondary" to="/pricing" />
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] sm:text-[12px] text-[#0B0B0B]/65 hover:text-[#0B2FA8] cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Retake quiz</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};