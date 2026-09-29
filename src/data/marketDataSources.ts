export interface DataSourceInfo {
  id: string;
  name: string;
  shortName: string;
  category: 'compensation' | 'candidate_pool' | 'statutory' | 'skills_taxonomy';
  categoryLabel: string;
  providerType: 'Enterprise Survey' | 'Real-Time HRIS API' | 'Cap-Table Data' | 'Crowdsourced & Verified' | 'Government Statutory' | 'Graph Analytics' | 'Academic / Registry';
  coverage: string;
  sampleSize: string;
  updateCadence: 'Real-Time / Continuous' | 'Monthly' | 'Quarterly' | 'Semiannual' | 'Annual';
  description: string;
  strengths: string[];
  limitations: string[];
  primaryUseCases: string[];
  reportApplication: string;
  officialUrl?: string;
  confidenceWeight: number; // 1-100
}

export const AUTHORITATIVE_DATA_SOURCES: DataSourceInfo[] = [
  // --- Compensation Intelligence Sources ---
  {
    id: 'radford-aon',
    name: 'Radford Global Technology Survey (Aon Radford)',
    shortName: 'Radford / Aon',
    category: 'compensation',
    categoryLabel: 'Compensation Benchmark',
    providerType: 'Enterprise Survey',
    coverage: 'Global enterprise tech & life sciences across 140+ countries',
    sampleSize: '3,000+ participating tech enterprises; 4M+ individual incumbents',
    updateCadence: 'Quarterly',
    description: 'The premier compensation benchmark used by corporate compensation committees and boardrooms for executive, engineering, and sales incentive design.',
    strengths: [
      'Gold standard for formal corporate leveling (IC3 through Fellow/VP)',
      'Rigorous employer-matched job matching guidelines',
      'Extensive equity and Long-Term Incentive (LTI) grant benchmarks by company revenue tier'
    ],
    limitations: [
      'Survey participation cycle can cause 3-6 month data latency in rapidly moving hiring markets',
      'Requires expensive enterprise subscription and reciprocal survey submission'
    ],
    primaryUseCases: [
      'Board-approved compensation band architectures',
      'Formal salary range midpoints & percentile structuring (P25, P50, P75, P90)',
      'Executive equity refresh guidelines'
    ],
    reportApplication: 'Calibrates standard enterprise salary band midpoints and corporate leveling parity (IC4/L5, IC5/L6, IC6/Staff).',
    confidenceWeight: 96
  },
  {
    id: 'pave-comp',
    name: 'Pave Real-Time Compensation Benchmarks',
    shortName: 'Pave',
    category: 'compensation',
    categoryLabel: 'Compensation Benchmark',
    providerType: 'Real-Time HRIS API',
    coverage: 'Venture-backed startups, high-growth scaleups, and modern tech enterprises',
    sampleSize: '6,000+ companies; 500,000+ active employee payroll records via direct API integrations',
    updateCadence: 'Real-Time / Continuous',
    description: 'Pioneered API-driven compensation benchmarking by integrating directly with HRIS (Workday, Rippling, BambooHR) and equity management systems to deliver zero-lag compensation intelligence.',
    strengths: [
      'Real-time automated updates eliminate survey reporting lag',
      'Granular breakdown of variable bonus realization rates and equity split models',
      'Exceptional calibration for Series A through pre-IPO startup valuation tiers'
    ],
    limitations: [
      'Heavier representation in VC-backed tech than traditional non-tech Fortune 500 sectors'
    ],
    primaryUseCases: [
      'Real-time offer negotiation & closing calibration',
      'Startup equity percentage and strike price market parity',
      'Fast-changing AI/ML hiring market spot premiums'
    ],
    reportApplication: 'Powers the dynamic Candidate Compensation Analyzer and recent hiring season velocity adjustments.',
    confidenceWeight: 95
  },
  {
    id: 'carta-total-comp',
    name: 'Carta Total Compensation',
    shortName: 'Carta Total Comp',
    category: 'compensation',
    categoryLabel: 'Compensation Benchmark',
    providerType: 'Cap-Table Data',
    coverage: 'Private market tech startups from Pre-Seed to Late-Stage / Pre-IPO',
    sampleSize: '50,000+ private companies on Carta platform; millions of option and RSU grants',
    updateCadence: 'Quarterly',
    description: 'Leverages Carta’s proprietary capitalization table database to provide unmatched private company equity valuations, option grant percentiles, and vesting mechanics.',
    strengths: [
      'Direct cap-table truth—no self-reported or speculative valuation data',
      'Precise ownership percentages across funding stages (Seed, Series A, B, C, D+)',
      'Real-time strike price, 409A valuation, and post-money dilution analytics'
    ],
    limitations: [
      'Exclusively covers private, venture-backed companies (not public market RSUs)'
    ],
    primaryUseCases: [
      'Structuring competitive startup equity grant sizes',
      'Explaining unvested equity trade-offs during candidate recruitment',
      'Determining option pool allocations for key executive hires'
    ],
    reportApplication: 'Calibrates startup equity grant sizes, 4-year unvested value models, and golden-handcuff buyout calculations.',
    confidenceWeight: 94
  },
  {
    id: 'levels-fyi',
    name: 'Levels.fyi Real-Time Verified Comp Platform',
    shortName: 'Levels.fyi',
    category: 'compensation',
    categoryLabel: 'Compensation Benchmark',
    providerType: 'Crowdsourced & Verified',
    coverage: 'Tier-1 Hyperscalers (Google, Meta, Apple, Amazon, Microsoft), AI frontier labs, and top unicorns',
    sampleSize: '300,000+ verified compensation submissions with W-2 and offer-letter verification',
    updateCadence: 'Real-Time / Continuous',
    description: 'The industry-standard platform for top-of-market compensation comparisons, level-by-level cross-company translation, and RSU vesting schedules.',
    strengths: [
      'Unsurpassed granularity for competitive counter-offers against Big Tech and AI labs',
      'Explicit cross-company level leveling matrix (e.g., Google L6 = Meta E6 = Amazon L7)',
      'Accurate capture of signing bonuses and front-loaded vesting structures'
    ],
    limitations: [
      'Self-selection bias toward high-earning candidates in top tech metros'
    ],
    primaryUseCases: [
      'Calibrating counter-offer defenses against FAANG and AI labs',
      'Designing sign-on bonuses to bridge unvested RSU cliffs',
      'Candidate expectation management during initial screening'
    ],
    reportApplication: 'Drives the Tier-1 Hyperscaler and AI Frontier Lab compensation curves and candidate negotiation scripts.',
    confidenceWeight: 92
  },
  {
    id: 'dol-lca-database',
    name: 'U.S. Department of Labor (DOL) H-1B LCA Disclosure Database',
    shortName: 'DOL H-1B LCA Database',
    category: 'statutory',
    categoryLabel: 'Statutory Government Filing',
    providerType: 'Government Statutory',
    coverage: 'All certified foreign labor petitions filed by U.S. employers nationwide',
    sampleSize: '600,000+ certified Labor Condition Applications (LCA) annually',
    updateCadence: 'Quarterly',
    description: 'The federal public database containing mandatory certified wage disclosures filed by U.S. employers sponsoring specialty occupation workers, providing legally binding actual salaries and prevailing wage levels.',
    strengths: [
      '100% statutory legal compliance—zero self-reporting or estimation error',
      'Exact base salaries, employer names, role titles, and geographic worksite ZIP codes',
      'Direct insight into verified wages paid by companies like Google, Microsoft, Meta, and Apple'
    ],
    limitations: [
      'Covers only base wages (excludes equity grants, discretionary bonuses, and sign-on incentives)',
      'Reflects foreign national petitions (though legally indexed to prevailing domestic wages)'
    ],
    primaryUseCases: [
      'Verifying actual minimum and median base salaries paid by target poaching competitors',
      'Geographic prevailing wage rate benchmarking',
      'Non-fabrication audit compliance and statutory compensation validation'
    ],
    reportApplication: 'Anchors the non-fabrication guarantee and hard statutory base salary baselines for metro areas.',
    confidenceWeight: 99
  },
  {
    id: 'state-pay-transparency',
    name: 'State Pay Transparency Disclosures (CA SB 1162, NY S9427A, WA SB 5761)',
    shortName: 'Pay Transparency Laws / Scraping',
    category: 'statutory',
    categoryLabel: 'Statutory Disclosures',
    providerType: 'Government Statutory',
    coverage: 'All public job postings from employers with 15+ employees in California, New York, Washington, Colorado, etc.',
    sampleSize: 'Millions of live job postings scraped daily via platforms like Comprehensive.io',
    updateCadence: 'Real-Time / Continuous',
    description: 'Mandatory public salary ranges published directly by employers in job descriptions under state equal pay transparency statutes, aggregated in real-time across tech career sites.',
    strengths: [
      'Direct, public statements of what employers are currently willing to pay in active listings',
      'Reflects employer-set hiring budgets across current open positions',
      'Enables daily tracking of market budget shifts and wage inflation/deflation'
    ],
    limitations: [
      'Some employers post intentionally wide ranges (e.g., $150k - $300k) to retain discretion'
    ],
    primaryUseCases: [
      'Auditing competitor job postings for active hiring budgets',
      'Setting legally compliant job posting salary bands',
      'Tracking real-time wage trend shifts before quarterly surveys update'
    ],
    reportApplication: 'Validates target company hiring budgets and ensures job opening ranges comply with state transparency statutes.',
    confidenceWeight: 93
  },
  {
    id: 'bls-oews',
    name: 'U.S. Bureau of Labor Statistics OEWS (Occupational Employment & Wage Statistics)',
    shortName: 'BLS OEWS',
    category: 'compensation',
    categoryLabel: 'Government Macroeconomic',
    providerType: 'Government Statutory',
    coverage: 'Nationwide coverage across all 50 states, 400+ Metropolitan Statistical Areas (MSAs)',
    sampleSize: '1.1M business establishments surveyed semiannually across 800+ SOC occupations',
    updateCadence: 'Annual',
    description: 'The federal government’s definitive macroeconomic wage program, producing occupational employment counts and wage percentiles (P10, P25, P50, P75, P90) by metropolitan area.',
    strengths: [
      'Statistically rigorous random sampling across private and public sectors',
      'Authoritative regional cost-of-labor indexes and MSA wage distribution baselines',
      'Completely neutral and independent federal data standard'
    ],
    limitations: [
      'Broad Standard Occupational Classification (SOC) groupings (e.g. 15-1252 Software Developers) don’t isolate niche AI/systems stacks',
      '12-18 month publication delay'
    ],
    primaryUseCases: [
      'Establishing regional macro wage floors and geographic differentials',
      'Economic modeling and metropolitan labor force sizing',
      'Longitudinal wage growth trend analysis'
    ],
    reportApplication: 'Establishes the macro metropolitan talent pool size and regional wage index multiplier relative to national median.',
    confidenceWeight: 97
  },

  // --- Qualified Candidate Pool & Labor Supply Sources ---
  {
    id: 'lightcast-labor-analytics',
    name: 'Lightcast Labor Market Analytics (formerly Emsi Burning Glass)',
    shortName: 'Lightcast',
    category: 'candidate_pool',
    categoryLabel: 'Talent Supply Intelligence',
    providerType: 'Graph Analytics',
    coverage: 'Global talent supply and demand across 150+ countries',
    sampleSize: '850M+ deduplicated professional profiles; 1B+ historical and real-time job postings',
    updateCadence: 'Monthly',
    description: 'The world’s leading labor market analytics engine, converting millions of raw job postings and career histories into structured skills taxonomies, supply/demand ratios, and talent heat maps.',
    strengths: [
      'Comprehensive Lightcast Open Taxonomy (LOT) connecting 32,000+ granular skills',
      'Calculates real-time talent scarcity scores and supply-to-demand ratios',
      'Maps skill adjacency and talent transferability across disparate industry sectors'
    ],
    limitations: [
      'Enterprise platform primarily designed for workforce planners and talent executives'
    ],
    primaryUseCases: [
      'Measuring exact talent scarcity and regional candidate density',
      'Skill adjacency modeling to identify alternative feeder talent pools',
      'Determining hiring difficulty scores and realistic time-to-fill projections'
    ],
    reportApplication: 'Powers the Talent Supply Funnel, Availability Scarcity Score, and Skill Adjacency Transferability Map.',
    confidenceWeight: 98
  },
  {
    id: 'linkedin-talent-insights',
    name: 'LinkedIn Talent Insights & Economic Graph',
    shortName: 'LinkedIn Talent Insights',
    category: 'candidate_pool',
    categoryLabel: 'Talent Supply Intelligence',
    providerType: 'Graph Analytics',
    coverage: 'Global professional network with members across 200+ countries',
    sampleSize: '1.2B+ member profiles; 67M+ company pages; billions of career transition events',
    updateCadence: 'Real-Time / Continuous',
    description: 'Leverages the world’s largest professional network to track real-time talent distribution, employer migration flows (exporters vs. importers), and tenure patterns.',
    strengths: [
      'Unrivaled visibility into cross-company talent movement and migration corridors',
      'Tracks employee turnover spikes and competitor talent attrition signals in real time',
      'Identifies geographic talent concentration and university alumni networks'
    ],
    limitations: [
      'Data accuracy depends on member profile update frequency and self-curation'
    ],
    primaryUseCases: [
      'Identifying feeder companies with high talent outflow to target',
      'Analyzing competitor talent retention and average tenure',
      'Mapping executive referral and sourcing channels'
    ],
    reportApplication: 'Drives the Talent Movement Flow diagrams, Feeder/Destination employer ratings, and poaching vulnerability indicators.',
    confidenceWeight: 96
  },
  {
    id: 'revelio-labs',
    name: 'Revelio Labs Workforce Intelligence',
    shortName: 'Revelio Labs',
    category: 'candidate_pool',
    categoryLabel: 'Competitor Intelligence',
    providerType: 'Graph Analytics',
    coverage: 'Public and private corporate workforce structures globally',
    sampleSize: 'Standardized HR and career records covering 100,000+ employers worldwide',
    updateCadence: 'Monthly',
    description: 'A workforce intelligence platform that standardizes hundreds of millions of public employment records to analyze company headcount shifts, attrition rates, and engineering team compositions.',
    strengths: [
      'Identifies engineering teams experiencing elevated attrition or leadership turnover',
      'Tracks competitor hiring freezes, restructuring, and layoff signals before official announcements',
      'Granular department-level headcount expansion and contraction tracking'
    ],
    limitations: [
      'Focuses on corporate-level workforce dynamics rather than individual candidate profiles'
    ],
    primaryUseCases: [
      'Pinpointing vulnerable competitors ripe for targeted headhunting campaigns',
      'Timing outreach to coincide with competitor vesting cliffs or reorganizations',
      'Benchmarking internal recruiting velocity against direct peers'
    ],
    reportApplication: 'Validates target company poaching angles, attrition triggers, and employer attractiveness scores.',
    confidenceWeight: 93
  },
  {
    id: 'onet-center',
    name: 'O*NET (Occupational Information Network) - U.S. Dept of Labor',
    shortName: 'O*NET Center',
    category: 'skills_taxonomy',
    categoryLabel: 'Skills Taxonomy & Standard',
    providerType: 'Government Statutory',
    coverage: 'Standardized occupational knowledge base for all U.S. economic sectors',
    sampleSize: '900+ occupations with detailed Knowledge, Skills, and Abilities (KSA) rubrics',
    updateCadence: 'Annual',
    description: 'The nation’s primary source of occupational information, sponsored by the U.S. Department of Labor/Employment and Training Administration (USDOL/ETA).',
    strengths: [
      'Standardized occupational taxonomy adopted across federal and state labor systems',
      'Rigorous KSA (Knowledge, Skills, Abilities) work activities and task definitions',
      'Tags "Hot Technologies" and "Bright Outlook" high-demand skill areas'
    ],
    limitations: [
      'High-level taxonomies require customization for proprietary AI infrastructure roles'
    ],
    primaryUseCases: [
      'Role decomposition and requirement taxonomy standardization',
      'Defining core job functions and non-negotiable prerequisite abilities',
      'Ensuring objective, bias-free job requirement leveling'
    ],
    reportApplication: 'Forms the baseline taxonomy for Section 01 Role Decomposition and Section 02 Core Competencies.',
    confidenceWeight: 95
  },
  {
    id: 'nces-ipeds',
    name: 'National Center for Education Statistics (NCES) IPEDS Database',
    shortName: 'NCES IPEDS',
    category: 'candidate_pool',
    categoryLabel: 'Graduate Pipeline',
    providerType: 'Academic / Registry',
    coverage: 'All 6,000+ U.S. postsecondary institutions receiving Title IV federal funds',
    sampleSize: 'Complete mandatory annual reporting of all university degrees conferred in the U.S.',
    updateCadence: 'Annual',
    description: 'The federal reporting system that tracks every degree and certificate awarded in Computer Science, Systems Engineering, Mathematics, and Data Science across all U.S. universities.',
    strengths: [
      '100% census count of university graduates entering the engineering talent pipeline',
      'Granular Classification of Instructional Programs (CIP) codes for distributed systems & AI/ML',
      'Identifies top regional university feeders and demographic graduate representations'
    ],
    limitations: [
      'Measures university graduate output rather than experienced mid/senior career professionals'
    ],
    primaryUseCases: [
      'Campus recruiting strategy and university pipeline mapping',
      'DEI diversity pipelining from top STEM institutions',
      'Long-term talent supply growth projection'
    ],
    reportApplication: 'Validates university feeder pipeline data and emerging candidate supply funnels.',
    confidenceWeight: 97
  }
];

export interface TriangulationSummary {
  modelName: string;
  description: string;
  weights: Array<{ sourceName: string; weightPercent: number; role: string }>;
  qualityAssuranceCheck: string;
}

export const TRIANGULATION_METHODOLOGY: TriangulationSummary = {
  modelName: 'Multi-Source Empirical Triangulation Framework',
  description: 'To guarantee data accuracy, prevent hallucination, and eliminate single-provider bias, this report synthesizes data through three independent analytical layers: Statutory Compliance, Real-Time Payroll Integration, and Verified Market Surveys.',
  weights: [
    { sourceName: 'Statutory Government Disclosures (DOL LCA & State Transparency)', weightPercent: 35, role: 'Enforces statutory wage floors, verified legal payroll, and zero-fabrication ground truth' },
    { sourceName: 'Real-Time Payroll & API Benchmarks (Pave & Carta)', weightPercent: 35, role: 'Captures immediate market velocity, startup equity valuations, and live hiring spot premiums' },
    { sourceName: 'Enterprise Surveys & Granular Leveling (Radford & Levels.fyi)', weightPercent: 30, role: 'Provides formal corporate leveling frameworks and competitive counter-offer intelligence' }
  ],
  qualityAssuranceCheck: 'Every metric displayed carries a formal confidence tag (Verified, Inferred, Estimated). Fields with insufficient statutory or empirical backing are flagged and conservatively adjusted.'
};
