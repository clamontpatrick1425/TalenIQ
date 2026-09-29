import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ReportSectionCardProps {
  id: number;
  domId: string;
  badge: string;
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  isHighlighted?: boolean;
  badgeColor?: string;
  headerRight?: React.ReactNode;
  collapsedSummary?: React.ReactNode;
  children: React.ReactNode;
}

export const ReportSectionCard: React.FC<ReportSectionCardProps> = ({
  domId,
  badge,
  title,
  isExpanded,
  onToggle,
  isHighlighted = false,
  badgeColor = 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
  headerRight,
  collapsedSummary,
  children,
}) => {
  return (
    <section
      id={domId}
      className={`glass-card rounded-2xl transition-all duration-300 border ${
        isHighlighted
          ? 'ring-2 ring-cyan-400 border-cyan-400 shadow-2xl shadow-cyan-500/30 bg-slate-900/90'
          : 'border-slate-800/80 hover:border-slate-700/80'
      } ${isExpanded ? 'p-6 space-y-4' : 'p-4'}`}
    >
      {/* Clickable Header for Collapsing/Expanding */}
      <div
        onClick={onToggle}
        className="flex items-center justify-between cursor-pointer select-none group border-b border-slate-800/60 pb-3"
      >
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-cyan-500/40 text-slate-400 group-hover:text-cyan-300 transition-colors">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-cyan-400 transition-transform duration-200" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400 transition-transform duration-200" />
            )}
          </div>
          <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-xs border ${badgeColor}`}>
            {badge}
          </span>
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors">
              {title}
            </h3>
            {!isExpanded && collapsedSummary && (
              <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                {collapsedSummary}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          {headerRight}
          <button
            type="button"
            onClick={onToggle}
            className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:text-cyan-300 hover:border-cyan-500/40 cursor-pointer transition-colors"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {/* Expanded Section Body */}
      {isExpanded && <div className="space-y-4 pt-1 animate-fadeIn">{children}</div>}
    </section>
  );
};
