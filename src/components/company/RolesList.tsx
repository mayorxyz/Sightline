import React, {useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {OPEN_ROLES, OpenRole} from '../../lib/companyContent';
import {SectionTag} from '../SectionTag';
import {ApplyModal} from './ApplyModal';

export const RolesList: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<OpenRole | null>(null);

  return (
    <section className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10">
      <div className="max-w-[1360px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <SectionTag label="Open Roles" />
            <h2 className="mt-3 sm:mt-4 headline-display text-[28px] sm:text-[48px] leading-tight text-[#0B0B0B]">
              Join the <span className="headline-serif-accent">engineering</span> team
            </h2>
          </div>
          <span className="font-mono text-[11px] sm:text-[12px] text-[#0B0B0B]/60">
            
          </span>
        </div>

        <div className="flex flex-col divide-y divide-[#0B0B0B]/15 border-y border-[#0B0B0B]/15 bg-white rounded-[6px]">
          {OPEN_ROLES.map((role) => (
            <div
              key={role.id}
              className="p-4 sm:p-6 lg:px-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h3 className="text-[17px] sm:text-[19px] font-medium tracking-[-0.02em] text-[#0B0B0B]">
                  {role.title}
                </h3>
                <div className="mt-1.5 sm:mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] sm:text-[12px] text-[#0B0B0B]/60">
                  <span className="text-[#0B2FA8]">{role.team}</span>
                  <span className="hidden sm:inline">·</span>
                  <span>{role.location}</span>
                  <span className="hidden sm:inline">·</span>
                  <span>{role.type}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRole(role)}
                className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-[#0B2FA8] hover:bg-[#0A1F6B] text-white text-[12px] sm:text-[13px] font-medium px-4 py-2 sm:py-2.5 transition-colors cursor-pointer w-full sm:w-auto"
              >
                <span>Apply</span>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D9C4A8]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <ApplyModal role={selectedRole} onClose={() => setSelectedRole(null)} />
    </section>
  );
};