import React, {useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight} from 'lucide-react';
import {useReducedMotion} from '../../hooks/useReducedMotion';

export type FeatureCardTheme = 'sand' | 'navy' | 'cobalt' | 'white';

interface FeatureCardProps {
  index: string;
  title: string;
  description: string;
  theme: FeatureCardTheme;
  icon: React.ReactNode;
  isActive: boolean;
  isScrubbing: boolean;
  isMobile: boolean;
  cardRef: (el: HTMLDivElement | null) => void;
  children: React.ReactNode;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  index,
  title,
  description,
  theme,
  icon,
  isActive,
  isScrubbing,
  isMobile,
  cardRef,
  children,
}) => {
  const reducedMotion = useReducedMotion();
  const innerRef = useRef<HTMLDivElement | null>(null);
  const linkRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({rx: 0, ry: 0});
  const [linkOffset, setLinkOffset] = useState({x: 0, y: 0});
  const [linkHovered, setLinkHovered] = useState(false);

  const isDark = theme === 'navy' || theme === 'cobalt';

  const bgClasses =
    theme === 'sand'
      ? 'bg-[#D9C4A8] text-[#0B0B0B]'
      : theme === 'navy'
        ? 'bg-[#0A1F6B] text-white'
        : theme === 'cobalt'
          ? 'bg-[#0B2FA8] text-white'
          : 'bg-white text-[#0B0B0B] border border-[#0B0B0B]/12';

  const iconBoxClasses =
    theme === 'cobalt'
      ? 'bg-[#0A1F6B] border border-white/20 text-white'
      : 'bg-[#0B2FA8] text-white';

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || isMobile || isScrubbing || !innerRef.current) return;
    const rect = innerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    // Max 3deg tilt
    setTilt({
      rx: Number((-ny * 6).toFixed(2)),
      ry: Number((nx * 6).toFixed(2)),
    });
  };

  const handleCardMouseLeave = () => {
    setTilt({rx: 0, ry: 0});
  };

  const handleLinkMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const rx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const ry = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setLinkOffset({
      x: Math.max(-8, Math.min(8, rx * 8)),
      y: Math.max(-8, Math.min(8, ry * 8)),
    });
  };

  const handleLinkLeave = () => {
    setLinkOffset({x: 0, y: 0});
    setLinkHovered(false);
  };

  const activeTransform =
    !reducedMotion && !isMobile
      ? `scale(${isActive ? 1 : 0.94})`
      : undefined;

  const activeOpacity = !reducedMotion && !isMobile ? (isActive ? 1 : 0.7) : 1;

  return (
    <div
      ref={cardRef}
      style={{
        transform: activeTransform,
        opacity: activeOpacity,
      }}
      className={`transition-[transform,opacity] duration-300 ease-out will-change-transform shrink-0 ${
        reducedMotion
          ? 'w-full h-[520px]'
          : 'w-[86vw] max-w-[440px] md:max-w-none md:w-[560px] h-[520px] snap-center'
      }`}
    >
      <div
        ref={innerRef}
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        style={{
          transform:
            reducedMotion || isMobile || isScrubbing
              ? undefined
              : `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`h-full w-full rounded-[8px] p-6 flex flex-col justify-between shadow-[0_14px_34px_rgba(11,11,11,0.08)] ${bgClasses}`}
      >
        {/* Top Row: Index + Icon + Title + 2-line Description */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span
              className={`font-mono text-[13px] font-medium tabular-nums ${
                isDark ? 'text-white/65' : 'text-[#0B0B0B]/55'
              }`}
            >
              {index}
            </span>
            <span
              className={`inline-flex items-center justify-center w-9 h-9 rounded-[4px] ${iconBoxClasses}`}
            >
              {icon}
            </span>
          </div>

          <h3 className="text-[28px] sm:text-[32px] font-medium tracking-[-0.03em] leading-[1.05]">
            {title}
          </h3>
          <p
            className={`mt-2 text-[14px] sm:text-[15px] leading-[1.45] line-clamp-2 ${
              isDark ? 'text-white/80' : 'text-[#0B0B0B]/70'
            }`}
          >
            {description}
          </p>
        </div>

        {/* Lower 55%: Mock UI Panel */}
        <div className="flex-1 min-h-0 mt-4 mb-3.5">{children}</div>

        {/* Bottom Magnetic Explore Feature Link */}
        <div className="pt-1 flex items-center justify-between">
          <div
            ref={linkRef}
            onMouseMove={handleLinkMove}
            onMouseEnter={() => setLinkHovered(true)}
            onMouseLeave={handleLinkLeave}
            style={{
              transform: reducedMotion
                ? undefined
                : `translate3d(${linkOffset.x}px, ${linkOffset.y}px, 0)`,
              transition: linkHovered
                ? 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1)'
                : 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="inline-block"
          >
            <Link
              to="/product"
              className={`inline-flex items-center gap-2 text-[14px] font-medium tracking-[-0.01em] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isDark
                  ? 'text-white hover:text-[#D9C4A8] focus-visible:outline-white'
                  : 'text-[#0B0B0B] hover:text-[#0B2FA8] focus-visible:outline-[#0B2FA8]'
              }`}
            >
              <span>Explore Feature</span>
              <ArrowUpRight
                className={`w-4 h-4 transition-transform duration-200 ${
                  linkHovered ? 'translate-x-0.5 -translate-y-0.5 rotate-45' : ''
                }`}
                strokeWidth={2}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
