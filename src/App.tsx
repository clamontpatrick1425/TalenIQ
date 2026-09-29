import React, { useState, useEffect } from 'react';
import { TalentMapInput, TalentMapReport, JDSourceInfo } from './types';
import { SAMPLE_JD_PRESETS } from './data/sampleJDs';
import { generateSynthesizedTalentMap, parseJDHeuristically } from './services/talentIntelligenceEngine';
import { IntakeView } from './components/IntakeView';
import { TalentDashboardView } from './components/TalentDashboardView';
import { ReportSectionsView } from './components/ReportSectionsView';
import { ExecutiveBriefView } from './components/ExecutiveBriefView';
import { SourcingSearchStation } from './components/SourcingSearchStation';
import { TalentCopilotDrawer } from './components/TalentCopilotDrawer';
import { ExportCenterModal } from './components/ExportCenterModal';
import { CandidateOutreachStudio } from './components/CandidateOutreachStudio';
import { MarketInsightsView } from './components/MarketInsightsView';
import { CandidateTracker } from './components/CandidateTracker';
import { SourcingPlanView } from './components/SourcingPlanView';
import { AutoSaveIndicator } from './components/AutoSaveIndicator';
import {
  saveReportToStorage,
  loadReportFromStorage,
  saveNavigationStateToStorage,
  loadNavigationStateFromStorage,
  clearAllAutoSavedData,
} from './services/storageService';
import {
  FileText,
  Activity,
  Search,
  ShieldCheck,
  Bot,
  Sun,
  Moon,
  Contrast,
  Eye,
  Sparkles,
  Layers,
  ChevronRight,
  Printer,
  RefreshCw,
  Cpu,
  CheckCircle2,
  Share2,
  Send,
  Terminal,
  TrendingUp,
  Users,
  ClipboardList,
  Target,
} from 'lucide-react';

type ActiveTab = 'intake' | 'dashboard' | 'insights' | 'report' | 'sourcing' | 'executive';

export default function App() {
  // Restore saved navigation or fallback to dashboard
  const savedNav = typeof window !== 'undefined' ? loadNavigationStateFromStorage() : null;
  const [activeTab, setActiveTab] = useState<ActiveTab>(savedNav?.activeTab || 'dashboard');
  const [sourcingSubTab, setSourcingSubTab] = useState<'search' | 'tracker' | 'outreach' | 'plan'>(
    savedNav?.sourcingSubTab || 'search'
  );
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isAutoSaving, setIsAutoSaving] = useState<boolean>(false);

  // Restore saved report from localStorage or generate from default preset
  const [report, setReport] = useState<TalentMapReport | null>(() => {
    const saved = loadReportFromStorage();
    if (saved && saved.id) {
      return saved;
    }
    try {
      const defaultPreset = SAMPLE_JD_PRESETS[0];
      const parsed = parseJDHeuristically(defaultPreset.jdText, `${defaultPreset.title}.txt`);
      return generateSynthesizedTalentMap(parsed, {
        method: 'preset',
        presetId: defaultPreset.id,
        fileName: `${defaultPreset.title}.txt`,
      });
    } catch {
      return null;
    }
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  type ThemeMode = 'dark' | 'light' | 'high-contrast';
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('talentiq-theme');
      if (saved === 'dark' || saved === 'light' || saved === 'high-contrast') return saved as ThemeMode;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark';
  });

  // Sync theme with DOM and localStorage
  useEffect(() => {
    localStorage.setItem('talentiq-theme', theme);
    document.documentElement.classList.remove('light', 'dark', 'high-contrast');
    document.body.classList.remove('light', 'dark', 'high-contrast');

    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.body.classList.add('light');
    } else if (theme === 'high-contrast') {
      document.documentElement.classList.add('high-contrast');
      document.body.classList.add('high-contrast');
    } else {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    }
  }, [theme]);

  // Auto-save active report whenever it changes
  useEffect(() => {
    if (report) {
      setIsAutoSaving(true);
      saveReportToStorage(report);
      const timer = setTimeout(() => setIsAutoSaving(false), 400);
      return () => clearTimeout(timer);
    }
  }, [report]);

  // Auto-save navigation tabs
  useEffect(() => {
    saveNavigationStateToStorage({
      activeTab,
      sourcingSubTab,
      lastUpdated: new Date().toISOString(),
    });
  }, [activeTab, sourcingSubTab]);

  // Periodic background auto-save sync (every 10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (report) {
        saveReportToStorage(report);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [report]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleManualSave = () => {
    setIsAutoSaving(true);
    if (report) {
      saveReportToStorage(report);
    }
    saveNavigationStateToStorage({
      activeTab,
      sourcingSubTab,
      lastUpdated: new Date().toISOString(),
    });
    setTimeout(() => setIsAutoSaving(false), 400);
  };

  const handleResetWorkspace = () => {
    clearAllAutoSavedData();
    const defaultPreset = SAMPLE_JD_PRESETS[0];
    const parsed = parseJDHeuristically(defaultPreset.jdText, `${defaultPreset.title}.txt`);
    const fallbackReport = generateSynthesizedTalentMap(parsed, {
      method: 'preset',
      presetId: defaultPreset.id,
      fileName: `${defaultPreset.title}.txt`,
    });
    setReport(fallbackReport);
    setActiveTab('dashboard');
    setSourcingSubTab('search');
  };

  // Handle report generation from IntakeView
  const handleGenerateReport = async (input: TalentMapInput, source: JDSourceInfo) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-talent-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, sourceInfo: source }),
      });
      const data = await response.json();
      if (data.success && data.report) {
        setReport(data.report);
        saveReportToStorage(data.report);
        setActiveTab('dashboard');
        return;
      }
    } catch (err) {
      console.warn('Network call failed, falling back to local synthesis engine:', err);
    } finally {
      setIsGenerating(false);
    }

    // Local synthesis fallback ensures zero downtime
    const fallbackReport = generateSynthesizedTalentMap(input, source);
    setReport(fallbackReport);
    saveReportToStorage(fallbackReport);
    setActiveTab('dashboard');
  };

  return (
    <div className={`min-h-screen gradient-bg ${theme} ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} font-sans antialiased flex flex-col selection:bg-indigo-500 selection:text-white`}>
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-2.5">
            <span className="text-xl font-bold tracking-tight text-white">
              TalentIQ
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-cyan-400/90 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 glow-dot-cyan"></span>
              Market Intelligence Platform
            </span>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-xs font-semibold backdrop-blur-md">
            <button
              id="nav-tab-intake"
              onClick={() => setActiveTab('intake')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'intake'
                  ? 'accent-gradient text-white glow font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Intake Engine</span>
            </button>

            <button
              id="nav-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'accent-gradient text-white glow font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Talent Dashboard</span>
            </button>

            <button
              id="nav-tab-insights"
              onClick={() => setActiveTab('insights')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'insights'
                  ? 'accent-gradient text-white glow font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Market Insights</span>
            </button>

            <button
              id="nav-tab-report"
              onClick={() => setActiveTab('report')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'report'
                  ? 'accent-gradient text-white glow font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Talent Market Map</span>
            </button>

            <button
              id="nav-tab-sourcing"
              onClick={() => setActiveTab('sourcing')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'sourcing'
                  ? 'accent-gradient text-white glow font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Sourcing War Room</span>
            </button>

            <button
              id="nav-tab-executive"
              onClick={() => setActiveTab('executive')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'executive'
                  ? 'accent-gradient text-white glow font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Executive Brief</span>
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2.5">
            {/* LocalStorage AutoSave Engine Indicator */}
            <AutoSaveIndicator
              onManualSave={handleManualSave}
              onResetWorkspace={handleResetWorkspace}
              isSaving={isAutoSaving}
            />

            {/* 3-Way Theme & Contrast Mode Switcher */}
            <div className="flex items-center p-0.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs shadow-inner">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                title="Dark Mode"
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-600'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('light')}
                title="Light Mode (Crisp White)"
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('high-contrast')}
                title="High Contrast Mode (WCAG AAA - Ultra Sharp)"
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  theme === 'high-contrast'
                    ? 'bg-black text-cyan-300 shadow-sm border-2 border-cyan-400 font-bold ring-1 ring-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Contrast className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">Contrast</span>
              </button>
            </div>

            {/* Export & Distribution Center Button */}
            {report && (
              <button
                id="btn-open-export"
                onClick={() => setIsExportOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-xl text-xs font-bold transition-all cursor-pointer hover:border-cyan-500/50"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export / Share</span>
              </button>
            )}

            {/* Recruiter Copilot Button */}
            <button
              id="btn-open-copilot"
              onClick={() => setIsCopilotOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer glow-subtle hover:border-indigo-400/60"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Recruiter Copilot</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 glow-dot"></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex md:hidden overflow-x-auto px-4 py-2.5 border-t border-slate-800/80 bg-slate-950/70 gap-1.5 text-xs">
          <button
            onClick={() => setActiveTab('intake')}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all ${
              activeTab === 'intake' ? 'accent-gradient text-white glow font-bold' : 'text-slate-400'
            }`}
          >
            Intake
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all ${
              activeTab === 'dashboard' ? 'accent-gradient text-white glow font-bold' : 'text-slate-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all ${
              activeTab === 'insights' ? 'accent-gradient text-white glow font-bold' : 'text-slate-400'
            }`}
          >
            Market Insights
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all ${
              activeTab === 'report' ? 'accent-gradient text-white glow font-bold' : 'text-slate-400'
            }`}
          >
            Talent Map
          </button>
          <button
            onClick={() => setActiveTab('sourcing')}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all ${
              activeTab === 'sourcing' ? 'accent-gradient text-white glow font-bold' : 'text-slate-400'
            }`}
          >
            Sourcing
          </button>
          <button
            onClick={() => setActiveTab('executive')}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all ${
              activeTab === 'executive' ? 'accent-gradient text-white glow font-bold' : 'text-slate-400'
            }`}
          >
            Executive Brief
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'intake' && (
          <IntakeView
            onGenerateReport={handleGenerateReport}
            isGenerating={isGenerating}
          />
        )}

        {activeTab === 'dashboard' && report && (
          <TalentDashboardView
            report={report}
            onNavigateToIntake={() => setActiveTab('intake')}
          />
        )}

        {activeTab === 'insights' && report && (
          <MarketInsightsView report={report} />
        )}

        {activeTab === 'report' && report && (
          <ReportSectionsView report={report} />
        )}

        {activeTab === 'sourcing' && report && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <span className="text-xs uppercase font-mono font-bold tracking-widest text-cyan-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 glow-dot-cyan"></span>
                  Talent Discovery Engine · Sections 14 & 15
                </span>
                <h1 className="text-2xl font-bold text-white mt-1">
                  Candidate Sourcing War Room
                </h1>
              </div>

              {/* Sourcing Sub-tab Switcher */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl text-xs">
                <button
                  id="btn-subtab-search"
                  onClick={() => setSourcingSubTab('search')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    sourcingSubTab === 'search'
                      ? 'accent-gradient text-white glow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Boolean & X-Ray</span>
                </button>
                <button
                  id="btn-subtab-tracker"
                  onClick={() => setSourcingSubTab('tracker')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    sourcingSubTab === 'tracker'
                      ? 'accent-gradient text-white glow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Candidate Tracker</span>
                </button>
                <button
                  id="btn-subtab-outreach"
                  onClick={() => setSourcingSubTab('outreach')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    sourcingSubTab === 'outreach'
                      ? 'accent-gradient text-white glow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Outreach Studio</span>
                </button>
                <button
                  id="btn-subtab-plan"
                  onClick={() => setSourcingSubTab('plan')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    sourcingSubTab === 'plan'
                      ? 'accent-gradient text-white glow'
                      : 'text-cyan-400 hover:text-white bg-cyan-950/30 border border-cyan-500/30'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Recruiting Plan</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 glow-dot-cyan"></span>
                </button>
              </div>
            </div>

            {/* Quick Sourcing Plan Shortcut Banner */}
            {sourcingSubTab !== 'plan' && (
              <div className="p-3 bg-gradient-to-r from-indigo-950/50 via-cyan-950/40 to-slate-900/80 border border-cyan-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <ClipboardList className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    Need a complete execution plan? Generate and download the <strong className="text-white font-semibold">Detailed Sourcing & Recruiting Plan</strong> with calibrated funnel math, competitor poaching tiers, and weekly milestones.
                  </span>
                </div>
                <button
                  onClick={() => setSourcingSubTab('plan')}
                  className="px-3.5 py-1.5 rounded-lg accent-gradient text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 glow hover:scale-[1.02]"
                >
                  <span>Open Sourcing Plan (PDF / MD)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {sourcingSubTab === 'search' && (
              <SourcingSearchStation data={report.sourcingStrings} />
            )}
            {sourcingSubTab === 'tracker' && (
              <CandidateTracker
                report={report}
                onNavigateToOutreach={() => setSourcingSubTab('outreach')}
              />
            )}
            {sourcingSubTab === 'outreach' && (
              <CandidateOutreachStudio report={report} />
            )}
            {sourcingSubTab === 'plan' && (
              <SourcingPlanView
                report={report}
                onNavigateToTracker={() => setSourcingSubTab('tracker')}
                onNavigateToOutreach={() => setSourcingSubTab('outreach')}
              />
            )}
          </div>
        )}

        {activeTab === 'executive' && report && (
          <ExecutiveBriefView report={report} />
        )}
      </main>

      {/* Persistent AI Recruiter Copilot Floating Trigger */}
      {report && (
        <TalentCopilotDrawer
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          report={report}
        />
      )}

      {/* Export & Share Modal */}
      {report && (
        <ExportCenterModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          report={report}
        />
      )}

      {/* Sleek Status Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/90 py-5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6 text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 glow-dot"></span>
              <span className="text-white font-semibold">TalentIQ Enterprise</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline">Executive Market Intelligence Platform</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-mono uppercase tracking-wider text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Instance:</span>
              <span className="text-indigo-300 font-bold">US-EAST-1</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Latency:</span>
              <span className="text-cyan-400 font-bold">14ms</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 glow-dot-emerald"></span>
              <span className="text-emerald-400 font-bold">Model Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
