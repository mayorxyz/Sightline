import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {Check, Minus, AlertCircle} from 'lucide-react';
import {
  ALTERNATIVE_COMPARE_ROWS,
  CompareCell,
  WHY_TEAMS_SWITCH,
} from '../../../lib/pricingContent';
import {Button} from '../../../components/Button';
import {useReducedMotion} from '../../../hooks/useReducedMotion';

const CellBadge: React.FC<{cell: CompareCell; highlight?: boolean}> = ({cell, highlight}) => {
  const [showTip, setShowTip] = useState(false);

  const icon =
    cell.status === 'full' ? (
      <Check
        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${highlight ? 'text-[#D9C4A8]' : 'text-emerald-600'}`}
        strokeWidth={2.5}
      />
    ) : cell.status === 'partial' ? (
      <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-amber-500" strokeWidth={2} />
    ) : (
      <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-[#0B0B0B]/30" strokeWidth={2} />
    );

  return (
    <div
      className="relative inline-flex items-center gap-1.5 sm:gap-2 group max-w-full"
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
      onFocus={() => setShowTip(true)}
      onBlur={() => setShowTip(false)}
      onClick={() => setShowTip((prev) => !prev)}
      tabIndex={0}
    >
      {icon}
      <span
        className={`text-[11.5px] sm:text-[13px] leading-snug ${
          highlight ? 'text-white font-medium' : 'text-[#0B0B0B]/80'
        }`}
      >
        {cell.text}
      </span>

      {showTip && (
        <div
          role="tooltip"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 bottom-full mb-2 w-[185px] sm:w-[220px] rounded-[4px] bg-[#0B0B0B] text-white text-[10.5px] sm:text-[11.5px] leading-[1.45] p-2 sm:p-2.5 shadow-xl z-30"
        >
          {cell.tooltip}
        </div>
      )}
    </div>
  );
};

export const CompareMatrix: React.FC = () => {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-3 sm:gap-6 min-w-0">
      {/* Sticky Header Comparison Matrix */}
      <section className="mx-1.5 sm:mx-5 mt-3 sm:mt-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10">
        <div className="w-full max-w-[1360px] mx-auto overflow-x-auto min-w-0">
          <table className="w-full min-w-[660px] sm:min-w-[780px] border-collapse text-left">
            <thead className="sticky top-0 z-20">
              <tr className="border-b border-[#0B0B0B]/15">
                <th className="py-2.5 sm:py-4 px-2.5 sm:px-4 bg-[#E9E8E6] font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#0B0B0B]/60 w-[22%]">
                  Capability
                </th>
                <th className="py-2.5 sm:py-4 px-3 sm:px-5 bg-[#0B2FA8] text-white rounded-t-[6px] w-[22%]">
                  <span className="block font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.08em] text-[#D9C4A8]">
                    Purpose-built
                  </span>
                  <span className="text-[13px] sm:text-[16px] font-medium">Sightline</span>
                </th>
                <th className="py-2.5 sm:py-4 px-2.5 sm:px-4 bg-[#E9E8E6] text-[#0B0B0B] w-[18%]">
                  <span className="block font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.08em] text-[#0B0B0B]/50">
                    Traditional
                  </span>
                  <span className="text-[12.5px] sm:text-[15px] font-medium">Generic APM</span>
                </th>
                <th className="py-2.5 sm:py-4 px-2.5 sm:px-4 bg-[#E9E8E6] text-[#0B0B0B] w-[19%]">
                  <span className="block font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.08em] text-[#0B0B0B]/50">
                    Raw Search
                  </span>
                  <span className="text-[12.5px] sm:text-[15px] font-medium">Logging Stack</span>
                </th>
                <th className="py-2.5 sm:py-4 px-2.5 sm:px-4 bg-[#E9E8E6] text-[#0B0B0B] w-[19%]">
                  <span className="block font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.08em] text-[#0B0B0B]/50">
                    Internal Build
                  </span>
                  <span className="text-[12.5px] sm:text-[15px] font-medium">Homegrown Scripts</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#0B0B0B]/12 bg-white">
              {ALTERNATIVE_COMPARE_ROWS.map((row, idx) => (
                <motion.tr
                  key={row.criterion}
                  initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 10}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true, amount: 0.1}}
                  transition={{
                    duration: reducedMotion ? 0 : 0.35,
                    delay: reducedMotion ? 0 : idx * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="hover:bg-[#D9C4A8]/20 transition-colors"
                >
                  <td className="py-2.5 sm:py-4 px-2.5 sm:px-4 font-medium text-[12px] sm:text-[14px] text-[#0B0B0B]">
                    {row.criterion}
                  </td>
                  <td className="py-2.5 sm:py-4 px-3 sm:px-5 bg-[#0A1F6B] border-b border-white/10">
                    <CellBadge cell={row.Sightline} highlight />
                  </td>
                  <td className="py-2.5 sm:py-4 px-2.5 sm:px-4">
                    <CellBadge cell={row.genericApm} />
                  </td>
                  <td className="py-2.5 sm:py-4 px-2.5 sm:px-4">
                    <CellBadge cell={row.loggingStack} />
                  </td>
                  <td className="py-2.5 sm:py-4 px-2.5 sm:px-4">
                    <CellBadge cell={row.homegrown} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Why Teams Switch Cards */}
      <section className="mx-1.5 sm:mx-5 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10">
        <div className="w-full max-w-[1360px] mx-auto min-w-0">
          <h2 className="headline-display text-[24px] leading-[1.12] sm:text-[44px] text-[#0B0B0B] mb-4 sm:mb-8">
            Why teams <span className="headline-serif-accent">switch</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 items-stretch gap-3 sm:gap-6">
            {WHY_TEAMS_SWITCH.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 14}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.1}}
                transition={{
                  duration: reducedMotion ? 0 : 0.45,
                  delay: reducedMotion ? 0 : idx * 0.08,
                }}
                className="h-full w-full min-w-0 rounded-[6px] sm:rounded-[8px] bg-white border border-[#0B0B0B]/12 p-3.5 sm:p-6 flex flex-col gap-2 sm:gap-3"
              >
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#0B2FA8]">
                  0{idx + 1}
                </span>
                <h3 className="text-[16px] sm:text-[20px] font-medium tracking-[-0.02em] text-[#0B0B0B] leading-snug">
                  {item.title}
                </h3>
                <p className="text-[12.5px] sm:text-[14px] leading-[1.5] sm:leading-[1.6] text-[#0B0B0B]/70">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA Band */}
          <div className="mt-5 sm:mt-10 rounded-[6px] sm:rounded-[8px] bg-[#D9C4A8] border border-[#0B0B0B]/15 p-3.5 sm:p-8 flex flex-wrap items-center justify-between gap-3 sm:gap-4 min-w-0">
            <div className="min-w-0">
              <h3 className="text-[17px] sm:text-[26px] font-medium tracking-[-0.02em] text-[#0B0B0B] leading-snug">
                Ready to retire log grep debugging?
              </h3>
              <p className="mt-1 text-[12.5px] sm:text-[14px] text-[#0B0B0B]/75">
                Launch the interactive sandbox or book 30 minutes with an engineer.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
              <Button label="Try Sandbox" variant="primary" to="/demo/sandbox" />
              <Button label="Calculate ROI" variant="secondary" to="/pricing/roi" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};