import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowUpRight, Search, X} from 'lucide-react';
import {RESOURCES_SEARCH_INDEX, SearchIndexItem} from '../../lib/resourcesContent';

interface SearchBoxProps {
  placeholder?: string;
  enableCmdK?: boolean;
  filterKind?: 'Doc' | 'Blog';
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.trim().toLowerCase());
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.trim().length);
  const after = text.slice(idx + query.trim().length);
  return (
    <>
      {before}
      <mark className="bg-[#D9C4A8] text-[#0B0B0B] px-0.5 rounded-[2px]">{match}</mark>
      {after}
    </>
  );
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = 'Search docs and blog...',
  enableCmdK = false,
  filterKind,
}) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results: SearchIndexItem[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return RESOURCES_SEARCH_INDEX.filter((item) => {
      if (filterKind && item.kind !== filterKind) return false;
      return (
        item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
      );
    }).slice(0, 7);
  }, [query, filterKind]);

  useEffect(() => {
    setActiveIndex(0);
  }, [results.length]);

  useEffect(() => {
    if (!enableCmdK) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enableCmdK]);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const handleSelect = (item: SearchIndexItem) => {
    setOpen(false);
    setQuery('');
    navigate(item.to);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = results[activeIndex];
      if (target) handleSelect(target);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative flex items-center">
        <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0B0B0B]/45 absolute left-3 pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder={enableCmdK ? 'Search docs...' : placeholder}
          aria-label={placeholder}
          aria-expanded={open && results.length > 0}
          aria-autocomplete="list"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full h-11 rounded-[4px] border border-[#0B0B0B]/20 bg-white pl-9 sm:pl-10 pr-10 sm:pr-20 text-[13px] sm:text-[14px] text-[#0B0B0B] placeholder:text-[#0B0B0B]/45 focus:outline-none focus:border-[#0B2FA8]"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-3 w-6 h-6 inline-flex items-center justify-center rounded-[2px] text-[#0B0B0B]/50 hover:text-[#0B0B0B] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          enableCmdK && (
            <kbd className="hidden sm:inline-block absolute right-3 px-1.5 py-0.5 rounded-[2px] border border-[#0B0B0B]/15 bg-[#E9E8E6] font-mono text-[10.5px] text-[#0B0B0B]/60">
              ⌘K
            </kbd>
          )
        )}
      </div>

      {open && query.trim().length > 0 && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] rounded-[6px] bg-white border border-[#0B0B0B]/15 shadow-2xl p-1.5 z-40 max-h-[320px] overflow-y-auto"
        >
          {results.length === 0 ? (
            <div className="px-3 py-4 text-[13px] text-[#0B0B0B]/55 text-center">
              No matching docs or articles for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            results.map((item, idx) => {
              const active = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left flex items-center justify-between gap-3 px-3 py-2.5 rounded-[4px] transition-colors cursor-pointer ${
                    active ? 'bg-[#0B2FA8]/10 text-[#0B0B0B]' : 'hover:bg-[#E9E8E6]/60'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-[#0B2FA8] text-white font-mono text-[10px] uppercase">
                        {item.kind}
                      </span>
                      <span className="text-[13.5px] font-medium truncate">
                        {highlightMatch(item.title, query)}
                      </span>
                    </div>
                    <span className="block text-[12px] text-[#0B0B0B]/60 truncate mt-0.5">
                      {highlightMatch(item.subtitle, query)}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#0B2FA8] shrink-0" />
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
