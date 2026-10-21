import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { HelpCircle, Info } from 'lucide-react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** Text or ReactNode content to render in the tooltip popup */
  content: string | ReactNode;
  /** Optional custom trigger element. If omitted, renders a small accessible '?' icon button */
  children?: ReactNode;
  /** Position of the tooltip relative to trigger */
  placement?: TooltipPlacement;
  /** Optional title header inside the tooltip */
  headerTitle?: string;
  /** Icon size if using the default '?' trigger */
  size?: 'sm' | 'md';
  /** Max width class (e.g. max-w-xs, max-w-sm) */
  maxWidthClass?: string;
  /** Custom wrapper class */
  className?: string;
}

/**
 * Standard C-Suite friendly definitions for complex recruiting market intelligence metrics.
 */
export const METHODOLOGY_EXPLANATIONS = {
  ttf: 'Time to Fill (TTF): Calibrated metric measuring total duration in calendar days from initial requisition opening through accepted offer. Models candidate response velocity, executive interview sequencing, and local resignation notice standards.',
  compPercentiles: 'Compensation Percentiles (p25 / p50 / p75 / p90): Total annual cash compensation benchmark derived from verified SEC filings, peer compensation data, and recent closed offer acceptance thresholds across the designated geography.',
  recruitingFriction: 'Recruiting Friction Index: Standardized composite index (0–100) assessing passive candidate poaching resistance, competitor requisition saturation, counter-offer volatility, and unvested equity retention cliffs.',
  addressableTalent: 'Addressable Talent Pool: Verified headcount across target metropolitan commuter zones satisfying all non-negotiable technical requirements, seniority bands, and domain tenure criteria.',
  skillScarcity: 'Skill Scarcity Rating: Market concentration quotient evaluating the supply-to-demand ratio for hyper-specialized technical competencies (e.g., distributed training, custom CUDA, low-latency kernels) versus standard software engineering baselines.',
  marketLiquidity: 'Market Liquidity Index: Real-time velocity score indicating candidate turnover and active exploratory conversations, calculated from public profile updates, tenure cycles, and inbound outreach response rates.',
} as const;

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  headerTitle = 'Analytical Methodology',
  size = 'sm',
  maxWidthClass = 'max-w-xs',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).substring(2, 8)}`);

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
      ref={triggerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {/* Trigger: Either custom child or default small '?' icon button */}
      {children ? (
        <div
          aria-describedby={isVisible ? tooltipId.current : undefined}
          tabIndex={0}
          className="inline-flex items-center cursor-help focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded"
        >
          {children}
        </div>
      ) : (
        <button
          type="button"
          aria-label="Metric methodology explanation"
          aria-describedby={isVisible ? tooltipId.current : undefined}
          className="inline-flex items-center justify-center p-0.5 rounded-full text-slate-400 hover:text-cyan-300 focus:text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-help transition-colors"
        >
          <HelpCircle className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        </button>
      )}

      {/* Floating Tooltip Box */}
      {isVisible && (
        <div
          id={tooltipId.current}
          role="tooltip"
          className={`absolute z-50 pointer-events-none transition-all duration-150 animate-fadeIn ${getPlacementClasses()} ${maxWidthClass} w-max`}
        >
          <div className="p-3 rounded-xl bg-slate-900/98 border border-cyan-500/40 shadow-2xl backdrop-blur-md text-xs text-slate-200 leading-relaxed font-sans ring-1 ring-cyan-500/20">
            {headerTitle && (
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1.5 border-b border-slate-800 pb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 glow-dot-cyan" />
                <span>{headerTitle}</span>
              </div>
            )}

            <div className="text-slate-300 text-[11px] leading-snug">
              {content}
            </div>

            {/* Pointing Arrow */}
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
