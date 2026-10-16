import React, { useState } from 'react';
import { TalentMapReport } from '../types';
import {
  generateDetailedSourcingPlan,
  generateSourcingPlanMarkdown,
  generateSourcingPlanCSV,
  generateSourcingPlanJSON,
} from '../services/sourcingPlanGenerator';
import { downloadSourcingPlanPDF } from '../services/sourcingPlanPdfGenerator';
import { CopyableBoolean } from './CopyableBoolean';
import {
  Download,
  FileText,
  FileSpreadsheet,
  FileCode,
  Copy,
  Check,
  Printer,
  Sparkles,
  Users,
  Target,
  Search,
  Send,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Clock,
  Briefcase,
  Layers,
  ArrowRight,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Sliders,
  ExternalLink,
} from 'lucide-react';

interface SourcingPlanViewProps {
  report: TalentMapReport;
  onNavigateToTracker?: () => void;
  onNavigateToOutreach?: () => void;
}

export const SourcingPlanView: React.FC<SourcingPlanViewProps> = ({
  report,
  onNavigateToTracker,
  onNavigateToOutreach,
}) => {
  const [hiringVolume, setHiringVolume] = useState<number>(
    report.input.hiringVolume.value || 1
  );
  const [activeSubSection, setActiveSubSection] = useState<
    'funnel' | 'competitors' | 'boolean' | 'outreach' | 'roadmap' | 'rubric' | 'slas'
  >('funnel');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Generate dynamic plan based on current report & hiring volume
  const plan = generateDetailedSourcingPlan(report, hiringVolume);

  const roleTitle = plan.roleTitle;
  const metro = plan.location;
  const workModel = plan.workModel;

  // File Download Helper
  const downloadTextFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadPDF = () => {
    downloadSourcingPlanPDF(report, hiringVolume);
  };

  const handleDownloadMarkdown = () => {
    const md = generateSourcingPlanMarkdown(plan, report);
    downloadTextFile(
      md,
      `SourcingPlan_${roleTitle.replace(/\s+/g, '_')}_${metro}.md`,
      'text/markdown'
    );
  };

  const handleDownloadCSV = () => {
    const csv = generateSourcingPlanCSV(plan);
    downloadTextFile(
      csv,
      `SourcingPlan_${roleTitle.replace(/\s+/g, '_')}.csv`,
      'text/csv'
    );
  };

  const handleDownloadJSON = () => {
    const json = generateSourcingPlanJSON(plan);
    downloadTextFile(
      json,
      `SourcingPlan_${report.id}.json`,
      'application/json'
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="sourcing-recruiting-plan-root" className="space-y-6">
      {/* Top Banner & Quick Action Center */}
      <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-indigo-950/40 space-y-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 glow-dot-cyan"></span>
              <span>TalentIQ War Room · Strategic Sourcing & Recruiting Plan</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              Detailed Sourcing & Recruiting Plan
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Synthesized from the comprehensive Talent Market Map calculations and Sourcing War Room metrics. 
              Provides exact funnel volume math, competitor poaching blueprints, ready-to-run Boolean strings, 
              multi-touch sequences, and week-by-week execution milestones.
            </p>
          </div>

          {/* Quick Download Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              id="btn-download-plan-pdf"
              onClick={handleDownloadPDF}
              className="px-4 py-2.5 rounded-xl accent-gradient text-white text-xs font-bold font-mono transition-all shadow-lg glow flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
              title="Download Full Multi-Page Sourcing Plan PDF"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Plan</span>
            </button>

            <button
              id="btn-download-plan-md"
              onClick={handleDownloadMarkdown}
              className="px-3.5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Download Markdown for Notion or Jira"
            >
              <FileText className="w-4 h-4 text-cyan-300" />
              <span>Markdown (.md)</span>
            </button>

            <button
              id="btn-download-plan-csv"
              onClick={handleDownloadCSV}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Download CSV for Excel or Google Sheets"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>CSV Spreadsheet</span>
            </button>

            <button
              id="btn-copy-full-plan"
              onClick={() => handleCopy(generateSourcingPlanMarkdown(plan, report), 'full-plan')}
              className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-all cursor-pointer"
              title="Copy Full Markdown Plan"
            >
              {copiedKey === 'full-plan' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            <button
              id="btn-print-plan"
              onClick={handlePrint}
              className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-all cursor-pointer"
              title="Print Plan"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Capacity Tuning Strip */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target Hiring Volume:</span>
            </span>
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              {[1, 2, 3, 5].map((count) => (
                <button
                  key={count}
                  onClick={() => setHiringVolume(count)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    hiringVolume === count
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {count} {count === 1 ? 'Hire' : 'Hires'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400">
            <div>
              <span className="text-slate-500">Target Role:</span>{' '}
              <span className="text-slate-200 font-bold">{roleTitle}</span>
            </div>
            <div>
              <span className="text-slate-500">Market:</span>{' '}
              <span className="text-indigo-300 font-bold">{metro} ({workModel})</span>
            </div>
            <div>
              <span className="text-slate-500">Timeline:</span>{' '}
              <span className="text-cyan-400 font-bold">~{plan.timeToFillDays} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Key Executive Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-card rounded-xl p-3.5 border-slate-800/80">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Difficulty Index</div>
          <div className="text-lg font-bold text-rose-400 mt-0.5">{plan.recruitingDifficultyScore}/100</div>
          <div className="text-[10px] text-slate-400 truncate">{plan.recruitingDifficultyBand}</div>
        </div>

        <div className="glass-card rounded-xl p-3.5 border-slate-800/80">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Talent Availability</div>
          <div className="text-lg font-bold text-amber-400 mt-0.5">{plan.talentAvailabilityScore}/100</div>
          <div className="text-[10px] text-slate-400 truncate">{plan.talentAvailabilityBand}</div>
        </div>

        <div className="glass-card rounded-xl p-3.5 border-slate-800/80">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Profiles to Map</div>
          <div className="text-lg font-bold text-cyan-400 mt-0.5">{plan.funnelMath.profilesToSource}</div>
          <div className="text-[10px] text-slate-400">Top-of-funnel pool</div>
        </div>

        <div className="glass-card rounded-xl p-3.5 border-slate-800/80">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Outreach Target</div>
          <div className="text-lg font-bold text-indigo-400 mt-0.5">{plan.funnelMath.outreachTarget}</div>
          <div className="text-[10px] text-slate-400">4-touch sequence</div>
        </div>

        <div className="glass-card rounded-xl p-3.5 border-slate-800/80">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Screens Needed</div>
          <div className="text-lg font-bold text-blue-400 mt-0.5">{plan.funnelMath.screensCompleted}</div>
          <div className="text-[10px] text-slate-400">~{plan.funnelMath.screenPassRatePct}% pass rate</div>
        </div>

        <div className="glass-card rounded-xl p-3.5 border-slate-800/80">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Final Onsites</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">{plan.funnelMath.finalLoops}</div>
          <div className="text-[10px] text-slate-400">For {plan.targetHires} hire(s)</div>
        </div>
      </div>

      {/* Interactive Sub-Section Navigator Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveSubSection('funnel')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubSection === 'funnel'
              ? 'accent-gradient text-white glow font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Funnel Mathematics</span>
        </button>

        <button
          onClick={() => setActiveSubSection('competitors')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubSection === 'competitors'
              ? 'accent-gradient text-white glow font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Competitor Poaching Matrix</span>
        </button>

        <button
          onClick={() => setActiveSubSection('boolean')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubSection === 'boolean'
              ? 'accent-gradient text-white glow font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Boolean & X-Ray Arsenal</span>
        </button>

        <button
          onClick={() => setActiveSubSection('outreach')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubSection === 'outreach'
              ? 'accent-gradient text-white glow font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Outreach Playbook</span>
        </button>

        <button
          onClick={() => setActiveSubSection('roadmap')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubSection === 'roadmap'
              ? 'accent-gradient text-white glow font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>8-Week Roadmap</span>
        </button>

        <button
          onClick={() => setActiveSubSection('rubric')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubSection === 'rubric'
              ? 'accent-gradient text-white glow font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Screening Rubric</span>
        </button>

        <button
          onClick={() => setActiveSubSection('slas')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubSection === 'slas'
              ? 'accent-gradient text-white glow font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Live Pipeline & SLAs</span>
        </button>
      </div>

      {/* =========================================================
          SECTION 1: FUNNEL MATHEMATICS
          ========================================================= */}
      {activeSubSection === 'funnel' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Visual Funnel Progression */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>Calibrated Sourcing Funnel Capacity Plan</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Exact pipeline conversion metrics required to achieve {plan.targetHires} hire{plan.targetHires > 1 ? 's' : ''} in {plan.timeToFillDays} days.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[11px]">
                {plan.funnelMath.responseRatePct}% Projected Response
              </span>
            </div>

            {/* Stepper Pipeline Visual */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
              {[
                { stage: '1. Profiles', count: plan.funnelMath.profilesToSource, rate: '100%', color: 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300' },
                { stage: '2. Outreach', count: plan.funnelMath.outreachTarget, rate: 'Multi-touch', color: 'border-indigo-500/40 bg-indigo-950/30 text-indigo-300' },
                { stage: '3. Responses', count: plan.funnelMath.responsesExpected, rate: `~${plan.funnelMath.responseRatePct}%`, color: 'border-blue-500/40 bg-blue-950/30 text-blue-300' },
                { stage: '4. Screens', count: plan.funnelMath.screensCompleted, rate: `~${plan.funnelMath.screenPassRatePct}%`, color: 'border-purple-500/40 bg-purple-950/30 text-purple-300' },
                { stage: '5. HM Loops', count: plan.funnelMath.hmInterviews, rate: `~${plan.funnelMath.hmPassRatePct}%`, color: 'border-amber-500/40 bg-amber-950/30 text-amber-300' },
                { stage: '6. Onsites', count: plan.funnelMath.finalLoops, rate: `~${plan.funnelMath.finalLoopPassRatePct}%`, color: 'border-orange-500/40 bg-orange-950/30 text-orange-300' },
                { stage: '7. Offers', count: plan.funnelMath.offersExtended, rate: `~${plan.funnelMath.offerAcceptanceRatePct}%`, color: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300' },
                { stage: '8. Hired', count: plan.funnelMath.projectedHires, rate: 'Closed', color: 'border-emerald-400 bg-emerald-500/20 text-emerald-200' },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex flex-col justify-between text-center transition-all ${step.color}`}
                >
                  <div className="text-[10px] font-mono uppercase font-bold text-slate-400">{step.stage}</div>
                  <div className="text-xl font-bold my-1">{step.count}</div>
                  <div className="text-[10px] font-mono opacity-80">{step.rate}</div>
                </div>
              ))}
            </div>

            {/* Sourcing Channel Mix */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Recommended Sourcing Channel Allocation</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {plan.channelMix.map((c, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{c.channel}</span>
                      <span className="text-xs font-mono font-bold text-cyan-400">{c.allocationPct}%</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Yield: {c.expectedYield}</p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        className="bg-cyan-500 h-full rounded-full"
                        style={{ width: `${c.allocationPct}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SECTION 2: COMPETITOR POACHING MATRIX
          ========================================================= */}
      {activeSubSection === 'competitors' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" />
              <span>4-Tier Competitor Poaching Matrix</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Categorized by talent similarity and poaching vulnerability
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.competitorTiers.map((tier, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-5 border-slate-800/90 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {tier.tier}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1.5">{tier.tierLabel}</h4>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold text-[11px]">Target Companies:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {tier.companies.map((comp, cIdx) => (
                        <span
                          key={cIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700/80 text-cyan-300 text-[11px] font-mono"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="text-indigo-300 font-semibold block text-[11px]">Tactical Poaching Pitch:</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{tier.tacticalAngle}</p>
                  </div>

                  <div>
                    <span className="text-amber-300 font-semibold block text-[11px]">Vulnerability Trigger:</span>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{tier.vulnerabilityNotes}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-semibold text-[11px]">Targeted Core Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tier.targetedSkills.map((sk, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 text-[10px]">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          SECTION 3: BOOLEAN & X-RAY ARSENAL
          ========================================================= */}
      {activeSubSection === 'boolean' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>Ready-to-Run Boolean & X-Ray Query Arsenal</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Copy and paste these exact strings directly into LinkedIn Recruiter, Google, or GitHub.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {plan.booleanArsenal.map((b, idx) => (
              <CopyableBoolean
                key={idx}
                string={b.query}
                label={b.name}
                platform={b.platform}
                description={b.purpose}
              />
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          SECTION 4: MULTI-TOUCH OUTREACH SEQUENCE
          ========================================================= */}
      {activeSubSection === 'outreach' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                <span>4-Touch High-Conversion Outreach Sequence</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Spaced sequence engineered to maximize passive candidate response rates without spamming.
              </p>
            </div>

            {onNavigateToOutreach && (
              <button
                onClick={onNavigateToOutreach}
                className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>Open in Outreach Studio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {plan.outreachSequence.map((seq, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-5 border-slate-800/90 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold uppercase text-indigo-400">
                        {seq.touchpoint}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs font-mono text-slate-400">{seq.timing}</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5 font-medium">
                      <span className="text-slate-500 font-mono">Channel:</span> {seq.channel}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(`${seq.subjectLine}\n\n${seq.messageTemplate}`, `seq-${idx}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-all cursor-pointer w-fit"
                  >
                    {copiedKey === `seq-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedKey === `seq-${idx}` ? 'Copied Message!' : 'Copy Touchpoint'}</span>
                  </button>
                </div>

                <div className="text-xs">
                  <span className="text-slate-500 font-mono">Subject: </span>
                  <span className="text-slate-200 font-bold">{seq.subjectLine}</span>
                </div>

                <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800/90 font-mono text-xs text-slate-300 whitespace-pre-line leading-relaxed select-all">
                  {seq.messageTemplate}
                </div>

                <div className="text-[11px] text-slate-400 italic">
                  <strong>Strategic Objective:</strong> {seq.actionIntent}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          SECTION 5: 8-WEEK EXECUTION ROADMAP
          ========================================================= */}
      {activeSubSection === 'roadmap' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Phased Recruiting Execution Roadmap (8 Weeks)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Calibrated for expected ~{plan.timeToFillDays} day time-to-fill
            </span>
          </div>

          <div className="space-y-4">
            {plan.weeklyRoadmap.map((w, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-5 border-slate-800/90 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold text-xs">
                      {w.week}
                    </span>
                    <div>
                      <span className="text-xs font-mono text-cyan-400 font-bold uppercase block">
                        {w.phase}
                      </span>
                      <h4 className="text-sm font-bold text-white">{w.title}</h4>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full">
                    {w.kpiDeliverable}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Recruiter Deliverables */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5 uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Recruiter Deliverables</span>
                    </span>
                    <ul className="space-y-1.5 text-slate-300">
                      {w.recruiterMilestones.map((m, mIdx) => (
                        <li key={mIdx} className="flex items-start gap-2">
                          <span className="text-cyan-500 mt-0.5">•</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Hiring Manager Deliverables */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <span className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1.5 uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Hiring Manager Actions</span>
                    </span>
                    <ul className="space-y-1.5 text-slate-300">
                      {w.hiringManagerMilestones.map((m, mIdx) => (
                        <li key={mIdx} className="flex items-start gap-2">
                          <span className="text-indigo-500 mt-0.5">•</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          SECTION 6: SCREENING RUBRIC
          ========================================================= */}
      {activeSubSection === 'rubric' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Technical Calibration & Screening Rubric</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Green flags, red flag warnings, and diagnostic interview prompts
            </span>
          </div>

          <div className="space-y-4">
            {plan.screeningRubric.map((rubric, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-5 border-slate-800/90 space-y-3">
                <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                  {rubric.category}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Must-Haves */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Green Flag Competency Signals</span>
                    </span>
                    <ul className="space-y-1.5 text-slate-200">
                      {rubric.mustHaveIndicators.map((m, mIdx) => (
                        <li key={mIdx} className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">✓</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Red Flags */}
                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                    <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Red Flag Warning Signals</span>
                    </span>
                    <ul className="space-y-1.5 text-slate-200">
                      {rubric.redFlagWarnings.map((w, wIdx) => (
                        <li key={wIdx} className="flex items-start gap-2">
                          <span className="text-rose-400 mt-0.5">✕</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <span className="text-indigo-400 font-mono font-bold block mb-1">
                    Diagnostic Interview Prompt:
                  </span>
                  <p className="text-slate-300 italic">"{rubric.interviewPrompt}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          SECTION 7: LIVE PIPELINE & SLAS
          ========================================================= */}
      {activeSubSection === 'slas' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Live Pipeline Snapshot */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Sourcing War Room Active Pipeline Snapshot</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Synchronized with Candidate Tracker state in localStorage.
                </p>
              </div>

              {onNavigateToTracker && (
                <button
                  onClick={onNavigateToTracker}
                  className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer w-fit"
                >
                  <span>Manage in Candidate Tracker</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Identified</div>
                <div className="text-xl font-bold text-cyan-400 mt-1">{plan.livePipelineSnapshot.identifiedCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Outreached</div>
                <div className="text-xl font-bold text-amber-400 mt-1">{plan.livePipelineSnapshot.outreachedCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Screening</div>
                <div className="text-xl font-bold text-indigo-400 mt-1">{plan.livePipelineSnapshot.screeningCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Interviewing</div>
                <div className="text-xl font-bold text-blue-400 mt-1">{plan.livePipelineSnapshot.interviewingCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Offered</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">{plan.livePipelineSnapshot.offeredCount}</div>
              </div>
            </div>
          </div>

          {/* Service Level Agreements Table */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Agreed Recruiting Service Level Agreements (SLAs)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-2.5 px-3">Workflow Step</th>
                    <th className="py-2.5 px-3">Strict SLA Timeframe</th>
                    <th className="py-2.5 px-3">Accountable Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {plan.slaCommitments.map((sla, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-200">{sla.processStep}</td>
                      <td className="py-2.5 px-3 font-mono text-cyan-400 font-bold">{sla.timeframe}</td>
                      <td className="py-2.5 px-3 text-slate-300">{sla.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk Mitigations */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Key Search Risks & Mitigation Protocols</span>
            </h3>

            <div className="space-y-3">
              {plan.riskMitigations.map((risk, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{risk.risk}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {risk.severity} Severity
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{risk.mitigationAction}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
