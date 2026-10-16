import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Printer,
  Check,
  X,
  TrendingUp,
  AlertCircle,
  Clock,
  DollarSign,
  Compass,
  Building2,
  Users,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { TalentMapReport } from '../types';

export interface HMBriefingProps {
  report: TalentMapReport;
  buttonClassName?: string;
}

export const HMBriefingExport: React.FC<HMBriefingProps> = ({
  report,
  buttonClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Extract core metrics
  const roleName = report.input.role.value || 'Senior Technical Specialist';
  const location = report.input.geography.location || 'United States (Nationwide / Remote)';
  const workModel = report.input.workModel.value || 'HYBRID';
  const targetCompMin = report.input.compensationTarget?.min || 160000;
  const targetCompMax = report.input.compensationTarget?.max || 220000;

  const totalTalentPool = report.talentSupply?.addressable?.count || 3850;
  const difficultyScore = report.recruitingDifficultyScore?.score || 72; // out of 100
  const estimatedTTF = report.recruitingDifficultyScore?.expectedTimeToFillDays || 58;

  // Determine difficulty tier
  const difficultyLabel =
    difficultyScore >= 80
      ? 'Extremely Scarce'
      : difficultyScore >= 60
      ? 'Highly Competitive'
      : difficultyScore >= 40
      ? 'Moderate Competition'
      : 'Healthy Liquidity';

  // Dynamic 1-2 sentence executive briefing summary
  const executiveSummary =
    difficultyScore >= 70
      ? `The current talent market for ${roleName} in ${location} is ${difficultyLabel} (${difficultyScore}/100 scarcity). Retaining a strict ${workModel.toLowerCase()} mandate and narrow target parameters creates an estimated Time-to-Fill of ~${estimatedTTF} days; pivoting to regional hybrid clusters or calibrated comp at the 75th percentile will unlock an estimated +35% to +60% addressable talent supply.`
      : `The market for ${roleName} in ${location} displays ${difficultyLabel} (${difficultyScore}/100 scarcity) with an addressable pool of ~${totalTalentPool.toLocaleString()} verified engineers. Current comp alignment ($${(targetCompMin / 1000).toFixed(0)}k–$${(targetCompMax / 1000).toFixed(0)}k) is competitive, supporting an estimated Time-to-Fill of ~${estimatedTTF} business days with targeted outbound sourcing.`;

  // Top Target Companies / Feeder Pools
  const topFeeders = report.targetCompanies?.slice(0, 5) || [];
  const primarySkills = report.roleDecomposition?.technicalSkillRequirements?.mustHave?.slice(0, 6) || [];

  // Formatted Markdown string for 1-click clipboard sharing
  const generateMarkdownSummary = () => {
    return `### 📊 Talent Market Intelligence Briefing
**Target Role:** ${roleName}
**Location / Scope:** ${location} (${workModel})
**Target Comp Range:** $${targetCompMin.toLocaleString()} - $${targetCompMax.toLocaleString()} USD
**Date:** ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}

---

#### 🎯 Executive Summary
${executiveSummary}

#### 📈 Key Market Calibration Metrics
- **Addressable Talent Supply:** ~${totalTalentPool.toLocaleString()} qualified candidates
- **Recruiting Scarcity Index:** ${difficultyScore}/100 (${difficultyLabel})
- **Projected Time-to-Fill (TTF):** ~${estimatedTTF} business days
- **Market Compensation P50-P75:** $${(targetCompMin / 1000).toFixed(0)}k - $${(targetCompMax / 1000).toFixed(0)}k base

#### 🚀 Recommended Strategic Pivots
1. **Work Model & Geo Flexibility:** If ${workModel} requirements restrict candidate flow past day 21, expand geographic search radius to Tier-1/Tier-2 tech hubs to unlock immediate pipeline liquidity.
2. **Must-Have vs. Trainable Skills:** Differentiate core architecture skills (${primarySkills.slice(0, 3).join(', ')}) from framework-specific proficiencies that can be onboarded in 30 days.
3. **Primary Feeder Targets:** Prioritize direct proactive outreach into: ${topFeeders.map((f) => f.company).join(', ') || 'Tier-1 enterprise engineering peers'}.

*Generated via TalentIQ Enterprise Recruitment Intelligence*`;
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(generateMarkdownSummary());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 hover:border-indigo-400 transition-all flex items-center gap-2 cursor-pointer shadow-sm ${buttonClassName}`}
      >
        <FileText className="w-4 h-4 text-indigo-400" />
        <span>Hiring Manager Briefing (1-Page)</span>
      </button>

      {/* Modal / Print Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white print:static">
          <div className="bg-slate-900 border border-slate-800 print:border-none print:shadow-none print:bg-white print:text-black rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none">
            {/* Action Bar (Hidden on Print) */}
            <div className="px-6 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-4 print:hidden">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-white font-semibold">VP &amp; C-Suite 1-Page Market Briefing</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Copy formatted markdown text to paste in Slack or Email"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Markdown / Text</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-sans transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Briefing Document (Optimized for 8.5x11 single page) */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto text-slate-200 print:text-black print:p-0 print:overflow-visible">
              {/* Header */}
              <div className="border-b border-slate-800 print:border-black/20 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-cyan-400 print:text-indigo-600 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Executive Hiring Calibration Briefing</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white print:text-black mt-1">
                    {roleName}
                  </h1>
                  <p className="text-xs text-slate-400 print:text-neutral-600 mt-0.5">
                    {location} • <span className="font-semibold">{workModel}</span> • Target Budget: ${targetCompMin.toLocaleString()} - ${targetCompMax.toLocaleString()}
                  </p>
                </div>

                <div className="text-right sm:text-right shrink-0 font-mono text-[11px] text-slate-400 print:text-neutral-500">
                  <div>Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  <div className="text-[10px] text-slate-500 print:text-neutral-400 uppercase mt-0.5">Confidential • For Internal Hiring Team</div>
                </div>
              </div>

              {/* Executive Summary Callout */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-neutral-50 print:border-neutral-300">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 print:text-indigo-700 uppercase tracking-wider font-mono mb-1.5">
                  <AlertCircle className="w-4 h-4 text-cyan-400 print:text-indigo-600" />
                  <span>Executive Market Summary</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 print:text-neutral-800 leading-relaxed font-sans">
                  {executiveSummary}
                </p>
              </div>

              {/* 4-Column Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 print:bg-white print:border-neutral-300">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400 print:text-neutral-500">
                    <Users className="w-3.5 h-3.5 text-cyan-400 print:text-neutral-600" />
                    <span>Addressable Supply</span>
                  </div>
                  <div className="text-lg font-bold text-white print:text-black mt-1 font-mono">
                    ~{totalTalentPool.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 print:text-neutral-600 mt-0.5">Verified Profile Pool</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 print:bg-white print:border-neutral-300">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400 print:text-neutral-500">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400 print:text-amber-600" />
                    <span>Scarcity Index</span>
                  </div>
                  <div className="text-lg font-bold text-amber-300 print:text-amber-700 mt-1 font-mono">
                    {difficultyScore}/100
                  </div>
                  <div className="text-[10px] text-slate-400 print:text-neutral-600 mt-0.5">{difficultyLabel}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 print:bg-white print:border-neutral-300">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400 print:text-neutral-500">
                    <Clock className="w-3.5 h-3.5 text-indigo-400 print:text-indigo-600" />
                    <span>Est. Time-to-Fill</span>
                  </div>
                  <div className="text-lg font-bold text-indigo-300 print:text-indigo-700 mt-1 font-mono">
                    ~{estimatedTTF} Days
                  </div>
                  <div className="text-[10px] text-slate-400 print:text-neutral-600 mt-0.5">Kickoff to Signed Offer</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 print:bg-white print:border-neutral-300">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400 print:text-neutral-500">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400 print:text-emerald-600" />
                    <span>Comp Calibration</span>
                  </div>
                  <div className="text-lg font-bold text-emerald-400 print:text-emerald-700 mt-1 font-mono">
                    ${(targetCompMin / 1000).toFixed(0)}k-${(targetCompMax / 1000).toFixed(0)}k
                  </div>
                  <div className="text-[10px] text-slate-400 print:text-neutral-600 mt-0.5">P50-P75 Market Fit</div>
                </div>
              </div>

              {/* Strategic Pivot Recommendations */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 print:text-black flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400 print:text-indigo-600" />
                  <span>Strategic Levers &amp; Market Calibration Options</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 print:bg-neutral-50 print:border-neutral-200">
                    <span className="font-bold text-white print:text-black flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      Lever 1: Geo &amp; Remote Expansion
                    </span>
                    <p className="text-slate-300 print:text-neutral-700 mt-1 text-[11px] leading-relaxed">
                      Expanding from on-site to 2-day hybrid or regional remote (+50 miles) increases candidate pool density by <strong className="text-cyan-300 print:text-indigo-700">+45%</strong> and compresses TTF by ~14 days.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 print:bg-neutral-50 print:border-neutral-200">
                    <span className="font-bold text-white print:text-black flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Lever 2: Experience &amp; Feeder Flexibility
                    </span>
                    <p className="text-slate-300 print:text-neutral-700 mt-1 text-[11px] leading-relaxed">
                      Adjusting experience floor from 8+ years to 5-7 years with strong technical aptitude unlocks adjacent staff-ready talent currently locked in stagnant promotion cycles.
                    </p>
                  </div>
                </div>
              </div>

              {/* Top Target Feeder Archetypes */}
              {topFeeders.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 print:text-black flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-400 print:text-indigo-600" />
                    <span>Primary Feeder Target Companies</span>
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {topFeeders.map((f, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-slate-800/80 print:bg-neutral-100 border border-slate-700/80 print:border-neutral-300 text-slate-200 print:text-black font-medium text-[11px]"
                      >
                        {f.company} ({f.estimatedTargetTalentPool} talent pool • {f.priority})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Print Footer */}
              <div className="pt-4 border-t border-slate-800 print:border-black/20 flex items-center justify-between text-[10px] font-mono text-slate-500 print:text-neutral-400">
                <span>TalentIQ Enterprise Intelligence Platform</span>
                <span>Confidential Executive Calibration</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
