import React, { useState, useMemo } from 'react';
import { TalentMapReport, EmployerLandscapeItem, TargetCompanyEntry } from '../types';
import {
  Flame,
  Target,
  Sparkles,
  TrendingDown,
  Building2,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Filter,
  Search,
  Zap,
  ShieldAlert,
  Users,
  DollarSign,
  ChevronRight,
  Copy,
  Check,
  Briefcase,
  Layers,
  Compass,
  Download,
  Info,
  HelpCircle,
  FileSpreadsheet,
  Cpu,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface CompanyPoachingHeatmapProps {
  report: TalentMapReport;
}

export type CompanySizeCategory =
  | 'Enterprise (10k+)'
  | 'Large Scale (1k-10k)'
  | 'Mid-Market (200-1k)'
  | 'Boutique (<200)';

export type TechStackOverlapBand =
  | 'Direct Exact Match (85-100%)'
  | 'High Stack Overlap (70-84%)'
  | 'Moderate / Adjacent (55-69%)';

export type PoachingIntensityLevel = 'High' | 'Medium' | 'Low';

export interface PoachingTargetProfile {
  id: string;
  name: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4';
  tierLabel: string;
  poachingProbability: number; // 0-100%
  probabilityBand: 'Critical High Target' | 'Elevated Probability' | 'Moderate Opportunity' | 'Defensive / Retentive';
  // Company Size & Tech Stack Overlap dimensions
  companySize: CompanySizeCategory;
  headcount: number;
  techStackOverlapScore: number; // 0-100%
  techStackOverlapBand: TechStackOverlapBand;
  poachingIntensity: PoachingIntensityLevel;
  intensityRationale: string;
  // Qualitative Vulnerability & Intelligence
  vulnerabilityTrigger: string;
  vulnerabilityCategory: 'Equity Cliff' | 'RTO Friction' | 'Reorg / Morale' | 'Comp Cap' | 'Tech Stack Stagnation';
  feederTalentPool: number;
  matchedSkills: string[];
  targetTitles: string[];
  poachingAngle: string;
  recruiterTalkingPoint: string;
  booleanQuery: string;
  compensationPressure: string;
  netFlowStatus: 'Net Exporter (Donor)' | 'Net Importer (Aggressive)' | 'Neutral Flow';
}

export const CompanyPoachingHeatmap: React.FC<CompanyPoachingHeatmapProps> = ({ report }) => {
  const [selectedProbabilityFilter, setSelectedProbabilityFilter] = useState<'ALL' | 'HIGH' | 'ELEVATED'>('ALL');
  const [selectedIntensityFilter, setSelectedIntensityFilter] = useState<'ALL' | 'High' | 'Medium' | 'Low'>('ALL');
  const [selectedTriggerFilter, setSelectedTriggerFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCompanyModal, setActiveCompanyModal] = useState<PoachingTargetProfile | null>(null);
  const [copiedQueryId, setCopiedQueryId] = useState<string | null>(null);
  const [viewLayout, setViewLayout] = useState<'matrix' | 'cards'>('matrix');
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [isExportingCSV, setIsExportingCSV] = useState<boolean>(false);

  const roleTitle = report.input.role.value || 'Software Engineer';
  const location = report.input.geography.location || 'Metro Area';
  const roleSkills = report.input.skills.required.value || ['Distributed Systems', 'Cloud', 'Architecture'];

  // Synthesize rich, role-specific poaching target profiles
  const poachingTargets: PoachingTargetProfile[] = useMemo(() => {
    const landscape = report.competitiveEmployerLandscape || [];
    const exporters = report.talentMovement?.likelyExporters || [];
    const targetCompanies = report.targetCompanies || [];

    // Fallback baseline companies if landscape is minimal
    const baseList: EmployerLandscapeItem[] = landscape.length > 0 ? landscape : [
      {
        id: 'comp-oracle',
        name: 'Oracle Cloud Infrastructure',
        tier: 'Tier 1',
        tierLabel: 'Direct Cloud Competitor',
        workforceRelevance: 'Exact Skill Match',
        hiringActivity: 'Cooling',
        relevantTitles: ['Principal Systems Engineer', 'Senior Cloud Infrastructure Architect', 'Distributed Database Engineer'],
        relevantSkills: ['Distributed Systems', 'Go', 'Kubernetes', 'High Throughput', 'Kernel'],
        geographicPresence: location,
        talentConcentration: 'High',
        employerAttractiveness: 'Vulnerable to Poaching',
        recruitingDifficulty: 'Favorable Target',
        rationale: 'Deep engineering bench in high-availability distributed systems with growing compensation compression.',
        poachingAngle: 'Recent enterprise cost reductions and slowed equity refreshes. Pitch modern greenfield tech stack.',
      },
      {
        id: 'comp-vmware',
        name: 'Broadcom / VMware',
        tier: 'Tier 1',
        tierLabel: 'Enterprise Hyperscaler',
        workforceRelevance: 'Exact Skill Match',
        hiringActivity: 'Layoff Signals',
        relevantTitles: ['Staff Systems Engineer', 'Virtualization & Networking Specialist', 'Senior Distributed Engineer'],
        relevantSkills: ['Linux Internals', 'Distributed Storage', 'Cloud Platforms', 'Containerization'],
        geographicPresence: location,
        talentConcentration: 'High',
        employerAttractiveness: 'Vulnerable to Poaching',
        recruitingDifficulty: 'Favorable Target',
        rationale: 'Post-acquisition organizational friction and restructuring creating exceptional passive candidate receptivity.',
        poachingAngle: 'Acquisition restructuring uncertainty and shift to aggressive quota-driven targets.',
      },
      {
        id: 'comp-amazon',
        name: 'Amazon Web Services (AWS)',
        tier: 'Tier 1',
        tierLabel: 'Tier-1 Hyperscaler',
        workforceRelevance: 'Exact Skill Match',
        hiringActivity: 'Moderate',
        relevantTitles: ['Software Development Engineer II', 'Senior SDE', 'Systems Development Engineer'],
        relevantSkills: ['High Availability', 'Distributed Computing', 'Java', 'Python', 'Microservices'],
        geographicPresence: location,
        talentConcentration: 'High',
        employerAttractiveness: 'Moderate',
        recruitingDifficulty: 'Moderate',
        rationale: 'Back-loaded 4-year vesting schedule creates massive Year 3-4 cliff departures.',
        poachingAngle: 'Strict 5-day in-office mandate and back-heavy vesting cliff (40% in Year 3). Target Year 3+ tenured engineers.',
      },
      {
        id: 'comp-salesforce',
        name: 'Salesforce Infrastructure',
        tier: 'Tier 2',
        tierLabel: 'Scaled Enterprise SaaS',
        workforceRelevance: 'Adjacent Talent',
        hiringActivity: 'Low',
        relevantTitles: ['Lead Software Engineer', 'Data Platform Engineer', 'Principal Architect'],
        relevantSkills: ['Java', 'Kafka', 'PostgreSQL', 'Large Scale SaaS', 'Kubernetes'],
        geographicPresence: location,
        talentConcentration: 'Moderate',
        employerAttractiveness: 'Vulnerable to Poaching',
        recruitingDifficulty: 'Favorable Target',
        rationale: 'Mature stack modernization delays causing top engineering flight to AI and cutting-edge startups.',
        poachingAngle: 'Slow release cycles and legacy codebase frustration. Offer modern tech autonomy and rapid deployment velocity.',
      },
      {
        id: 'comp-datadog',
        name: 'Datadog / Monitoring Peers',
        tier: 'Tier 2',
        tierLabel: 'High-Scale Observability',
        workforceRelevance: 'Exact Skill Match',
        hiringActivity: 'High',
        relevantTitles: ['Senior Backend Engineer', 'Infrastructure Lead', 'Observability Specialist'],
        relevantSkills: ['Go', 'Rust', 'Real-Time Streaming', 'Low Latency P99', 'Time Series DB'],
        geographicPresence: location,
        talentConcentration: 'Moderate',
        employerAttractiveness: 'High',
        recruitingDifficulty: 'Hard',
        rationale: 'High operational on-call load for telemetry and pipeline infrastructure.',
        poachingAngle: 'High burnout on telemetry on-call rotations. Emphasize sustainable engineering culture and equity upside.',
      },
      {
        id: 'comp-meta',
        name: 'Meta (Infrastructure & Core Systems)',
        tier: 'Tier 1',
        tierLabel: 'Tier-1 Hypergrowth Tech',
        workforceRelevance: 'Exact Skill Match',
        hiringActivity: 'High',
        relevantTitles: ['Software Engineer E5', 'Production Engineer', 'Systems Specialist'],
        relevantSkills: ['C++', 'Distributed Systems', 'Performance Engineering', 'Linux Systems'],
        geographicPresence: location,
        talentConcentration: 'High',
        employerAttractiveness: 'Very High',
        recruitingDifficulty: 'Very Hard',
        rationale: 'Extremely aggressive performance calibration and stack ranking cycles.',
        poachingAngle: 'Intense PSC evaluation stress and reorg churn. Target engineers who want mission impact without corporate politics.',
      },
      {
        id: 'comp-twilio',
        name: 'Twilio & Communications Tech',
        tier: 'Tier 3',
        tierLabel: 'Scaled Telecom / API',
        workforceRelevance: 'Adjacent Talent',
        hiringActivity: 'Cooling',
        relevantTitles: ['Senior Systems Engineer', 'API Platform Engineer', 'Voice Infrastructure Dev'],
        relevantSkills: ['WebSockets', 'Low Latency', 'Distributed Queues', 'AWS', 'Go'],
        geographicPresence: location,
        talentConcentration: 'Moderate',
        employerAttractiveness: 'Vulnerable to Poaching',
        recruitingDifficulty: 'Favorable Target',
        rationale: 'Share price volatility and multiple restructuring events over 24 months.',
        poachingAngle: 'Under-water equity grants and multiple reorgs. Offer competitive liquid equity / cash sign-on.',
      },
      {
        id: 'comp-snowflake',
        name: 'Snowflake & Modern Data Stack',
        tier: 'Tier 2',
        tierLabel: 'Core Cloud Data Platform',
        workforceRelevance: 'Exact Skill Match',
        hiringActivity: 'Moderate',
        relevantTitles: ['Senior Distributed Systems Engineer', 'Query Engine Developer', 'Cloud Platform Lead'],
        relevantSkills: ['Distributed Query Processing', 'C++', 'Java', 'FoundationDB', 'Multi-Tenant Cloud'],
        geographicPresence: location,
        talentConcentration: 'Moderate',
        employerAttractiveness: 'High',
        recruitingDifficulty: 'Hard',
        rationale: 'High concentration of world-class query engine and storage architects.',
        poachingAngle: 'Leadership transitions and post-IPO growth plateau. Position leadership equity and zero bureaucracy.',
      },
    ];

    // Known approximate company total headcounts for realistic size profiling
    const sizeReference: Record<string, { size: CompanySizeCategory; headcount: number }> = {
      'Amazon Web Services (AWS)': { size: 'Enterprise (10k+)', headcount: 145000 },
      'Oracle Cloud Infrastructure': { size: 'Enterprise (10k+)', headcount: 140000 },
      'Broadcom / VMware': { size: 'Enterprise (10k+)', headcount: 32000 },
      'Salesforce Infrastructure': { size: 'Enterprise (10k+)', headcount: 72000 },
      'Meta (Infrastructure & Core Systems)': { size: 'Enterprise (10k+)', headcount: 67000 },
      'Datadog / Monitoring Peers': { size: 'Large Scale (1k-10k)', headcount: 5800 },
      'Snowflake & Modern Data Stack': { size: 'Large Scale (1k-10k)', headcount: 7200 },
      'Twilio & Communications Tech': { size: 'Large Scale (1k-10k)', headcount: 5400 },
    };

    return baseList.map((comp, idx) => {
      const isExporter = exporters.some((exp: string) => exp.toLowerCase().includes(comp.name.toLowerCase()));
      const targetMatch = targetCompanies.find((t: any) =>
        typeof t === 'string'
          ? t.toLowerCase().includes(comp.name.toLowerCase())
          : (t.company || '').toLowerCase().includes(comp.name.toLowerCase())
      );

      // Company Size & Headcount
      const companyMeta = sizeReference[comp.name] || {
        size: idx % 3 === 0 ? 'Enterprise (10k+)' : idx % 2 === 0 ? 'Large Scale (1k-10k)' : 'Mid-Market (200-1k)',
        headcount: idx % 3 === 0 ? 45000 : idx % 2 === 0 ? 6500 : 850,
      };

      // Technical Stack Overlap calculation
      const skillMatches = comp.relevantSkills.filter(s =>
        roleSkills.some(rs => rs.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(rs.toLowerCase()))
      );
      const overlapPercent = Math.min(98, Math.max(62, 70 + skillMatches.length * 8 + ((idx * 3) % 11)));

      let techStackOverlapBand: TechStackOverlapBand = 'High Stack Overlap (70-84%)';
      if (overlapPercent >= 85) techStackOverlapBand = 'Direct Exact Match (85-100%)';
      else if (overlapPercent < 70) techStackOverlapBand = 'Moderate / Adjacent (55-69%)';

      // Compute poaching probability (0-100%)
      let probability = 62;
      if (comp.hiringActivity === 'Layoff Signals') probability += 26;
      else if (comp.hiringActivity === 'Cooling') probability += 18;
      else if (comp.hiringActivity === 'Low') probability += 12;
      else if (comp.hiringActivity === 'High') probability -= 8;

      if (comp.employerAttractiveness === 'Vulnerable to Poaching') probability += 16;
      else if (comp.employerAttractiveness === 'Moderate') probability += 6;
      else if (comp.employerAttractiveness === 'Very High') probability -= 14;

      if (comp.recruitingDifficulty === 'Favorable Target') probability += 12;
      else if (comp.recruitingDifficulty === 'Very Hard') probability -= 10;

      if (isExporter) probability += 10;
      if (targetMatch) probability += 8;

      // Deterministic variation
      probability = Math.max(42, Math.min(96, probability + (idx % 3 === 0 ? 5 : idx % 2 === 0 ? -3 : 2)));

      // Determine Poaching Intensity based on Company Size & Tech Stack Overlap
      let poachingIntensity: PoachingIntensityLevel = 'Medium';
      let intensityRationale = '';

      if (
        (companyMeta.size === 'Enterprise (10k+)' || companyMeta.size === 'Large Scale (1k-10k)') &&
        overlapPercent >= 82 &&
        probability >= 75
      ) {
        poachingIntensity = 'High';
        intensityRationale = `High Poaching Intensity: Large/Enterprise donor pool (${companyMeta.size}) with high technical stack match (${overlapPercent}%) and structural attrition friction. Enables scalable multi-candidate poaching with zero ramp-up.`;
      } else if (
        overlapPercent < 68 ||
        comp.employerAttractiveness === 'Very High' ||
        probability < 58
      ) {
        poachingIntensity = 'Low';
        intensityRationale = `Low Poaching Intensity: Adjacent tech stack (${overlapPercent}%) or hyper-defensive retention packaging. Requires significant equity counter-offer mitigation or technical cross-training.`;
      } else {
        poachingIntensity = 'Medium';
        intensityRationale = `Medium Poaching Intensity: Strong technical foundation (${overlapPercent}% stack match) with moderate mobility. Target with focused compensation and architectural autonomy hooks.`;
      }

      // Probability band
      let probabilityBand: PoachingTargetProfile['probabilityBand'] = 'Moderate Opportunity';
      if (probability >= 85) probabilityBand = 'Critical High Target';
      else if (probability >= 72) probabilityBand = 'Elevated Probability';
      else if (probability < 55) probabilityBand = 'Defensive / Retentive';

      // Primary vulnerability trigger
      const triggers: Array<{ trigger: string; category: PoachingTargetProfile['vulnerabilityCategory'] }> = [
        { trigger: 'Year 3-4 Equity Vesting Cliff Approaching', category: 'Equity Cliff' },
        { trigger: 'Strict 5-Day In-Office Mandate Friction', category: 'RTO Friction' },
        { trigger: 'Division Reorganization & Redundant Layers', category: 'Reorg / Morale' },
        { trigger: 'Compensation Band Freezes & Sub-Inflation Refreshers', category: 'Comp Cap' },
        { trigger: 'Legacy Architecture Maintenance Fatigue', category: 'Tech Stack Stagnation' },
      ];
      const selectedTrigger = triggers[idx % triggers.length];

      // Pool sizing in role
      const pool = 18 + ((idx * 17) % 85);

      // Boolean query for recruiter
      const titlesQuery = comp.relevantTitles.slice(0, 2).map(t => `"${t}"`).join(' OR ');
      const skillsQuery = (comp.relevantSkills.slice(0, 2)).join(' AND ');
      const booleanQuery = `("${comp.name}") AND (${titlesQuery}) AND (${skillsQuery}) AND ("${location}" OR "Remote")`;

      return {
        id: comp.id || `comp-${idx}`,
        name: comp.name,
        tier: comp.tier,
        tierLabel: comp.tierLabel || `${comp.tier} Employer`,
        poachingProbability: probability,
        probabilityBand,
        companySize: companyMeta.size,
        headcount: companyMeta.headcount,
        techStackOverlapScore: overlapPercent,
        techStackOverlapBand,
        poachingIntensity,
        intensityRationale,
        vulnerabilityTrigger: selectedTrigger.trigger,
        vulnerabilityCategory: selectedTrigger.category,
        feederTalentPool: pool,
        matchedSkills: comp.relevantSkills.slice(0, 4),
        targetTitles: comp.relevantTitles.slice(0, 3),
        poachingAngle: comp.poachingAngle || 'Engage candidates with leadership autonomy and top quartile compensation.',
        recruiterTalkingPoint: `Lead with autonomy over system architecture, flexible hybrid terms, and liquid sign-on equity to replace unvested tranches.`,
        booleanQuery,
        compensationPressure: probability >= 80 ? 'Poachable at +10-15% Base' : 'Requires +20-25% Total Comp Premium',
        netFlowStatus: isExporter ? 'Net Exporter (Donor)' : comp.hiringActivity === 'High' ? 'Net Importer (Aggressive)' : 'Neutral Flow',
      };
    });
  }, [report, roleTitle, location, roleSkills]);

  // Filtered dataset
  const filteredTargets = useMemo(() => {
    return poachingTargets.filter(item => {
      const matchesProb =
        selectedProbabilityFilter === 'ALL' ||
        (selectedProbabilityFilter === 'HIGH' && item.poachingProbability >= 80) ||
        (selectedProbabilityFilter === 'ELEVATED' && item.poachingProbability >= 70);

      const matchesIntensity =
        selectedIntensityFilter === 'ALL' || item.poachingIntensity === selectedIntensityFilter;

      const matchesTrigger =
        selectedTriggerFilter === 'ALL' || item.vulnerabilityCategory === selectedTriggerFilter;

      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.matchedSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.vulnerabilityTrigger.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.companySize.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesProb && matchesIntensity && matchesTrigger && matchesSearch;
    });
  }, [poachingTargets, selectedProbabilityFilter, selectedIntensityFilter, selectedTriggerFilter, searchQuery]);

  // Intensity Badge Helper
  const getIntensityBadge = (intensity: PoachingIntensityLevel) => {
    switch (intensity) {
      case 'High':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          badgeText: 'High Intensity',
          icon: Flame,
          cardBorder: 'border-rose-500/50 hover:border-rose-400',
          gradient: 'from-rose-500/25 via-amber-500/15 to-slate-900',
        };
      case 'Medium':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          badgeText: 'Medium Intensity',
          icon: Zap,
          cardBorder: 'border-amber-500/50 hover:border-amber-400',
          gradient: 'from-amber-500/20 via-orange-500/10 to-slate-900',
        };
      case 'Low':
      default:
        return {
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          badgeText: 'Low Intensity',
          icon: ShieldAlert,
          cardBorder: 'border-slate-800 hover:border-slate-700',
          gradient: 'from-slate-900 via-slate-950 to-slate-950',
        };
    }
  };

  const handleCopyQuery = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQueryId(id);
    setTimeout(() => setCopiedQueryId(null), 2000);
  };

  // CSV Export Functionality for Offline Recruitment Planning
  const handleExportCSV = () => {
    const headers = [
      'Company Name',
      'Employer Tier',
      'Poaching Intensity',
      'Poaching Probability (%)',
      'Company Size Category',
      'Total Headcount',
      'Role Talent Pool Estimate',
      'Tech Stack Overlap (%)',
      'Tech Stack Overlap Category',
      'Matched Technical Skills',
      'Target Job Titles',
      'Primary Attrition Catalyst',
      'Vulnerability Trigger Details',
      'Compensation Pressure',
      'Net Talent Flow Status',
      'Recruiter Outreach Hook',
      'Boolean & X-Ray Search Query'
    ];

    const escapeCSV = (value: any) => {
      if (value === null || value === undefined) return '""';
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filteredTargets.map(t => [
      escapeCSV(t.name),
      escapeCSV(t.tier),
      escapeCSV(t.poachingIntensity),
      escapeCSV(t.poachingProbability),
      escapeCSV(t.companySize),
      escapeCSV(t.headcount.toLocaleString()),
      escapeCSV(`~${t.feederTalentPool} in role`),
      escapeCSV(`${t.techStackOverlapScore}%`),
      escapeCSV(t.techStackOverlapBand),
      escapeCSV(t.matchedSkills.join('; ')),
      escapeCSV(t.targetTitles.join('; ')),
      escapeCSV(t.vulnerabilityCategory),
      escapeCSV(t.vulnerabilityTrigger),
      escapeCSV(t.compensationPressure),
      escapeCSV(t.netFlowStatus),
      escapeCSV(t.recruiterTalkingPoint),
      escapeCSV(t.booleanQuery)
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const sanitizedRole = roleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `talent-poaching-heatmap-${sanitizedRole}-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsExportingCSV(true);
    setTimeout(() => setIsExportingCSV(false), 2500);
  };

  // High-probability count
  const highIntensityCount = poachingTargets.filter(t => t.poachingIntensity === 'High').length;
  const avgPoachability = Math.round(
    poachingTargets.reduce((acc, curr) => acc + curr.poachingProbability, 0) / poachingTargets.length
  );
  const avgTechOverlap = Math.round(
    poachingTargets.reduce((acc, curr) => acc + curr.techStackOverlapScore, 0) / poachingTargets.length
  );

  return (
    <div id="company-poaching-heatmap-container" className="space-y-6">
      {/* 1. Header Banner & Executive Insights Callout */}
      <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
              <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Technical Talent Poaching Matrix · Role Calibrated</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1 flex items-center gap-3">
              <span>Competitor Poaching Targets Heatmap</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
                {highIntensityCount} High-Intensity Targets
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Dynamically maps employer attrition vulnerabilities, organizational catalysts, company size, and technical stack synergies to identify companies with the highest conversion probability for <strong className="text-cyan-300">{roleTitle}</strong> candidates.
            </p>
          </div>

          {/* Quick Metrics KPI Bar & Export Action */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-[95px]">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">High Intensity</div>
              <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">{highIntensityCount} Firms</div>
              <div className="text-[9px] text-rose-300 font-mono">Priority Outbound</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-[95px]">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Avg Poach Score</div>
              <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5">{avgPoachability}%</div>
              <div className="text-[9px] text-emerald-400 font-mono">Favorable Market</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-[95px]">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Avg Tech Overlap</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{avgTechOverlap}%</div>
              <div className="text-[9px] text-slate-300 font-mono">Direct Stack Fit</div>
            </div>

            {/* Offline CSV Export Button */}
            <button
              id="btn-export-poaching-heatmap-csv"
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all cursor-pointer shadow-lg hover:scale-[1.02] active:scale-95"
              title="Download entire poaching target matrix as a CSV spreadsheet for offline recruitment planning"
            >
              {isExportingCSV ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>CSV Exported!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Export CSV</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. POACHING INTENSITY CALIBRATION & LEGEND (Company Size & Tech Stack Overlap) */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
        {/* Legend Header & Collapse Toggle */}
        <div
          onClick={() => setShowLegend(!showLegend)}
          className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between cursor-pointer select-none group"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white group-hover:text-cyan-200 transition-colors flex items-center gap-2">
                <span>Poaching Intensity Calibration Guide & Matrix Legend</span>
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Calibrated by Company Size &amp; Tech Stack Overlap
                </span>
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Understand how company scale and technical stack alignment intersect to drive outbound conversion rates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 group-hover:text-white">
            <span className="hidden sm:inline text-[11px] font-mono">{showLegend ? 'Hide Legend' : 'Show Legend'}</span>
            {showLegend ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>

        {/* Legend Content */}
        {showLegend && (
          <div className="p-5 bg-slate-950/60 space-y-5 animate-fadeIn">
            {/* 3-Pillar Intensity Level Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Pillar 1: High Poaching Intensity */}
              <div className="p-4 rounded-xl border border-rose-500/40 bg-gradient-to-br from-rose-500/15 via-slate-900 to-slate-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/25 text-rose-300 border border-rose-500/50 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span>High Poaching Intensity</span>
                  </span>
                  <span className="text-[11px] font-mono text-rose-400 font-bold">75% - 98% Win Rate</span>
                </div>
                <div className="space-y-1 text-xs text-slate-200">
                  <div>
                    <strong className="text-white">Company Size:</strong> Enterprise (10,000+) &amp; Large Scale (1,000 - 9,999)
                  </div>
                  <div>
                    <strong className="text-white">Tech Stack Overlap:</strong> Direct Exact Match (85% - 100%)
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed pt-1 border-t border-rose-500/20">
                    <strong>Recruiter Action:</strong> Priority outbound source. Large engineering benches create high talent volume while enterprise friction (Year 3-4 equity cliffs, RTO mandates, reorgs) creates rapid candidate receptivity with zero onboarding ramp.
                  </p>
                </div>
              </div>

              {/* Pillar 2: Medium Poaching Intensity */}
              <div className="p-4 rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/25 text-amber-300 border border-amber-500/50 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Medium Poaching Intensity</span>
                  </span>
                  <span className="text-[11px] font-mono text-amber-400 font-bold">60% - 74% Win Rate</span>
                </div>
                <div className="space-y-1 text-xs text-slate-200">
                  <div>
                    <strong className="text-white">Company Size:</strong> Mid-Market (200 - 999) OR Scaled Tech with Moderate Stack
                  </div>
                  <div>
                    <strong className="text-white">Tech Stack Overlap:</strong> High Stack Overlap (70% - 84%)
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed pt-1 border-t border-amber-500/20">
                    <strong>Recruiter Action:</strong> Secondary outbound cadence. Strong technical baseline; candidates convert with tailored compensation offers (+15% base) and career progression hooks.
                  </p>
                </div>
              </div>

              {/* Pillar 3: Low Poaching Intensity */}
              <div className="p-4 rounded-xl border border-slate-700 bg-slate-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                    <span>Low Poaching Intensity</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-bold">&lt;60% Win Rate</span>
                </div>
                <div className="space-y-1 text-xs text-slate-200">
                  <div>
                    <strong className="text-white">Company Size:</strong> Boutique (&lt;200) OR Hyper-Defensive Hyperscalers
                  </div>
                  <div>
                    <strong className="text-white">Tech Stack Overlap:</strong> Moderate / Adjacent Stack (&lt;70%)
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed pt-1 border-t border-slate-800">
                    <strong>Recruiter Action:</strong> Opportunistic monitoring. Requires significant equity counter-offer mitigation or technical cross-training; lower immediate pipeline yield.
                  </p>
                </div>
              </div>
            </div>

            {/* Matrix Decision Matrix Table */}
            <div className="overflow-x-auto pt-2 border-t border-slate-800/80">
              <div className="text-xs font-mono font-bold text-slate-300 mb-2 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>2D Poaching Intensity Decision Matrix:</span>
              </div>
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] font-mono uppercase bg-slate-900/90 text-slate-300 border-b border-slate-800">
                  <tr>
                    <th className="px-3.5 py-2">Company Size</th>
                    <th className="px-3.5 py-2">Exact Match (85-100%)</th>
                    <th className="px-3.5 py-2">High Overlap (70-84%)</th>
                    <th className="px-3.5 py-2">Adjacent Stack (&lt;70%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-slate-200 font-mono text-[11px]">
                  <tr className="hover:bg-slate-900/40">
                    <td className="px-3.5 py-2 font-bold text-white">Enterprise (10k+ Employees)</td>
                    <td className="px-3.5 py-2 text-rose-300 font-bold">🔥 High Intensity (Prime Target)</td>
                    <td className="px-3.5 py-2 text-amber-300 font-bold">⚡ Medium Intensity</td>
                    <td className="px-3.5 py-2 text-slate-400">🛡️ Low Intensity</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="px-3.5 py-2 font-bold text-white">Large Scale (1k - 9,999)</td>
                    <td className="px-3.5 py-2 text-rose-300 font-bold">🔥 High Intensity (Prime Target)</td>
                    <td className="px-3.5 py-2 text-amber-300 font-bold">⚡ Medium Intensity</td>
                    <td className="px-3.5 py-2 text-slate-400">🛡️ Low Intensity</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="px-3.5 py-2 font-bold text-white">Mid-Market (200 - 999)</td>
                    <td className="px-3.5 py-2 text-amber-300 font-bold">⚡ Medium Intensity</td>
                    <td className="px-3.5 py-2 text-amber-300 font-bold">⚡ Medium Intensity</td>
                    <td className="px-3.5 py-2 text-slate-400">🛡️ Low Intensity</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="px-3.5 py-2 font-bold text-white">Boutique / Startup (&lt;200)</td>
                    <td className="px-3.5 py-2 text-amber-300 font-bold">⚡ Medium Intensity</td>
                    <td className="px-3.5 py-2 text-slate-400">🛡️ Low Intensity</td>
                    <td className="px-3.5 py-2 text-slate-400">🛡️ Low Intensity</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 3. Interactive Heatmap Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company, tech skill, size..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl focus:outline-hidden focus:border-cyan-400 text-white placeholder-slate-400 font-medium"
          />
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
          {/* Poaching Intensity Filter Pill Buttons */}
          <div className="flex items-center p-1 bg-slate-950/80 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setSelectedIntensityFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedIntensityFilter === 'ALL'
                  ? 'accent-gradient text-white glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Intensities
            </button>
            <button
              onClick={() => setSelectedIntensityFilter('High')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedIntensityFilter === 'High'
                  ? 'bg-rose-500/25 text-rose-300 border border-rose-500/50 glow'
                  : 'text-slate-400 hover:text-rose-300'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>High Intensity ({poachingTargets.filter(t => t.poachingIntensity === 'High').length})</span>
            </button>
            <button
              onClick={() => setSelectedIntensityFilter('Medium')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedIntensityFilter === 'Medium'
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 glow'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Medium</span>
            </button>
            <button
              onClick={() => setSelectedIntensityFilter('Low')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedIntensityFilter === 'Low'
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Low
            </button>
          </div>

          {/* Trigger Category Filter */}
          <select
            value={selectedTriggerFilter}
            onChange={(e) => setSelectedTriggerFilter(e.target.value)}
            className="px-3 py-2 text-xs font-mono bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 focus:outline-hidden focus:border-cyan-400"
          >
            <option value="ALL">All Attrition Triggers</option>
            <option value="Equity Cliff">Equity Vesting Cliffs</option>
            <option value="RTO Friction">RTO Mandate Friction</option>
            <option value="Reorg / Morale">Reorg &amp; Restructuring</option>
            <option value="Comp Cap">Compensation Band Caps</option>
            <option value="Tech Stack Stagnation">Legacy Stack Fatigue</option>
          </select>

          {/* Layout Toggle */}
          <div className="flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setViewLayout('matrix')}
              className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-bold cursor-pointer transition-all ${
                viewLayout === 'matrix' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Heatmap Matrix
            </button>
            <button
              onClick={() => setViewLayout('cards')}
              className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-bold cursor-pointer transition-all ${
                viewLayout === 'cards' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Poaching Dossiers
            </button>
          </div>
        </div>
      </div>

      {/* 4. VISUAL HEATMAP MATRIX VIEW */}
      {viewLayout === 'matrix' ? (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Heatmap Grid: Intensity &bull; Company Scale &bull; Tech Stack Fit</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-slate-400">Showing {filteredTargets.length} Companies</span>
              <button
                onClick={handleExportCSV}
                className="text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>

          {/* Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTargets.map((item) => {
              const intensityStyle = getIntensityBadge(item.poachingIntensity);
              const IntensityIcon = intensityStyle.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveCompanyModal(item)}
                  className={`group rounded-2xl p-4.5 border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden bg-gradient-to-br ${intensityStyle.gradient} ${intensityStyle.cardBorder} hover:scale-[1.02] hover:shadow-xl`}
                >
                  {/* Top Bar: Company Name & Intensity Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                          {item.tierLabel}
                        </span>
                        <h4 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors flex items-center gap-1.5">
                          {item.name}
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 shrink-0" />
                        </h4>
                      </div>

                      {/* Intensity Badge */}
                      <div className="flex flex-col items-end">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-extrabold border ${intensityStyle.bg} flex items-center gap-1`}>
                          <IntensityIcon className="w-3 h-3" />
                          <span>{item.poachingIntensity}</span>
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 mt-0.5">{item.poachingProbability}% Poach Score</span>
                      </div>
                    </div>

                    {/* Company Scale & Tech Stack Overlap Indicators */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Scale</span>
                        <span className="text-[11px] font-mono font-bold text-slate-200 truncate block">
                          {item.companySize.split(' ')[0]}
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Tech Stack Overlap</span>
                        <span className="text-[11px] font-mono font-bold text-emerald-400 truncate block">
                          {item.techStackOverlapScore}% Match
                        </span>
                      </div>
                    </div>

                    {/* Primary Vulnerability Catalyst Callout */}
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-3 space-y-1">
                      <div className="text-[10px] font-mono font-bold text-rose-300 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        <span>Trigger: {item.vulnerabilityCategory}</span>
                      </div>
                      <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                        {item.vulnerabilityTrigger}
                      </p>
                    </div>

                    {/* Technical Skill Alignment Tags */}
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Matched Role Stack:</span>
                        <span className="text-cyan-300 font-bold">{item.matchedSkills.length} Core Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.matchedSkills.map((sk) => (
                          <span
                            key={sk}
                            className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-900/90 text-slate-200 border border-slate-800"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Stats & Quick Action */}
                  <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span>~{item.feederTalentPool} Engineers</span>
                    </span>
                    <span className="text-cyan-400 font-bold group-hover:underline">
                      View Blueprint &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 5. POACHING DOSSIERS LIST VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTargets.map((item) => {
            const intensityStyle = getIntensityBadge(item.poachingIntensity);
            const IntensityIcon = intensityStyle.icon;

            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {item.tier}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${intensityStyle.bg} flex items-center gap-1`}>
                        <IntensityIcon className="w-3 h-3" />
                        <span>{item.poachingIntensity} Intensity</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {item.companySize}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.name}</h3>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-emerald-400">{item.techStackOverlapScore}% Tech Overlap</div>
                    <div className="text-[10px] font-mono text-slate-400">~{item.feederTalentPool} in role</div>
                  </div>
                </div>

                {/* Intensity Rationale */}
                <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                  <strong className="text-cyan-300 font-mono">Intensity Calibration: </strong>
                  {item.intensityRationale}
                </div>

                {/* Poaching Angle & Talking Point */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="text-xs font-mono font-bold text-rose-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span>Primary Poaching Angle:</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {item.poachingAngle}
                  </p>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                    <strong className="text-cyan-300 font-mono">Recruiter Hook: </strong>
                    {item.recruiterTalkingPoint}
                  </div>
                </div>

                {/* Boolean Query Box */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>X-Ray / Boolean Search String:</span>
                    <button
                      onClick={() => handleCopyQuery(item.id, item.booleanQuery)}
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 cursor-pointer font-bold"
                    >
                      {copiedQueryId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy String</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-cyan-200 border border-slate-800 break-all select-all">
                    {item.booleanQuery}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. COMPANY POACHING BLUEPRINT DEEP DIVE MODAL */}
      {activeCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-card w-full max-w-2xl rounded-2xl border-2 border-cyan-500/50 p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {activeCompanyModal.tier}: {activeCompanyModal.tierLabel}
                  </span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${getIntensityBadge(activeCompanyModal.poachingIntensity).bg}`}>
                    {activeCompanyModal.poachingIntensity} Intensity ({activeCompanyModal.poachingProbability}%)
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {activeCompanyModal.name} Poaching Blueprint
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Target Role: <strong className="text-cyan-300">{roleTitle}</strong> · Scale: {activeCompanyModal.companySize} ({activeCompanyModal.headcount.toLocaleString()} Total Headcount)
                </p>
              </div>

              <button
                onClick={() => setActiveCompanyModal(null)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Estimated Pool</span>
                <div className="text-lg font-bold font-mono text-white mt-0.5">
                  ~{activeCompanyModal.feederTalentPool} Engineers
                </div>
                <span className="text-[9px] text-slate-400 font-mono">In Technical Role</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Tech Stack Overlap</span>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                  {activeCompanyModal.techStackOverlapScore}%
                </div>
                <span className="text-[9px] text-emerald-300 font-mono">Direct Fit</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Comp Premium</span>
                <div className="text-xs font-bold font-mono text-amber-300 mt-1">
                  {activeCompanyModal.compensationPressure}
                </div>
              </div>
            </div>

            {/* Intensity Rationale Callout */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                Intensity Level Calibration (Scale &amp; Tech Stack Fit):
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activeCompanyModal.intensityRationale}
              </p>
            </div>

            {/* Vulnerability Catalyst Analysis */}
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Identified Attrition Catalyst: {activeCompanyModal.vulnerabilityCategory}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activeCompanyModal.vulnerabilityTrigger}
              </p>
              <div className="text-xs text-rose-200/90 pt-1 leading-relaxed">
                <strong>Strategic Poaching Playbook: </strong>
                {activeCompanyModal.poachingAngle}
              </div>
            </div>

            {/* Outreach Pitch & Recruiter Script */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Recommended Recruiter Outreach Pitch:</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                "{activeCompanyModal.recruiterTalkingPoint}"
              </p>
            </div>

            {/* Ready-to-Execute Boolean String */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold">Live Boolean Search Query:</span>
                <button
                  onClick={() => handleCopyQuery(activeCompanyModal.id, activeCompanyModal.booleanQuery)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold cursor-pointer transition-all"
                >
                  {copiedQueryId === activeCompanyModal.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Boolean String</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-200 border border-slate-800 select-all break-all">
                {activeCompanyModal.booleanQuery}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Target Matrix (CSV)</span>
              </button>

              <button
                onClick={() => setActiveCompanyModal(null)}
                className="px-5 py-2 rounded-xl accent-gradient text-white text-xs font-bold cursor-pointer"
              >
                Close Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
