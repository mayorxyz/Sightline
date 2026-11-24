import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {ArrowRight, Check, Loader2} from 'lucide-react';
import {useReducedMotion} from '../../hooks/useReducedMotion';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPICS = ['Sales', 'Support', 'Partnerships', 'Press', 'Other'] as const;

export const ContactForm: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<string>('Sales');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shakeCount, setShakeCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required.';
    if (!email.trim()) errs.email = 'Work email is required.';
    else if (!EMAIL_REGEX.test(email.trim())) errs.email = 'Enter a valid email address.';
    if (!message.trim()) errs.message = 'Message is required.';
    if (!consent) errs.consent = 'Please confirm permission to reply.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (!reducedMotion) setShakeCount((c) => c + 1);
      return;
    }

    setErrors({});
    setSubmitting(true);
    console.log('Sightline Contact Submission:', {name, email, topic, message, consent});
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 500);
  };

  if (submitted) {
    return (
      <div className="w-full min-w-0 bg-white rounded-[6px] sm:rounded-[8px] border border-[#0B0B0B]/15 p-4 sm:p-8 flex flex-col items-start gap-2.5 sm:gap-4">
        <span className="inline-flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-[4px] bg-[#0B2FA8] text-[#D9C4A8] shrink-0">
          <Check className="w-4 h-4 sm:w-6 sm:h-6" strokeWidth={2.5} />
        </span>
        <h2 className="text-[20px] sm:text-[26px] font-medium tracking-[-0.02em] leading-snug text-[#0B0B0B]">
          Message received
        </h2>
        <p className="text-[13px] sm:text-[15px] leading-[1.52] sm:leading-[1.6] text-[#0B0B0B]/70">
          Thanks, <span className="font-medium text-[#0B0B0B]">{name}</span>. Our{' '}
          <span className="font-medium text-[#0B2FA8]">{topic}</span> team will reply to{' '}
          <span className="font-mono text-[11.5px] sm:text-[13px] text-[#0B2FA8] break-all">
            {email}
          </span>{' '}
          shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setMessage('');
          }}
          className="mt-1 sm:mt-2 font-mono text-[11px] sm:text-[12px] text-[#0B2FA8] hover:underline cursor-pointer"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      key={shakeCount > 0 ? `contact-shake-${shakeCount}` : 'contact-steady'}
      animate={shakeCount > 0 && !reducedMotion ? {x: [0, -7, 7, -5, 5, 0]} : {x: 0}}
      transition={{duration: 0.35}}
      className="w-full min-w-0 bg-white rounded-[6px] sm:rounded-[8px] border border-[#0B0B0B]/15 p-3.5 sm:p-8 flex flex-col gap-3 sm:gap-5"
    >
      <div aria-live="polite" className="sr-only">
        {Object.values(errors).filter(Boolean).join(' ')}
      </div>

      <ContactFloatInput
        id="contact-name"
        label="Full name *"
        value={name}
        error={errors.name}
        onChange={(v) => {
          setErrors((er) => ({...er, name: ''}));
          setName(v);
        }}
      />

      <ContactFloatInput
        id="contact-email"
        type="email"
        label="Work email *"
        value={email}
        error={errors.email}
        onChange={(v) => {
          setErrors((er) => ({...er, email: ''}));
          setEmail(v);
        }}
      />

      <div className="min-w-0">
        <label
          htmlFor="contact-topic"
          className="block font-mono text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.06em] text-[#0B0B0B]/55 mb-1 sm:mb-1.5"
        >
          Topic
        </label>
        <select
          id="contact-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full h-[40px] sm:h-[46px] rounded-[4px] border border-[#0B0B0B]/20 bg-[#F8F7F5] px-2.5 sm:px-3 text-[13px] sm:text-[14px] text-[#0B0B0B] focus:outline-none focus:border-[#0B2FA8]"
        >
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-0">
        <div className="relative">
          <textarea
            id="contact-message"
            rows={3}
            placeholder=" "
            value={message}
            onChange={(e) => {
              setErrors((er) => ({...er, message: ''}));
              setMessage(e.target.value);
            }}
            aria-invalid={!!errors.message}
            className={`peer w-full rounded-[4px] border bg-[#F8F7F5] px-3 sm:px-3.5 pt-5 sm:pt-6 pb-1.5 sm:pb-2 text-[13px] sm:text-[14px] text-[#0B0B0B] focus:outline-none resize-none ${
              errors.message
                ? 'border-red-500'
                : 'border-[#0B0B0B]/20 focus:border-[#0B2FA8]'
            }`}
          />
          <label
            htmlFor="contact-message"
            className="pointer-events-none absolute left-3 sm:left-3.5 top-1.5 sm:top-2 font-mono text-[9.5px] sm:text-[10px] uppercase tracking-[0.06em] text-[#0B0B0B]/55 transition-all peer-placeholder-shown:top-3 sm:peer-placeholder-shown:top-4 peer-placeholder-shown:text-[12px] sm:peer-placeholder-shown:text-[13px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-1.5 sm:peer-focus:top-2 peer-focus:text-[9.5px] sm:peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.06em] peer-focus:text-[#0B2FA8]"
          >
            How can we help? *
          </label>
        </div>
        {errors.message && (
          <p className="mt-1 text-[11px] sm:text-[12px] text-red-600">{errors.message}</p>
        )}
      </div>

      <div className="min-w-0">
        <label className="flex items-start gap-2 sm:gap-2.5 text-[12px] sm:text-[13px] leading-snug text-[#0B0B0B]/75 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setErrors((er) => ({...er, consent: ''}));
              setConsent(e.target.checked);
            }}
            className="mt-0.5 shrink-0 accent-[#0B2FA8]"
          />
          <span>Allow Sightline to respond to my inquiry via email.</span>
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
            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin shrink-0" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <span>Send Message</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          </>
        )}
      </button>
    </motion.form>
  );
};

const ContactFloatInput: React.FC<{
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
    {error && <p className="mt-1 text-[11px] sm:text-[12px] text-red-600">{error}</p>}
  </div>
);