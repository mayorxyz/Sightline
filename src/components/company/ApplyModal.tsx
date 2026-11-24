import React, {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Check, Loader2, X} from 'lucide-react';
import {OpenRole} from '../../lib/companyContent';
import {useReducedMotion} from '../../hooks/useReducedMotion';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ApplyModalProps {
  role: OpenRole | null;
  onClose: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({role, onClose}) => {
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [link, setLink] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Reset form when role changes
  useEffect(() => {
    if (!role) return;
    setName('');
    setEmail('');
    setLink('');
    setErrors({});
    setSubmitted(false);
  }, [role]);

  // Focus trap, Esc close, and restore focus on close
  useEffect(() => {
    if (!role) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const focusTimer = setTimeout(() => {
      const firstInput = dialogRef.current?.querySelector<HTMLElement>('input, button');
      firstInput?.focus();
    }, 30);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'input:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [role, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required.';
    if (!email.trim()) errs.email = 'Email is required.';
    else if (!EMAIL_REGEX.test(email.trim())) errs.email = 'Enter a valid email.';
    if (!link.trim()) errs.link = 'GitHub, portfolio, or LinkedIn URL is required.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitting(true);
    console.log('Sightline Role Application:', {
      roleId: role?.id,
      roleTitle: role?.title,
      name,
      email,
      link,
    });
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 450);
  };

  return (
    <AnimatePresence>
      {role && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto"
          role="presentation"
        >
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={onClose}
            className="fixed inset-0 bg-[#0A1F6B]/75 backdrop-blur-xs"
            aria-hidden="true"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="apply-modal-title"
            initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 14}}
            animate={{opacity: 1, y: 0}}
            exit={reducedMotion ? {opacity: 0} : {opacity: 0, y: 10}}
            transition={{duration: reducedMotion ? 0 : 0.22}}
            className="relative z-10 w-full min-w-0 max-w-[480px] max-h-[90dvh] overflow-y-auto rounded-[6px] sm:rounded-[8px] bg-white text-[#0B0B0B] border border-[#0B0B0B]/15 p-4 sm:p-8 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-2.5 sm:gap-3 pb-3 sm:pb-4 border-b border-[#0B0B0B]/12 min-w-0">
              <div className="min-w-0">
                <span className="block font-mono text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.08em] text-[#0B2FA8] truncate">
                  {role.team} · {role.location}
                </span>
                <h2
                  id="apply-modal-title"
                  className="mt-1 text-[18px] sm:text-[22px] font-medium tracking-[-0.02em] leading-snug text-[#0B0B0B]"
                >
                  Apply: {role.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close application modal"
                className="w-7 h-7 sm:w-8 sm:h-8 inline-flex items-center justify-center rounded-[2px] border border-[#0B0B0B]/15 hover:bg-[#0B0B0B]/6 cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {submitted ? (
              <div className="pt-4 sm:pt-6 flex flex-col items-start gap-2.5 sm:gap-4 min-w-0">
                <span className="inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-[4px] bg-[#0B2FA8] text-[#D9C4A8] shrink-0">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                </span>
                <h3 className="text-[18px] sm:text-[20px] font-medium text-[#0B0B0B] leading-snug">
                  Application received
                </h3>
                <p className="text-[13px] sm:text-[14px] leading-[1.52] sm:leading-[1.6] text-[#0B0B0B]/70">
                  Thanks, <span className="font-medium text-[#0B0B0B]">{name}</span>. Our hiring
                  lead will review your profile and reach out to{' '}
                  <span className="font-mono text-[11.5px] sm:text-[12.5px] text-[#0B2FA8] break-all">
                    {email}
                  </span>
                  .
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-1 sm:mt-2 w-full sm:w-auto rounded-[2px] bg-[#0B2FA8] text-white text-[12.5px] sm:text-[13px] font-medium px-4 sm:px-5 py-2 sm:py-2.5 cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="pt-3.5 sm:pt-5 flex flex-col gap-3 sm:gap-4 min-w-0"
              >
                <div aria-live="polite" className="sr-only">
                  {Object.values(errors).filter(Boolean).join(' ')}
                </div>

                <div className="min-w-0">
                  <label
                    htmlFor="apply-name"
                    className="block font-mono text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.06em] text-[#0B0B0B]/60 mb-1"
                  >
                    Full name *
                  </label>
                  <input
                    id="apply-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setErrors((er) => ({...er, name: ''}));
                      setName(e.target.value);
                    }}
                    className="w-full h-10 sm:h-11 rounded-[4px] border border-[#0B0B0B]/20 bg-[#F8F7F5] px-2.5 sm:px-3 text-[13px] sm:text-[14px] focus:outline-none focus:border-[#0B2FA8]"
                  />
                  {errors.name && (
                    <p className="mt-1 text-[11px] sm:text-[12px] text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="min-w-0">
                  <label
                    htmlFor="apply-email"
                    className="block font-mono text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.06em] text-[#0B0B0B]/60 mb-1"
                  >
                    Email *
                  </label>
                  <input
                    id="apply-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setErrors((er) => ({...er, email: ''}));
                      setEmail(e.target.value);
                    }}
                    className="w-full h-10 sm:h-11 rounded-[4px] border border-[#0B0B0B]/20 bg-[#F8F7F5] px-2.5 sm:px-3 text-[13px] sm:text-[14px] focus:outline-none focus:border-[#0B2FA8]"
                  />
                  {errors.email && (
                    <p className="mt-1 text-[11px] sm:text-[12px] text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="min-w-0">
                  <label
                    htmlFor="apply-link"
                    className="block font-mono text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.06em] text-[#0B0B0B]/60 mb-1"
                  >
                    GitHub / LinkedIn / Portfolio URL *
                  </label>
                  <input
                    id="apply-link"
                    type="url"
                    placeholder="https://github.com/username"
                    value={link}
                    onChange={(e) => {
                      setErrors((er) => ({...er, link: ''}));
                      setLink(e.target.value);
                    }}
                    className="w-full h-10 sm:h-11 rounded-[4px] border border-[#0B0B0B]/20 bg-[#F8F7F5] px-2.5 sm:px-3 text-[13px] sm:text-[14px] focus:outline-none focus:border-[#0B2FA8]"
                  />
                  {errors.link && (
                    <p className="mt-1 text-[11px] sm:text-[12px] text-red-600">{errors.link}</p>
                  )}
                </div>

                <div className="pt-1 sm:pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto rounded-[2px] border border-[#0B0B0B]/20 px-4 py-2 sm:py-2.5 text-[12.5px] sm:text-[13px] font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[2px] bg-[#0B2FA8] hover:bg-[#0A1F6B] text-white px-4 sm:px-5 py-2 sm:py-2.5 text-[12.5px] sm:text-[13px] font-medium cursor-pointer disabled:opacity-70"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
                    <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};