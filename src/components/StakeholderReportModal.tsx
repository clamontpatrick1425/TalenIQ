import React, { useState } from 'react';
import { TalentMapReport } from '../types';
import {
  downloadStakeholderReportPDF,
  StakeholderReportOptions,
} from '../services/pdfReportGenerator';
import {
  FileText,
  Printer,
  Download,
  X,
  CheckCircle2,
  Settings,
  Eye,
  Building2,
  User,
  ShieldAlert,
  Sparkles,
  Sliders,
  DollarSign,
  Target,
  FileCheck,
  HelpCircle,
  Award,
  AlertTriangle,
  Send,
  Briefcase,
  MapPin,
  Clock,
} from 'lucide-react';

interface StakeholderReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: TalentMapReport;
}

export const StakeholderReportModal: React.FC<StakeholderReportModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const roleName = report?.input?.role?.value || 'Technical Specialist';
  const sanitizedFilename = `${roleName.replace(/[^a-zA-Z0-9_-]/g, '_')}_report.pdf`;

  const [activeTab, setActiveTab] = useState<'customize' | 'preview'>('customize');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Customization State
  const [options, setOptions] = useState<StakeholderReportOptions>({
    hiringManagerName: 'Alex Rivera',
    hiringManagerTitle: 'VP of Engineering',
    department: 'Platform & Distributed Infrastructure',
    talentLeadName: 'Principal Talent Partner',
    confidentialityLevel: 'CONFIDENTIAL: Internal Leadership & Hiring Committee Only',
    customStakeholderNotes: `Market intelligence assessment for ${roleName}. Focus candidate outreach on direct Tier-1 distributed systems competitors while aligning the interview panel on core system architecture pass/fail bars.`,
    filename: 'report.pdf',
    includeCompensation: true,
    includeCompetitors: true,
    includeCalibrationMatrix: true,
    includeScreenQuestions: true,
    includeLeveling: true,
    includeRisks: true,
    includeClosingStrategy: true,
  });

  if (!isOpen || !report) return null;

  const handleDownload = () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      downloadStakeholderReportPDF(report, options, options.filename || 'report.pdf');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const applyPreset = (preset: 'executive' | 'complete' | 'interview') => {
    if (preset === 'executive') {
      setOptions((prev) => ({
        ...prev,
        includeCompensation: true,
        includeCompetitors: true,
        includeCalibrationMatrix: false,
        includeScreenQuestions: false,
        includeLeveling: true,
        includeRisks: true,
        includeClosingStrategy: true,
        confidentialityLevel: 'STRICTLY CONFIDENTIAL: C-Suite & Executive Leadership Only',
      }));
    } else if (preset === 'complete') {
      setOptions((prev) => ({
        ...prev,
        includeCompensation: true,
        includeCompetitors: true,
        includeCalibrationMatrix: true,
        includeScreenQuestions: true,
        includeLeveling: true,
        includeRisks: true,
        includeClosingStrategy: true,
        confidentialityLevel: 'CONFIDENTIAL: Internal Leadership & Hiring Committee Only',
      }));
    } else if (preset === 'interview') {
      setOptions((prev) => ({
        ...prev,
        includeCompensation: false,
        includeCompetitors: false,
        includeCalibrationMatrix: true,
        includeScreenQuestions: true,
        includeLeveling: true,
        includeRisks: false,
        includeClosingStrategy: false,
        confidentialityLevel: 'INTERNAL: Interview Panel & Calibration Guide',
      }));
    }
  };

  const {
    input,
    executiveSummary,
    executiveRecruitingBrief,
    recruitingDifficultyScore,
    talentAvailabilityScore,
    talentSupply,
    compensationIntelligence,
    competitiveEmployerLandscape,
  } = report;

  return (
    <div
      id="stakeholder-report-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Executive Stakeholder Report & PDF Export
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  report.pdf
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tailored presentation packet for Hiring Managers, Interview Loops, and Executive Stakeholders.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex items-center p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setActiveTab('customize')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'customize'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Customize & Export</span>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Document Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'customize' ? (
            <div className="space-y-6">
              {/* Presets Bar */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Quick Stakeholder Report Presets
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Pre-select sections based on your target meeting audience.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => applyPreset('complete')}
                    className="px-2.5 py-1 text-xs font-medium bg-blue-600/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-600/20 transition-all border border-blue-200 dark:border-blue-800/60 cursor-pointer"
                  >
                    Full Brief & Calibration (Recommended)
                  </button>
                  <button
                    onClick={() => applyPreset('executive')}
                    className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all cursor-pointer"
                  >
                    Executive / C-Suite Focus
                  </button>
                  <button
                    onClick={() => applyPreset('interview')}
                    className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all cursor-pointer"
                  >
                    Interview Loop Guide
                  </button>
                </div>
              </div>

              {/* Stakeholder Metadata Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Hiring Manager & Department
                  </label>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400">Hiring Manager Name & Title</span>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={options.hiringManagerName}
                          onChange={(e) => setOptions({ ...options, hiringManagerName: e.target.value })}
                          placeholder="e.g. Sarah Jenkins"
                          className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={options.hiringManagerTitle}
                          onChange={(e) => setOptions({ ...options, hiringManagerTitle: e.target.value })}
                          placeholder="e.g. VP of Engineering"
                          className="w-1/3 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400">Business Unit / Department</span>
                      <input
                        type="text"
                        value={options.department}
                        onChange={(e) => setOptions({ ...options, department: e.target.value })}
                        placeholder="e.g. Platform Infrastructure & Distributed Systems"
                        className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Document Governance & Author
                  </label>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400">Prepared By (Talent Intelligence Lead)</span>
                      <input
                        type="text"
                        value={options.talentLeadName}
                        onChange={(e) => setOptions({ ...options, talentLeadName: e.target.value })}
                        placeholder="e.g. Principal Talent Partner"
                        className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400">Confidentiality Classification</span>
                      <select
                        value={options.confidentialityLevel}
                        onChange={(e) => setOptions({ ...options, confidentialityLevel: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="CONFIDENTIAL: Internal Leadership & Hiring Committee Only">
                          CONFIDENTIAL: Internal Leadership & Hiring Committee Only
                        </option>
                        <option value="STRICTLY CONFIDENTIAL: C-Suite & Executive Leadership Only">
                          STRICTLY CONFIDENTIAL: C-Suite & Executive Leadership Only
                        </option>
                        <option value="INTERNAL: Interview Panel & Calibration Guide">
                          INTERNAL: Interview Panel & Calibration Guide
                        </option>
                        <option value="RESTRICTED: Talent Acquisition & Compensation Committee">
                          RESTRICTED: Talent Acquisition & Compensation Committee
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Mandate / Note to Stakeholder */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Strategic Briefing Mandate (Included prominently on Page 1)
                </label>
                <textarea
                  value={options.customStakeholderNotes}
                  onChange={(e) => setOptions({ ...options, customStakeholderNotes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                  placeholder="Add custom guidance or instructions for the hiring manager or interview team..."
                />
              </div>

              {/* Section Checkboxes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Included Report Modules
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeCompensation}
                      onChange={(e) => setOptions({ ...options, includeCompensation: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <DollarSign className="w-3.5 h-3.5 text-blue-500" />
                    <span>Compensation Benchmarks (P25-P90)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeCompetitors}
                      onChange={(e) => setOptions({ ...options, includeCompetitors: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <Target className="w-3.5 h-3.5 text-rose-500" />
                    <span>Competitor Poaching Targets & Hooks</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeCalibrationMatrix}
                      onChange={(e) => setOptions({ ...options, includeCalibrationMatrix: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <FileCheck className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Hiring Team Competency Rubric</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeScreenQuestions}
                      onChange={(e) => setOptions({ ...options, includeScreenQuestions: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>High-Signal Screen Questions</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeLeveling}
                      onChange={(e) => setOptions({ ...options, includeLeveling: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Leveling Nuances (L5 / L6 / L7)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeRisks}
                      onChange={(e) => setOptions({ ...options, includeRisks: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Recruiting Risks & Mitigations</span>
                  </label>
                </div>
              </div>

              {/* Filename Input */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Export Filename:</span>
                <input
                  type="text"
                  value={options.filename}
                  onChange={(e) => setOptions({ ...options, filename: e.target.value })}
                  className="px-3 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 w-48 font-mono"
                />
              </div>
            </div>
          ) : (
            /* Document Live Preview Tab */
            <div className="bg-slate-100 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-center">
              <div className="w-full max-w-3xl bg-white text-slate-900 p-8 rounded-lg shadow-md border border-slate-200 text-xs space-y-5 font-sans">
                {/* Visual Header */}
                <div className="border-b-2 border-blue-600 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 rounded">
                        {options.confidentialityLevel}
                      </span>
                      <h1 className="text-xl font-black text-slate-900 mt-1">
                        {input.role.value}
                      </h1>
                      <div className="flex gap-2 text-[11px] text-slate-500 mt-1">
                        <span><strong>{input.geography.location}</strong> ({input.workModel.value})</span>
                        <span>•</span>
                        <span>Level: <strong>{input.seniority.value}</strong></span>
                        <span>•</span>
                        <span>Generated: {new Date(report.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Recruiting Difficulty</div>
                      <div className="text-base font-bold text-rose-600">
                        {recruitingDifficultyScore.score}/100 ({recruitingDifficultyScore.band})
                      </div>
                    </div>
                  </div>

                  {/* Stakeholder Box */}
                  <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] grid grid-cols-3 gap-2">
                    <div>
                      <div className="font-bold text-slate-900">Presented To:</div>
                      <div className="text-slate-600">{options.hiringManagerName}</div>
                      <div className="text-[10px] text-slate-400">{options.hiringManagerTitle}</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Department:</div>
                      <div className="text-slate-600">{options.department}</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Prepared By:</div>
                      <div className="text-slate-600">{options.talentLeadName}</div>
                      <div className="text-[10px] text-slate-400">Talent Intelligence</div>
                    </div>
                  </div>
                </div>

                {/* Mandate */}
                {options.customStakeholderNotes && (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded text-[11px] text-slate-700">
                    <div className="font-bold text-indigo-900 mb-0.5">Calibration Mandate:</div>
                    <p className="italic">{options.customStakeholderNotes}</p>
                  </div>
                )}

                {/* 4 Quick Tiles */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded text-center">
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Addressable Pool</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {talentSupply.addressable.count.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded text-center">
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Active Searchers</div>
                    <div className="text-sm font-bold text-emerald-600 mt-0.5">
                      {talentSupply.active.count.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded text-center">
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Median Base</div>
                    <div className="text-sm font-bold text-blue-600 mt-0.5">
                      ${compensationIntelligence.baseSalary.p50.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded text-center">
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Est. Time-to-Fill</div>
                    <div className="text-sm font-bold text-indigo-600 mt-0.5">
                      {recruitingDifficultyScore.expectedTimeToFillDays} Days
                    </div>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-800">
                    Executive Summary & Market Assessment
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {executiveSummary.executiveBriefNarrative}
                  </p>
                </div>

                {/* Calibration Matrix snippet */}
                {options.includeCalibrationMatrix && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <div className="font-bold text-slate-900 text-xs uppercase tracking-wider text-indigo-800">
                      Interview Calibration Matrix (Excerpt)
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                        <div className="font-bold text-slate-900">Core Architecture & Code Craft (30%)</div>
                        <div className="text-emerald-700 mt-1">✓ Green: Clear latency vs memory trade-offs, modular design</div>
                        <div className="text-rose-700 mt-0.5">✗ Red: Framework magic reliance without concurrency depth</div>
                      </div>
                      <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                        <div className="font-bold text-slate-900">Distributed Scale & Triage (25%)</div>
                        <div className="text-emerald-700 mt-1">✓ Green: Post-mortem hygiene, telemetry mastery, P99 tails</div>
                        <div className="text-rose-700 mt-0.5">✗ Red: Views reliability as solely an SRE task</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sign-Off block */}
                <div className="pt-3 border-t border-slate-200 grid grid-cols-3 gap-3 text-[10px] text-slate-500">
                  <div className="border-b border-slate-300 pb-1">
                    <div className="font-semibold text-slate-700">{options.hiringManagerName}</div>
                    <div>Hiring Manager Sign-off</div>
                  </div>
                  <div className="border-b border-slate-300 pb-1">
                    <div className="font-semibold text-slate-700">{options.talentLeadName}</div>
                    <div>Talent Intelligence Lead</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-600">CALIBRATION APPROVED</div>
                    <div>Status: Active Search</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer with Primary Action Buttons */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            {downloadSuccess ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Successfully generated {options.filename || 'report.pdf'}!
              </span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400">
                Vector-sharp, print-calibrated PDF document with customized stakeholder metadata.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer border border-slate-300 dark:border-slate-700"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              id="btn-generate-download-pdf"
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Compiling PDF...' : 'Download Detailed report.pdf'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
