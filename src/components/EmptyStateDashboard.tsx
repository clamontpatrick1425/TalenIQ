import React from 'react';
import {
  BrainCircuit,
  Upload,
  ArrowRight,
  Sparkles,
  Sliders,
  Layers,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';

export interface EmptyStateDashboardProps {
  /** Called when user clicks "Upload First JD" */
  onUploadFirstJD: () => void;
  /** Called when user clicks "Or explore with a Demo Data Profile" */
  onExploreDemoProfile: () => void;
  /** Optional custom container classes */
  className?: string;
}

export const EmptyStateDashboard: React.FC<EmptyStateDashboardProps> = ({
  onUploadFirstJD,
  onExploreDemoProfile,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full flex items-center justify-center px-4 py-8 sm:py-16 ${className}`}
    >
      {/* Elevated Centered Card in Foreground */}
      <div className="relative z-20 max-w-lg w-full rounded-3xl p-8 sm:p-10 text-center glass-card border border-cyan-500/40 shadow-2xl backdrop-blur-xl bg-slate-900/95 ring-1 ring-cyan-500/30 animate-fadeIn space-y-6">
        {/* Glow ambient background aura */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Central Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl accent-gradient glow flex items-center justify-center text-white shadow-xl ring-2 ring-white/20">
          <BrainCircuit className="w-8 h-8 animate-pulse" />
        </div>

        {/* Headline & Subheadline */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Talent Intelligence</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Unlock Your Market Intelligence
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            Upload a Job Description to instantly parse taxonomy, calculate talent scarcity, and generate executive closing briefs.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 gap-2 text-left pt-2 pb-1">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] flex items-center gap-2 text-slate-300">
            <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>5-Layer Taxonomy Engine</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] flex items-center gap-2 text-slate-300">
            <Sliders className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Real-Time Pivot Simulator</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] flex items-center gap-2 text-slate-300">
            <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Talent Scarcity Index</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
            <span>C-Suite 1-Page Briefing</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4 pt-2">
          {/* Primary Action Button */}
          <button
            type="button"
            id="btn-upload-first-jd"
            onClick={onUploadFirstJD}
            className="w-full py-3.5 px-6 rounded-full text-xs sm:text-sm font-bold text-white accent-gradient accent-gradient-hover glow shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Upload className="w-4 h-4" />
            <span>Upload First JD</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          {/* Secondary Action Link */}
          <div>
            <button
              type="button"
              id="btn-explore-demo-profile"
              onClick={onExploreDemoProfile}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer transition-colors font-medium inline-flex items-center gap-1.5"
            >
              <span>Or explore with a Demo Data Profile (e.g., Senior ML Engineer, Austin TX)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
