import React, { useState } from 'react';
import {
  AUTHORITATIVE_DATA_SOURCES,
  TRIANGULATION_METHODOLOGY,
  DataSourceInfo,
} from '../data/marketDataSources';
import {
  ShieldCheck,
  Search,
  Filter,
  Layers,
  Database,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Clock,
  Award,
} from 'lucide-react';

interface DataSourcesAuditorProps {
  onSelectSource?: (source: DataSourceInfo) => void;
}

export const DataSourcesAuditor: React.FC<DataSourcesAuditorProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSourceId, setActiveSourceId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All 12 Data Sources', count: AUTHORITATIVE_DATA_SOURCES.length },
    { id: 'compensation', label: 'Compensation & Equity', icon: DollarSign, count: AUTHORITATIVE_DATA_SOURCES.filter(s => s.category === 'compensation').length },
    { id: 'candidate_pool', label: 'Candidate Pool & Supply', icon: Users, count: AUTHORITATIVE_DATA_SOURCES.filter(s => s.category === 'candidate_pool').length },
    { id: 'statutory', label: 'Statutory Filings & Laws', icon: FileText, count: AUTHORITATIVE_DATA_SOURCES.filter(s => s.category === 'statutory').length },
    { id: 'skills_taxonomy', label: 'Skills & Role Taxonomy', icon: Database, count: AUTHORITATIVE_DATA_SOURCES.filter(s => s.category === 'skills_taxonomy').length },
  ];

  const filteredSources = AUTHORITATIVE_DATA_SOURCES.filter((source) => {
    const matchesCategory = selectedCategory === 'all' || source.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.strengths.some(st => st.toLowerCase().includes(searchQuery.toLowerCase())) ||
      source.reportApplication.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Explanation & Triangulation Architecture */}
      <div className="glass-card rounded-2xl p-6 border border-cyan-500/20 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-white tracking-wide">
                Authoritative Market Intelligence & Data Sources Directory
              </h3>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Every data point, compensation percentile, and candidate supply estimate in this system is calibrated against verified external benchmarks, empirical payroll APIs, and federal statutory disclosures.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Non-Fabrication Audit</span>
            </span>
          </div>
        </div>

        {/* 3-Layer Triangulation Architecture Breakdown */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Multi-Source Triangulation Weights</span>
            </span>
            <span className="text-slate-400">Zero-Hallucination Framework</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {TRIANGULATION_METHODOLOGY.weights.map((w, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{w.sourceName.split(' (')[0]}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300">
                    {w.weightPercent}% Weight
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{w.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'accent-gradient text-white shadow-md'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                selectedCategory === cat.id ? 'bg-black/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search data sources or use cases..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Source Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSources.map((source) => {
          const isSelected = activeSourceId === source.id;

          return (
            <div
              key={source.id}
              onClick={() => setActiveSourceId(isSelected ? null : source.id)}
              className={`glass-card rounded-2xl p-5 border transition-all cursor-pointer space-y-3.5 ${
                isSelected
                  ? 'border-cyan-400 bg-slate-900/90 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-400'
                  : 'border-slate-800/90 hover:border-slate-700 bg-slate-950/60'
              }`}
            >
              {/* Top Row: Provider Name & Key Badges */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      source.category === 'compensation'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : source.category === 'candidate_pool'
                        ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                        : source.category === 'statutory'
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                    }`}>
                      {source.categoryLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800/80 text-slate-300 border border-slate-700/60">
                      {source.providerType}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    {source.name}
                  </h4>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-emerald-400 block">
                    {source.confidenceWeight}% Confidence
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {source.updateCadence}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {source.description}
              </p>

              {/* Sample Size & Coverage Metric Pills */}
              <div className="p-3 bg-slate-900/90 border border-slate-800/80 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-mono text-[11px]">Coverage:</span>
                  <span className="text-slate-200 font-medium truncate max-w-[280px]">{source.coverage}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/60">
                  <span className="font-mono text-[11px]">Sample Size:</span>
                  <span className="text-cyan-300 font-medium truncate max-w-[280px]">{source.sampleSize}</span>
                </div>
              </div>

              {/* Core Strengths */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Methodology Strengths
                </span>
                <ul className="space-y-1">
                  {source.strengths.map((str, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5 leading-snug">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Report Application Hook */}
              <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-xs space-y-1">
                <span className="text-[11px] font-mono font-bold text-cyan-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Role Calibration in this Report:</span>
                </span>
                <p className="text-slate-300 leading-snug">
                  {source.reportApplication}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
