import React, { useState, useMemo } from 'react';
import { WorkModel } from '../types';
import { Sliders, RefreshCw, TrendingUp, Users, Clock, AlertCircle, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import { Tooltip, METHODOLOGY_EXPLANATIONS } from './Tooltip';

export interface PivotSimulatorProps {
  /** Baseline talent availability score from report (0-100) */
  baseAvailabilityScore?: number;
  /** Baseline recruiting difficulty score from report (0-100) */
  baseDifficultyScore?: number;
  /** Baseline addressable candidate count */
  baseAddressableCount?: number;
  /** Baseline expected time to fill in calendar days */
  baseTimeToFillDays?: number;
  /** Initial work model requirement */
  initialWorkModel?: WorkModel;
  /** Initial base radius in miles */
  initialRadiusMiles?: number;
  /** Target base salary for compensation modeling */
  initialBaseSalary?: number;
  /** Callback fired whenever simulation outputs change */
  onSimulationChange?: (simulatedMetrics: SimulatedOutputs) => void;
  /** Optional custom container class */
  className?: string;
}

export interface SimulatedOutputs {
  simWorkModel: WorkModel;
  simRadiusDelta: number;
  simCompDelta: number;
  simulatedAvailability: number;
  simulatedDifficulty: number;
  simulatedAddressable: number;
  simulatedTTF: number;
  availabilityBand: string;
  difficultyBand: string;
  netTalentYieldPercent: number;
}

/**
 * Enterprise Pivot Simulator
 * Allows hiring executives and lead recruiters to model organizational pivots
 * (Work Model, Search Radius, and Compensation Adjustments) and observe instant
 * mathematical impacts on talent supply, hiring velocity, and market friction.
 */
export const PivotSimulator: React.FC<PivotSimulatorProps> = ({
  baseAvailabilityScore = 32,
  baseDifficultyScore = 88,
  baseAddressableCount = 2202,
  baseTimeToFillDays = 65,
  initialWorkModel = 'HYBRID',
  initialRadiusMiles = 35,
  initialBaseSalary = 220000,
  onSimulationChange,
  className = '',
}) => {
  // ============================================================================
  // 1. SIMULATOR INPUT STATE
  // ============================================================================
  const [workModel, setWorkModel] = useState<WorkModel>(initialWorkModel);
  const [radiusDeltaMiles, setRadiusDeltaMiles] = useState<number>(0); // 0 to 100 miles
  const [compDeltaPercent, setCompDeltaPercent] = useState<number>(0); // -20% to +20%

  // ============================================================================
  // 2. MATHEMATICAL SENSITIVITY ENGINE
  // ============================================================================
  // Explanatory Note on Calculations:
  // - Work Model: Mandatory ON-SITE incurs a steep -14 availability penalty and +15 days TTF
  //   due to regional resistance. REMOTE opens the national aperture (+22 pts, -18 days TTF, ~3.2x talent pool).
  // - Radius Expansion: Each +25 miles broadens the commuter shed, capturing suburban / adjacent feeder corridors (+6 pts per 25mi).
  // - Comp Delta: For each +5% above market, candidate response velocity jumps, mitigating counter-offers (-3 days TTF, +4 availability pts).
  const simulatedResults = useMemo<SimulatedOutputs>(() => {
    // Work Model shift coefficients
    const workModelAvailabilityShift =
      workModel === 'REMOTE' ? 22 : workModel === 'HYBRID' ? 0 : -14;
    const workModelDifficultyShift =
      workModel === 'REMOTE' ? -18 : workModel === 'HYBRID' ? 0 : 12;
    const workModelTTFShift =
      workModel === 'REMOTE' ? -18 : workModel === 'HYBRID' ? 0 : 15;
    const workModelSupplyMultiplier =
      workModel === 'REMOTE' ? 3.2 : workModel === 'HYBRID' ? 1.0 : 0.72;

    // Radius Expansion coefficients (0 to 100 miles)
    const radiusFactor = Math.round((radiusDeltaMiles / 50) * 12);
    const radiusSupplyBoost = 1 + (radiusDeltaMiles / 100) * 0.85;
    const radiusTTFShift = -Math.round((radiusDeltaMiles / 25) * 3);

    // Compensation Adjustment coefficients (-20% to +20%)
    const compFactor = Math.round((compDeltaPercent / 20) * 16);
    const compTTFShift = -Math.round((compDeltaPercent / 10) * 6);

    // Bounded synthetic metric values (0-100 scores)
    const simulatedAvailability = Math.max(
      5,
      Math.min(95, baseAvailabilityScore + workModelAvailabilityShift + radiusFactor + compFactor)
    );
    const simulatedDifficulty = Math.max(
      10,
      Math.min(98, baseDifficultyScore + workModelDifficultyShift - radiusFactor - compFactor)
    );

    // Simulated Addressable Headcount
    const simulatedAddressable = Math.round(
      baseAddressableCount * workModelSupplyMultiplier * radiusSupplyBoost
    );

    // Simulated Time to Fill (clamped between 25 and 120 days)
    const simulatedTTF = Math.max(
      25,
      Math.min(120, baseTimeToFillDays + workModelTTFShift + radiusTTFShift + compTTFShift)
    );

    // Qualitative Bands
    const getAvailBand = (s: number) => {
      if (s >= 75) return 'Very High Availability';
      if (s >= 55) return 'High Availability';
      if (s >= 35) return 'Moderate Availability';
      if (s >= 20) return 'Low Availability';
      return 'Extremely Scarce';
    };

    const getDiffBand = (s: number) => {
      if (s >= 80) return 'Extremely Difficult';
      if (s >= 60) return 'Difficult';
      if (s >= 40) return 'Challenging';
      if (s >= 20) return 'Manageable';
      return 'Easy';
    };

    const netTalentYieldPercent = Math.round(
      ((simulatedAddressable - baseAddressableCount) / baseAddressableCount) * 100
    );

    const outputs: SimulatedOutputs = {
      simWorkModel: workModel,
      simRadiusDelta: radiusDeltaMiles,
      simCompDelta: compDeltaPercent,
      simulatedAvailability,
      simulatedDifficulty,
      simulatedAddressable,
      simulatedTTF,
      availabilityBand: getAvailBand(simulatedAvailability),
      difficultyBand: getDiffBand(simulatedDifficulty),
      netTalentYieldPercent,
    };

    if (onSimulationChange) {
      onSimulationChange(outputs);
    }

    return outputs;
  }, [
    workModel,
    radiusDeltaMiles,
    compDeltaPercent,
    baseAvailabilityScore,
    baseDifficultyScore,
    baseAddressableCount,
    baseTimeToFillDays,
    onSimulationChange,
  ]);

  // Handle Reset to Initial Baseline
  const handleResetBaseline = () => {
    setWorkModel(initialWorkModel);
    setRadiusDeltaMiles(0);
    setCompDeltaPercent(0);
  };

  const calculatedBaseSalary = Math.round(initialBaseSalary * (1 + compDeltaPercent / 100));

  return (
    <div className={`glass-card rounded-2xl p-6 space-y-6 border border-slate-800 ${className}`}>
      {/* Header & Reset Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Interactive Scenario Intelligence</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-0.5">
            Real-Time Market Sensitivity & Pivot Simulator
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Dynamically adjust policy parameters to see real-time impact on addressable supply, hiring friction, and time to fill.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetBaseline}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold text-slate-300 hover:text-cyan-300 bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
          title="Restore baseline parameters from uploaded job specification"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Baseline</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* =========================================================================
            CONTROLS SECTION (Columns 1-7)
        ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Control 1: Segmented Work Model Toggle */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label
                id="work-model-group-label"
                className="text-xs font-semibold text-slate-200 flex items-center gap-1.5"
              >
                <span>Work Model Policy</span>
                <Tooltip content="Mandatory on-site policies restrict candidate pool to immediate commuting radius; Remote eliminates geo-fencing." />
              </label>
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase">
                {workModel}
              </span>
            </div>

            <div
              role="radiogroup"
              aria-labelledby="work-model-group-label"
              className="grid grid-cols-3 gap-2 p-1 bg-slate-950/80 border border-slate-800 rounded-xl"
            >
              {(['ON-SITE', 'HYBRID', 'REMOTE'] as WorkModel[]).map((wm) => {
                const isSelected = workModel === wm;
                return (
                  <button
                    key={wm}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setWorkModel(wm)}
                    className={`py-2 px-3 text-xs font-bold font-mono rounded-lg transition-all cursor-pointer text-center ${
                      isSelected
                        ? 'accent-gradient text-white shadow-md glow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    {wm}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Control 2: Geographic Search Radius Range Slider (0 to 100 miles) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="radius-slider" className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span>Geographic Search Radius Expansion</span>
                <Tooltip content="Expands commuter radius around metro epicenter. Captures suburban tech corridors and regional feeder metros." />
              </label>
              <span className="font-mono font-bold text-cyan-400">
                +{radiusDeltaMiles} Miles{' '}
                <span className="text-slate-500 font-normal">
                  (Total: {initialRadiusMiles + radiusDeltaMiles} mi)
                </span>
              </span>
            </div>

            <div className="space-y-1">
              <input
                id="radius-slider"
                type="range"
                min="0"
                max="100"
                step="10"
                value={radiusDeltaMiles}
                onChange={(e) => setRadiusDeltaMiles(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-950/90 border border-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label="Geographic search radius expansion slider"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 px-0.5">
                <span>0 mi (Baseline)</span>
                <span>+50 mi</span>
                <span>+100 mi (Wide Corridor)</span>
              </div>
            </div>
          </div>

          {/* Control 3: Compensation Adjustment Range Slider (-20% to +20%) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="comp-slider" className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span>Compensation Adjustment</span>
                <Tooltip content={METHODOLOGY_EXPLANATIONS.compPercentiles} />
              </label>
              <span
                className={`font-mono font-bold ${
                  compDeltaPercent > 0
                    ? 'text-emerald-400'
                    : compDeltaPercent < 0
                    ? 'text-rose-400'
                    : 'text-slate-300'
                }`}
              >
                {compDeltaPercent > 0
                  ? `+${compDeltaPercent}%`
                  : compDeltaPercent < 0
                  ? `${compDeltaPercent}%`
                  : 'Baseline (0%)'}
                <span className="text-slate-500 font-normal ml-1">
                  (~${(calculatedBaseSalary / 1000).toFixed(0)}k Base)
                </span>
              </span>
            </div>

            <div className="space-y-1">
              <input
                id="comp-slider"
                type="range"
                min="-20"
                max="20"
                step="2.5"
                value={compDeltaPercent}
                onChange={(e) => setCompDeltaPercent(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-950/90 border border-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                aria-label="Compensation adjustment slider"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 px-0.5">
                <span className="text-rose-400">-20% (Cost Savings)</span>
                <span>0% (Market Parity)</span>
                <span className="text-emerald-400">+20% (Aggressive Close)</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SIMULATED REAL-TIME OUTPUTS (Columns 8-12)
        ========================================================================= */}
        <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simulated Projection</span>
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                simulatedResults.netTalentYieldPercent >= 0
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/15 text-rose-300 border border-rose-500/40'
              }`}
            >
              {simulatedResults.netTalentYieldPercent >= 0 ? (
                <>
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  <span>+{simulatedResults.netTalentYieldPercent}% Pool Yield</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-3 h-3 text-rose-400" />
                  <span>{simulatedResults.netTalentYieldPercent}% Pool Yield</span>
                </>
              )}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Projected Addressable Talent */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono font-semibold uppercase text-slate-400">
                Addressable Pool
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                {simulatedResults.simulatedAddressable.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                <Users className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>Base: {baseAddressableCount.toLocaleString()}</span>
              </div>
            </div>

            {/* Projected Time to Fill (TTF) */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono font-semibold uppercase text-slate-400 flex items-center gap-1">
                <span>Est. TTF</span>
                <Tooltip content={METHODOLOGY_EXPLANATIONS.ttf} />
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">
                {simulatedResults.simulatedTTF}{' '}
                <span className="text-xs font-normal text-slate-400">Days</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>Base: {baseTimeToFillDays} Days</span>
              </div>
            </div>

            {/* Simulated Talent Availability Score */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono font-semibold uppercase text-slate-400">
                Availability Index
              </div>
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
                {simulatedResults.simulatedAvailability}
                <span className="text-xs text-slate-500 font-normal">/100</span>
              </div>
              <div className="text-[10px] text-slate-300 truncate">
                {simulatedResults.availabilityBand}
              </div>
            </div>

            {/* Simulated Hiring Difficulty */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono font-semibold uppercase text-slate-400 flex items-center gap-1">
                <span>Hiring Friction</span>
                <Tooltip content={METHODOLOGY_EXPLANATIONS.recruitingFriction} />
              </div>
              <div
                className={`text-lg sm:text-xl font-bold font-mono ${
                  simulatedResults.simulatedDifficulty >= 75
                    ? 'text-rose-400'
                    : simulatedResults.simulatedDifficulty >= 50
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {simulatedResults.simulatedDifficulty}
                <span className="text-xs text-slate-500 font-normal">/100</span>
              </div>
              <div className="text-[10px] text-slate-300 truncate">
                {simulatedResults.difficultyBand}
              </div>
            </div>
          </div>

          {/* Quick Scenario Executive Takeaway */}
          <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-slate-300 leading-snug flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              {workModel === 'REMOTE'
                ? 'Unlocking Remote policy increases addressable headcount by >3x and compresses time-to-fill by ~18 days.'
                : compDeltaPercent > 10
                ? 'Above-market compensation significantly boosts outbound conversion against tier-1 competitors.'
                : 'Current policy maintains local market constraints; consider +25mi commuter radius to unlock feeder pipelines.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
