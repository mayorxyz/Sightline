import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {ChevronDown} from 'lucide-react';
import {DOC_GROUPS, DOC_PAGES} from '../../lib/resourcesContent';

interface DocsSidebarProps {
  onNavigate?: () => void;
}

export const DocsSidebar: React.FC<DocsSidebarProps> = ({onNavigate}) => {
  const {pathname} = useLocation();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (group: string) => {
    setCollapsed((prev) => ({...prev, [group]: !prev[group]}));
  };

  return (
    <nav aria-label="Documentation navigation" className="flex flex-col gap-5">
      {DOC_GROUPS.map((group) => {
        const items = DOC_PAGES.filter((d) => d.group === group);
        const isCollapsed = !!collapsed[group];

        return (
          <div key={group}>
            <button
              type="button"
              onClick={() => toggleGroup(group)}
              aria-expanded={!isCollapsed}
              className="w-full flex items-center justify-between text-left font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#0B0B0B]/55 hover:text-[#0B0B0B] mb-2 cursor-pointer"
            >
              <span>{group}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  isCollapsed ? '-rotate-90' : 'rotate-0'
                }`}
              />
            </button>

            {!isCollapsed && (
              <ul className="flex flex-col gap-1">
                {items.map((doc) => {
                  const target = `/resources/docs/${doc.slug}`;
                  const active = pathname === target;
                  return (
                    <li key={doc.slug}>
                      <Link
                        to={target}
                        onClick={onNavigate}
                        aria-current={active ? 'page' : undefined}
                        className={`block px-3 py-1.5 rounded-[3px] text-[13.5px] transition-colors ${
                          active
                            ? 'bg-[#0B2FA8] text-white font-medium'
                            : 'text-[#0B0B0B]/75 hover:bg-[#0B0B0B]/6 hover:text-[#0B0B0B]'
                        }`}
                      >
                        {doc.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
};
