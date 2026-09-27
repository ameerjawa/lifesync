import React from 'react';
import { ArrowRight } from 'lucide-react';

export function NextLogo({ size = 'md', light = false }: { size?: 'sm' | 'md' | 'lg'; light?: boolean }) {
  const dimensions = {
    sm: { box: 'h-7 w-7', text: 'text-lg', dot: 'r=2.5' },
    md: { box: 'h-8 w-8', text: 'text-xl', dot: 'r=3' },
    lg: { box: 'h-10 w-10', text: 'text-2xl', dot: 'r=3.5' },
  };
  const d = dimensions[size];

  return (
    <div className="flex items-center gap-2 select-none">
      <div className={`${d.box} rounded-lg flex items-center justify-center ${light ? 'bg-white' : 'bg-ink-950 dark:bg-white'}`}>
        <svg viewBox="0 0 64 64" className="h-full w-full p-1.5">
          <path d="M20 44V20H24L40 38V20H44V44H40L24 26V44H20Z"
            fill={light ? '#0A0A0B' : '#F5F5F5'} />
          <circle cx="32" cy="50" r={d.dot === 'r=3' ? '3' : '2.5'} fill="#3B82F6" />
        </svg>
      </div>
      <span className={`${d.text} font-extrabold tracking-tight ${light ? 'text-white' : 'text-heading'}`}>
        NEXT
      </span>
    </div>
  );
}

export function NextMark({ light = false }: { light?: boolean }) {
  return (
    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${light ? 'bg-white' : 'bg-ink-950 dark:bg-white'}`}>
      <svg viewBox="0 0 64 64" className="h-full w-full p-1.5">
        <path d="M20 44V20H24L40 38V20H44V44H40L24 26V44H20Z"
          fill={light ? '#0A0A0B' : '#F5F5F5'} />
        <circle cx="32" cy="50" r="3" fill="#3B82F6" />
      </svg>
    </div>
  );
}
