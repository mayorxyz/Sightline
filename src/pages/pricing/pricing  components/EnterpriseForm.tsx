import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {Check, Loader2, ArrowRight} from 'lucide-react';
import {useReducedMotion} from '../../../hooks/useReducedMotion';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface EnterprisePayload {
  fullName: string;
  workEmail: string;
  company: string;
  role: string;
  companySize: string;
  monthlyTraces: string;
  requirements: string;
  preferredContact: 'email' | 'call';
  consent: boolean;
}

export const EnterpriseForm: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [form, setForm] = useState<EnterprisePayload>({
    fullName: '',
    workEmail: '',
    company: '',
    role: 'VP / Head of Engineering',
    companySize: '200–1,000',
    monthlyTraces: '5M – 25M / mo',
    requirements: '',
    preferredContact: 'call',
    consent: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shakeCount, setShakeCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.workEmail.trim()) next.workEmail = 'Work email is required.';
    else if (!EMAIL_REGEX.test(form.workEmail.trim()))
      next.workEmail = 'Enter a valid work email.';
    if (!form.company.trim()) next.company = 'Company name is required.';
    if (!form.requirements.trim()) next.requirements = 'Share your security or scale needs.';
    if (!form.consent) next.consent = 'Please confirm permission to contact you.';
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (!reducedMotion) setShakeCount((c) => c + 1);
      return;
    }
    setErrors({});
    setSubmitting(true);
    console.log('Sightline Enterprise Request:', form);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 550);
  };

  if (submitted) {
    return (
      <div className="w-full min-w-0 bg-white rounded-[6px] sm:rounded-[8px] border border-[#0B0B0B]/15 p-4 sm:p-8 flex flex-col items-start gap-2.5 sm:gap-4">
        <span className="inline-flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-[4px] bg-[#0B2FA8] text-[#D9C4A8] shrink-0">
          <Check className="w-4 h-4 sm:w-6 sm:h-6" strokeWidth={2.5} />
        </span>
        <h3 className="text-[20px] sm:text-[26px] font-medium tracking-[-0.02em] text-[#0B0B0B] leading-snug">
          Enterprise request received
        </h3>
        <p className="text-[13px] sm:text-[15px] leading-[1.52] sm:leading-[1.6] text-[#0B0B0B]/70 max-w-[460px]">
          Thank you, <span className="font-medium text-[#0B0B0B]">{form.fullName}</span>. Our
          solutions team will reach out via {form.preferredContact} at{' '}
          <span className="font-mono text-[11.5px] sm:text-[13px] text-[#0B2FA8] break-all">
            {form.workEmail}
          </span>{' '}
          within 1 business day.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-1 sm:mt-2 font-mono text-[11px] sm:text-[12px] text-[#0B2FA8] hover:underline cursor-pointer"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      key={shakeCount > 0 ? `ent-shake-${shakeCount}` : 'ent-steady'}
      animate={shakeCount > 0 && !reducedMotion ? {x: [0, -7, 7, -5, 5, 0]} : {x: 0}}
      transition={{duration: 0.35}}
      className="w-full min-w-0 bg-white rounded-[6px] sm:rounded-[8px] border border-[#0B0B0B]/15 p-3.5 sm:p-8 flex flex-col gap-3 sm:gap-5"
    >
      <div aria-live="polite" className="sr-only">
        {Object.values(errors).filter(Boolean).join(' ')}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
        <FloatField
          id="ent-name"
          label="Full name *"
          value={form.fullName}
          error={errors.fullName}
          onChange={(v) => {
            setErrors((er) => ({...er, fullName: ''}));
            setForm((f) => ({...f, fullName: v}));
          }}
        />
        <FloatField
          id="ent-email"
          type="email"
          label="Work email *"
          value={form.workEmail}
          error={errors.workEmail}
          onChange={(v) => {
            setErrors((er) => ({...er, workEmail: ''}));
            setForm((f) => ({...f, workEmail: v}));
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
        <FloatField
          id="ent-company"
          label="Company *"
          value={form.company}
          error={errors.company}
          onChange={(v) => {
            setErrors((er) => ({...er, company: ''}));
            setForm((f) => ({...f, company: v}));
          }}
        />
        <div className="min-w-0">
          <label
            htmlFor="ent-role"
            className="block font-mono text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.06em] text-[#0B0B0B]/55 mb-1 sm:mb-1.5"
          >
            Role
          </label>
          <select
            id="ent-role"
            value={form.role}
            onChange={(e) => setForm((f) => ({...f, role: e.target.value}))}
            className="w-full h-[40px] sm:h-[46px] rounded-[4px] border border-[#0B0B0B]/20 bg-[#F8F7F5] px-2.5 sm:px-3 text-[13px] sm:text-[14px] text-[#0B0B0B] focus:outline-none focus:border-[#0B2FA8]"
          >
            <option>VP / Head of Engineering</option>
            <option>Staff ML / AI Engineer</option>
            <option>Platform / Infra Lead</option>
            <option>CISO / Security</option>
            <option>Procurement</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
        <div className="min-w-0">
          <label
            htmlFor="ent-size"
            className="block font-mono text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.06em] text-[#0B0B0B]/55 mb-1 sm:mb-1.5"
          >
            Company size
          </label>
          <select
            id="ent-size"
            value={form.companySize}
            onChange={(e) => setForm((f) => ({...f, companySize: e.target.value}))}
            className="w-full h-[40px] sm:h-[46px] rounded-[4px] border border-[#0B0B0B]/20 bg-[#F8F7F5] px-2.5 sm:px-3 text-[13px] sm:text-[14px] text-[#0B0B0B] focus:outline-none focus:border-[#0B2FA8]"
          >
            <option>50–200</option>
            <option>200–1,000</option>
            <option>1,000–5,000</option>
            <option>5,000+</option>
          </select>
        </div>

        <div className="min-w-0">
          <label
            htmlFor="ent-traces"
            className="block font-mono text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.06em] text-[#0B0B0B]/55 mb-1 sm:mb-1.5"
          >
            Monthly traces
          </label>
          <select
            id="ent-traces"
            value={form.monthlyTraces}
            onChange={(e) => setForm((f) => ({...f, monthlyTraces: e.target.value}))}
            className="w-full h-[40px] sm:h-[46px] rounded-[4px] border border-[#0B0B0B]/20 bg-[#F8F7F5] px-2.5 sm:px-3 text-[13px] sm:text-[14px] text-[#0B0B0B] focus:outline-none focus:border-[#0B2FA8]"
          >
            <option>5M – 25M / mo</option>
            <option>25M – 100M / mo</option>
            <option>100M+ / mo</option>
          </select>
        </div>
      </div>

      <div className="min-w-0">
        <div className="relative">
          <textarea
            id="ent-req"
            rows={2}
            placeholder=" "
            value={form.requirements}
            onChange={(e) => {
              setErrors((er) => ({...er, requirements: ''}));
              setForm((f) => ({...f, requirements: e.target.value}));
            }}
            className={`peer w-full rounded-[4px] border bg-[#F8F7F5] px-3 sm:px-3.5 pt-5 sm:pt-6 pb-1.5 sm:pb-2 text-[13px] sm:text-[14px] text-[#0B0B0B] focus:outline-none resize-none ${
              errors.requirements
                ? 'border-red-500'
                : 'border-[#0B0B0B]/20 focus:border-[#0B2FA8]'
            }`}
          />
          <label
            htmlFor="ent-req"
            className="pointer-events-none absolute left-3 sm:left-3.5 top-1.5 sm:top-2 font-mono text-[9.5px] sm:text-[10px] uppercase tracking-[0.06em] text-[#0B0B0B]/55 transition-all peer-placeholder-shown:top-3 sm:peer-placeholder-shown:top-4 peer-placeholder-shown:text-[12px] sm:peer-placeholder-shown:text-[13px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-1.5 sm:peer-focus:top-2 peer-focus:text-[9.5px] sm:peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.06em] peer-focus:text-[#0B2FA8]"
          >
            Deployment &amp; compliance requirements *
          </label>
        </div>
        {errors.requirements && (
          <p className="mt-1 text-[11px] sm:text-[12px] text-red-600 font-medium">
            {errors.requirements}
          </p>
        )}
      </div>

      {/* Preferred Contact Toggle */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.06em] text-[#0B0B0B]/60 truncate">
          Preferred contact
        </span>
        <div className="inline-flex shrink-0 rounded-[3px] border border-[#0B0B0B]/20 bg-[#F8F7F5] p-0.5">
          {(['email', 'call'] as const).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setForm((f) => ({...f, preferredContact: method}))}
              className={`px-2.5 sm:px-3 py-1 rounded-[2px] font-mono text-[10.5px] sm:text-[11.5px] capitalize cursor-pointer ${
                form.preferredContact === method
                  ? 'bg-[#0B2FA8] text-white'
                  : 'text-[#0B0B0B]/70'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Consent */}
      <div className="min-w-0">
        <label className="flex items-start gap-2 sm:gap-2.5 text-[12px] sm:text-[13px] leading-snug text-[#0B0B0B]/75 cursor-pointer">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => {
              setErrors((er) => ({...er, consent: ''}));
              setForm((f) => ({...f, consent: e.target.checked}));
            }}
            className="mt-0.5 shrink-0 accent-[#0B2FA8]"
          />
          <span>I agree to receive enterprise deployment details and SLA documentation.</span>
        </label>
        {errors.consent && (
          <p className="mt-1 text-[11px] sm:text-[12px] text-red-600">{errors.consent}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[2px] bg-[#0B2FA8] hover:bg-[#0A1F6B] text-white text-[13px] sm:text-[14px] font-medium px-4 sm:px-6 py-2.5 sm:py-3 transition-colors cursor-pointer disabled:opacity-70"
      >
        {submitting ? (
          <>
            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
            <span>Sending request...</span>
          </>
        ) : (
          <>
            <span>Request Enterprise Proposal</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </>
        )}
      </button>
    </motion.form>
  );
};

const FloatField: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
}> = ({id, label, value, onChange, type = 'text', error}) => (
  <div className="min-w-0">
    <div className="relative">
      <input
        id={id}
        type={type}
        placeholder=" "
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`peer w-full h-[44px] sm:h-[50px] rounded-[4px] border bg-[#F8F7F5] px-3 sm:px-3.5 pt-3.5 sm:pt-4 text-[13px] sm:text-[14px] text-[#0B0B0B] focus:outline-none ${
          error ? 'border-red-500' : 'border-[#0B0B0B]/20 focus:border-[#0B2FA8]'
        }`}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3 sm:left-3.5 top-1 sm:top-1.5 font-mono text-[9.5px] sm:text-[10px] uppercase tracking-[0.06em] text-[#0B0B0B]/55 transition-all peer-placeholder-shown:top-3 sm:peer-placeholder-shown:top-4 peer-placeholder-shown:text-[12px] sm:peer-placeholder-shown:text-[13px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-1 sm:peer-focus:top-1.5 peer-focus:text-[9.5px] sm:peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.06em] peer-focus:text-[#0B2FA8]"
      >
        {label}
      </label>
    </div>
    {error && (
      <p className="mt-1 text-[11px] sm:text-[12px] text-red-600 font-medium">{error}</p>
    )}
  </div>
);