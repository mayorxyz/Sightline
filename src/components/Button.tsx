import React, {useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight} from 'lucide-react';
import {useReducedMotion} from '../hooks/useReducedMotion';

export type ButtonVariant = 'primary' | 'secondary' | 'sand';

interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  to?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  to,
  onClick,
  type = 'button',
  className = '',
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [offset, setOffset] = useState({x: 0, y: 0});
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setOffset({
      x: Math.max(-8, Math.min(8, relX * 8)),
      y: Math.max(-8, Math.min(8, relY * 8)),
    });
  };

  const handleMouseLeave = () => {
    setOffset({x: 0, y: 0});
    setHovered(false);
  };

  const containerStyle =
    variant === 'primary'
      ? 'bg-[#0B2FA8] text-white border border-[#0B2FA8] hover:bg-[#09268C]'
      : variant === 'sand'
        ? 'bg-[#D9C4A8] text-[#0B2FA8] border border-[#D9C4A8] hover:bg-[#E2D0B7]'
        : 'bg-white text-[#0B0B0B] border border-[#0B0B0B]/10 hover:bg-[#F7F6F4]';

  const arrowBoxStyle =
    variant === 'primary'
      ? 'bg-[#D9C4A8] text-[#0B2FA8]'
      : variant === 'sand'
        ? 'bg-[#0B2FA8] text-white'
        : 'bg-[#0B2FA8] text-white';

  const innerContent = (
    <span
      className={`group inline-flex items-center justify-between gap-4 rounded-[2px] pl-4 pr-1.5 py-1.5 text-[14px] font-medium tracking-[-0.01em] transition-colors duration-200 whitespace-nowrap shrink-0 select-none ${containerStyle} ${className}`}
    >
      <span className="whitespace-nowrap shrink-0">{label}</span>
      <span
        className={`inline-flex items-center justify-center w-8 h-8 rounded-[2px] transition-transform duration-200 ease-out ${arrowBoxStyle} ${
          hovered ? 'translate-x-0.5' : ''
        }`}
        aria-hidden="true"
      >
        <ArrowUpRight
          className={`w-4 h-4 transition-transform duration-200 ease-out ${
            hovered ? 'rotate-45 scale-105' : 'rotate-0'
          }`}
          strokeWidth={2}
        />
      </span>
    </span>
  );

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: reducedMotion
          ? undefined
          : `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: hovered
          ? 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1)'
          : 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="inline-block"
    >
      {to ? (
        <Link
          to={to}
          className="inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B2FA8]"
        >
          {innerContent}
        </Link>
      ) : (
        <button
          type={type}
          onClick={onClick}
          className="inline-block cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B2FA8]"
        >
          {innerContent}
        </button>
      )}
    </div>
  );
};
