import React, {useState} from 'react';
import {Menu, X} from 'lucide-react';
import {DocsSidebar} from './DocsSidebar';
import {SearchBox} from './SearchBox';
import {Toc, TocHeading} from './Toc';
import {Footer} from '../Footer';

interface DocsLayoutProps {
  tocHeadings: TocHeading[];
  children: React.ReactNode;
}

export const DocsLayout: React.FC<DocsLayoutProps> = ({tocHeadings, children}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="pb-4 pt-20 sm:pt-24">
      <div className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 bg-[#F8F7F5] rounded-[8px] sm:rounded-[12px] overflow-hidden">
        {/* Docs Search Bar Strip */}
        <div className="border-b border-[#0B0B0B]/15 bg-white px-2.5 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open docs sidebar"
              className="lg:hidden inline-flex items-center gap-1 px-2 py-1.5 rounded-[3px] border border-[#0B0B0B]/20 bg-[#F8F7F5] text-[11px] sm:text-[12.5px] font-medium cursor-pointer shrink-0"
            >
              <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden min-[400px]:inline">Docs Menu</span>
            </button>
            <span className="hidden sm:inline font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#0B2FA8]">
              SDK Documentation
            </span>
          </div>

          <div className="w-full min-w-0 max-w-[220px] sm:max-w-[380px]">
            <SearchBox
              placeholder="Search docs... (Cmd/Ctrl+K)"
              enableCmdK={true}
              filterKind="Doc"
            />
          </div>
        </div>

        {/* 3-Pane Grid */}
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Left Sidebar (Desktop) */}
          <aside className="sticky top-24 lg:top-28 hidden lg:block lg:col-span-3 border-r border-[#0B0B0B]/12 pr-4 lg:pr-6">
            <div>
              <DocsSidebar />
            </div>
          </aside>

          {/* Center Content */}
          <main className="lg:col-span-6 min-w-0">{children}</main>

          {/* Right On This Page TOC */}
          <aside className="sticky top-24 lg:top-28 hidden xl:block lg:col-span-3 pl-4">
            <Toc headings={tocHeadings} title="On this page" />
          </aside>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Documentation menu"
        >
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-[#0A1F6B]/60 backdrop-blur-[1px]"
            aria-hidden="true"
          />
          <div className="relative z-10 w-[260px] sm:w-[280px] max-w-[82vw] bg-white h-full p-4 sm:p-5 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-[#0B0B0B]/12">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#0B2FA8]">
                Docs Navigation
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close docs menu"
                className="w-7 h-7 sm:w-8 sm:h-8 inline-flex items-center justify-center rounded-[2px] border border-[#0B0B0B]/15"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
            <DocsSidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};