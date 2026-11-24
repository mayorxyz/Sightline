import React, {useState} from 'react';
import {Check, ChevronDown, Minus} from 'lucide-react';
import {COMPARISON_GROUPS} from '../../../lib/mockData';

export const CompareTable: React.FC = () => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (id: string) => {
    setCollapsed((prev) => ({...prev, [id]: !prev[id]}));
  };

  const renderCell = (val: string | boolean) => {
    if (val === true) {
      return (
        <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-[2px] bg-[#0B2FA8] text-white shrink-0">
          <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={2.4} />
        </span>
      );
    }
    if (val === false) {
      return <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0B0B0B]/30 mx-auto" />;
    }
    return (
      <span className="font-mono text-[11px] sm:text-[13px] tabular-nums text-[#0B0B0B] whitespace-nowrap">
        {val}
      </span>
    );
  };

  return (
    <section className="mx-1.5 sm:mx-5 mb-3 sm:mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1360px] mx-auto min-w-0">
        <h2 className="headline-display text-[24px] leading-[1.12] sm:text-[46px] text-[#0B0B0B] mb-4 sm:mb-8">
          Compare <span className="headline-serif-accent">every</span> capability
        </h2>

        <div className="w-full min-w-0 bg-white rounded-[6px] sm:rounded-[8px] border border-[#0B0B0B]/12 overflow-x-auto">
          <table className="w-full min-w-[500px] sm:min-w-[640px] text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[#E9E8E6] border-b border-[#0B0B0B]/15">
              <tr className="text-[11px] sm:text-[13px] font-medium text-[#0B0B0B]">
                <th className="py-2.5 sm:py-4 px-2.5 sm:px-5 w-[40%]">Capability</th>
                <th className="py-2.5 sm:py-4 px-2 sm:px-5 text-center w-[20%]">Starter</th>
                <th className="py-2.5 sm:py-4 px-2 sm:px-5 text-center w-[20%] text-[#0B2FA8]">
                  Team
                </th>
                <th className="py-2.5 sm:py-4 px-2 sm:px-5 text-center w-[20%]">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_GROUPS.map((group) => {
                const isClosed = Boolean(collapsed[group.id]);
                return (
                  <React.Fragment key={group.id}>
                    <tr className="bg-[#0B0B0B]/[0.03] border-b border-[#0B0B0B]/10">
                      <td colSpan={4} className="p-0">
                        <button
                          type="button"
                          onClick={() => toggleGroup(group.id)}
                          aria-expanded={!isClosed}
                          className="w-full flex items-center justify-between gap-2 px-2.5 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-[12px] font-mono uppercase tracking-[0.08em] text-[#0B0B0B]/75 hover:text-[#0B2FA8] cursor-pointer min-w-0"
                        >
                          <span className="truncate">{group.title}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-200 ${
                              isClosed ? '-rotate-90' : 'rotate-0'
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                    {!isClosed &&
                      group.rows.map((row) => (
                        <tr
                          key={row.feature}
                          className="border-b border-[#0B0B0B]/8 last:border-b-0 hover:bg-[#E9E8E6]/40 transition-colors"
                        >
                          <td className="py-2 sm:py-3.5 px-2.5 sm:px-5 text-[12px] sm:text-[14px] leading-snug font-medium text-[#0B0B0B]">
                            {row.feature}
                          </td>
                          <td className="py-2 sm:py-3.5 px-2 sm:px-5 text-center">
                            {renderCell(row.starter)}
                          </td>
                          <td className="py-2 sm:py-3.5 px-2 sm:px-5 text-center bg-[#0B2FA8]/[0.03]">
                            {renderCell(row.team)}
                          </td>
                          <td className="py-2 sm:py-3.5 px-2 sm:px-5 text-center">
                            {renderCell(row.enterprise)}
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};