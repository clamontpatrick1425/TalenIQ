import React, { ReactNode } from 'react';
import { ConfidenceLevel } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { Tooltip } from './Tooltip';

export interface MetricCardProps {
  /** The primary title or label of the metric */
  title: string;
  /** The primary value display (number, string, or node) */
  value: string | number | ReactNode;
  /** Optional secondary unit or suffix (e.g., "/100", "Days", "Headcount") */
  unit?: string;
  /** Descriptive subtext underneath the value */
  subtext?: string;
  /** Optional data confidence / inference level ('verified' | 'estimated' | 'inferred' | 'unknown') */
  confidenceLevel?: ConfidenceLevel | string;
  /** Optional explicit confidence label (defaults to ConfidenceBadge default) */
  confidenceLabel?: string;
  /** Optional tooltip explanation explaining methodology in executive terms */
  tooltipExplanation?: string;
  /** Optional color tone for the value (e.g. 'cyan', 'emerald', 'amber', 'rose', 'indigo', 'white') */
  variant?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'white';
  /** Optional status indicator or secondary pill */
  statusBadge?: ReactNode;
  /** Custom wrapper class */
  className?: string;
}

/**
 * Enterprise-grade B2B Metric Card.
 * Fixes text concatenation bugs by strictly separating the primary metric text,
 * numerical value, descriptive metadata, and inference badges using structured Flexbox/Grid
 * with dedicated gaps, distinct typography, and contrast tokens.
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtext,
  confidenceLevel,
  confidenceLabel,
  tooltipExplanation,
  variant = 'white',
  statusBadge,
  className = '',
}) => {
  const getVariantTextColor = () => {
    switch (variant) {
      case 'cyan':
        return 'text-cyan-400';
      case 'emerald':
        return 'text-emerald-400';
      case 'amber':
        return 'text-amber-400';
      case 'rose':
        return 'text-rose-400';
      case 'indigo':
        return 'text-indigo-400';
      case 'white':
      default:
        return 'text-white';
    }
  };

  return (
    <div
      className={`glass-card rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:border-slate-700/80 hover:shadow-lg ${className}`}
      role="region"
      aria-label={`${title} metric`}
    >
      {/* 1. Card Header: Title + Optional Tooltip + Status Pill */}
      <div className="flex items-start justify-between gap-2 min-h-[24px]">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 truncate">
            {title}
          </span>
          {tooltipExplanation && (
            <Tooltip
              content={tooltipExplanation}
              placement="top"
              size="sm"
            />
          )}
        </div>

        {statusBadge && (
          <div className="shrink-0">
            {statusBadge}
          </div>
        )}
      </div>

      {/* 2. Card Body: Primary Metric Value & Unit */}
      <div className="my-2 flex items-baseline gap-1.5 flex-wrap">
        <span
          className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${getVariantTextColor()}`}
        >
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono font-normal text-slate-400">
            {unit}
          </span>
        )}
      </div>

      {/* 3. Card Footer: Subtext and Confidence Badge strictly separated */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2 text-[11px] min-h-[28px]">
        {subtext ? (
          <span className="text-slate-400 font-medium truncate flex-1" title={subtext}>
            {subtext}
          </span>
        ) : (
          <span className="text-slate-500 font-mono text-[10px]">—</span>
        )}

        {confidenceLevel && (
          <div className="shrink-0 flex items-center ml-auto">
            <ConfidenceBadge
              level={confidenceLevel}
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};
