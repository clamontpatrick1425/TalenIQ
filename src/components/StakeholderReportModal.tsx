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
  ChevronLeft,
  ChevronRight,
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
  const [selectedPreset, setSelectedPreset] = useState<'complete' | 'executive' | 'interview' | 'custom'>('complete');
  const [previewPage, setPreviewPage] = useState<number>(1);
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
    setSelectedPreset(preset);
    setPreviewPage(1);

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
        customStakeholderNotes: `Executive talent intelligence briefing for ${roleName}. Focus candidate outreach on direct Tier-1 distributed systems competitors while aligning executive leadership on market compensation percentiles, availability index, and key retention risks.`,
        filename: `${roleName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_executive_brief.pdf`,
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
        customStakeholderNotes: `Market intelligence assessment for ${roleName}. Focus candidate outreach on direct Tier-1 distributed systems competitors while aligning the interview panel on core system architecture pass/fail bars.`,
        filename: 'report.pdf',
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
        customStakeholderNotes: `Interview panel calibration packet for ${roleName}. Focus interview evaluations strictly on technical architecture, distributed resilience, RFC communication, and target leveling bars. Compensation details omitted for panel focus.`,
        filename: `${roleName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_interview_guide.pdf`,
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
                    type="button"
                    onClick={() => applyPreset('complete')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer flex items-center gap-1.5 ${
                      selectedPreset === 'complete'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {selectedPreset === 'complete' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    <span>Full Brief & Calibration (4 Pages)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('executive')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer flex items-center gap-1.5 ${
                      selectedPreset === 'executive'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {selectedPreset === 'executive' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    <span>Executive / C-Suite Focus (3 Pages)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('interview')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer flex items-center gap-1.5 ${
                      selectedPreset === 'interview'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {selectedPreset === 'interview' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    <span>Interview Loop Guide (3 Pages)</span>
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
                          onChange={(e) => {
                            setSelectedPreset('custom');
                            setOptions({ ...options, hiringManagerName: e.target.value });
                          }}
                          placeholder="e.g. Sarah Jenkins"
                          className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={options.hiringManagerTitle}
                          onChange={(e) => {
                            setSelectedPreset('custom');
                            setOptions({ ...options, hiringManagerTitle: e.target.value });
                          }}
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
                        onChange={(e) => {
                          setSelectedPreset('custom');
                          setOptions({ ...options, department: e.target.value });
                        }}
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
                        onChange={(e) => {
                          setSelectedPreset('custom');
                          setOptions({ ...options, talentLeadName: e.target.value });
                        }}
                        placeholder="e.g. Principal Talent Partner"
                        className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400">Confidentiality Classification</span>
                      <select
                        value={options.confidentialityLevel}
                        onChange={(e) => {
                          setSelectedPreset('custom');
                          setOptions({ ...options, confidentialityLevel: e.target.value });
                        }}
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
                  onChange={(e) => {
                    setSelectedPreset('custom');
                    setOptions({ ...options, customStakeholderNotes: e.target.value });
                  }}
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
                      onChange={(e) => {
                        setSelectedPreset('custom');
                        setOptions({ ...options, includeCompensation: e.target.checked });
                      }}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <DollarSign className="w-3.5 h-3.5 text-blue-500" />
                    <span>Compensation Benchmarks (P25-P90)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeCompetitors}
                      onChange={(e) => {
                        setSelectedPreset('custom');
                        setOptions({ ...options, includeCompetitors: e.target.checked });
                      }}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <Target className="w-3.5 h-3.5 text-rose-500" />
                    <span>Competitor Poaching Targets & Hooks</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeCalibrationMatrix}
                      onChange={(e) => {
                        setSelectedPreset('custom');
                        setOptions({ ...options, includeCalibrationMatrix: e.target.checked });
                      }}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <FileCheck className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Hiring Team Competency Rubric</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeScreenQuestions}
                      onChange={(e) => {
                        setSelectedPreset('custom');
                        setOptions({ ...options, includeScreenQuestions: e.target.checked });
                      }}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>High-Signal Screen Questions</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeLeveling}
                      onChange={(e) => {
                        setSelectedPreset('custom');
                        setOptions({ ...options, includeLeveling: e.target.checked });
                      }}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Leveling Nuances (L5 / L6 / L7)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeRisks}
                      onChange={(e) => {
                        setSelectedPreset('custom');
                        setOptions({ ...options, includeRisks: e.target.checked });
                      }}
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
            /* Multi-Page Document Live Preview Tab */
            (() => {
              const previewPages = [
                { id: 'overview', title: '1. Executive Overview', type: 'overview' as const },
                ...(options.includeCompensation || options.includeCompetitors
                  ? [{ id: 'compensation', title: '2. Comp & Competitors', type: 'compensation' as const }]
                  : []),
                ...(options.includeCalibrationMatrix || options.includeScreenQuestions
                  ? [{ id: 'calibration', title: `${options.includeCompensation || options.includeCompetitors ? '3' : '2'}. Interview Calibration`, type: 'calibration' as const }]
                  : []),
                { id: 'governance', title: `${(options.includeCompensation || options.includeCompetitors ? 1 : 0) + (options.includeCalibrationMatrix || options.includeScreenQuestions ? 1 : 0) + 2}. Governance & Sign-Off`, type: 'governance' as const },
              ].map((p, index, arr) => ({
                ...p,
                pageIndex: index + 1,
                totalPages: arr.length,
              }));

              const activePageIndex = Math.max(1, Math.min(previewPage, previewPages.length));
              const currentPage = previewPages[activePageIndex - 1] || previewPages[0];

              return (
                <div className="space-y-4">
                  {/* Page Navigation Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        Viewing Sheet {currentPage.pageIndex} of {currentPage.totalPages}:
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                        {currentPage.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewPage(Math.max(1, activePageIndex - 1))}
                        disabled={activePageIndex <= 1}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
                        title="Previous Sheet"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-1">
                        {previewPages.map((page) => (
                          <button
                            key={page.id}
                            type="button"
                            onClick={() => setPreviewPage(page.pageIndex)}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              activePageIndex === page.pageIndex
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            Page {page.pageIndex}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setPreviewPage(Math.min(previewPages.length, activePageIndex + 1))}
                        disabled={activePageIndex >= previewPages.length}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
                        title="Next Sheet"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Document Canvas */}
                  <div className="bg-slate-200/70 dark:bg-slate-950 p-4 sm:p-6 rounded-xl border border-slate-300 dark:border-slate-800 flex justify-center overflow-x-auto">
                    <div className="w-full max-w-3xl bg-white text-slate-900 p-7 sm:p-9 rounded-lg shadow-xl border border-slate-300 text-xs space-y-5 font-sans min-h-[750px] flex flex-col justify-between">
                      {/* PAGE CONTENT SWITCHER */}
                      <div className="space-y-5">
                        {/* Page Running Header for Page > 1 */}
                        {currentPage.type !== 'overview' && (
                          <div className="border-b border-slate-300 pb-2.5 flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                            <span className="text-blue-700 font-bold">
                              TALENTIQ INTELLIGENCE BRIEF • {input.role.value}
                            </span>
                            <span>PAGE {currentPage.pageIndex} OF {currentPage.totalPages}</span>
                          </div>
                        )}

                        {/* ================= PAGE 1: OVERVIEW ================= */}
                        {currentPage.type === 'overview' && (
                          <>
                            {/* Page 1 Header */}
                            <div className="border-b-2 border-blue-600 pb-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 rounded">
                                    {options.confidentialityLevel}
                                  </span>
                                  <h1 className="text-xl font-black text-slate-900 mt-1">
                                    {input.role.value}
                                  </h1>
                                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 mt-1">
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
                              <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div>
                                  <div className="font-bold text-slate-900">Presented To:</div>
                                  <div className="text-slate-700">{options.hiringManagerName}</div>
                                  <div className="text-[10px] text-slate-400">{options.hiringManagerTitle}</div>
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900">Department:</div>
                                  <div className="text-slate-700">{options.department}</div>
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900">Prepared By:</div>
                                  <div className="text-slate-700">{options.talentLeadName}</div>
                                  <div className="text-[10px] text-slate-400">Talent Intelligence</div>
                                </div>
                              </div>
                            </div>

                            {/* Mandate */}
                            {options.customStakeholderNotes && (
                              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded text-[11px] text-slate-700">
                                <div className="font-bold text-indigo-900 mb-0.5">Strategic Calibration Mandate:</div>
                                <p className="italic leading-relaxed">{options.customStakeholderNotes}</p>
                              </div>
                            )}

                            {/* 4 Quick Tiles */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-center">
                                <div className="text-[9px] text-slate-500 uppercase font-bold">Addressable Pool</div>
                                <div className="text-sm font-bold text-slate-900 mt-0.5">
                                  {talentSupply.addressable.count.toLocaleString()}
                                </div>
                              </div>
                              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-center">
                                <div className="text-[9px] text-slate-500 uppercase font-bold">Active Searchers</div>
                                <div className="text-sm font-bold text-emerald-600 mt-0.5">
                                  {talentSupply.active.count.toLocaleString()}
                                </div>
                              </div>
                              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-center">
                                <div className="text-[9px] text-slate-500 uppercase font-bold">Median Base</div>
                                <div className="text-sm font-bold text-blue-600 mt-0.5">
                                  ${compensationIntelligence.baseSalary.p50.toLocaleString()}
                                </div>
                              </div>
                              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-center">
                                <div className="text-[9px] text-slate-500 uppercase font-bold">Est. Time-to-Fill</div>
                                <div className="text-sm font-bold text-indigo-600 mt-0.5">
                                  {recruitingDifficultyScore.expectedTimeToFillDays} Days
                                </div>
                              </div>
                            </div>

                            {/* Executive Summary Narrative */}
                            <div className="space-y-1.5">
                              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-800">
                                Labor Market Assessment & Executive Summary
                              </div>
                              <p className="text-[11px] text-slate-600 leading-relaxed">
                                {executiveSummary.executiveBriefNarrative}
                              </p>
                            </div>

                            {/* Key Recruiting Takeaways */}
                            {executiveRecruitingBrief?.keyTakeaways && executiveRecruitingBrief.keyTakeaways.length > 0 && (
                              <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-200 rounded">
                                <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider text-slate-800">
                                  Critical Search Priorities & Strategic Focus
                                </div>
                                <ul className="space-y-1 text-[11px] text-slate-600">
                                  {executiveRecruitingBrief.keyTakeaways.map((item, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <span className="text-blue-600 font-bold">•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Target Companies & Adjacent Pools */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                                <div className="font-bold text-slate-900 mb-1">Target Poaching Employers:</div>
                                <div className="flex flex-wrap gap-1">
                                  {(executiveSummary.top10TargetCompanies || ['Meta', 'Stripe', 'Google', 'Databricks']).slice(0, 6).map((c, i) => (
                                    <span key={i} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-700">
                                      {c}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                                <div className="font-bold text-slate-900 mb-1">High-Yield Adjacent Pools:</div>
                                <div className="flex flex-wrap gap-1">
                                  {(executiveSummary.best5AdjacentTalentPools || ['Distributed Databases', 'Fintech Trading Systems']).map((p, i) => (
                                    <span key={i} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-indigo-700">
                                      {p}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* ================= PAGE 2: COMPENSATION & COMPETITORS ================= */}
                        {currentPage.type === 'compensation' && (
                          <div className="space-y-5">
                            {options.includeCompensation && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800">
                                    Compensation Market Benchmarks (USD)
                                  </h3>
                                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    {compensationIntelligence.marketPosition}
                                  </span>
                                </div>
                                <div className="border border-slate-200 rounded overflow-hidden">
                                  <table className="w-full text-left text-[11px]">
                                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                                      <tr>
                                        <th className="p-2">Percentile Band</th>
                                        <th className="p-2">Base Salary</th>
                                        <th className="p-2">Market Context</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 text-slate-600">
                                      <tr>
                                        <td className="p-2 font-medium text-slate-900">25th Percentile (P25)</td>
                                        <td className="p-2 font-bold text-slate-900">${compensationIntelligence.baseSalary.p25.toLocaleString()}</td>
                                        <td className="p-2">Entry threshold; non-metro or junior scope</td>
                                      </tr>
                                      <tr className="bg-blue-50/50">
                                        <td className="p-2 font-bold text-blue-900">50th Percentile (P50 - Median)</td>
                                        <td className="p-2 font-bold text-blue-900">${compensationIntelligence.baseSalary.p50.toLocaleString()}</td>
                                        <td className="p-2 font-medium text-blue-900">Target median for verified production experience</td>
                                      </tr>
                                      <tr>
                                        <td className="p-2 font-medium text-slate-900">75th Percentile (P75)</td>
                                        <td className="p-2 font-bold text-slate-900">${compensationIntelligence.baseSalary.p75.toLocaleString()}</td>
                                        <td className="p-2">Competitive tier required to poach from Tier-1 tech</td>
                                      </tr>
                                      <tr>
                                        <td className="p-2 font-medium text-slate-900">90th Percentile (P90)</td>
                                        <td className="p-2 font-bold text-slate-900">${compensationIntelligence.baseSalary.p90.toLocaleString()}</td>
                                        <td className="p-2">Top-tier hyperscaler / AI research compensation</td>
                                      </tr>
                                      {input.compensationTarget?.min && (
                                        <tr className="bg-emerald-50/60 font-semibold text-emerald-900">
                                          <td className="p-2">Client Target Budget</td>
                                          <td className="p-2 font-bold">
                                            ${input.compensationTarget.min.toLocaleString()} - ${input.compensationTarget.max?.toLocaleString()}
                                          </td>
                                          <td className="p-2 text-emerald-800">Approved hiring authority bracket</td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {options.includeCompetitors && (
                              <div className="space-y-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                  Competitive Employer Landscape & Poaching Hooks
                                </h3>
                                <div className="border border-slate-200 rounded overflow-hidden">
                                  <table className="w-full text-left text-[11px]">
                                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                                      <tr>
                                        <th className="p-2 w-14">Tier</th>
                                        <th className="p-2">Target Company</th>
                                        <th className="p-2">Activity</th>
                                        <th className="p-2">Presence</th>
                                        <th className="p-2">Actionable Poaching Hook</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 text-slate-600">
                                      {(competitiveEmployerLandscape && competitiveEmployerLandscape.length > 0
                                        ? competitiveEmployerLandscape
                                        : [
                                            { tier: 'Tier 1', name: 'Meta / Infrastructure', hiringActivity: 'High', geographicPresence: 'Austin / Remote', poachingAngle: 'Offer direct RFC autonomy and reduce review bureaucracy.' },
                                            { tier: 'Tier 1', name: 'Google Cloud Platform', hiringActivity: 'Moderate', geographicPresence: 'Austin / Sunnyvale', poachingAngle: 'High equity upside and senior architecture impact.' },
                                            { tier: 'Tier 2', name: 'Datadog / Confluent', hiringActivity: 'High', geographicPresence: 'Remote', poachingAngle: 'Competitive base compensation and zero RTO restrictions.' },
                                          ]
                                      ).map((comp, idx) => (
                                        <tr key={idx}>
                                          <td className="p-2 font-bold text-slate-900">{comp.tier}</td>
                                          <td className="p-2 font-bold text-slate-800">{comp.name}</td>
                                          <td className="p-2">
                                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                                              {comp.hiringActivity}
                                            </span>
                                          </td>
                                          <td className="p-2 text-slate-600">{comp.geographicPresence}</td>
                                          <td className="p-2 text-slate-700 font-medium">{comp.poachingAngle}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* ================= PAGE 3: CALIBRATION & SCREENING ================= */}
                        {currentPage.type === 'calibration' && (
                          <div className="space-y-5">
                            {options.includeCalibrationMatrix && (
                              <div className="space-y-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-800">
                                  Hiring Team Calibration Rubric (Pass/Fail Signals)
                                </h3>
                                <div className="border border-slate-200 rounded overflow-hidden">
                                  <table className="w-full text-left text-[11px]">
                                    <thead className="bg-indigo-50 text-indigo-900 font-semibold border-b border-slate-200">
                                      <tr>
                                        <th className="p-2 w-1/4">Evaluation Domain</th>
                                        <th className="p-2 w-3/8 text-emerald-800">Positive Signals (Pass)</th>
                                        <th className="p-2 w-3/8 text-rose-800">Red Flags (Fail)</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 text-[10.5px]">
                                      <tr>
                                        <td className="p-2 font-bold text-slate-900">
                                          Core Architecture & Craft (30%)
                                        </td>
                                        <td className="p-2 text-emerald-700">
                                          Clear latency vs memory trade-offs; modular design; deep understanding of thread concurrency and data consistency.
                                        </td>
                                        <td className="p-2 text-rose-700">
                                          Relies on framework magic without understanding underlying OS/network runtime mechanics.
                                        </td>
                                      </tr>
                                      <tr className="bg-slate-50/50">
                                        <td className="p-2 font-bold text-slate-900">
                                          Distributed Scale & Triage (25%)
                                        </td>
                                        <td className="p-2 text-emerald-700">
                                          Deep telemetry mastery, post-mortem hygiene, handles cascading failures and P99 latency spikes systematically.
                                        </td>
                                        <td className="p-2 text-rose-700">
                                          Views reliability as purely an operations/SRE responsibility; ignores edge failover paths.
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="p-2 font-bold text-slate-900">
                                          Technical Influence & RFCs (25%)
                                        </td>
                                        <td className="p-2 text-emerald-700">
                                          Builds cross-functional architectural alignment; writes rigorous design RFCs; mentors staff engineers.
                                        </td>
                                        <td className="p-2 text-rose-700">
                                          Territorial design mindset; unable to take critical feedback or compromise on pragmatic milestones.
                                        </td>
                                      </tr>
                                      <tr className="bg-slate-50/50">
                                        <td className="p-2 font-bold text-slate-900">
                                          High Agency & Execution (20%)
                                        </td>
                                        <td className="p-2 text-emerald-700">
                                          Thrives amidst ambiguous roadmaps; clarifies unstated assumptions; delivers resilient production software.
                                        </td>
                                        <td className="p-2 text-rose-700">
                                          Paralysis by analysis; waits for detailed specs before taking architectural action.
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {options.includeScreenQuestions && (
                              <div className="space-y-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                                  High-Signal Recruiter & Hiring Manager Screening Questions
                                </h3>
                                <div className="space-y-2 text-[11px]">
                                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                                    <div className="font-bold text-slate-900">
                                      1. "Walk me through the most severe distributed systems bottleneck or outage you personally diagnosed in production."
                                    </div>
                                    <div className="text-slate-600 mt-1">
                                      <strong>Target Signal:</strong> Verifies real operational scars vs theoretical knowledge. Listen for metric-driven triage (p99 tail latencies, trace sampling, root cause mitigation).
                                    </div>
                                  </div>
                                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                                    <div className="font-bold text-slate-900">
                                      2. "Describe an architectural decision where you consciously chose technical debt to meet a mission-critical deadline."
                                    </div>
                                    <div className="text-slate-600 mt-1">
                                      <strong>Target Signal:</strong> Tests pragmatic engineering judgment vs dogmatic idealism. Great candidates articulate repayment timelines and risk bounds.
                                    </div>
                                  </div>
                                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                                    <div className="font-bold text-slate-900">
                                      3. "How have you navigated severe architectural disagreements between principal engineers during an RFC review?"
                                    </div>
                                    <div className="text-slate-600 mt-1">
                                      <strong>Target Signal:</strong> High emotional quotient, constructive debate synthesis, and organizational influence without authority.
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* ================= PAGE 4 / FINAL: GOVERNANCE, LEVELING & SIGN-OFF ================= */}
                        {currentPage.type === 'governance' && (
                          <div className="space-y-5">
                            {options.includeLeveling && (
                              <div className="space-y-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                                  Corporate Leveling & Grade Nuance
                                </h3>
                                <div className="border border-slate-200 rounded overflow-hidden">
                                  <table className="w-full text-left text-[11px]">
                                    <thead className="bg-amber-50/60 text-amber-900 font-semibold border-b border-slate-200">
                                      <tr>
                                        <th className="p-2 w-28">Internal Grade</th>
                                        <th className="p-2 w-32">Scope of Impact</th>
                                        <th className="p-2">Expected Autonomy & Ownership</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 text-slate-700">
                                      <tr>
                                        <td className="p-2 font-bold text-slate-900">Senior IC (L5)</td>
                                        <td className="p-2 font-medium">Single Team / Complex Service</td>
                                        <td className="p-2">Autonomous feature delivery, code review excellence, and team mentorship.</td>
                                      </tr>
                                      <tr className="bg-blue-50/50">
                                        <td className="p-2 font-bold text-blue-900">Staff IC (L6 - Target)</td>
                                        <td className="p-2 font-bold text-blue-900">Multi-Team / Domain Wide</td>
                                        <td className="p-2 font-medium text-blue-900">Sets multi-quarter architecture roadmaps, unblocks adjacent engineering squads.</td>
                                      </tr>
                                      <tr>
                                        <td className="p-2 font-bold text-slate-900">Principal IC (L7)</td>
                                        <td className="p-2 font-medium">Org-Wide / Company Level</td>
                                        <td className="p-2">Defines enterprise-wide technology strategy, executive advisory, industry leadership.</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {options.includeRisks && (
                              <div className="space-y-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                                  Recruiting Risks & Mitigation Playbook
                                </h3>
                                <div className="border border-slate-200 rounded overflow-hidden">
                                  <table className="w-full text-left text-[11px]">
                                    <thead className="bg-rose-50/60 text-rose-900 font-semibold border-b border-slate-200">
                                      <tr>
                                        <th className="p-2 w-20">Severity</th>
                                        <th className="p-2 w-1/3">Identified Risk Factor</th>
                                        <th className="p-2">Tactical Mitigation Strategy</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 text-slate-700">
                                      <tr>
                                        <td className="p-2 font-bold text-rose-600">HIGH</td>
                                        <td className="p-2 font-medium">Aggressive counter-offers from Big Tech incumbents</td>
                                        <td className="p-2">Pre-close early on autonomy, direct impact, and custom equity acceleration vesting.</td>
                                      </tr>
                                      <tr>
                                        <td className="p-2 font-bold text-amber-600">MEDIUM</td>
                                        <td className="p-2 font-medium">Long interview loops causing candidate drop-off</td>
                                        <td className="p-2">Cap total interview loop at 3 rounds; guarantee written decision within 48 hours.</td>
                                      </tr>
                                      <tr>
                                        <td className="p-2 font-bold text-amber-600">MEDIUM</td>
                                        <td className="p-2 font-medium">Unvested equity handcuffs (1-2 year cliffs)</td>
                                        <td className="p-2">Structure upfront sign-on bonus tranches to bridge candidate's unvested equity gap.</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {options.includeClosingStrategy && (
                              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded text-[11px] text-slate-700">
                                <div className="font-bold text-emerald-900 mb-0.5">Candidate Closing Strategy & Value Proposition:</div>
                                <p className="leading-relaxed">
                                  {executiveRecruitingBrief?.closingStrategy ||
                                    'Sell technical ownership, greenfield platform scaling, and direct visibility with executive leadership over corporate bureaucracy.'}
                                </p>
                              </div>
                            )}

                            {/* Formal Stakeholder Sign-Off Block */}
                            <div className="pt-4 border-t-2 border-slate-300">
                              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                                Search Alignment & Governance Sign-Off
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px] text-slate-600">
                                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Hiring Manager Approval</div>
                                  <div className="font-bold text-slate-900 mt-1">{options.hiringManagerName}</div>
                                  <div className="text-[10px] text-slate-500">{options.hiringManagerTitle}</div>
                                  <div className="mt-2 text-[10px] text-slate-400 border-t border-slate-200 pt-1">
                                    Signature: ___________________
                                  </div>
                                </div>
                                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Talent Intelligence Lead</div>
                                  <div className="font-bold text-slate-900 mt-1">{options.talentLeadName}</div>
                                  <div className="text-[10px] text-slate-500">Talent Acquisition Lead</div>
                                  <div className="mt-2 text-[10px] text-slate-400 border-t border-slate-200 pt-1">
                                    Signature: ___________________
                                  </div>
                                </div>
                                <div className="p-2.5 bg-emerald-50/50 border border-emerald-200 rounded flex flex-col justify-between">
                                  <div>
                                    <div className="text-[10px] text-emerald-800 uppercase font-bold">Search Kickoff Status</div>
                                    <div className="text-xs font-black text-emerald-700 mt-0.5">CALIBRATION APPROVED</div>
                                  </div>
                                  <div className="text-[10px] text-emerald-700">
                                    Active Search Kickoff: {new Date(report.createdAt || Date.now()).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Document Sheet Footer */}
                      <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-[9px] text-slate-400 uppercase font-medium">
                        <span>TalentIQ Enterprise Intelligence Platform • Confidential</span>
                        <span>Sheet {currentPage.pageIndex} of {currentPage.totalPages}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
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
