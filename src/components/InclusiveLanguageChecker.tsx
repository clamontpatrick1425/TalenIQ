import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Info,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';
import {
  analyzeInclusiveLanguage,
  assessInclusivity,
  replaceFlaggedWord,
  replaceAllFlaggedWords,
  InclusiveLanguageFlag,
  InclusiveCategory,
} from '../utils/inclusiveLanguage';

export interface InclusiveLanguageCheckerProps {
  jdText: string;
  onApplyFixes?: (updatedText: string) => void;
  className?: string;
}

const CATEGORY_META: Record<
  InclusiveCategory,
  { label: string; badgeClass: string; borderClass: string }
> = {
  'gendered': {
    label: 'Gendered Phrasing',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    borderClass: 'border-purple-500/20',
  },
  'age': {
    label: 'Ageist Proxy',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    borderClass: 'border-rose-500/20',
  },
  'ableist': {
    label: 'Ableist Idiom',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    borderClass: 'border-amber-500/20',
  },
  'aggressive-culture': {
    label: 'Bro / Aggressive Slang',
    badgeClass: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    borderClass: 'border-orange-500/20',
  },
};

export const InclusiveLanguageChecker: React.FC<InclusiveLanguageCheckerProps> = ({
  jdText,
  onApplyFixes,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [justFixed, setJustFixed] = useState<boolean>(false);
  const [recentlyFixedWord, setRecentlyFixedWord] = useState<string | null>(null);

  // Compute assessment metrics
  const assessment = useMemo(() => {
    return assessInclusivity(jdText);
  }, [jdText]);

  const { flags, totalIssues, inclusivityScore, categoryCounts } = assessment;

  // Handler to replace all flagged occurrences
  const handleFixAll = () => {
    if (!onApplyFixes || flags.length === 0) return;
    const updated = replaceAllFlaggedWords(jdText, flags);
    onApplyFixes(updated);
    setJustFixed(true);
    setTimeout(() => setJustFixed(false), 2500);
  };

  // Handler to replace a single flagged word
  const handleFixSingle = (flag: InclusiveLanguageFlag) => {
    if (!onApplyFixes) return;
    const primaryReplacement = flag.suggestion.split('/')[0].trim();
    const updated = replaceFlaggedWord(jdText, flag.word, primaryReplacement);
    onApplyFixes(updated);
    setRecentlyFixedWord(flag.word);
    setTimeout(() => setRecentlyFixedWord(null), 2000);
  };

  // If there's no text yet, don't clutter the UI
  if (!jdText || jdText.trim().length === 0) {
    return null;
  }

  // 100% Clean State
  if (totalIssues === 0) {
    return (
      <div
        className={`p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs flex items-center justify-between gap-3 text-emerald-300 transition-all ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-white">
              D&amp;I Inclusive Language Check: 100% Clean
            </span>
            <span className="text-emerald-400/90 ml-1.5 hidden sm:inline">
              Zero gendered, age-biased, or exclusionary terminology detected.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>EEOC / D&amp;I Ready</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-amber-500/30 bg-slate-900/95 overflow-hidden shadow-lg transition-all ${className}`}
    >
      {/* Header Banner */}
      <div className="p-3.5 sm:px-4 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                D&amp;I Inclusive Language Scanner
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {totalIssues} {totalIssues === 1 ? 'flag' : 'flags'} detected
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Identifies exclusionary jargon, ageist proxies, or gendered terms that depress candidate pipeline diversity.
            </p>
          </div>
        </div>

        {/* Action Controls & Health Score */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Health Score Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono">
            <span className="text-slate-400">Inclusivity:</span>
            <span
              className={`font-bold ${
                inclusivityScore >= 80
                  ? 'text-emerald-400'
                  : inclusivityScore >= 60
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {inclusivityScore}%
            </span>
          </div>

          {/* Fix All Button */}
          {onApplyFixes && (
            <button
              type="button"
              onClick={handleFixAll}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Replace all flagged non-inclusive words with enterprise suggestions"
            >
              {justFixed ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Applied All Fixes!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Fix All ({totalIssues})</span>
                </>
              )}
            </button>
          )}

          {/* Expand/Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700"
            title={isExpanded ? 'Collapse scanner details' : 'Expand scanner details'}
          >
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content View */}
      {isExpanded && (
        <div className="p-4 space-y-3 bg-slate-950/60">
          {/* Category Metric Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono pb-1">
            {categoryCounts['aggressive-culture'] > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-300">
                Aggressive/Bro: {categoryCounts['aggressive-culture']}
              </span>
            )}
            {categoryCounts['age'] > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300">
                Ageist Proxy: {categoryCounts['age']}
              </span>
            )}
            {categoryCounts['gendered'] > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300">
                Gendered: {categoryCounts['gendered']}
              </span>
            )}
            {categoryCounts['ableist'] > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300">
                Ableist: {categoryCounts['ableist']}
              </span>
            )}
          </div>

          {/* Flagged Item Cards */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
            {flags.map((flag, idx) => {
              const meta = CATEGORY_META[flag.category];
              const isRecent = recentlyFixedWord === flag.word;

              return (
                <div
                  key={`${flag.word}-${idx}`}
                  className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1.5 flex-1">
                    {/* Word and Replacement */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Flagged word badge (amber warning) */}
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-semibold flex items-center gap-1 line-through">
                        <span>&ldquo;{flag.word}&rdquo;</span>
                        {flag.occurrences > 1 && (
                          <span className="text-[10px] text-amber-400/80 not-italic">
                            (&times;{flag.occurrences})
                          </span>
                        )}
                      </span>

                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />

                      {/* Suggestion pill (subtle green) */}
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium font-mono flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>{flag.suggestion}</span>
                      </span>

                      {/* Category Badge */}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border ${meta.badgeClass}`}
                      >
                        {meta.label}
                      </span>
                    </div>

                    {/* D&I Rationale */}
                    <p className="text-[11px] text-slate-400 leading-relaxed flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span>{flag.reason}</span>
                    </p>
                  </div>

                  {/* Individual Replace Button */}
                  {onApplyFixes && (
                    <button
                      type="button"
                      onClick={() => handleFixSingle(flag)}
                      disabled={isRecent}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-medium font-mono bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 transition-all cursor-pointer shrink-0 self-start sm:self-center flex items-center gap-1 active:scale-95"
                    >
                      {isRecent ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Replaced</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3 text-emerald-400" />
                          <span>Replace</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
