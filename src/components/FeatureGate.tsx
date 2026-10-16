import React, { ReactNode } from 'react';
import {
  Sparkles,
  Lock,
  Check,
  Zap,
  ArrowRight,
  ShieldCheck,
  Star,
} from 'lucide-react';

export interface FeatureGateProps {
  /** Whether the active user holds a Pro subscription */
  isProUser: boolean;
  /** Content to render (blurred & gated if isProUser is false) */
  children: ReactNode;
  /** Optional custom badge text (default: 'Pro Feature') */
  badgeText?: string;
  /** Optional custom headline */
  headline?: string;
  /** Optional custom body text */
  body?: string;
  /** Optional bullet points */
  bullets?: string[];
  /** Optional callback when user clicks "Upgrade to Pro" */
  onUpgrade?: () => void;
  /** Optional callback when user clicks "Start Free Trial" */
  onStartTrial?: () => void;
  /** Custom wrapper class */
  className?: string;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  isProUser,
  children,
  badgeText = 'Pro Feature',
  headline = 'Unlock Advanced Market Simulations',
  body = 'See exactly how adjusting work model, radius, or compensation alters your talent pool. Upgrade to Talent IQ Pro.',
  bullets = [
    '✓ Unlimited Pivot Simulations',
    '✓ Competitor Density Mapping',
    '✓ HM Briefing Exports',
  ],
  onUpgrade,
  onStartTrial,
  className = '',
}) => {
  // If user is Pro, render children unimpeded
  if (isProUser) {
    return <div className={className}>{children}</div>;
  }

  // If user is Free Tier, render children blurred with sleek soft paywall overlay
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Blurred & Gated Background Content (Children) */}
      <div
        className="filter blur-sm opacity-35 select-none pointer-events-none transition-all duration-300 transform scale-[0.99]"
        aria-hidden="true"
        tabIndex={-1}
      >
        {children}
      </div>

      {/* Sleek, Premium Soft Paywall Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs">
        <div className="max-w-md w-full rounded-2xl p-6 sm:p-7 glass-card border border-indigo-500/40 shadow-2xl bg-gradient-to-b from-slate-900/95 via-slate-900/95 to-indigo-950/40 ring-1 ring-indigo-500/30 text-center animate-fadeIn space-y-4">
          {/* Top Badge */}
          <div className="flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{badgeText}</span>
            </span>
          </div>

          {/* Headline & Body */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {headline}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              {body}
            </p>
          </div>

          {/* Premium Value Props Bullets */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-left space-y-2 shadow-inner">
            {bullets.map((bullet, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs font-medium text-slate-200"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-emerald-400" />
                </div>
                <span>{bullet.replace(/^✓\s*/, '')}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            {/* Primary Button */}
            <button
              type="button"
              id="btn-upgrade-pro-plan"
              onClick={onUpgrade}
              className="w-full py-3 px-5 rounded-xl text-xs sm:text-sm font-bold text-white accent-gradient accent-gradient-hover glow shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 text-cyan-200" />
              <span>Upgrade to Pro ($79/mo)</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            {/* Secondary Button */}
            <button
              type="button"
              id="btn-start-free-trial"
              onClick={onStartTrial}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 hover:border-slate-600 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Start 14-Day Free Trial</span>
            </button>
          </div>

          {/* Subtle Trust Footer */}
          <div className="text-[10px] font-mono text-slate-500">
            Cancel anytime • Enterprise SOC-2 Type II Certified • Instant activation
          </div>
        </div>
      </div>
    </div>
  );
};
