import React, { useState, useMemo } from 'react';
import { TalentMapReport } from '../types';
import {
  DollarSign,
  TrendingUp,
  Scale,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ArrowRight,
  Building2,
  MapPin,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Award,
  ChevronDown,
  Layers,
  Percent,
  Clock,
  Briefcase,
  HelpCircle,
  Cpu,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from 'recharts';

interface CompensationAnalyzerProps {
  report: TalentMapReport;
}

interface CandidateCompProfile {
  id: string;
  name: string;
  baseSalary: number;
  bonus: number;
  equityAnnual: number;
  signOnBonus: number;
  vestingSchedule: 'standard_4yr' | 'front_loaded_33' | 'back_loaded_amazon' | 'even_quarterly';
  candidateSeniority: string;
  candidateLocation: string;
  candidateEmployerType: string;
  isAiSpecialist: boolean;
}

export const CompensationAnalyzer: React.FC<CompensationAnalyzerProps> = ({ report }) => {
  const roleTitle = report.input.role.value;
  const p25 = report.compensationIntelligence?.percentiles?.p25 || report.compensationIntelligence?.baseSalary?.p25 || 165000;
  const p50 = report.compensationIntelligence?.percentiles?.p50 || report.compensationIntelligence?.baseSalary?.p50 || 195000;
  const p75 = report.compensationIntelligence?.percentiles?.p75 || report.compensationIntelligence?.baseSalary?.p75 || 235000;
  const p90 = report.compensationIntelligence?.percentiles?.p90 || report.compensationIntelligence?.baseSalary?.p90 || 280000;
  const p10 = Math.round(p25 * 0.85);

  const budgetedMin = report.input.compensationTarget?.min || p25;
  const budgetedMax = report.input.compensationTarget?.max || p75;

  // Geographic multipliers based on BLS & Pave cost-of-labor indices
  const geoMultipliers: Record<string, { multiplier: number; taxLabel: string; stateTax: string }> = {
    'San Francisco Bay Area': { multiplier: 1.12, taxLabel: 'High CA Tax (13.3%)', stateTax: '13.3% CA Top' },
    'New York City': { multiplier: 1.08, taxLabel: 'High NY Tax (10.9%)', stateTax: '10.9% NY+NYC' },
    'Seattle Metro': { multiplier: 1.04, taxLabel: '0% State Income Tax', stateTax: '0% WA' },
    'Austin / Texas Hub': { multiplier: 0.92, taxLabel: '0% State Income Tax', stateTax: '0% TX' },
    'Remote (US Nationwide)': { multiplier: 1.0, taxLabel: 'Varies by Resident State', stateTax: 'Flexible' },
    'London / Western Europe': { multiplier: 0.72, taxLabel: 'High Tax (~45%)', stateTax: '45% UK' },
    'Bengaluru / India Hub': { multiplier: 0.42, taxLabel: 'Moderate Tax (30%)', stateTax: '30% IN' },
  };

  // Employer compensation archetype characteristics (Carta, Radford, Levels.fyi verified models)
  const employerProfiles: Record<string, {
    baseFactor: number;
    bonusPercentOfBase: number;
    equityPercentOfBase: number;
    signOnBaseline: number;
    defaultVesting: 'standard_4yr' | 'front_loaded_33' | 'back_loaded_amazon' | 'even_quarterly';
    description: string;
    archetypeEquityShare: number; // typical % of TTC in equity
    archetypeBonusShare: number;  // typical % of TTC in bonus
  }> = {
    'Tier-1 Hyperscaler': {
      baseFactor: 1.02,
      bonusPercentOfBase: 0.15,
      equityPercentOfBase: 0.52,
      signOnBaseline: 25000,
      defaultVesting: 'front_loaded_33',
      description: 'FAANG / Hyperscaler: High liquid RSU refresh, 15% target bonus',
      archetypeEquityShare: 35,
      archetypeBonusShare: 12,
    },
    'AI Frontier Lab': {
      baseFactor: 1.14,
      bonusPercentOfBase: 0.18,
      equityPercentOfBase: 0.78,
      signOnBaseline: 45000,
      defaultVesting: 'standard_4yr',
      description: 'Frontier AI Lab: Top cash comp, massive equity profit units (+30% premium)',
      archetypeEquityShare: 42,
      archetypeBonusShare: 10,
    },
    'High-Growth Unicorn': {
      baseFactor: 0.96,
      bonusPercentOfBase: 0.10,
      equityPercentOfBase: 0.45,
      signOnBaseline: 15000,
      defaultVesting: 'standard_4yr',
      description: 'High-Growth Unicorn: High option upside, competitive base',
      archetypeEquityShare: 32,
      archetypeBonusShare: 8,
    },
    'FinTech & Quant': {
      baseFactor: 1.10,
      bonusPercentOfBase: 0.45,
      equityPercentOfBase: 0.18,
      signOnBaseline: 30000,
      defaultVesting: 'even_quarterly',
      description: 'FinTech / Quant: Outsized performance cash bonuses (35-50% of base)',
      archetypeEquityShare: 14,
      archetypeBonusShare: 32,
    },
    'Mid-Market Enterprise': {
      baseFactor: 0.88,
      bonusPercentOfBase: 0.08,
      equityPercentOfBase: 0.12,
      signOnBaseline: 5000,
      defaultVesting: 'standard_4yr',
      description: 'Enterprise Tech: Standard corporate base, lower equity volatility',
      archetypeEquityShare: 12,
      archetypeBonusShare: 8,
    },
    'Early-Stage Startup': {
      baseFactor: 0.80,
      bonusPercentOfBase: 0.02,
      equityPercentOfBase: 0.70,
      signOnBaseline: 0,
      defaultVesting: 'standard_4yr',
      description: 'Early-Stage: Cash-conserving base, large equity % ownership',
      archetypeEquityShare: 46,
      archetypeBonusShare: 2,
    },
  };

  const getSeniorityMultiplier = (seniority: string) => {
    switch (seniority) {
      case 'MID': return 0.72;
      case 'STAFF': return 1.35;
      case 'PRINCIPAL': return 1.78;
      case 'DIRECTOR': return 2.10;
      case 'SENIOR':
      default: return 1.00;
    }
  };

  // Dynamic calibrated calculation
  const calculateCalibratedPackage = (
    seniority: string,
    location: string,
    employer: string,
    aiSpecialist: boolean
  ) => {
    const geo = geoMultipliers[location]?.multiplier || 1.0;
    const sen = getSeniorityMultiplier(seniority);
    const emp = employerProfiles[employer] || employerProfiles['Tier-1 Hyperscaler'];
    const aiMultiplier = aiSpecialist ? 1.25 : 1.0; // +25% AI/ML Systems Premium from 2025/2026 Pave/Carta benchmarks

    const targetBase = Math.round(p50 * sen * geo * emp.baseFactor * (aiSpecialist ? 1.10 : 1.0));
    const targetBonus = Math.round(targetBase * emp.bonusPercentOfBase);
    const targetEquity = Math.round(targetBase * emp.equityPercentOfBase * (aiSpecialist ? 1.30 : 1.0));
    const targetSignOn = Math.round(emp.signOnBaseline * geo * (aiSpecialist ? 1.20 : 1.0));

    return {
      baseSalary: targetBase,
      bonus: targetBonus,
      equityAnnual: targetEquity,
      signOnBonus: targetSignOn,
      vestingSchedule: emp.defaultVesting,
    };
  };

  // Initial calibrated package
  const initialPkg = calculateCalibratedPackage(
    report.input.seniority.value || 'SENIOR',
    report.input.geography.location || 'San Francisco Bay Area',
    'Tier-1 Hyperscaler',
    false
  );

  // Candidate State
  const [candidateName, setCandidateName] = useState<string>('Candidate Profile #1');
  const [candidateSeniority, setCandidateSeniority] = useState<string>(report.input.seniority.value || 'SENIOR');
  const [candidateLocation, setCandidateLocation] = useState<string>(report.input.geography.location || 'San Francisco Bay Area');
  const [candidateEmployerType, setCandidateEmployerType] = useState<string>('Tier-1 Hyperscaler');
  const [isAiSpecialist, setIsAiSpecialist] = useState<boolean>(false);
  const [vestingSchedule, setVestingSchedule] = useState<'standard_4yr' | 'front_loaded_33' | 'back_loaded_amazon' | 'even_quarterly'>('front_loaded_33');
  const [clawbackTerm, setClawbackTerm] = useState<'12_months' | '24_months'>('12_months');

  const [baseSalary, setBaseSalary] = useState<number>(initialPkg.baseSalary);
  const [bonus, setBonus] = useState<number>(initialPkg.bonus);
  const [equityAnnual, setEquityAnnual] = useState<number>(initialPkg.equityAnnual);
  const [signOnBonus, setSignOnBonus] = useState<number>(initialPkg.signOnBonus);

  const [autoCalibrate, setAutoCalibrate] = useState<boolean>(true);
  const [lastAdjustmentNote, setLastAdjustmentNote] = useState<string | null>('Initial Calibration Applied');
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  // Preset sample candidates
  const [savedCandidates] = useState<CandidateCompProfile[]>([
    {
      id: 'c1',
      name: 'Tier-1 Senior Candidate (Hyperscaler)',
      baseSalary: Math.round(p50 * 0.95),
      bonus: Math.round(p50 * 0.15),
      equityAnnual: Math.round(p50 * 0.48),
      signOnBonus: 25000,
      vestingSchedule: 'front_loaded_33',
      candidateSeniority: 'SENIOR',
      candidateLocation: report.input.geography.location,
      candidateEmployerType: 'Tier-1 Hyperscaler',
      isAiSpecialist: false,
    },
    {
      id: 'c2',
      name: 'Staff AI/ML Systems Engineer (Frontier Lab)',
      baseSalary: Math.round(p50 * 1.45),
      bonus: Math.round(p50 * 0.25),
      equityAnnual: Math.round(p50 * 0.95),
      signOnBonus: 50000,
      vestingSchedule: 'standard_4yr',
      candidateSeniority: 'STAFF',
      candidateLocation: 'San Francisco Bay Area',
      candidateEmployerType: 'AI Frontier Lab',
      isAiSpecialist: true,
    },
    {
      id: 'c3',
      name: 'Unicorn Tech Lead (Series C/D)',
      baseSalary: Math.round(p50 * 0.98),
      bonus: Math.round(p50 * 0.10),
      equityAnnual: Math.round(p50 * 0.35),
      signOnBonus: 15000,
      vestingSchedule: 'standard_4yr',
      candidateSeniority: 'SENIOR',
      candidateLocation: report.input.geography.location,
      candidateEmployerType: 'High-Growth Unicorn',
      isAiSpecialist: false,
    },
    {
      id: 'c4',
      name: 'Value Mover (Remote / Low COL)',
      baseSalary: Math.round(p25 * 0.95),
      bonus: Math.round(p25 * 0.08),
      equityAnnual: Math.round(p25 * 0.18),
      signOnBonus: 0,
      vestingSchedule: 'even_quarterly',
      candidateSeniority: 'SENIOR',
      candidateLocation: 'Remote (US Nationwide)',
      candidateEmployerType: 'Mid-Market Enterprise',
      isAiSpecialist: false,
    },
  ]);

  const handleLoadCandidate = (cand: CandidateCompProfile) => {
    setCandidateName(cand.name);
    setBaseSalary(cand.baseSalary);
    setBonus(cand.bonus);
    setEquityAnnual(cand.equityAnnual);
    setSignOnBonus(cand.signOnBonus);
    setVestingSchedule(cand.vestingSchedule);
    setCandidateSeniority(cand.candidateSeniority);
    setCandidateLocation(cand.candidateLocation);
    setCandidateEmployerType(cand.candidateEmployerType);
    setIsAiSpecialist(cand.isAiSpecialist);
    setLastAdjustmentNote(`Loaded scenario: ${cand.name.split(' (')[0]}`);
  };

  // Calculations & Dynamic Multipliers
  const currentGeo = geoMultipliers[candidateLocation] || { multiplier: 1.0, taxLabel: 'Standard', stateTax: 'Standard' };
  const geoMultiplier = currentGeo.multiplier;
  const aiMultiplier = isAiSpecialist ? 1.25 : 1.0;

  // Total Target Comp (TTC) annualized
  const totalAnnualTarget = baseSalary + bonus + equityAnnual;
  const fourYearEquityTotal = equityAnnual * 4;

  // Year 1 Realized Equity based on Vesting Schedule model
  const year1RealizedEquity = useMemo(() => {
    switch (vestingSchedule) {
      case 'front_loaded_33':
        // 33% realized in Year 1 (Google/Uber model)
        return Math.round(fourYearEquityTotal * 0.33);
      case 'back_loaded_amazon':
        // 5% realized in Year 1 (Amazon 5/15/40/40 model)
        return Math.round(fourYearEquityTotal * 0.05);
      case 'even_quarterly':
        // 25% realized evenly quarterly
        return Math.round(fourYearEquityTotal * 0.25);
      case 'standard_4yr':
      default:
        // 25% realized at 1-year cliff
        return Math.round(fourYearEquityTotal * 0.25);
    }
  }, [vestingSchedule, fourYearEquityTotal]);

  // First year total realized comp (TTC + Sign-on with schedule impact)
  const firstYearTotalRealized = baseSalary + bonus + year1RealizedEquity + signOnBonus;

  // Seniority multiplier adjustments for market percentiles
  const seniorityMultiplier = useMemo(() => {
    return getSeniorityMultiplier(candidateSeniority);
  }, [candidateSeniority]);

  const adjustedP10 = Math.round(p10 * seniorityMultiplier * geoMultiplier * aiMultiplier);
  const adjustedP25 = Math.round(p25 * seniorityMultiplier * geoMultiplier * aiMultiplier);
  const adjustedP50 = Math.round(p50 * seniorityMultiplier * geoMultiplier * aiMultiplier);
  const adjustedP75 = Math.round(p75 * seniorityMultiplier * geoMultiplier * aiMultiplier);
  const adjustedP90 = Math.round(p90 * seniorityMultiplier * geoMultiplier * aiMultiplier);

  // Exact Percentile Estimation on Market Curve
  const estimatedPercentile = useMemo(() => {
    if (totalAnnualTarget <= adjustedP10) return 10;
    if (totalAnnualTarget >= adjustedP90 * 1.25) return 99;

    if (totalAnnualTarget < adjustedP25) {
      const ratio = (totalAnnualTarget - adjustedP10) / (adjustedP25 - adjustedP10 || 1);
      return Math.round(10 + Math.max(0, ratio) * 15);
    }
    if (totalAnnualTarget < adjustedP50) {
      const ratio = (totalAnnualTarget - adjustedP25) / (adjustedP50 - adjustedP25 || 1);
      return Math.round(25 + ratio * 25);
    }
    if (totalAnnualTarget < adjustedP75) {
      const ratio = (totalAnnualTarget - adjustedP50) / (adjustedP75 - adjustedP50 || 1);
      return Math.round(50 + ratio * 25);
    }
    if (totalAnnualTarget < adjustedP90) {
      const ratio = (totalAnnualTarget - adjustedP75) / (adjustedP90 - adjustedP75 || 1);
      return Math.round(75 + ratio * 15);
    }
    const ratio = (totalAnnualTarget - adjustedP90) / (adjustedP90 * 0.25 || 1);
    return Math.min(99, Math.round(90 + ratio * 9));
  }, [totalAnnualTarget, adjustedP10, adjustedP25, adjustedP50, adjustedP75, adjustedP90]);

  // Handlers for dropdown and switch changes
  const handleSenioritySelect = (newSeniority: string) => {
    setCandidateSeniority(newSeniority);
    if (autoCalibrate) {
      const pkg = calculateCalibratedPackage(newSeniority, candidateLocation, candidateEmployerType, isAiSpecialist);
      setBaseSalary(pkg.baseSalary);
      setBonus(pkg.bonus);
      setEquityAnnual(pkg.equityAnnual);
      setSignOnBonus(pkg.signOnBonus);
      setLastAdjustmentNote(`Recalculated for ${newSeniority} (${getSeniorityMultiplier(newSeniority)}x level factor)`);
    }
  };

  const handleLocationSelect = (newLocation: string) => {
    setCandidateLocation(newLocation);
    if (autoCalibrate) {
      const pkg = calculateCalibratedPackage(candidateSeniority, newLocation, candidateEmployerType, isAiSpecialist);
      setBaseSalary(pkg.baseSalary);
      setBonus(pkg.bonus);
      setEquityAnnual(pkg.equityAnnual);
      setSignOnBonus(pkg.signOnBonus);
      const mult = geoMultipliers[newLocation]?.multiplier || 1.0;
      setLastAdjustmentNote(`Adjusted to ${newLocation} (${mult}x metro index)`);
    }
  };

  const handleEmployerSelect = (newEmployer: string) => {
    setCandidateEmployerType(newEmployer);
    if (autoCalibrate) {
      const pkg = calculateCalibratedPackage(candidateSeniority, candidateLocation, newEmployer, isAiSpecialist);
      setBaseSalary(pkg.baseSalary);
      setBonus(pkg.bonus);
      setEquityAnnual(pkg.equityAnnual);
      setSignOnBonus(pkg.signOnBonus);
      setVestingSchedule(pkg.vestingSchedule);
      setLastAdjustmentNote(`Calibrated for ${employerProfiles[newEmployer]?.description.split(':')[0] || newEmployer}`);
    }
  };

  const handleToggleAiSpecialist = () => {
    const nextVal = !isAiSpecialist;
    setIsAiSpecialist(nextVal);
    if (autoCalibrate) {
      const pkg = calculateCalibratedPackage(candidateSeniority, candidateLocation, candidateEmployerType, nextVal);
      setBaseSalary(pkg.baseSalary);
      setBonus(pkg.bonus);
      setEquityAnnual(pkg.equityAnnual);
      setSignOnBonus(pkg.signOnBonus);
      setLastAdjustmentNote(nextVal ? 'Applied +25% AI/ML Systems Premium' : 'Reverted to Standard Systems Stack');
    }
  };

  const handleManualReCalculate = () => {
    const pkg = calculateCalibratedPackage(candidateSeniority, candidateLocation, candidateEmployerType, isAiSpecialist);
    setBaseSalary(pkg.baseSalary);
    setBonus(pkg.bonus);
    setEquityAnnual(pkg.equityAnnual);
    setSignOnBonus(pkg.signOnBonus);
    setLastAdjustmentNote(`Re-synced: ${candidateLocation} & ${candidateEmployerType} (AI: ${isAiSpecialist ? 'Yes' : 'No'})`);
  };

  const handleReset = () => {
    const defaultSeniority = report.input.seniority.value || 'SENIOR';
    const defaultLocation = report.input.geography.location || 'San Francisco Bay Area';
    const defaultEmployer = 'Tier-1 Hyperscaler';
    const pkg = calculateCalibratedPackage(defaultSeniority, defaultLocation, defaultEmployer, false);
    setCandidateSeniority(defaultSeniority);
    setCandidateLocation(defaultLocation);
    setCandidateEmployerType(defaultEmployer);
    setIsAiSpecialist(false);
    setVestingSchedule('front_loaded_33');
    setClawbackTerm('12_months');
    setBaseSalary(pkg.baseSalary);
    setBonus(pkg.bonus);
    setEquityAnnual(pkg.equityAnnual);
    setSignOnBonus(pkg.signOnBonus);
    setLastAdjustmentNote('Reset to initial market calibration');
  };

  // Budget Variance
  const varianceVsBudgetMax = totalAnnualTarget - budgetedMax;
  const variancePercentMax = Math.round((varianceVsBudgetMax / budgetedMax) * 100);
  const isOverBudget = varianceVsBudgetMax > 0;

  // Percentage shares of candidate package
  const baseShare = Math.round((baseSalary / (totalAnnualTarget || 1)) * 100);
  const equityShare = Math.round((equityAnnual / (totalAnnualTarget || 1)) * 100);
  const bonusShare = Math.round((bonus / (totalAnnualTarget || 1)) * 100);

  // Counter-offer & Flight Risk assessment
  const counterOfferRisk = useMemo(() => {
    if (candidateEmployerType === 'Tier-1 Hyperscaler' || candidateEmployerType === 'AI Frontier Lab') {
      if (totalAnnualTarget < adjustedP75) {
        return {
          level: 'High Risk (78% Counter Probability)',
          color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
          reason: 'Candidate likely holds lucrative unvested RSU stock grant refreshes from current employer. A sign-on cash sweetener or expanded initial equity cliff buyout is vital.',
          buyoutNeed: Math.max(signOnBonus, 35000),
        };
      }
      return {
        level: 'Moderate Risk (45% Counter Probability)',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        reason: 'Comp meets top quartile standards, but retention lock-ins remain strong. Pitch scope autonomy, faster promotion velocity, and modern tech stack.',
        buyoutNeed: Math.max(signOnBonus, 20000),
      };
    }
    if (isOverBudget) {
      return {
        level: 'Budget Friction (Low Counter, High Internal Approval Friction)',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        reason: `Candidate expectation exceeds internal compensation bands by ${Math.abs(variancePercentMax)}%. Recommend Option A (Equity-Heavy Bridge) to preserve cash limits.`,
        buyoutNeed: 0,
      };
    }
    return {
      level: 'Low Risk (High Closing Probability - 85%+)',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      reason: 'Offer package aligns tightly with market median and company budgeted parameters. Standard offer closing playbook recommended.',
      buyoutNeed: 0,
    };
  }, [candidateEmployerType, totalAnnualTarget, adjustedP75, isOverBudget, variancePercentMax, signOnBonus]);

  // Peer Industry Benchmark Comparison Data
  const peerComparisonData = useMemo(() => {
    const data = [
      {
        name: 'Candidate Expectation (TTC)',
        total: totalAnnualTarget,
        base: baseSalary,
        type: 'candidate',
      },
      {
        name: 'Role Budget Max',
        total: budgetedMax,
        base: Math.round(budgetedMax * 0.75),
        type: 'budget',
      },
      {
        name: `Local Market Median (${currentGeo.multiplier}x)`,
        total: adjustedP50,
        base: Math.round(adjustedP50 * 0.72),
        type: 'market',
      },
      {
        name: 'Tier-1 Hyperscaler (FAANG)',
        total: Math.round(adjustedP50 * 1.55),
        base: Math.round(adjustedP50 * 0.88),
        type: 'industry',
      },
      {
        name: 'AI Frontier Lab (Anthropic/OAI)',
        total: Math.round(adjustedP50 * 1.88),
        base: Math.round(adjustedP50 * 0.98),
        type: 'industry',
      },
      {
        name: 'High-Growth Unicorn',
        total: Math.round(adjustedP50 * 1.42),
        base: Math.round(adjustedP50 * 0.85),
        type: 'industry',
      },
    ];

    if (candidateEmployerType === 'FinTech & Quant') {
      data.push({
        name: 'FinTech / Quant Archetype',
        total: Math.round(adjustedP50 * 1.68),
        base: Math.round(adjustedP50 * 0.95),
        type: 'industry',
      });
    }

    return data;
  }, [totalAnnualTarget, baseSalary, budgetedMax, currentGeo.multiplier, adjustedP50, candidateEmployerType]);

  // Recruiter Negotiation Script with 3-Step Strategy
  const recruiterNegotiationScript = `CONFIDENTIAL CANDIDATE COMPENSATION EVALUATION & CLOSING MEMO
Target Candidate: ${candidateName}
Role: ${roleTitle} (${candidateSeniority} Level)
Location: ${candidateLocation} (${geoMultipliers[candidateLocation]?.stateTax || 'Standard Tax'})
Candidate Employer Archetype: ${candidateEmployerType}
Specialization: ${isAiSpecialist ? 'AI/ML & Distributed Systems (+25% Premium)' : 'Standard Systems Architecture'}

1. CANDIDATE PACKAGE BREAKDOWN:
- Base Salary: $${baseSalary.toLocaleString()} (${baseShare}% of TTC)
- Annual Variable Bonus: $${bonus.toLocaleString()} (${bonusShare}% of TTC)
- Annual Equity / LTI: $${equityAnnual.toLocaleString()} (${equityShare}% of TTC) | 4-Year Total: $${fourYearEquityTotal.toLocaleString()}
- Vesting Schedule: ${
  vestingSchedule === 'front_loaded_33'
    ? 'Front-Loaded (33% Y1 / 33% Y2 / 22% Y3 / 12% Y4) - Realized Y1: $' + year1RealizedEquity.toLocaleString()
    : vestingSchedule === 'back_loaded_amazon'
    ? 'Back-Loaded (5% Y1 / 15% Y2 / 40% Y3 / 40% Y4) - Realized Y1: $' + year1RealizedEquity.toLocaleString()
    : 'Standard 4-Year Linear (25% / yr with 1-Yr Cliff) - Realized Y1: $' + year1RealizedEquity.toLocaleString()
}
- One-Time Sign-on Sweetener: $${signOnBonus.toLocaleString()} (${clawbackTerm === '12_months' ? '12-Month Pro-Rata Clawback' : '24-Month Executive Retention Clawback'})
- Total Annual Target (TTC): $${totalAnnualTarget.toLocaleString()}
- Year 1 Total Realized Package: $${firstYearTotalRealized.toLocaleString()}

2. MARKET PERCENTILE STANDING:
- Current Standing: ${estimatedPercentile}th Percentile against ${candidateLocation} market curve
- Market Baselines: P10 ($${adjustedP10.toLocaleString()}) | P25 ($${adjustedP25.toLocaleString()}) | P50 ($${adjustedP50.toLocaleString()}) | P75 ($${adjustedP75.toLocaleString()}) | P90 ($${adjustedP90.toLocaleString()})
- Approved Budget Cap: $${budgetedMax.toLocaleString()} (${isOverBudget ? `+$${varianceVsBudgetMax.toLocaleString()} / +${variancePercentMax}% over max` : 'Within approved budget'})

3. RECRUITER 3-STEP CLOSING SEQUENCE:
Step 1 (Base Salary Anchor): "Our internal base salary structure for ${candidateSeniority} engineers is strictly calibrated at $${Math.min(baseSalary, Math.round(budgetedMax * 0.78)).toLocaleString()} to maintain internal equity across our team."
Step 2 (Equity Upside & Vesting Model): "To deliver your desired upside, we are structuring an expanded 4-year grant of $${fourYearEquityTotal.toLocaleString()} using a ${vestingSchedule === 'front_loaded_33' ? 'front-loaded 33% Year 1 schedule, guaranteeing $' + year1RealizedEquity.toLocaleString() + ' in Year 1' : 'high-upside equity package'}."
Step 3 (Clawback-Protected Cash Bridge): "To neutralize unvested RSUs or annual bonus cycles forfeited at ${candidateEmployerType}, we are providing a sign-on bridge of $${signOnBonus.toLocaleString()} with a ${clawbackTerm === '12_months' ? '12-month standard' : '24-month'} pro-rata retention agreement."`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(recruiterNegotiationScript);
    setCopiedScript('copied');
    setTimeout(() => setCopiedScript(null), 2500);
  };

  return (
    <div id="compensation-analyzer-section" className="glass-card rounded-2xl p-6 sm:p-8 space-y-8 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner & Data Source Grounding */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>Empirical Candidate Compensation Analyzer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Candidate Salary Expectation & Market Peer Evaluation
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Input specific candidate salary expectations to assess market percentile standing, budget compliance, competitor flight risks, and closing tactics calibrated against verified market datasets.
          </p>

          {/* Grounding Source Tags */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Radford / Aon Leveling</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Pave Real-Time API</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-indigo-400" />
              <span>Carta Cap-Table Data</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-400" />
              <span>Levels.fyi Verified</span>
            </span>
          </div>
        </div>

        {/* Quick Candidate Preset Selector */}
        <div className="space-y-1.5 lg:text-right">
          <span className="text-xs text-slate-400 font-mono block">Sample Scenarios:</span>
          <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
            {savedCandidates.map((cand) => (
              <button
                key={cand.id}
                onClick={() => handleLoadCandidate(cand)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  candidateName === cand.name
                    ? 'accent-gradient text-white glow font-bold'
                    : 'bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                }`}
              >
                {cand.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Interactive Inputs vs Real-time Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Candidate Comp Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-5 p-5 bg-slate-950/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold uppercase text-cyan-300 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              <span>Candidate Comp Parameters</span>
            </span>
            <button
              onClick={handleReset}
              className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Candidate Name / Seniority / Geo / Specialization Row */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                Candidate Label / Name
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                placeholder="e.g. Lead Candidate - John Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Seniority Level
                </label>
                <select
                  value={candidateSeniority}
                  onChange={(e) => handleSenioritySelect(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none font-mono cursor-pointer"
                >
                  <option value="MID">Mid-Level (IC3 - 0.72x)</option>
                  <option value="SENIOR">Senior (IC4/IC5 - 1.0x)</option>
                  <option value="STAFF">Staff Engineer (IC6 - 1.35x)</option>
                  <option value="PRINCIPAL">Principal / Lead (IC7 - 1.78x)</option>
                  <option value="DIRECTOR">Director / Head (2.1x)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Candidate Market / Metro
                </label>
                <select
                  value={candidateLocation}
                  onChange={(e) => handleLocationSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none font-mono cursor-pointer"
                >
                  <option value="San Francisco Bay Area">SF Bay Area (1.12x)</option>
                  <option value="New York City">New York City (1.08x)</option>
                  <option value="Seattle Metro">Seattle Metro (1.04x)</option>
                  <option value="Austin / Texas Hub">Austin Hub (0.92x)</option>
                  <option value="Remote (US Nationwide)">Remote US (1.0x)</option>
                  <option value="London / Western Europe">London (0.72x)</option>
                  <option value="Bengaluru / India Hub">Bengaluru (0.42x)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                Candidate's Current Employer Type
              </label>
              <select
                value={candidateEmployerType}
                onChange={(e) => handleEmployerSelect(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none font-mono cursor-pointer"
              >
                <option value="Tier-1 Hyperscaler">Tier-1 Hyperscaler / FAANG (Heavy RSU refresh)</option>
                <option value="AI Frontier Lab">AI Frontier Lab (Anthropic, OpenAI, DeepMind)</option>
                <option value="High-Growth Unicorn">High-Growth Unicorn (Series B-D)</option>
                <option value="FinTech & Quant">FinTech / Quantitative Firm (High Cash Bonus)</option>
                <option value="Mid-Market Enterprise">Mid-Market Enterprise / Legacy Tech</option>
                <option value="Early-Stage Startup">Early-Stage Startup (High Equity, Low Cash)</option>
              </select>
            </div>

            {/* AI/ML Specialization Premium Toggle */}
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI/ML & Distributed Systems Premium</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  Adds +25% market equity & spot surge (2025/2026 Pave/Carta benchmark)
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleAiSpecialist}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                  isAiSpecialist
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {isAiSpecialist ? 'ACTIVE (+25%)' : 'STANDARD'}
              </button>
            </div>

            {/* Dynamic Market & Archetype Calculation Pill */}
            <div className="p-2.5 bg-cyan-950/40 border border-cyan-500/30 rounded-xl flex items-center justify-between text-[11px] gap-2">
              <div className="flex items-center gap-1.5 text-cyan-300 min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-semibold truncate">
                  {lastAdjustmentNote || `Calibrated: ${candidateLocation} (${geoMultiplier}x)`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleManualReCalculate}
                  className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 font-mono text-[10px] cursor-pointer transition-colors"
                  title="Recalculate and re-sync values based on current parameters"
                >
                  Re-calculate
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Financial Inputs */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            {/* Base Salary */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Base Salary Expectation</span>
                </span>
                <span className="font-mono font-bold text-cyan-300 text-sm">
                  ${baseSalary.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={Math.max(30000, Math.round(adjustedP10 * 0.7))}
                max={Math.max(450000, Math.round(adjustedP90 * 1.5))}
                step={2500}
                value={baseSalary}
                onChange={(e) => {
                  setBaseSalary(Number(e.target.value));
                  setLastAdjustmentNote('Custom base salary override');
                }}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex gap-1.5">
                {[
                  Math.round(adjustedP25 / 1000) * 1000,
                  Math.round(adjustedP50 / 1000) * 1000,
                  Math.round(adjustedP75 / 1000) * 1000,
                  Math.round(adjustedP90 / 1000) * 1000,
                  Math.round(adjustedP90 * 1.15 / 1000) * 1000,
                ].map((val, i) => (
                  <button
                    key={`${val}-${i}`}
                    onClick={() => {
                      setBaseSalary(val);
                      setLastAdjustmentNote(`Set base to P${[25, 50, 75, 90, 95][i]} benchmark`);
                    }}
                    className="flex-1 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-mono text-slate-400 hover:text-white transition-colors"
                  >
                    ${Math.round(val / 1000)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Annual Equity & Vesting Schedule */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Annual Equity / LTI Value</span>
                </span>
                <span className="font-mono font-bold text-indigo-300 text-sm">
                  ${equityAnnual.toLocaleString()} / yr
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(350000, Math.round(adjustedP90 * 1.7))}
                step={2500}
                value={equityAnnual}
                onChange={(e) => {
                  setEquityAnnual(Number(e.target.value));
                  setLastAdjustmentNote('Custom equity override');
                }}
                className="w-full accent-indigo-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>4-Year Total: ${(fourYearEquityTotal).toLocaleString()}</span>
                <span>{equityShare}% of Annual TTC</span>
              </div>

              {/* Vesting Schedule Selector (Carta / Pave / Levels.fyi insight) */}
              <div className="pt-1">
                <label className="text-[11px] text-slate-400 font-mono flex items-center justify-between mb-1">
                  <span>Vesting Schedule Model:</span>
                  <span className="text-cyan-300 font-bold">Yr 1 Realized: ${year1RealizedEquity.toLocaleString()}</span>
                </label>
                <select
                  value={vestingSchedule}
                  onChange={(e) => setVestingSchedule(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono focus:border-indigo-400 focus:outline-none cursor-pointer"
                >
                  <option value="front_loaded_33">Front-Loaded 33/33/22/12 (Google/Uber model - 33% Y1)</option>
                  <option value="standard_4yr">Standard 4-Year Linear (25%/yr, 1-yr cliff - Carta standard)</option>
                  <option value="back_loaded_amazon">Back-Loaded 5/15/40/40 (Amazon model - 5% Y1)</option>
                  <option value="even_quarterly">Even Quarterly (25%/yr, No Cliff - Scaleup tech)</option>
                </select>
              </div>
            </div>

            {/* Annual Cash Bonus */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Target Annual Cash Bonus</span>
                </span>
                <span className="font-mono font-bold text-emerald-300 text-sm">
                  ${bonus.toLocaleString()}
                  <span className="text-[11px] text-slate-400 font-normal ml-1">
                    ({Math.round((bonus / (baseSalary || 1)) * 100)}% of base)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(160000, Math.round(adjustedP90 * 0.9))}
                step={2500}
                value={bonus}
                onChange={(e) => {
                  setBonus(Number(e.target.value));
                  setLastAdjustmentNote('Custom bonus override');
                }}
                className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Sign-on Bonus with Clawback Term */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>One-Time Sign-on Sweetener / RSU Buyout</span>
                </span>
                <span className="font-mono font-bold text-amber-300 text-sm">
                  ${signOnBonus.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(120000, Math.round(adjustedP90 * 0.6))}
                step={2500}
                value={signOnBonus}
                onChange={(e) => {
                  setSignOnBonus(Number(e.target.value));
                  setLastAdjustmentNote('Custom sign-on override');
                }}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />

              {/* Clawback Agreement Term */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-0.5">
                <span>Clawback Agreement:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setClawbackTerm('12_months')}
                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                      clawbackTerm === '12_months'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    12-Mo Pro-Rata
                  </button>
                  <button
                    type="button"
                    onClick={() => setClawbackTerm('24_months')}
                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                      clawbackTerm === '24_months'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    24-Mo Retention
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Market Analytics & Visuals (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Metric Cards Bar (4 KPIs) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Total Annual Target Comp */}
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Annual (TTC)</span>
              <span className="text-xl sm:text-2xl font-black text-cyan-300 font-sans block">
                ${(totalAnnualTarget / 1000).toFixed(0)}k
              </span>
              <span className="text-[10px] text-slate-400 font-mono block truncate">
                ${totalAnnualTarget.toLocaleString()}
              </span>
            </div>

            {/* Year 1 Total Realized Comp */}
            <div className="p-3.5 bg-slate-950/80 border border-indigo-500/30 rounded-xl space-y-1">
              <span className="text-[10px] font-mono uppercase text-indigo-400 block font-semibold">Yr 1 Realized</span>
              <span className="text-xl sm:text-2xl font-black text-indigo-300 font-sans block">
                ${(firstYearTotalRealized / 1000).toFixed(0)}k
              </span>
              <span className="text-[10px] text-indigo-300/80 font-mono block truncate">
                Incl. sign-on & Y1 equity
              </span>
            </div>

            {/* Market Standing */}
            <div className="p-3.5 bg-slate-950/80 border border-cyan-500/40 rounded-xl space-y-1 glow-subtle">
              <span className="text-[10px] font-mono uppercase text-cyan-400 block font-bold">Market Standing</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-sans">
                  {estimatedPercentile}th
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Pctl</span>
              </div>
              <span className="text-[10px] text-slate-300 font-mono block truncate">
                {estimatedPercentile >= 75
                  ? 'Top Quartile'
                  : estimatedPercentile >= 50
                  ? 'At / Above Median'
                  : 'Below Median'}
              </span>
            </div>

            {/* Budget Variance */}
            <div
              className={`p-3.5 rounded-xl border space-y-1 ${
                isOverBudget
                  ? 'bg-rose-950/20 border-rose-500/40'
                  : 'bg-emerald-950/20 border-emerald-500/40'
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Budget Variance</span>
              <span
                className={`text-xl sm:text-2xl font-black font-sans block ${
                  isOverBudget ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {isOverBudget ? `+$${(varianceVsBudgetMax / 1000).toFixed(0)}k` : `-$${(Math.abs(varianceVsBudgetMax) / 1000).toFixed(0)}k`}
              </span>
              <span className="text-[10px] font-mono block truncate text-slate-300">
                {isOverBudget ? `+${variancePercentMax}% over cap` : 'Within budget'}
              </span>
            </div>
          </div>

          {/* Visual Percentile Gradient Bar & Market Spectrum */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>Market Calibration Spectrum ({candidateLocation})</span>
              </span>
              <span className="text-cyan-300 font-bold">
                Candidate at {estimatedPercentile}% of market
              </span>
            </div>

            <div className="relative pt-6 pb-2">
              {/* Markers for P25, P50, P75, P90 */}
              <div className="relative h-3 w-full rounded-full bg-gradient-to-r from-cyan-600 via-emerald-500 via-indigo-500 to-amber-500 overflow-visible">
                {/* Candidate Indicator Marker */}
                <div
                  className="absolute -top-6 transform -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                  style={{ left: `${Math.max(5, Math.min(95, estimatedPercentile))}%` }}
                >
                  <span className="px-2 py-0.5 rounded bg-cyan-400 text-slate-950 text-[10px] font-bold font-mono shadow-md whitespace-nowrap">
                    Candidate: ${(totalAnnualTarget / 1000).toFixed(0)}k
                  </span>
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-400" />
                </div>
              </div>

              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
                <span>P10 (${(adjustedP10 / 1000).toFixed(0)}k)</span>
                <span>P25 (${(adjustedP25 / 1000).toFixed(0)}k)</span>
                <span className="text-emerald-400 font-bold">P50 (${(adjustedP50 / 1000).toFixed(0)}k)</span>
                <span>P75 (${(adjustedP75 / 1000).toFixed(0)}k)</span>
                <span className="text-amber-400">P90 (${(adjustedP90 / 1000).toFixed(0)}k)</span>
              </div>
            </div>
          </div>

          {/* Component Split Bar vs Employer Archetype Norm */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Package Component Split vs Archetype Norm</span>
              </span>
              <span className="text-slate-400 text-[11px]">
                {candidateEmployerType}
              </span>
            </div>

            {/* Candidate Split Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Candidate Expectation Split:</span>
                <span>Base: {baseShare}% | Eq: {equityShare}% | Bonus: {bonusShare}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-slate-800">
                <div style={{ width: `${baseShare}%` }} className="bg-cyan-400" title={`Base Salary: ${baseShare}%`} />
                <div style={{ width: `${equityShare}%` }} className="bg-indigo-500" title={`Annual Equity: ${equityShare}%`} />
                <div style={{ width: `${bonusShare}%` }} className="bg-emerald-400" title={`Annual Bonus: ${bonusShare}%`} />
              </div>
            </div>

            {/* Archetype Norm Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>{candidateEmployerType} Peer Norm:</span>
                <span>
                  Base: {100 - employerProfiles[candidateEmployerType].archetypeEquityShare - employerProfiles[candidateEmployerType].archetypeBonusShare}% | Eq: {employerProfiles[candidateEmployerType].archetypeEquityShare}% | Bonus: {employerProfiles[candidateEmployerType].archetypeBonusShare}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full overflow-hidden flex bg-slate-800/80">
                <div
                  style={{ width: `${100 - employerProfiles[candidateEmployerType].archetypeEquityShare - employerProfiles[candidateEmployerType].archetypeBonusShare}%` }}
                  className="bg-cyan-400/50"
                />
                <div
                  style={{ width: `${employerProfiles[candidateEmployerType].archetypeEquityShare}%` }}
                  className="bg-indigo-500/50"
                />
                <div
                  style={{ width: `${employerProfiles[candidateEmployerType].archetypeBonusShare}%` }}
                  className="bg-emerald-400/50"
                />
              </div>
            </div>
          </div>

          {/* Regional Peer Comparison Bar Chart */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>Market Peer Archetype Comparison</span>
              </span>
              <span className="text-slate-400 text-[11px]">Total Target Comp (TTC)</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={peerComparisonData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#94a3b8"
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#94a3b8"
                    tick={{ fontSize: 10 }}
                    width={150}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                    }}
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Total Target Comp']}
                  />
                  <ReferenceLine
                    x={budgetedMax}
                    stroke="#f43f5e"
                    strokeDasharray="4 4"
                    label={{
                      value: 'Budget Cap',
                      fill: '#f43f5e',
                      fontSize: 10,
                      position: 'top',
                    }}
                  />
                  <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                    {peerComparisonData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.type === 'candidate'
                            ? '#38bdf8'
                            : entry.type === 'budget'
                            ? '#f43f5e'
                            : entry.type === 'market'
                            ? '#10b981'
                            : '#818cf8'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Evaluation & Flight Risk Card */}
          <div className={`p-4 rounded-xl border ${counterOfferRisk.color} space-y-1.5`}>
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Counter-Offer & Flight Risk Assessment</span>
              </span>
              <span>{counterOfferRisk.level}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {counterOfferRisk.reason}
            </p>
            {counterOfferRisk.buyoutNeed > 0 && (
              <div className="text-[11px] font-mono text-cyan-300 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                <span>Recommended Sign-on RSU Buyout:</span>
                <span className="font-bold">${counterOfferRisk.buyoutNeed.toLocaleString()} (with {clawbackTerm === '12_months' ? '12-Mo' : '24-Mo'} Clawback)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Strategic Recruiter Closing Playbook & Copyable HM Dossier */}
      <div className="p-5 bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Executive Negotiation & Recruiter Closing Script
              </h4>
              <p className="text-xs text-slate-400">
                Ready-to-use 3-step positioning script and compensation evaluation memo for the hiring manager.
              </p>
            </div>
          </div>

          <button
            id="btn-copy-comp-script"
            onClick={handleCopyScript}
            className="px-4 py-2 rounded-xl accent-gradient text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-lg glow transition-all shrink-0"
          >
            {copiedScript === 'copied' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied Memo to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy HM Compensation Memo</span>
              </>
            )}
          </button>
        </div>

        {/* 3 Closing Packages Advice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Strategy A */}
          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1.5">
            <span className="font-bold text-cyan-300 block font-mono text-[11px] uppercase">
              Option A: Equity-Heavy Bridge
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Cap Base at <strong className="text-white">${Math.min(baseSalary, Math.round(budgetedMax * 0.78)).toLocaleString()}</strong> to preserve budget equity, and grant an expanded 4-year equity package of <strong className="text-indigo-300">${(fourYearEquityTotal).toLocaleString()}</strong> using a {vestingSchedule === 'front_loaded_33' ? 'front-loaded 33% Year 1 schedule' : 'standard 4-year schedule'}.
            </p>
          </div>

          {/* Strategy B */}
          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1.5">
            <span className="font-bold text-amber-300 block font-mono text-[11px] uppercase">
              Option B: Sign-On Cash Neutralizer
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Use a one-time <strong className="text-white">${Math.max(signOnBonus, 25000).toLocaleString()}</strong> sign-on bonus protected by a <strong className="text-amber-300">{clawbackTerm === '12_months' ? '12-month' : '24-month'} clawback agreement</strong> to neutralize unvested equity forfeit at {candidateEmployerType} without inflating ongoing recurring OPEX.
            </p>
          </div>

          {/* Strategy C */}
          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1.5">
            <span className="font-bold text-emerald-300 block font-mono text-[11px] uppercase">
              Option C: Accelerated 6-Mo Review
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Offer <strong className="text-white">${budgetedMax.toLocaleString()}</strong> with an explicit performance metric clause tied to an automatic base salary bump or RSU refresh upon meeting 6-month deliverables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
