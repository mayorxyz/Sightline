import React, {useState} from 'react';
import {ShieldCheck, Lock, ArrowRight} from 'lucide-react';

const RAW_PAYLOAD = `{
  "trace_id": "trace_8f21",
  "user_email": "amara.okafor@lumenlabs.io",
  "ssn_last4_token": "481-00-9214",
  "api_secret": "sk_live_99a4b82e110c",
  "prompt": "Refund order #4812 for Amara (+1-415-555-0192)",
  "region": "eu-west-1"
}`;

const REDACTED_PAYLOAD = `{
  "trace_id": "trace_8f21",
  "user_email": "[REDACTED_EMAIL]",
  "ssn_last4_token": "[REDACTED_SSN]",
  "api_secret": "[REDACTED_SECRET]",
  "prompt": "Refund order #4812 for Amara ([REDACTED_PHONE])",
  "region": "eu-west-1"
}`;

const COMPLIANCE = ['SOC 2 Type II', 'GDPR EU-Pinned', 'HIPAA BAA', 'ISO 27001'];

export const RedactionDemo: React.FC = () => {
  const [redacted, setRedacted] = useState(true);

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Top Bar: Toggle + Data Flow */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-white/15">
        <div className="inline-flex items-center gap-1 p-1 rounded-[4px] bg-[#06154D] border border-white/15">
          <button
            type="button"
            onClick={() => setRedacted(false)}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-[2px] font-mono text-[10px] sm:text-[12px] transition-colors cursor-pointer ${
              !redacted ? 'bg-[#D9C4A8] text-[#0B0B0B] font-semibold' : 'text-white/70 hover:text-white'
            }`}
          >
            Before
          </button>
          <button
            type="button"
            onClick={() => setRedacted(true)}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-[2px] font-mono text-[10px] sm:text-[12px] transition-colors cursor-pointer ${
              redacted ? 'bg-[#0B2FA8] text-white font-semibold' : 'text-white/70 hover:text-white'
            }`}
          >
            After Scrubbing
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 font-mono text-[9px] sm:text-[11px] text-[#D9C4A8]">
          <span>SDK</span>
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="px-1.5 sm:px-2 py-0.5 rounded-[2px] bg-white/10 text-white whitespace-nowrap">Edge PII Scrubber</span>
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-[2px] bg-white/10 text-white whitespace-nowrap">
            <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> AES-256
          </span>
        </div>
      </div>

      {/* Payload Preview */}
      <pre className="rounded-[6px] bg-[#06154D] border border-white/15 p-3 sm:p-5 font-mono text-[10px] sm:text-[12.5px] leading-[1.6] sm:leading-[1.7] text-white/90 overflow-x-auto">
        <code>{redacted ? REDACTED_PAYLOAD : RAW_PAYLOAD}</code>
      </pre>

      {/* Compliance Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {COMPLIANCE.map((badge) => (
          <div
            key={badge}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-[4px] bg-white/8 border border-white/15 text-[10px] sm:text-[12px] font-mono text-white"
          >
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D9C4A8] shrink-0" />
            <span className="truncate">{badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
};