import React from 'react';
import {Activity, Bell, CheckSquare, DollarSign, GitBranch} from 'lucide-react';

export type SandboxTab = 'overview' | 'traces' | 'evals' | 'cost' | 'alerts';

interface SandboxSidebarProps {
  activeTab: SandboxTab;
  onSelectTab: (tab: SandboxTab) => void;
  alertCount?: number;
}

const TABS: {id: SandboxTab; label: string; icon: React.ComponentType<{className?: string}>}[] = [
  {id: 'overview', label: 'Overview', icon: Activity},
  {id: 'traces', label: 'Traces', icon: GitBranch},
  {id: 'evals', label: 'Evals', icon: CheckSquare},
  {id: 'cost', label: 'Cost', icon: DollarSign},
  {id: 'alerts', label: 'Alerts', icon: Bell},
];

export const SandboxSidebar: React.FC<SandboxSidebarProps> = ({
  activeTab,
  onSelectTab,
  alertCount = 0,
}) => {
  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside
        aria-label="Sandbox navigation"
        className="hidden md:flex flex-col w-[210px] shrink-0 border-r border-white/15 bg-[#06154D] p-3 gap-1.5"
      >
        <div className="px-2.5 py-2 mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[#D9C4A8]">
          Workspace Views
        </div>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-[4px] text-[13px] font-medium transition-colors cursor-pointer ${
                active
                  ? 'bg-[#0B2FA8] text-white border border-white/25'
                  : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </span>
              {tab.id === 'alerts' && alertCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-[2px] bg-[#D9C4A8] text-[#0A1F6B] font-mono text-[10px] font-semibold tabular-nums">
                  {alertCount}
                </span>
              )}
            </button>
          );
        })}

        <div className="mt-auto rounded-[4px] bg-white/5 border border-white/10 p-3 text-[11px] font-mono text-white/60 leading-[1.5]">
          <span className="block text-[#D9C4A8] mb-1">ENV: sandbox-eu-1</span>
          Synthetic telemetry active. Safe to test rules &amp; evals.
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav
        aria-label="Sandbox mobile navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#06154D] border-t border-white/20 grid grid-cols-5 px-1 py-1.5"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 py-1 rounded-[3px] text-[11px] font-mono cursor-pointer ${
                active ? 'text-[#D9C4A8] bg-white/10' : 'text-white/65'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
