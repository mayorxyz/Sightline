import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {AnimatePresence, motion} from 'framer-motion';
import {ArrowLeft, ArrowRight, CalendarCheck, Check, Globe, Loader2} from 'lucide-react';
import {
  AGENT_FRAMEWORKS,
  COMMON_TIMEZONES,
  DEMO_GOALS,
  DemoBookingData,
  DemoGoal,
  MONTHLY_TRACE_RANGES,
  TEAM_SIZES,
  WIZARD_ROLES,
} from '../../lib/demoContent';
import {CalendarPicker} from './CalendarPicker';
import {SlotList} from './SlotList';
import {formatReadableDate} from '../../lib/ics';
import {useReducedMotion} from '../../hooks/useReducedMotion';

const STORAGE_KEY = 'oiq_demo_booking_v1';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getNextWeekdayIso(): string {
  const dt = new Date();
  dt.setDate(dt.getDate() + 1);
  while (dt.getDay() === 0 || dt.getDay() === 6) {
    dt.setDate(dt.getDate() + 1);
  }
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
  } catch {
    return 'America/New_York';
  }
}

interface BookingWizardProps {
  initialBooking?: DemoBookingData;
  initialStep?: 1 | 2 | 3;
  onGoalsChange?: (goals: DemoGoal[]) => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  initialBooking,
  initialStep,
  onGoalsChange,
}) => {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  const defaultBooking: DemoBookingData = useMemo(
    () => ({
      fullName: '',
      workEmail: '',
      company: '',
      role: WIZARD_ROLES[0],
      teamSize: TEAM_SIZES[1],
      framework: AGENT_FRAMEWORKS[0],
      monthlyTraces: MONTHLY_TRACE_RANGES[2],
      notes: '',
      goals: ['Debugging', 'Evals'],
      dateIso: getNextWeekdayIso(),
      timeSlot: '10:30',
      timezone: detectTimezone(),
    }),
    []
  );

  const [step, setStep] = useState<1 | 2 | 3>(() => initialStep ?? 1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [form, setForm] = useState<DemoBookingData>(() => {
    if (initialBooking) return initialBooking;
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<DemoBookingData>;
        return {...defaultBooking, ...parsed};
      }
    } catch {
      // ignore storage failure
    }
    return defaultBooking;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shakeCount, setShakeCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Sync goals upstream to SessionChecklist
  useEffect(() => {
    onGoalsChange?.(form.goals);
  }, [form.goals, onGoalsChange]);

  // Persist wizard state in sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      // ignore storage errors
    }
  }, [form]);

  const timezoneOptions = useMemo(() => {
    const set = new Set<string>([form.timezone, ...COMMON_TIMEZONES]);
    return Array.from(set).filter(Boolean);
  }, [form.timezone]);

  const validateStep = (targetStep: 1 | 2 | 3): Record<string, string> => {
    const nextErrors: Record<string, string> = {};
    if (targetStep === 1) {
      if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required.';
      if (!form.workEmail.trim()) {
        nextErrors.workEmail = 'Work email is required.';
      } else if (!EMAIL_REGEX.test(form.workEmail.trim())) {
        nextErrors.workEmail = 'Enter a valid work email address.';
      }
      if (!form.company.trim()) nextErrors.company = 'Company name is required.';
      if (!form.role) nextErrors.role = 'Please pick a role.';
    } else if (targetStep === 2) {
      if (!form.teamSize) nextErrors.teamSize = 'Select your team size.';
      if (!form.framework) nextErrors.framework = 'Select a framework.';
      if (form.goals.length === 0) nextErrors.goals = 'Choose at least one focus area.';
    } else if (targetStep === 3) {
      if (!form.dateIso) nextErrors.dateIso = 'Choose an available date.';
      if (!form.timeSlot) nextErrors.timeSlot = 'Select a 30-minute time slot.';
      if (!form.timezone) nextErrors.timezone = 'Select a timezone.';
    }
    return nextErrors;
  };

  const triggerErrorShake = (nextErrors: Record<string, string>) => {
    setErrors(nextErrors);
    if (!reducedMotion) {
      setShakeCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length > 0) {
      triggerErrorShake(stepErrors);
      return;
    }
    setErrors({});
    setDirection(1);
    setStep((prev) => (prev === 1 ? 2 : 3));
  };

  const handleBack = () => {
    setErrors({});
    setDirection(-1);
    setStep((prev) => (prev === 3 ? 2 : 1));
  };

  const toggleGoal = (goal: DemoGoal) => {
    setErrors((e) => ({...e, goals: ''}));
    setForm((prev) => {
      const exists = prev.goals.includes(goal);
      const goals = exists ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal];
      return {...prev, goals};
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stepErrors = validateStep(3);
    if (Object.keys(stepErrors).length > 0) {
      triggerErrorShake(stepErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    console.log('Sightline Demo Booking Payload:', form);

    setTimeout(() => {
      setSubmitting(false);
      navigate('/demo/confirmed', {state: {booking: form}});
    }, 550);
  };

  const stepLabels = [
    {num: 1 as const, label: 'About you'},
    {num: 2 as const, label: 'Your agents'},
    {num: 3 as const, label: 'Pick a time'},
  ];

  const errorList = Object.values(errors).filter(Boolean);

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      animate={
        shakeCount > 0 && !reducedMotion
          ? {x: [0, -7, 7, -5, 5, -2, 0]}
          : {x: 0}
      }
      key={shakeCount > 0 ? `form-shake-${shakeCount}` : 'form-steady'}
      transition={{duration: 0.36}}
      className="bg-white rounded-[8px] border border-[#0B0B0B]/15 p-4 sm:p-8 flex flex-col justify-between gap-4 sm:gap-6"
    >
      <div>
        {/* Wizard Header + Progress Dots */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pb-4 sm:pb-5 border-b border-[#0B0B0B]/12">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#0B2FA8]">
              Step 0{step} / 03
            </span>
            <h2 className="text-[21px] sm:text-[28px] leading-[1.1] font-medium tracking-[-0.03em] text-[#0B0B0B]">
              {step === 1 && 'Tell us about you'}
              {step === 2 && 'Your agent stack'}
              {step === 3 && 'Pick a date & time'}
            </h2>
          </div>

          <div className="flex items-center gap-2" aria-label="Booking steps">
            {stepLabels.map((s) => {
              const active = step === s.num;
              const completed = step > s.num;
              return (
                <div key={s.num} className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-[3px] font-mono text-[11px] font-medium transition-colors ${
                      active
                        ? 'bg-[#0B2FA8] text-white'
                        : completed
                          ? 'bg-[#D9C4A8] text-[#0A1F6B]'
                          : 'bg-[#0B0B0B]/6 text-[#0B0B0B]/45'
                    }`}
                  >
                    {completed ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : `0${s.num}`}
                  </span>
                  <span
                    className={`hidden sm:inline text-[12px] ${
                      active ? 'text-[#0B0B0B] font-medium' : 'text-[#0B0B0B]/45'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accessible Validation Live Region */}
        <div aria-live="polite" className="sr-only">
          {errorList.length > 0 ? errorList.join(' ') : ''}
        </div>

        {/* Animated Step Body */}
        <div className="pt-6 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={reducedMotion ? {opacity: 1, x: 0} : {opacity: 0, x: direction * 24}}
                animate={{opacity: 1, x: 0}}
                exit={reducedMotion ? {opacity: 0} : {opacity: 0, x: direction * -24}}
                transition={{duration: reducedMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1]}}
                className="flex flex-col gap-5"
              >
                <FloatingInput
                  id="wizard-fullName"
                  label="Full name *"
                  value={form.fullName}
                  error={errors.fullName}
                  onChange={(v) => {
                    setErrors((er) => ({...er, fullName: ''}));
                    setForm((f) => ({...f, fullName: v}));
                  }}
                />

                <FloatingInput
                  id="wizard-workEmail"
                  type="email"
                  label="Work email *"
                  value={form.workEmail}
                  error={errors.workEmail}
                  onChange={(v) => {
                    setErrors((er) => ({...er, workEmail: ''}));
                    setForm((f) => ({...f, workEmail: v}));
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FloatingInput
                    id="wizard-company"
                    label="Company *"
                    value={form.company}
                    error={errors.company}
                    onChange={(v) => {
                      setErrors((er) => ({...er, company: ''}));
                      setForm((f) => ({...f, company: v}));
                    }}
                  />

                  <div className="relative">
                    <label
                      htmlFor="wizard-role"
                      className="block font-mono text-[10.5px] uppercase tracking-[0.06em] text-[#0B0B0B]/55 mb-1.5"
                    >
                      Role *
                    </label>
                    <select
                      id="wizard-role"
                      value={form.role}
                      onChange={(e) => setForm((f) => ({...f, role: e.target.value}))}
                      className="w-full h-[46px] rounded-[4px] border border-[#0B0B0B]/20 bg-[#F8F7F5] px-3 text-[14px] text-[#0B0B0B] focus:outline-none focus:border-[#0B2FA8]"
                    >
                      {WIZARD_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={reducedMotion ? {opacity: 1, x: 0} : {opacity: 0, x: direction * 24}}
                animate={{opacity: 1, x: 0}}
                exit={reducedMotion ? {opacity: 0} : {opacity: 0, x: direction * -24}}
                transition={{duration: reducedMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1]}}
                className="flex flex-col gap-5"
              >
                {/* Team Size */}
                <div>
                  <span className="block font-mono text-[11px] uppercase tracking-[0.06em] text-[#0B0B0B]/60 mb-2">
                    Engineering team size *
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {TEAM_SIZES.map((sz) => {
                      const active = form.teamSize === sz;
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setForm((f) => ({...f, teamSize: sz}))}
                          className={`py-2 px-2 rounded-[3px] font-mono text-[12px] border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#0B2FA8] text-white border-[#0B2FA8] font-medium'
                              : 'bg-[#F8F7F5] text-[#0B0B0B] border-[#0B0B0B]/15 hover:border-[#0B2FA8]'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Framework + Monthly Traces */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="wizard-framework"
                      className="block font-mono text-[11px] uppercase tracking-[0.06em] text-[#0B0B0B]/60 mb-1.5"
                    >
                      Primary framework
                    </label>
                    <select
                      id="wizard-framework"
                      value={form.framework}
                      onChange={(e) => setForm((f) => ({...f, framework: e.target.value}))}
                      className="w-full h-[46px] rounded-[4px] border border-[#0B0B0B]/20 bg-[#F8F7F5] px-3 text-[14px] text-[#0B0B0B] focus:outline-none focus:border-[#0B2FA8]"
                    >
                      {AGENT_FRAMEWORKS.map((fw) => (
                        <option key={fw} value={fw}>
                          {fw}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="wizard-traces"
                      className="block font-mono text-[11px] uppercase tracking-[0.06em] text-[#0B0B0B]/60 mb-1.5"
                    >
                      Monthly traces
                    </label>
                    <select
                      id="wizard-traces"
                      value={form.monthlyTraces}
                      onChange={(e) => setForm((f) => ({...f, monthlyTraces: e.target.value}))}
                      className="w-full h-[46px] rounded-[4px] border border-[#0B0B0B]/20 bg-[#F8F7F5] px-3 text-[14px] text-[#0B0B0B] focus:outline-none focus:border-[#0B2FA8]"
                    >
                      {MONTHLY_TRACE_RANGES.map((rng) => (
                        <option key={rng} value={rng}>
                          {rng}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Multi-select Goals */}
                <div>
                  <span className="block font-mono text-[11px] uppercase tracking-[0.06em] text-[#0B0B0B]/60 mb-2">
                    Goals for this walkthrough *
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {DEMO_GOALS.map((goal) => {
                      const active = form.goals.includes(goal);
                      return (
                        <button
                          key={goal}
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleGoal(goal)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-[13px] border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#0B2FA8] text-white border-[#0B2FA8]'
                              : 'bg-white text-[#0B0B0B]/80 border-[#0B0B0B]/20 hover:border-[#0B2FA8]'
                          }`}
                        >
                          {active && <Check className="w-3.5 h-3.5 text-[#D9C4A8]" strokeWidth={2.5} />}
                          <span>{goal}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.goals && (
                    <p className="mt-1.5 text-[12px] text-red-600 font-medium">{errors.goals}</p>
                  )}
                </div>

                {/* Floating Textarea */}
                <div className="relative">
                  <textarea
                    id="wizard-notes"
                    rows={3}
                    placeholder=" "
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({...f, notes: e.target.value}))}
                    className="peer w-full rounded-[4px] border border-[#0B0B0B]/20 bg-[#F8F7F5] px-3.5 pt-6 pb-2 text-[14px] text-[#0B0B0B] focus:outline-none focus:border-[#0B2FA8] resize-none"
                  />
                  <label
                    htmlFor="wizard-notes"
                    className="pointer-events-none absolute left-3.5 top-2 font-mono text-[10.5px] uppercase tracking-[0.06em] text-[#0B0B0B]/55 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-[13px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10.5px] peer-focus:uppercase peer-focus:tracking-[0.06em] peer-focus:text-[#0B2FA8]"
                  >
                    What do you want to observe?
                  </label>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={reducedMotion ? {opacity: 1, x: 0} : {opacity: 0, x: direction * 24}}
                animate={{opacity: 1, x: 0}}
                exit={reducedMotion ? {opacity: 0} : {opacity: 0, x: direction * -24}}
                transition={{duration: reducedMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1]}}
                className="flex flex-col gap-5"
              >
                {/* Timezone Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label
                    htmlFor="wizard-tz"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-[#0B0B0B]/65"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#0B2FA8]" />
                    <span>Timezone</span>
                  </label>
                  <select
                    id="wizard-tz"
                    value={form.timezone}
                    onChange={(e) => setForm((f) => ({...f, timezone: e.target.value}))}
                    className="rounded-[3px] border border-[#0B0B0B]/20 bg-[#F8F7F5] px-2.5 py-1.5 font-mono text-[12px] text-[#0B0B0B] focus:outline-none focus:border-[#0B2FA8]"
                  >
                    {timezoneOptions.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Calendar & Time Slots */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-7">
                    <CalendarPicker
                      selectedDate={form.dateIso}
                      onSelectDate={(dateIso) => {
                        setErrors((er) => ({...er, dateIso: ''}));
                        setForm((f) => ({...f, dateIso}));
                      }}
                    />
                  </div>
                  <div className="md:col-span-5 flex flex-col gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#0B0B0B]/60">
                      30-min slots
                    </span>
                    <SlotList
                      selectedDate={form.dateIso}
                      selectedSlot={form.timeSlot}
                      onSelectSlot={(timeSlot) => {
                        setErrors((er) => ({...er, timeSlot: ''}));
                        setForm((f) => ({...f, timeSlot}));
                      }}
                    />
                  </div>
                </div>

                {(errors.dateIso || errors.timeSlot) && (
                  <p className="text-[12px] text-red-600 font-medium">
                    {errors.dateIso || errors.timeSlot}
                  </p>
                )}

                {/* Selected Slot Summary Chip */}
                {form.dateIso && form.timeSlot && (
                  <div className="inline-flex flex-wrap items-center gap-2 rounded-[4px] bg-[#D9C4A8]/45 border border-[#0B2FA8]/30 px-3.5 py-2 text-[13px] text-[#0B0B0B]">
                    <CalendarCheck className="w-4 h-4 text-[#0B2FA8] shrink-0" />
                    <span className="font-medium">Selected:</span>
                    <span className="font-mono text-[12px] tabular-nums">
                      {formatReadableDate(form.dateIso)} · {form.timeSlot} ({form.timezone})
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-[#0B0B0B]/12 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-[2px] border border-[#0B0B0B]/20 bg-white hover:bg-[#0B0B0B]/5 text-[#0B0B0B] text-[13px] font-medium px-4 py-2.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <span className="font-mono text-[11px] text-[#0B0B0B]/50">
            No credit card or production keys needed
          </span>
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-[2px] bg-[#0B2FA8] hover:bg-[#0A1F6B] text-white text-[14px] font-medium px-5 py-2.5 transition-colors cursor-pointer"
          >
            <span>Next step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-[2px] bg-[#0B2FA8] hover:bg-[#0A1F6B] disabled:opacity-70 text-white text-[14px] font-medium px-6 py-2.5 transition-colors cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Booking...</span>
              </>
            ) : (
              <>
                <span>Confirm Walkthrough</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </motion.form>
  );
};

interface FloatingInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  error,
}) => (
  <div>
    <div className="relative">
      <input
        id={id}
        type={type}
        placeholder=" "
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`peer w-full h-[52px] rounded-[4px] border bg-[#F8F7F5] px-3.5 pt-4 text-[14px] text-[#0B0B0B] focus:outline-none transition-colors ${
          error
            ? 'border-red-500 focus:border-red-600'
            : 'border-[#0B0B0B]/20 focus:border-[#0B2FA8]'
        }`}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3.5 top-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#0B0B0B]/55 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-[13px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.06em] peer-focus:text-[#0B2FA8]"
      >
        {label}
      </label>
    </div>
    {error && <p className="mt-1 text-[12px] text-red-600 font-medium">{error}</p>}
  </div>
);
