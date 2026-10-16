/**
 * D&I Inclusive Language Scanner Utility
 *
 * Scans Job Description (JD) text against evidence-based diversity, equity, and inclusion
 * recruiting benchmarks. Detects gendered phrases, ageist proxies, ableist idioms,
 * and aggressive/bro-culture language, providing calibrated enterprise alternatives.
 */

export type InclusiveCategory = 'gendered' | 'age' | 'ableist' | 'aggressive-culture';

export interface InclusiveLanguageRule {
  pattern: RegExp;
  word: string;
  category: InclusiveCategory;
  suggestion: string;
  reason: string;
}

export interface InclusiveLanguageFlag {
  word: string;
  category: InclusiveCategory;
  suggestion: string;
  reason: string;
  occurrences: number;
}

export interface InclusivityAssessment {
  flags: InclusiveLanguageFlag[];
  totalIssues: number;
  inclusivityScore: number; // 0 - 100
  categoryCounts: Record<InclusiveCategory, number>;
}

/**
 * Predefined enterprise dictionary of common recruiting bias patterns & red flags
 */
export const INCLUSIVE_LANGUAGE_DICTIONARY: InclusiveLanguageRule[] = [
  // 1. Aggressive & Bro-Culture Terminology
  {
    pattern: /\b(?:ninja|ninjas)\b/gi,
    word: 'ninja',
    category: 'aggressive-culture',
    suggestion: 'technical specialist / experienced engineer',
    reason: 'Informal tech jargon that obscures required skills and deters candidates seeking structured, mature engineering environments.',
  },
  {
    pattern: /\b(?:rockstar|rockstars|rock\s*star)\b/gi,
    word: 'rockstar',
    category: 'aggressive-culture',
    suggestion: 'high-impact contributor / senior engineer',
    reason: 'Signals an individualistic, high-burnout hero culture rather than collaborative, sustainable team delivery.',
  },
  {
    pattern: /\b(?:guru|gurus)\b/gi,
    word: 'guru',
    category: 'aggressive-culture',
    suggestion: 'subject matter expert / technical lead',
    reason: 'Esoteric colloquialism that can feel exclusionary; standard enterprise technical titles communicate competency more effectively.',
  },
  {
    pattern: /\b(?:culture\s*fit)\b/gi,
    word: 'culture fit',
    category: 'aggressive-culture',
    suggestion: 'values alignment / culture add',
    reason: "'Culture fit' is a documented unconscious bias trap that often leads teams to replicate demographic homogeneity.",
  },
  {
    pattern: /\b(?:work\s*hard\s*play\s*hard)\b/gi,
    word: 'work hard play hard',
    category: 'aggressive-culture',
    suggestion: 'collaborative team with high engagement and healthy work-life balance',
    reason: 'Frequently correlates with poor workplace boundaries, long unscheduled hours, and social dynamics centered on drinking.',
  },
  {
    pattern: /\b(?:crush\s*it|kill\s*it)\b/gi,
    word: 'crush it',
    category: 'aggressive-culture',
    suggestion: 'excel / deliver high impact / drive success',
    reason: 'Hyper-competitive slang that detracts from professional role expectations and discourages collaborative candidates.',
  },
  {
    pattern: /\b(?:dominate|dominating)\b/gi,
    word: 'dominate',
    category: 'aggressive-culture',
    suggestion: 'lead / excel in / expand market presence',
    reason: 'Combative framing that research shows reduces application rates among women and underrepresented groups.',
  },
  {
    pattern: /\b(?:aggressive|aggressively)\b/gi,
    word: 'aggressive',
    category: 'aggressive-culture',
    suggestion: 'proactive / determined / goal-oriented',
    reason: 'Masculine-coded framing that can unintentionally signal an antagonistic or hostile work environment.',
  },

  // 2. Age Bias & Generational Proxies (EEOC / ADEA Concerns)
  {
    pattern: /\b(?:digital\s*native|digital\s*natives)\b/gi,
    word: 'digital native',
    category: 'age',
    suggestion: 'technically adaptable / proficient with modern cloud tooling',
    reason: 'Implies age-based exclusion against experienced candidates who mastered modern technologies later in their careers (ADEA liability).',
  },
  {
    pattern: /\b(?:young\s*(?:and|&)\s*energetic|young\s*professional|youthful)\b/gi,
    word: 'young and energetic',
    category: 'age',
    suggestion: 'proactive and highly engaged',
    reason: 'Direct age proxy that violates federal EEOC age-discrimination guidelines (Age Discrimination in Employment Act).',
  },
  {
    pattern: /\b(?:recent\s*grad(?:uate)?s?|fresh\s*grad(?:uate)?s?)\b/gi,
    word: 'recent graduate',
    category: 'age',
    suggestion: 'entry-level candidate / candidates with foundational training',
    reason: 'Excludes older candidates who made mid-career transitions, military veterans, or non-traditional bootcamp graduates.',
  },
  {
    pattern: /\b(?:fresh\s*talent)\b/gi,
    word: 'fresh talent',
    category: 'age',
    suggestion: 'emerging talent / new perspectives',
    reason: 'Can be interpreted as coded language favoring younger workers over seasoned professionals.',
  },
  {
    pattern: /\b(?:overqualified)\b/gi,
    word: 'overqualified',
    category: 'age',
    suggestion: 'possessing extensive expertise',
    reason: 'Historically utilized as a filter to reject experienced or older applicants regardless of candidate interest.',
  },

  // 3. Gendered Phrasing & Pronouns
  {
    pattern: /\b(?:manpower)\b/gi,
    word: 'manpower',
    category: 'gendered',
    suggestion: 'workforce / team capacity / personnel',
    reason: 'Male-gendered noun with accurate, professional gender-neutral alternatives.',
  },
  {
    pattern: /\b(?:chairman)\b/gi,
    word: 'chairman',
    category: 'gendered',
    suggestion: 'chair / committee lead / chairperson',
    reason: 'Gender-specific title; modern governance standards prefer gender-neutral phrasing.',
  },
  {
    pattern: /\b(?:he\s*\/\s*she|he\s*or\s*she)\b/gi,
    word: 'he/she',
    category: 'gendered',
    suggestion: 'they / the candidate / the specialist',
    reason: 'Binary phrasing that excludes non-binary professionals; standard practice is singular "they" or role-based nouns.',
  },
  {
    pattern: /\b(?:salesman|salesmen)\b/gi,
    word: 'salesman',
    category: 'gendered',
    suggestion: 'sales representative / account executive / commercial specialist',
    reason: 'Gendered job specification; standard enterprise nomenclature uses gender-neutral role titles.',
  },

  // 4. Ableist Idioms & Physical Presumptions
  {
    pattern: /\b(?:hit\s*the\s*ground\s*running)\b/gi,
    word: 'hit the ground running',
    category: 'ableist',
    suggestion: 'ramp up quickly / quickly integrate with the team',
    reason: 'Physical idiom that sets an unrealistic expectation of zero onboarding support, deterring neurodivergent and adaptive candidates.',
  },
  {
    pattern: /\b(?:blind\s*spot|blind\s*spots)\b/gi,
    word: 'blind spot',
    category: 'ableist',
    suggestion: 'unmonitored area / knowledge gap / oversight',
    reason: 'Metaphorical disability reference; precise technical terminology conveys the requirement more clearly.',
  },
  {
    pattern: /\b(?:crazy|insane)\b/gi,
    word: 'crazy',
    category: 'ableist',
    suggestion: 'extraordinary / complex / ambitious',
    reason: 'Casual ableist slang that trivializes mental health; use precise technical or descriptive adjectives.',
  },
  {
    pattern: /\b(?:crippled\s*by|crippling)\b/gi,
    word: 'crippled by',
    category: 'ableist',
    suggestion: 'constrained by / bottlenecked by / impeded by',
    reason: 'Ableist medical imagery; engineering terms such as "bottlenecked" or "throttled" are far more accurate.',
  },
  {
    pattern: /\b(?:daily\s*stand-?up|stand-?ups)\b/gi,
    word: 'stand-up',
    category: 'ableist',
    suggestion: 'daily sync / daily scrum / team alignment',
    reason: 'Presumes physical standing ability in agile ceremonies; "daily sync" or "scrum" is inclusive of all physical abilities.',
  },
];

/**
 * Analyzes a Job Description string and flags non-inclusive language.
 *
 * @param jdText - The raw text of the job description
 * @returns Array of detected flags with category, suggestion, and educational reason
 */
export function analyzeInclusiveLanguage(jdText: string): InclusiveLanguageFlag[] {
  if (!jdText || typeof jdText !== 'string' || jdText.trim().length === 0) {
    return [];
  }

  const detectedMap = new Map<string, InclusiveLanguageFlag>();

  for (const rule of INCLUSIVE_LANGUAGE_DICTIONARY) {
    const matches = jdText.match(rule.pattern);
    if (matches && matches.length > 0) {
      const existing = detectedMap.get(rule.word.toLowerCase());
      if (existing) {
        existing.occurrences += matches.length;
      } else {
        detectedMap.set(rule.word.toLowerCase(), {
          word: rule.word,
          category: rule.category,
          suggestion: rule.suggestion,
          reason: rule.reason,
          occurrences: matches.length,
        });
      }
    }
  }

  return Array.from(detectedMap.values());
}

/**
 * Provides a comprehensive inclusivity assessment including score and category counts.
 */
export function assessInclusivity(jdText: string): InclusivityAssessment {
  const flags = analyzeInclusiveLanguage(jdText);
  const totalIssues = flags.reduce((acc, curr) => acc + curr.occurrences, 0);

  const categoryCounts: Record<InclusiveCategory, number> = {
    'gendered': 0,
    'age': 0,
    'ableist': 0,
    'aggressive-culture': 0,
  };

  flags.forEach((flag) => {
    categoryCounts[flag.category] += flag.occurrences;
  });

  // Calculate score: 100 minus penalty per flagged occurrence (clamped to 30 min)
  const penalty = totalIssues * 8;
  const inclusivityScore = Math.max(30, 100 - penalty);

  return {
    flags,
    totalIssues,
    inclusivityScore,
    categoryCounts,
  };
}

/**
 * Programmatically replaces a specific flagged word in the text with its suggestion.
 */
export function replaceFlaggedWord(
  text: string,
  word: string,
  replacement: string
): string {
  if (!text) return '';
  const rule = INCLUSIVE_LANGUAGE_DICTIONARY.find(
    (r) => r.word.toLowerCase() === word.toLowerCase()
  );
  if (!rule) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    return text.replace(regex, replacement);
  }
  return text.replace(rule.pattern, replacement);
}

/**
 * Programmatically replaces all flagged words in the text with their primary suggestions.
 */
export function replaceAllFlaggedWords(
  text: string,
  flags?: InclusiveLanguageFlag[]
): string {
  if (!text) return '';
  const targetFlags = flags || analyzeInclusiveLanguage(text);
  let updatedText = text;

  for (const flag of targetFlags) {
    // Pick the first alternative if suggestions are slash-separated
    const primaryReplacement = flag.suggestion.split('/')[0].trim();
    const rule = INCLUSIVE_LANGUAGE_DICTIONARY.find(
      (r) => r.word.toLowerCase() === flag.word.toLowerCase()
    );
    if (rule) {
      updatedText = updatedText.replace(rule.pattern, primaryReplacement);
    }
  }

  return updatedText;
}
