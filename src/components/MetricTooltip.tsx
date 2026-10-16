import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Info } from 'lucide-react';

export interface MetricTooltipProps {
  label?: string | ReactNode;
  explanation: string | ReactNode;
  children?: ReactNode;
  className?: string;
  iconClassName?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  maxWidthClass?: string;
}

export const MetricTooltip: React.FC<MetricTooltipProps> = ({
  label,
  explanation,
  children,
  className = '',
  iconClassName = '',
  placement = 'top',
  maxWidthClass = 'max-w-xs',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(true);
  };

  const hideTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Compute position classes
  const getPlacementClasses = () => {
    switch (placement) {
      case 'bottom':
        return 'top-full mt-2 left-1/2 -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 -translate-y-1/2';
      case 'top':
      default:
        return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center gap-1.5 group ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {/* Label or Custom Children */}
      {children ? (
        children
      ) : (
        label && <span className="cursor-help">{label}</span>
      )}

      {/* Info Icon Button */}
      <button
        type="button"
        aria-label="Metric explanation"
        className={`p-0.5 rounded-full text-slate-400 hover:text-cyan-300 focus:text-cyan-300 focus:outline-hidden transition-colors cursor-help inline-flex items-center justify-center shrink-0 ${iconClassName}`}
        tabIndex={0}
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {/* Dark-mode Floating Tooltip */}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 pointer-events-none transition-all duration-150 animate-fadeIn ${getPlacementClasses()} ${maxWidthClass}`}
        >
          <div className="p-3 rounded-xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md text-xs text-slate-200 leading-relaxed font-sans ring-1 ring-cyan-500/20">
            {/* Header pill indicator */}
            <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 glow-dot" />
              <span>Metric Methodology</span>
            </div>

            <div className="text-slate-300 text-[11px] leading-snug">
              {explanation}
            </div>

            {/* Subtle pointing micro-arrow */}
            {placement === 'top' && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 bg-slate-900 border-r border-b border-cyan-500/40 transform rotate-45" />
            )}
            {placement === 'bottom' && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px w-2 h-2 bg-slate-900 border-l border-t border-cyan-500/40 transform rotate-45" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
