import React, { useState } from 'react';
import {
  Layers,
  FileText,
  Cpu,
  MapPin,
  Compass,
  Users,
  BarChart3,
  Search,
  Shuffle,
  Building2,
  TrendingUp,
  Target,
  ShieldBan,
  UserCheck,
  Terminal,
  HeartHandshake,
  DollarSign,
  AlertOctagon,
  ShieldAlert,
  CheckCircle2,
  FileSpreadsheet,
  Flame,
  Award,
  ShieldCheck,
  ChevronsDownUp,
  ChevronsUpDown,
  LayoutGrid,
  Rows3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export interface SectionNavMeta {
  id: number;
  domId: string;
  badge: string;
  title: string;
  shortTitle: string;
  category: 'role' | 'supply' | 'market' | 'sourcing' | 'comp' | 'exec';
  categoryLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgLight: string;
  badgeColor: string;
}

export const REPORT_SECTIONS_METADATA: SectionNavMeta[] = [
  { id: 1, domId: 'section-01-role-decomposition', badge: '01', title: 'Role Decomposition & Requirement Taxonomy', shortTitle: 'Role Taxonomy', category: 'role', categoryLabel: 'Role & Scope', icon: FileText, color: 'text-cyan-400', bgLight: 'bg-cyan-500/10 border-cyan-500/30', badgeColor: 'bg-cyan-500/20 text-cyan-300' },
  { id: 2, domId: 'section-02-core-competencies', badge: '02', title: 'Core Competencies & Skills Architecture', shortTitle: 'Skills Architecture', category: 'role', categoryLabel: 'Competencies', icon: Cpu, color: 'text-cyan-400', bgLight: 'bg-cyan-500/10 border-cyan-500/30', badgeColor: 'bg-cyan-500/20 text-cyan-300' },
  { id: 3, domId: 'section-03-geographic-market', badge: '03', title: 'Geographic Talent Density & Commute Corridors', shortTitle: 'Geographic Density', category: 'role', categoryLabel: 'Location', icon: MapPin, color: 'text-sky-400', bgLight: 'bg-sky-500/10 border-sky-500/30', badgeColor: 'bg-sky-500/20 text-sky-300' },
  { id: 4, domId: 'section-04-relocation-feasibility', badge: '04', title: 'Relocation Feasibility & Mobility Attractiveness', shortTitle: 'Relocation Feasibility', category: 'role', categoryLabel: 'Mobility', icon: Compass, color: 'text-sky-400', bgLight: 'bg-sky-500/10 border-sky-500/30', badgeColor: 'bg-sky-500/20 text-sky-300' },
  { id: 5, domId: 'section-05-talent-supply-funnel', badge: '05', title: 'Talent Supply Funnel Analysis', shortTitle: 'Supply Funnel', category: 'supply', categoryLabel: 'Supply', icon: Users, color: 'text-indigo-400', bgLight: 'bg-indigo-500/10 border-indigo-500/30', badgeColor: 'bg-indigo-500/20 text-indigo-300' },
  { id: 6, domId: 'section-06-talent-availability', badge: '06', title: 'Talent Availability Scoring & Scarcity Index', shortTitle: 'Availability Score', category: 'supply', categoryLabel: 'Availability', icon: BarChart3, color: 'text-indigo-400', bgLight: 'bg-indigo-500/10 border-indigo-500/30', badgeColor: 'bg-indigo-500/20 text-indigo-300' },
  { id: 7, domId: 'section-07-sourcing-channels', badge: '07', title: 'Sourcing Channel Effectiveness & ROI', shortTitle: 'Sourcing Channels', category: 'supply', categoryLabel: 'Channels', icon: Search, color: 'text-indigo-400', bgLight: 'bg-indigo-500/10 border-indigo-500/30', badgeColor: 'bg-indigo-500/20 text-indigo-300' },
  { id: 8, domId: 'section-08-skill-adjacency', badge: '08', title: 'Skill Adjacency & Profile Transferability Map', shortTitle: 'Skill Adjacency', category: 'supply', categoryLabel: 'Adjacency', icon: Shuffle, color: 'text-indigo-400', bgLight: 'bg-indigo-500/10 border-indigo-500/30', badgeColor: 'bg-indigo-500/20 text-indigo-300' },
  { id: 9, domId: 'section-09-company-landscape', badge: '09', title: 'Competitive Employer Landscape (Tiers 1-4)', shortTitle: 'Employer Landscape', category: 'market', categoryLabel: 'Market', icon: Building2, color: 'text-violet-400', bgLight: 'bg-violet-500/10 border-violet-500/30', badgeColor: 'bg-violet-500/20 text-violet-300' },
  { id: 10, domId: 'section-10-talent-movement', badge: '10', title: 'Talent Movement Flows & Cross-Company Migration', shortTitle: 'Talent Movement', category: 'market', categoryLabel: 'Migration', icon: TrendingUp, color: 'text-violet-400', bgLight: 'bg-violet-500/10 border-violet-500/30', badgeColor: 'bg-violet-500/20 text-violet-300' },
  { id: 11, domId: 'section-11-poaching-targets', badge: '11', title: 'Poaching Targets & Competitor Vulnerabilities', shortTitle: 'Poaching Targets', category: 'market', categoryLabel: 'Poaching', icon: Target, color: 'text-violet-400', bgLight: 'bg-violet-500/10 border-violet-500/30', badgeColor: 'bg-violet-500/20 text-violet-300' },
  { id: 12, domId: 'section-12-off-limits', badge: '12', title: 'Off-Limits & Excluded Organizations Policy', shortTitle: 'Off-Limits Policy', category: 'market', categoryLabel: 'Governance', icon: ShieldBan, color: 'text-rose-400', bgLight: 'bg-rose-500/10 border-rose-500/30', badgeColor: 'bg-rose-500/20 text-rose-300' },
  { id: 13, domId: 'section-13-candidate-archetypes', badge: '13', title: 'Candidate Archetypes & High-Conversion Outreach', shortTitle: 'Candidate Personas', category: 'sourcing', categoryLabel: 'Archetypes', icon: UserCheck, color: 'text-teal-400', bgLight: 'bg-teal-500/10 border-teal-500/30', badgeColor: 'bg-teal-500/20 text-teal-300' },
  { id: 14, domId: 'section-14-search-strategy', badge: '14', title: 'Candidate Sourcing War Room (Boolean & X-Ray)', shortTitle: 'Search War Room', category: 'sourcing', categoryLabel: 'Boolean/X-Ray', icon: Terminal, color: 'text-teal-400', bgLight: 'bg-teal-500/10 border-teal-500/30', badgeColor: 'bg-teal-500/20 text-teal-300' },
  { id: 15, domId: 'section-15-dei-intelligence', badge: '15', title: 'Diversity, Equity & Inclusion (DEI) Sourcing Channels', shortTitle: 'DEI Sourcing', category: 'sourcing', categoryLabel: 'Diversity', icon: HeartHandshake, color: 'text-teal-400', bgLight: 'bg-teal-500/10 border-teal-500/30', badgeColor: 'bg-teal-500/20 text-teal-300' },
  { id: 16, domId: 'section-16-compensation', badge: '16', title: 'Compensation Intelligence & Market Percentiles', shortTitle: 'Compensation Bands', category: 'comp', categoryLabel: 'Comp Intel', icon: DollarSign, color: 'text-amber-400', bgLight: 'bg-amber-500/10 border-amber-500/30', badgeColor: 'bg-amber-500/20 text-amber-300' },
  { id: 17, domId: 'section-17-recruiting-difficulty', badge: '17', title: 'Recruiting Difficulty Score & Pipeline Velocity', shortTitle: 'Difficulty Score', category: 'comp', categoryLabel: 'Difficulty', icon: AlertOctagon, color: 'text-amber-400', bgLight: 'bg-amber-500/10 border-amber-500/30', badgeColor: 'bg-amber-500/20 text-amber-300' },
  { id: 18, domId: 'section-18-risks', badge: '18', title: 'Recruiting Risks & Market Constraints Audit', shortTitle: 'Risks & Mitigations', category: 'comp', categoryLabel: 'Risk Matrix', icon: ShieldAlert, color: 'text-rose-400', bgLight: 'bg-rose-500/10 border-rose-500/30', badgeColor: 'bg-rose-500/20 text-rose-300' },
  { id: 19, domId: 'section-19-recommendations', badge: '19', title: 'Strategic Recruiting Recommendations & Action Plan', shortTitle: 'Recommendations', category: 'exec', categoryLabel: 'Action Plan', icon: CheckCircle2, color: 'text-emerald-400', bgLight: 'bg-emerald-500/10 border-emerald-500/30', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
  { id: 20, domId: 'section-20-executive-summary', badge: '20', title: 'Executive Talent Market Summary', shortTitle: 'Executive Summary', category: 'exec', categoryLabel: 'Synthesis', icon: FileSpreadsheet, color: 'text-emerald-400', bgLight: 'bg-emerald-500/10 border-emerald-500/30', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
  { id: 21, domId: 'section-21-talent-heatmap', badge: '21', title: 'Talent Heat Map Matrix (Skill x Geography Scarcity)', shortTitle: 'Talent Heat Map', category: 'exec', categoryLabel: 'Heat Map', icon: Flame, color: 'text-orange-400', bgLight: 'bg-orange-500/10 border-orange-500/30', badgeColor: 'bg-orange-500/20 text-orange-300' },
  { id: 22, domId: 'section-22-executive-brief', badge: '22', title: 'Executive Recruiting Brief (C-Suite / HM Takeaways)', shortTitle: 'Executive Brief', category: 'exec', categoryLabel: 'C-Suite Brief', icon: Award, color: 'text-emerald-400', bgLight: 'bg-emerald-500/10 border-emerald-500/30', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
  { id: 23, domId: 'section-23-data-confidence', badge: '23', title: 'Data Confidence Scoring & Non-Fabrication Disclosure', shortTitle: 'Data Audit', category: 'exec', categoryLabel: 'Confidence', icon: ShieldCheck, color: 'text-slate-300', bgLight: 'bg-slate-800/60 border-slate-700/60', badgeColor: 'bg-slate-700 text-slate-300' },
];

interface ReportThumbnailsNavProps {
  expandedSections: Record<number, boolean>;
  onToggleSection: (id: number) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  activeSectionId: number | null;
  onSelectSection: (id: number, domId: string) => void;
}

export const ReportThumbnailsNav: React.FC<ReportThumbnailsNavProps> = ({
  expandedSections,
  onExpandAll,
  onCollapseAll,
  activeSectionId,
  onSelectSection,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'strip'>('grid');

  const expandedCount = Object.values(expandedSections).filter(Boolean).length;
  const totalCount = REPORT_SECTIONS_METADATA.length;

  return (
    <div className="glass-card rounded-2xl border border-slate-800/90 overflow-hidden shadow-xl">
      {/* Navigator Header Toolbar */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-wide">
                23-Section Visual Navigation Thumbnails
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                {expandedCount}/{totalCount} Expanded
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Click any thumbnail to immediately jump to and highlight that section in the report
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Expand All */}
          <button
            type="button"
            onClick={onExpandAll}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            title="Expand all 23 report sections"
          >
            <ChevronsDownUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Expand All</span>
          </button>

          {/* Collapse All */}
          <button
            type="button"
            onClick={onCollapseAll}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            title="Collapse all 23 report sections"
          >
            <ChevronsUpDown className="w-3.5 h-3.5 text-amber-400" />
            <span>Collapse All</span>
          </button>

          {/* Layout Toggle: Grid vs Rail Strip */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs cursor-pointer transition-all ${
                viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Compact Visual Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('strip')}
              className={`p-1.5 rounded-lg text-xs cursor-pointer transition-all ${
                viewMode === 'strip' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Horizontal Scrolling Rail"
            >
              <Rows3 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Collapse/Expand Thumbnails Drawer */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs cursor-pointer transition-all"
            title={isOpen ? 'Hide Thumbnail Drawer' : 'Show Thumbnail Drawer'}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Visual Navigation Thumbnail Cards */}
      {isOpen && (
        <div className="p-4 bg-slate-950/50">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
              {REPORT_SECTIONS_METADATA.map((meta) => {
                const IconComponent = meta.icon;
                const isExpanded = !!expandedSections[meta.id];
                const isActive = activeSectionId === meta.id;

                return (
                  <button
                    key={meta.id}
                    type="button"
                    onClick={() => onSelectSection(meta.id, meta.domId)}
                    className={`group text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                      isActive
                        ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                        : 'border-slate-800/90 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    {/* Top Row: Section Badge & Status Indicator */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${meta.badgeColor}`}>
                        S{meta.badge}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full transition-colors ${
                          isExpanded ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-slate-600'
                        }`}
                        title={isExpanded ? 'Section is Expanded' : 'Section is Collapsed (click to expand & jump)'}
                      />
                    </div>

                    {/* Center: Icon and Short Title */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded-lg ${meta.bgLight} shrink-0`}>
                        <IconComponent className={`w-3.5 h-3.5 ${meta.color}`} />
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-cyan-200 line-clamp-2 leading-tight">
                        {meta.shortTitle}
                      </span>
                    </div>

                    {/* Bottom: Category Pill and Expand Status */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/70 text-[10px] text-slate-400">
                      <span className="truncate">{meta.categoryLabel}</span>
                      <span className="font-mono text-[9px] text-slate-500">
                        {isExpanded ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Horizontal Strip Rail */
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
              {REPORT_SECTIONS_METADATA.map((meta) => {
                const IconComponent = meta.icon;
                const isExpanded = !!expandedSections[meta.id];
                const isActive = activeSectionId === meta.id;

                return (
                  <button
                    key={meta.id}
                    type="button"
                    onClick={() => onSelectSection(meta.id, meta.domId)}
                    className={`group shrink-0 w-44 text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                        : 'border-slate-800/90 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${meta.badgeColor}`}>
                        SECTION {meta.badge}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isExpanded ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-slate-600'
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`p-1.5 rounded-lg ${meta.bgLight} shrink-0`}>
                        <IconComponent className={`w-3.5 h-3.5 ${meta.color}`} />
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-cyan-200 truncate">
                        {meta.shortTitle}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between">
                      <span className="truncate">{meta.categoryLabel}</span>
                      <span className="font-mono text-[9px] text-slate-500">
                        {isExpanded ? 'Expanded' : 'Collapsed'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
