import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {Check, Loader2, ArrowUpRight} from 'lucide-react';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface FormValues {
  fullName: string;
  workEmail: string;
  company: string;
  teamSize: string;
  framework: string;
  notes: string;
  consent: boolean;
}

const INITIAL_VALUES: FormValues = {
  fullName: '',
  workEmail: '',
  company: '',
  teamSize: '11-50',
  framework: 'LangGraph',
  notes: '',
  consent: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const DemoForm: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [shakeKey, setShakeKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submittedPayload, setSubmittedPayload] = useState<FormValues | null>(null);

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormValues, string>> = {};
    if (!values.fullName.trim()) next.fullName = 'Full name is required.';
    if (!EMAIL_RE.test(values.workEmail.trim())) next.workEmail = 'Enter a valid work email.';
    if (!values.company.trim()) next.company = 'Company name is required.';
    if (!values.notes.trim()) next.notes = 'Tell us briefly what you want to observe.';
    if (!values.consent) next.consent = 'Please confirm consent to be contacted.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setShakeKey((k) => k + 1);
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const payload = {...values};
      console.log('Sightline Demo Request:', payload);
      setSubmitting(false);
      setSubmittedPayload(payload);
    }, 650);
  };

  const updateField = <K extends keyof FormValues>(key: K, val: FormValues[K]) => {
    setValues((prev) => ({...prev, [key]: val}));
    if (errors[key]) {
      setErrors((prev) => {
        const next = {...prev};
        delete next[key];
        return next;
      });
    }
  };

  if (submittedPayload) {
    return (
      <div className="bg-white rounded-[6px] sm:rounded-[8px] border border-[#0B0B0B]/12 p-6 sm:p-10 flex flex-col items-center justify-center text-center min-h-[480px] sm:min-h-[520px]">
        <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-5 sm:mb-6">
          {!reducedMotion && (
            <motion.span
              initial={{scale: 0.6, opacity: 0.85}}
              animate={{scale: 1.75, opacity: 0}}
              transition={{duration: 0.85, ease: [0.16, 1, 0.3, 1]}}
              className="absolute inset-0 rounded-full border-2 border-[#0B2FA8]"
            />
          )}
          <motion.div
            initial={reducedMotion ? {scale: 1} : {scale: 0.7, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            transition={{type: 'spring', stiffness: 360, damping: 22}}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0B2FA8] text-white flex items-center justify-center shadow-[0_12px_30px_rgba(11,47,168,0.28)]"
          >
            <Check className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
          </motion.div>
        </div>

        <h2 className="text-[24px] sm:text-[28px] font-medium tracking-[-0.03em] text-[#0B0B0B]">
          Request received.
        </h2>
        <p className="mt-2 text-[14px] sm:text-[16px] text-[#0B0B0B]/70 max-w-[360px]">
          We&apos;ll reply within 1 business day to{' '}
          <span className="font-medium text-[#0B0B0B]">{submittedPayload.workEmail}</span>.
        </p>

        <button
          type="button"
          onClick={() => {
            setSubmittedPayload(null);
            setValues(INITIAL_VALUES);
          }}
          className="mt-6 sm:mt-8 px-4 py-2 rounded-[2px] border border-[#0B0B0B]/20 text-[12px] sm:text-[13px] font-medium text-[#0B0B0B] hover:bg-[#E9E8E6] transition-colors cursor-pointer"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <motion.form
      key={shakeKey}
      onSubmit={handleSubmit}
      noValidate
      animate={
        shakeKey > 0 && !reducedMotion
          ? {x: [-6, 6, -4, 4, 0]}
          : {x: 0}
      }
      transition={{duration: 0.32}}
      className="bg-white rounded-[6px] sm:rounded-[8px] border border-[#0B0B0B]/12 p-5 sm:p-8 flex flex-col gap-4 sm:gap-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="relative">
          <input
            id="demo-name"
            type="text"
            value={values.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder=" "
            className={`peer w-full rounded-[4px] border bg-white px-3 sm:px-3.5 pt-5 pb-2 text-[13px] sm:text-[14px] text-[#0B0B0B] focus:outline-none ${
              errors.fullName
                ? 'border-red-500'
                : 'border-[#0B0B0B]/20 focus:border-[#0B2FA8]'
            }`}
          />
          <label
            htmlFor="demo-name"
            className="pointer-events-none absolute left-3 sm:left-3.5 top-2 text-[10px] sm:text-[11px] font-medium text-[#0B0B0B]/55 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[13px] sm:peer-placeholder-shown:text-[14px] peer-focus:top-1.5 peer-focus:text-[10px] sm:peer-focus:text-[11px] peer-focus:text-[#0B2FA8]"
          >
            Full name *
          </label>
          {errors.fullName && (
            <span className="mt-1 block text-[11px] sm:text-[12px] text-red-600">{errors.fullName}</span>
          )}
        </div>

        {/* Work Email */}
        <div className="relative">
          <input
            id="demo-email"
            type="email"
            value={values.workEmail}
            onChange={(e) => updateField('workEmail', e.target.value)}
            placeholder=" "
            className={`peer w-full rounded-[4px] border bg-white px-3 sm:px-3.5 pt-5 pb-2 text-[13px] sm:text-[14px] text-[#0B0B0B] focus:outline-none ${
              errors.workEmail
                ? 'border-red-500'
                : 'border-[#0B0B0B]/20 focus:border-[#0B2FA8]'
            }`}
          />
          <label
            htmlFor="demo-email"
            className="pointer-events-none absolute left-3 sm:left-3.5 top-2 text-[10px] sm:text-[11px] font-medium text-[#0B0B0B]/55 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[13px] sm:peer-placeholder-shown:text-[14px] peer-focus:top-1.5 peer-focus:text-[10px] sm:peer-focus:text-[11px] peer-focus:text-[#0B2FA8]"
          >
            Work email *
          </label>
          {errors.workEmail && (
            <span className="mt-1 block text-[11px] sm:text-[12px] text-red-600">{errors.workEmail}</span>
          )}
        </div>
      </div>

      {/* Company */}
      <div className="relative">
        <input
          id="demo-company"
          type="text"
          value={values.company}
          onChange={(e) => updateField('company', e.target.value)}
          placeholder=" "
          className={`peer w-full rounded-[4px] border bg-white px-3 sm:px-3.5 pt-5 pb-2 text-[13px] sm:text-[14px] text-[#0B0B0B] focus:outline-none ${
            errors.company
              ? 'border-red-500'
              : 'border-[#0B0B0B]/20 focus:border-[#0B2FA8]'
          }`}
        />
        <label
          htmlFor="demo-company"
          className="pointer-events-none absolute left-3 sm:left-3.5 top-2 text-[10px] sm:text-[11px] font-medium text-[#0B0B0B]/55 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[13px] sm:peer-placeholder-shown:text-[14px] peer-focus:top-1.5 peer-focus:text-[10px] sm:peer-focus:text-[11px] peer-focus:text-[#0B2FA8]"
        >
          Company *
        </label>
        {errors.company && (
          <span className="mt-1 block text-[11px] sm:text-[12px] text-red-600">{errors.company}</span>
        )}
      </div>

      {/* Team Size + Agent Framework */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <label
            htmlFor="demo-team-size"
            className="block text-[10px] sm:text-[11px] font-medium text-[#0B0B0B]/60 mb-1"
          >
            Team size
          </label>
          <select
            id="demo-team-size"
            value={values.teamSize}
            onChange={(e) => updateField('teamSize', e.target.value)}
            className="w-full rounded-[4px] border border-[#0B0B0B]/20 bg-white px-3 py-2 sm:py-2.5 text-[13px] sm:text-[14px] text-[#0B0B0B] focus:outline-none focus:border-[#0B2FA8]"
          >
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="200+">200+</option>
          </select>
        </div>

        <div className="relative">
          <label
            htmlFor="demo-framework"
            className="block text-[10px] sm:text-[11px] font-medium text-[#0B0B0B]/60 mb-1"
          >
            Agent framework
          </label>
          <select
            id="demo-framework"
            value={values.framework}
            onChange={(e) => updateField('framework', e.target.value)}
            className="w-full rounded-[4px] border border-[#0B0B0B]/20 bg-white px-3 py-2 sm:py-2.5 text-[13px] sm:text-[14px] text-[#0B0B0B] focus:outline-none focus:border-[#0B2FA8]"
          >
            <option value="LangGraph">LangGraph</option>
            <option value="CrewAI">CrewAI</option>
            <option value="LlamaIndex">LlamaIndex</option>
            <option value="OpenAI Agents SDK">OpenAI Agents SDK</option>
            <option value="Custom / Internal">Custom / Internal</option>
          </select>
        </div>
      </div>

      {/* Notes Textarea */}
      <div className="relative">
        <textarea
          id="demo-notes"
          rows={3}
          value={values.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder=" "
          className={`peer w-full rounded-[4px] border bg-white px-3 sm:px-3.5 pt-6 pb-2 text-[13px] sm:text-[14px] text-[#0B0B0B] focus:outline-none resize-none ${
            errors.notes
              ? 'border-red-500'
              : 'border-[#0B0B0B]/20 focus:border-[#0B2FA8]'
          }`}
        />
        <label
          htmlFor="demo-notes"
          className="pointer-events-none absolute left-3 sm:left-3.5 top-2 text-[10px] sm:text-[11px] font-medium text-[#0B0B0B]/55 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-[13px] sm:peer-placeholder-shown:text-[14px] peer-focus:top-1.5 peer-focus:text-[10px] sm:peer-focus:text-[11px] peer-focus:text-[#0B2FA8]"
        >
          What do you want to observe? *
        </label>
        {errors.notes && (
          <span className="mt-1 block text-[11px] sm:text-[12px] text-red-600">{errors.notes}</span>
        )}
      </div>

      {/* Consent Checkbox */}
      <div>
        <label className="flex items-start gap-2.5 text-[12px] sm:text-[13px] text-[#0B0B0B]/75 cursor-pointer">
          <input
            type="checkbox"
            checked={values.consent}
            onChange={(e) => updateField('consent', e.target.checked)}
            className="mt-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 accent-[#0B2FA8] cursor-pointer"
          />
          <span>
            I agree to receive a response from Sightline regarding this live technical demo.
          </span>
        </label>
        {errors.consent && (
          <span className="mt-1 block text-[11px] sm:text-[12px] text-red-600">{errors.consent}</span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="mt-1 inline-flex items-center justify-between gap-4 rounded-[2px] bg-[#0B2FA8] hover:bg-[#09268C] disabled:opacity-75 text-white pl-4 sm:pl-5 pr-1.5 py-1.5 sm:py-2 text-[13px] sm:text-[14px] font-medium transition-colors cursor-pointer"
      >
        <span>{submitting ? 'Scheduling...' : 'Request Live Demo'}</span>
        <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-[2px] bg-[#D9C4A8] text-[#0B2FA8]">
          {submitting ? (
            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
          ) : (
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
          )}
        </span>
      </button>
    </motion.form>
  );
};