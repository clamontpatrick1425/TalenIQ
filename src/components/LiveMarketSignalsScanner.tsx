import React, { useState, useEffect } from 'react';
import { TalentMapReport } from '../types';
import {
  Globe,
  Radio,
  RefreshCw,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Building,
  DollarSign,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Target,
  ArrowUpRight,
  ShieldAlert,
  Flame,
} from 'lucide-react';

interface LiveSignal {
  source: string;
  title: string;
  summary: string;
  category: 'RTO Mandate' | 'Compensation Shift' | 'Layoff / Outflow' | 'Hiring Surge';
  impact: 'High' | 'Medium' | 'Low';
  actionableTactic: string;
}

interface DonorVulnerability {
  company: string;
  vulnerabilityReason: string;
  poachingResistanceScore: number;
  recommendedOutreachHook: string;
}

interface MarketScanData {
  scannedAt: string;
  role: string;
  metro: string;
  marketLiquidityStatus: string;
  averageTimeToFillDays: number;
  liveSignals: LiveSignal[];
  donorCompanyVulnerabilities: DonorVulnerability[];
  salaryMovement: {
    trend: string;
    p50MedianTotalComp: string;
    p75TotalComp: string;
    p90TotalComp: string;
  };
  executiveTakeaways: string[];
}

interface LiveMarketSignalsScannerProps {
  report: TalentMapReport;
  className?: string;
}

export const LiveMarketSignalsScanner: React.FC<LiveMarketSignalsScannerProps> = ({
  report,
  className = '',
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanData, setScanData] = useState<MarketScanData | null>(null);
  const [isLiveGrounded, setIsLiveGrounded] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const executeLiveScan = async () => {
    setIsScanning(true);
    try {
      const response = await fetch('/api/scan-live-market-signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: report.input.role.value,
          location: report.input.geography.location,
          targetCompanies: report.targetCompanies.map((c) => c.company),
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setScanData(json.data);
        setIsLiveGrounded(!!json.isLiveWebGrounded);
      }
    } catch (err) {
      console.warn('Failed to fetch live scan signals:', err);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    executeLiveScan();
  }, [report.input.role.value, report.input.geography.location]);

  const filteredSignals = scanData?.liveSignals.filter((signal) => {
    if (selectedCategory === 'ALL') return true;
    return signal.category === selectedCategory;
  }) || [];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. Header Banner with Live Telemetry & Refresh */}
      <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Live Web Market Intelligence Scanner</span>
              </span>

              {isLiveGrounded ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <Globe className="w-3 h-3 text-emerald-400" />
                  <span>Google Search Grounded</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  <span>Calibrated Labor Index</span>
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              Real-Time Labor Market Signals & Outflow Corridors
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Scanning live web feeds, public SEC filings, Levels.fyi/Radford compensation shifts, and competitor return-to-office mandates for{' '}
              <strong className="text-white font-semibold">{report.input.role.value}</strong> in{' '}
              <strong className="text-cyan-300 font-semibold">{report.input.geography.location}</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={executeLiveScan}
            disabled={isScanning}
            className="self-start md:self-center px-4 py-2.5 rounded-xl text-xs font-bold font-mono accent-gradient accent-gradient-hover text-white shadow-lg glow flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Live Web...' : 'Refresh Live Signals'}</span>
          </button>
        </div>

        {/* Live Meta Strip */}
        {scanData && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3 text-slate-400">
              <span>Last Scanned: <strong className="text-slate-200">{new Date(scanData.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
              <span>•</span>
              <span>Liquidity Status: <strong className="text-emerald-400">{scanData.marketLiquidityStatus}</strong></span>
              <span>•</span>
              <span>Est. TTF: <strong className="text-cyan-400">{scanData.averageTimeToFillDays} Days</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Comp Velocity:</span>
              <span className="text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                {scanData.salaryMovement.trend}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Executive Market Takeaways Strip */}
      {scanData && scanData.executiveTakeaways.length > 0 && (
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Executive Sourcing Summary & Poaching Angles</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {scanData.executiveTakeaways.map((takeaway, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-snug flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  0{idx + 1}
                </span>
                <span>{takeaway}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'RTO Mandate', 'Compensation Shift', 'Hiring Surge', 'Layoff / Outflow'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 glow-dot-cyan'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {cat === 'ALL' ? 'All Live Signals' : cat}
          </button>
        ))}
      </div>

      {/* 4. Live Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSignals.map((signal, idx) => (
          <div
            key={idx}
            className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-cyan-500/40 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    signal.category === 'RTO Mandate'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : signal.category === 'Compensation Shift'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : signal.category === 'Hiring Surge'
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                  }`}
                >
                  {signal.category}
                </span>

                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    signal.impact === 'High'
                      ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30'
                      : 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                  }`}
                >
                  {signal.impact} Market Impact
                </span>
              </div>

              <h4 className="text-sm font-bold text-white leading-snug">{signal.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{signal.summary}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-xs">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">
                  Tactical Sourcing Recommendation:
                </span>
                <span className="text-slate-200">{signal.actionableTactic}</span>
              </div>

              <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span>Source: {signal.source}</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Competitor Donor Vulnerability Matrix */}
      {scanData && scanData.donorCompanyVulnerabilities.length > 0 && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-cyan-400" />
              <span>Competitor Poaching Vulnerability Heatmap</span>
            </h4>
            <span className="text-xs font-mono text-slate-400">Target Donor Organizations</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {scanData.donorCompanyVulnerabilities.map((donor, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span className="truncate">{donor.company}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        donor.poachingResistanceScore < 45
                          ? 'text-emerald-300 bg-emerald-500/20'
                          : 'text-amber-300 bg-amber-500/20'
                      }`}
                    >
                      {donor.poachingResistanceScore < 45 ? 'High Outflow' : 'Moderate'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {donor.vulnerabilityReason}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-cyan-300">
                  <strong className="text-[10px] uppercase font-mono block text-slate-500">Outreach Hook:</strong>
                  {donor.recommendedOutreachHook}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
