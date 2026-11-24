import React from 'react';
import {RoiInputs} from '../../../lib/pricingContent';

interface RoiCalculatorProps {
  inputs: RoiInputs;
  onChange: (next: RoiInputs) => void;
}

interface FieldConfig {
  key: keyof RoiInputs;
  label: string;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
}

const FIELDS: FieldConfig[] = [
  {key: 'engineers', label: 'Engineers working on agents', min: 1, max: 50, step: 1},
  {key: 'debugHoursPerWeek', label: 'Debug hours / week per engineer', min: 1, max: 20, step: 1, suffix: 'h'},
  {key: 'hourlyCost', label: 'Avg engineering hourly cost', min: 30, max: 200, step: 5, prefix: '$'},
  {key: 'monthlyLlmSpend', label: 'Monthly LLM spend', min: 500, max: 200000, step: 500, prefix: '$'},
  {key: 'incidentsPerMonth', label: 'Agent quality incidents / month', min: 0, max: 20, step: 1},
  {key: 'costPerIncident', label: 'Avg cost per incident', min: 500, max: 20000, step: 250, prefix: '$'},
];

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({inputs, onChange}) => {
  const updateField = (key: keyof RoiInputs, raw: number, min: number, max: number) => {
    const clamped = Number.isNaN(raw) ? min : Math.max(min, Math.min(max, raw));
    onChange({...inputs, [key]: clamped});
  };

  return (
    <div className="w-full min-w-0 bg-white rounded-[6px] sm:rounded-[8px] border border-[#0B0B0B]/15 p-3.5 sm:p-8 flex flex-col gap-4 sm:gap-6">
      <div className="pb-3 sm:pb-4 border-b border-[#0B0B0B]/10 min-w-0">
        <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#0B2FA8]">
          Your Team Profile
        </span>
        <h2 className="mt-1 text-[19px] sm:text-[24px] font-medium tracking-[-0.02em] leading-snug text-[#0B0B0B]">
          Adjust baseline assumptions
        </h2>
      </div>

      <div className="flex flex-col gap-3.5 sm:gap-5 min-w-0">
        {FIELDS.map((field) => {
          const val = inputs[field.key];
          return (
            <div key={field.key} className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
              <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
                <label
                  htmlFor={`roi-${field.key}`}
                  className="text-[12.5px] sm:text-[14px] leading-snug font-medium text-[#0B0B0B] min-w-0"
                >
                  {field.label}
                </label>

                <div className="inline-flex items-center shrink-0 rounded-[3px] border border-[#0B0B0B]/20 bg-[#F8F7F5] px-2 sm:px-2.5 py-0.5 sm:py-1">
                  {field.prefix && (
                    <span className="font-mono text-[11px] sm:text-[12px] text-[#0B0B0B]/55 mr-0.5">
                      {field.prefix}
                    </span>
                  )}
                  <input
                    id={`roi-${field.key}`}
                    type="number"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={val}
                    onChange={(e) =>
                      updateField(field.key, Number(e.target.value), field.min, field.max)
                    }
                    className="w-16 sm:w-20 bg-transparent font-mono text-[12px] sm:text-[13px] font-medium text-[#0B2FA8] text-right tabular-nums focus:outline-none"
                  />
                  {field.suffix && (
                    <span className="font-mono text-[11px] sm:text-[12px] text-[#0B0B0B]/55 ml-0.5">
                      {field.suffix}
                    </span>
                  )}
                </div>
              </div>

              <input
                type="range"
                aria-label={field.label}
                min={field.min}
                max={field.max}
                step={field.step}
                value={val}
                onChange={(e) =>
                  updateField(field.key, Number(e.target.value), field.min, field.max)
                }
                className="w-full h-1.5 sm:h-2 my-0.5 accent-[#0B2FA8] cursor-pointer"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};