import {
  TalentMapReport,
  SourcingPlanData,
  SourcingFunnelMath,
  WeeklyRoadmapPhase,
  CompetitorPoachingTier,
  OutreachSequenceStep,
  ScreeningRubricCategory,
  TrackedCandidate,
} from '../types';
import { loadCandidatesFromStorage } from './storageService';

/**
 * Synthesizes an exhaustive, highly calibrated Sourcing & Recruiting Plan
 * integrating the 23-Part Talent Map calculations and the Sourcing War Room data.
 */
export function generateDetailedSourcingPlan(
  report: TalentMapReport,
  customHiringVolume?: number
): SourcingPlanData {
  const roleTitle = report.input.role.value;
  const seniority = report.input.seniority.value;
  const location = report.input.geography.location;
  const workModel = report.input.workModel.value;
  const industry = report.input.industry.value;
  const targetHires = Math.max(1, customHiringVolume ?? report.input.hiringVolume.value ?? 1);
  const timeToFillDays = report.recruitingDifficultyScore.expectedTimeToFillDays || 64;
  const diffScore = report.recruitingDifficultyScore.score;
  const availScore = report.talentAvailabilityScore.score;
  const primarySkills = report.input.skills.required.value;
  const primarySkill = primarySkills[0] || 'Distributed Systems';
  const secondarySkill = primarySkills[1] || 'Cloud Infrastructure';
  const targetEmployers = report.competitiveEmployerLandscape || [];

  // ==========================================
  // 1. DYNAMIC FUNNEL CAPACITY MATHEMATICS
  // ==========================================
  // Conversion benchmarks dynamically calibrated by difficulty & availability
  const responseRatePct = Math.max(
    14,
    Math.min(38, Math.round(24 + (availScore - 50) * 0.15 - (diffScore - 50) * 0.12))
  );
  const screenPassRatePct = Math.max(
    35,
    Math.min(65, Math.round(50 - (diffScore - 50) * 0.14))
  );
  const hmPassRatePct = Math.max(
    30,
    Math.min(55, Math.round(42 - (diffScore - 50) * 0.12))
  );
  const finalLoopPassRatePct = Math.max(
    25,
    Math.min(45, Math.round(33 - (diffScore - 50) * 0.10))
  );
  const offerAcceptanceRatePct = Math.max(
    65,
    Math.min(
      92,
      Math.round(80 + (report.compensationIntelligence?.marketPosition === 'Upper Quartile' ? 8 : -3))
    )
  );

  // Back-calculate required volumes from target hires
  const offersExtended = Math.max(
    targetHires,
    Math.ceil(targetHires / (offerAcceptanceRatePct / 100))
  );
  const finalLoops = Math.max(
    offersExtended + 1,
    Math.ceil(offersExtended / (finalLoopPassRatePct / 100))
  );
  const hmInterviews = Math.max(
    finalLoops + 2,
    Math.ceil(finalLoops / (hmPassRatePct / 100))
  );
  const screensCompleted = Math.max(
    hmInterviews + 4,
    Math.ceil(hmInterviews / (screenPassRatePct / 100))
  );
  const responsesExpected = screensCompleted;
  const outreachTarget = Math.max(
    responsesExpected * 3,
    Math.ceil(responsesExpected / (responseRatePct / 100))
  );
  const profilesToSource = Math.ceil(outreachTarget * 1.32);

  const funnelMath: SourcingFunnelMath = {
    profilesToSource,
    outreachTarget,
    responsesExpected,
    responseRatePct,
    screensCompleted,
    screenPassRatePct,
    hmInterviews,
    hmPassRatePct,
    finalLoops,
    finalLoopPassRatePct,
    offersExtended,
    offerAcceptanceRatePct,
    projectedHires: targetHires,
  };

  // ==========================================
  // 2. COMPETITOR POACHING TIERS (4 TIERS)
  // ==========================================
  const tier1List = targetEmployers.filter((c) => c.tier === 'Tier 1');
  const tier2List = targetEmployers.filter((c) => c.tier === 'Tier 2');
  const tier3List = targetEmployers.filter((c) => c.tier === 'Tier 3');
  const tier4List = targetEmployers.filter((c) => c.tier === 'Tier 4');

  const competitorTiers: CompetitorPoachingTier[] = [
    {
      tier: 'Tier 1',
      tierLabel: 'Direct Competitors & Hyperscalers',
      companies: tier1List.length > 0 ? tier1List.map((c) => c.name) : ['Stripe', 'Datadog', 'Snowflake', 'AWS'],
      tacticalAngle: 'High-Impact Ownership & Fast RFC Decision Cycles vs Big Tech Bureaucracy',
      vulnerabilityNotes:
        tier1List[0]?.poachingAngle ||
        'Engineers facing slow promotional velocity, re-org fatigue, and multi-layer management approvals.',
      targetedSkills: [primarySkill, secondarySkill, 'High Throughput', 'Distributed Architecture'],
    },
    {
      tier: 'Tier 2',
      tierLabel: 'Adjacent Enterprise Platforms',
      companies: tier2List.length > 0 ? tier2List.map((c) => c.name) : ['Twilio', 'Uber', 'Palantir', 'Salesforce'],
      tacticalAngle: 'Modern Greenfield Stack & Core Product Mission vs Legacy Maintenance',
      vulnerabilityNotes:
        tier2List[0]?.poachingAngle ||
        'Approaching 4-year unvested equity cliffs; engineers desire greenfield architecture mandates.',
      targetedSkills: [secondarySkill, 'Cloud Systems', 'Microservices', 'Scale Resiliency'],
    },
    {
      tier: 'Tier 3',
      tierLabel: 'High-Growth Tech Scale-ups',
      companies: tier3List.length > 0 ? tier3List.map((c) => c.name) : ['DoorDash', 'Figma', 'Brex', 'Ramp'],
      tacticalAngle: 'Leadership Autonomy, Transparent Leveling & Liquid Comp Parity',
      vulnerabilityNotes:
        tier3List[0]?.poachingAngle ||
        'Scaling growing pains, high burnout from rapid hyper-growth, and fluctuating equity expectations.',
      targetedSkills: [primarySkill, 'Product Velocity', 'Fast Iteration', 'Cross-Functional Execution'],
    },
    {
      tier: 'Tier 4',
      tierLabel: 'Consulting Feeder & Regional Incubators',
      companies: tier4List.length > 0 ? tier4List.map((c) => c.name) : ['Slalom', 'ThoughtWorks', 'EPAM', 'Accenture Tech'],
      tacticalAngle: 'Permanent Product Ownership & Eliminating Client Billing Pressures',
      vulnerabilityNotes:
        tier4List[0]?.poachingAngle ||
        'Tired of client travel and context-switching; eager for long-term production architecture ownership.',
      targetedSkills: ['Full Lifecycle Delivery', 'Client Architecture', 'Rapid Ramp-Up'],
    },
  ];

  // ==========================================
  // 3. READY-TO-RUN BOOLEAN & X-RAY ARSENAL
  // ==========================================
  const booleanArsenal: Array<{ platform: string; name: string; query: string; purpose: string }> = [
    {
      platform: 'LinkedIn Recruiter',
      name: 'Primary Precision Boolean',
      query: `("${roleTitle}" OR "${seniority} Engineer" OR "${seniority} Architect") AND ("${primarySkill}" OR "${secondarySkill}") AND ("${location}" OR "Remote") NOT ("Intern" OR "Junior" OR "Bootcamp")`,
      purpose: 'Identifies high-density senior talent currently holding matching titles in target geography.',
    },
    {
      platform: 'Google X-Ray (LinkedIn)',
      name: 'Direct Public LinkedIn X-Ray',
      query: `site:linkedin.com/in/ ("${roleTitle}" OR "${seniority} ${primarySkill}") AND ("${location}" OR "United States") -intitle:jobs -intitle:recruiter`,
      purpose: 'Unrestricted X-Ray search bypassing LinkedIn commercial search limits.',
    },
    {
      platform: 'Google X-Ray (GitHub)',
      name: 'GitHub Open-Source Contributors',
      query: `site:github.com ("joined on" OR "followers") ("${primarySkill}" OR "${secondarySkill}") ("${location}" OR "USA")`,
      purpose: 'Surfaces engineers actively committing to relevant open-source distributed frameworks.',
    },
    {
      platform: 'LinkedIn Recruiter',
      name: 'Competitor Poaching Inverted Query',
      query: `(${competitorTiers[0].companies.map((c) => `"${c}"`).join(' OR ')}) AND ("${roleTitle}" OR "${seniority}") AND ("${primarySkill}")`,
      purpose: 'Directly targets currently employed talent inside Tier 1 target poaching accounts.',
    },
  ];

  // If report has predefined sourcing strings, add them as well
  if (report.sourcingStrings?.linkedinBoolean?.length) {
    report.sourcingStrings.linkedinBoolean.forEach((item) => {
      booleanArsenal.push({
        platform: 'LinkedIn Recruiter',
        name: item.name,
        query: item.query,
        purpose: item.purpose,
      });
    });
  }

  // ==========================================
  // 4. MULTI-TOUCH OUTREACH SEQUENCE (4 TOUCHPOINTS)
  // ==========================================
  const primaryArchetype = report.candidateArchetypes?.[0];
  const hook = primaryArchetype?.recommendedMessagingHook || `Spearhead our core ${primarySkill} platform architecture with full autonomy.`;
  const tier1Comp = competitorTiers[0].companies[0] || 'Tier-1 firms';

  const outreachSequence: OutreachSequenceStep[] = [
    {
      touchpoint: 'Touchpoint 1: Initial Hook',
      timing: 'Day 1 (Tuesday or Wednesday 9:15 AM)',
      channel: 'LinkedIn InMail / Direct Work Email',
      subjectLine: `${roleTitle} | Architecting our next-gen platform in ${location} (no legacy baggage)`,
      actionIntent: 'Spark intellectual curiosity, highlight peer-to-peer technical autonomy, and request low-friction 15-min chat.',
      messageTemplate: `Hi {{firstName}},

I came across your work on high-throughput systems and distributed architectures, particularly your background at {{currentCompany}}.

I am partnering directly with our VP of Engineering to appoint our ${roleTitle} in ${location} (${workModel}). We are architecting our core ${primarySkill} infrastructure to handle our next order of magnitude scale.

Unlike larger environments at places like ${tier1Comp}, our team operates without bureaucratic committee approvals—engineers own the RFC lifecycle, service boundaries, and production topology.

${hook}

Are you open to a casual 15-minute engineering-to-engineering conversation this Thursday or Friday to compare technical notes?

Best,
{{senderName}}
{{senderTitle}}`,
    },
    {
      touchpoint: 'Touchpoint 2: Value-Add & Technical Deep-Dive',
      timing: 'Day 4 (Friday or Monday 11:30 AM)',
      channel: 'LinkedIn InMail Reply / Email Thread',
      subjectLine: `Re: ${roleTitle} | Technical challenges & stack details`,
      actionIntent: 'Provide deep technical substance, stack transparency, and specific problem statements to passive talent.',
      messageTemplate: `Hi {{firstName}},

Following up quickly on my note from earlier this week.

To provide concrete context on why this role is pivotal:
• Tech Stack: Modern ${primarySkill}, ${secondarySkill}, event-driven microservices, and container orchestration.
• Scope: Direct architectural ownership of low-latency data pipelines handling mission-critical throughput.
• Compensation: Budgeted at the 75th market percentile ($${(report.compensationIntelligence?.percentiles?.p75 ?? 235000).toLocaleString()} base target + liquid equity).

Even if you are not currently seeking a move, I'd love to connect and share our architecture roadmap. Would 10 minutes next Tuesday work for you?

Best,
{{senderName}}`,
    },
    {
      touchpoint: 'Touchpoint 3: Executive / Peer Note',
      timing: 'Day 8 (Thursday 10:00 AM)',
      channel: 'Hiring Manager / Founder Direct Email or InMail',
      subjectLine: `Note from Engineering Leadership re: ${roleTitle}`,
      actionIntent: 'Leverage peer authority; 3.2x higher response rate when outreach comes directly from a functional leader.',
      messageTemplate: `Hi {{firstName}},

{{recruiterName}} mentioned she reached out to you regarding our ${roleTitle} opening.

I reviewed your GitHub commits and background with ${primarySkill}, and your technical profile aligns directly with the architectural challenges we are solving over the next 12 months.

I would value the opportunity to speak with you personally about what we are building and get your perspective on distributed scaling bottlenecks.

Do you have 15 minutes for a quick founder/lead call this week?

Warm regards,
[Hiring Manager Name]
Head of Engineering`,
    },
    {
      touchpoint: 'Touchpoint 4: Graceful Breakup & Pipeline Door-Holder',
      timing: 'Day 14 (Wednesday 2:00 PM)',
      channel: 'Email / LinkedIn InMail',
      subjectLine: `Closing the loop / Future timing on ${primarySkill} initiatives`,
      actionIntent: 'Polite close-out that triggers psychological FOMO and secures consent for future talent community engagement.',
      messageTemplate: `Hi {{firstName}},

I recognize your schedule is busy and the timing might not be ideal for a transition away from {{currentCompany}}.

I will pause my outreach for now, but I want to ensure we stay connected as our engineering team and infrastructure continue to expand.

If your priorities shift or you ever want to benchmark market opportunities in ${location}, my door is always open.

Wishing you and your team continued momentum!

Best,
{{senderName}}`,
    },
  ];

  // ==========================================
  // 5. 8-WEEK PHASED EXECUTION ROADMAP
  // ==========================================
  const weeklyRoadmap: WeeklyRoadmapPhase[] = [
    {
      week: 'Week 1',
      phase: 'Phase 1: Calibration & Setup',
      title: 'Search Kickoff, Market Mapping & Calibration Slates',
      recruiterMilestones: [
        `Map initial ${Math.ceil(profilesToSource * 0.4)} target profiles across Tier 1 competitors (${competitorTiers[0].companies.slice(0, 3).join(', ')}).`,
        'Deploy precision Boolean and Google X-Ray strings in LinkedIn Recruiter.',
        'Deliver calibration benchmark dossier of 6 sample profiles to Hiring Manager within 48 hours.',
      ],
      hiringManagerMilestones: [
        'Review and sign off on 6 calibration profiles (Green / Red calibration rubric).',
        'Finalize interview committee panel and assign specific technical competency scorecards.',
        'Approve peer-to-peer outreach messaging template and sender persona.',
      ],
      kpiDeliverable: '6 Calibration Profiles Reviewed; 100% Alignment on Must-Have vs Nice-to-Have Skills.',
    },
    {
      week: 'Weeks 2-3',
      phase: 'Phase 2: Targeted Outbound',
      title: 'High-Volume Outbound & Initial Phone Screen Velocity',
      recruiterMilestones: [
        `Execute Touchpoint 1 & 2 across ${Math.ceil(outreachTarget * 0.6)} vetted Tier 1 & Tier 2 candidates.`,
        `Complete ${Math.ceil(screensCompleted * 0.5)} recruiter phone screens with structured behavioral and leveling rubrics.`,
        'Track outreach response rates daily; pivot messaging angles if response rate drops below 20%.',
      ],
      hiringManagerMilestones: [
        'Participate in first wave of 30-minute Technical Discovery Screenings (target: 4-6 candidates).',
        'Provide written scorecard feedback within strict 24-hour SLA.',
      ],
      kpiDeliverable: `${Math.ceil(screensCompleted * 0.5)} Screens Completed; First 4 Candidates Advanced to HM Technical Screen.`,
    },
    {
      week: 'Weeks 4-5',
      phase: 'Phase 3: Pipeline Velocity',
      title: 'HM Technical Deep-Dives & Final Calibration Loops',
      recruiterMilestones: [
        `Expand sourcing into Tier 3 & Tier 4 feeder pools to maintain top-of-funnel momentum (${Math.ceil(outreachTarget * 0.4)} additional outbounds).`,
        `Coordinate and facilitate ${Math.ceil(finalLoops * 0.6)} full onsite / virtual interview loops.`,
        'Conduct pre-closing compensation checks and verify candidate equity vesting schedules.',
      ],
      hiringManagerMilestones: [
        `Conduct ${Math.ceil(hmInterviews * 0.6)} HM Technical evaluations.`,
        'Host weekly 20-minute talent debrief to calibrate cross-panel scoring consistency.',
        'Identify top contender and prepare customized executive closing pitch.',
      ],
      kpiDeliverable: `${finalLoops} Final Loops Scheduled; 2 Strong Finalists Identified in Active Pipeline.`,
    },
    {
      week: 'Weeks 6-8+',
      phase: 'Phase 4: Closing & Offer',
      title: 'Offer Delivery, Counter-Offer Mitigation & Sign-Off',
      recruiterMilestones: [
        'Perform reference checks and prepare competitive compensation package based on P75 benchmarks.',
        'Deliver verbal offer alongside Hiring Manager with personalized impact deck.',
        'Deploy counter-offer defense strategy against incumbent retention bonuses.',
      ],
      hiringManagerMilestones: [
        'Participate in executive closing call with candidate (and spouse/partner if applicable).',
        'Confirm official start date and orchestrate 30-day engineering onboarding itinerary.',
      ],
      kpiDeliverable: `${targetHires} Signed Offer Acceptance; Search Successfully Closed in ~${timeToFillDays} Days.`,
    },
  ];

  // ==========================================
  // 6. TECHNICAL SCREENING & CALIBRATION RUBRIC
  // ==========================================
  const screeningRubric: ScreeningRubricCategory[] = [
    {
      category: `Core Technical Mastery (${primarySkill})`,
      mustHaveIndicators: [
        `Proven track record designing production ${primarySkill} systems operating at real-world scale.`,
        'Demonstrates deep understanding of failure modes, network partitioning, and high concurrency bottlenecks.',
        'Articulates trade-offs between consistency, availability, and latency without dogma.',
      ],
      redFlagWarnings: [
        'Only superficial conceptual knowledge without hands-on production troubleshooting experience.',
        'Relies exclusively on high-level managed cloud abstractions without understanding underlying mechanics.',
      ],
      interviewPrompt: `Walk me through the most catastrophic production outage or performance degradation you diagnosed in your ${primarySkill} infrastructure. What was the root cause and architectural remediation?`,
    },
    {
      category: 'Architectural Ownership & RFC Leadership',
      mustHaveIndicators: [
        'Has drafted, defended, and shipped comprehensive Technical RFCs across cross-functional teams.',
        'Comfortable making pragmatic technical compromises under aggressive delivery deadlines.',
        'Mentors mid-level engineers through code reviews and architectural best practices.',
      ],
      redFlagWarnings: [
        'Avoids ownership; blames product managers or legacy systems for technical shortcomings.',
        'Over-engineers simple requirements with premature microservice sprawl.',
      ],
      interviewPrompt: 'Describe an instance where you pushed back against a product requirement or leadership timeline due to technical debt. How did you resolve the deadlock?',
    },
    {
      category: 'Cultural Alignment & Mission Velocity',
      mustHaveIndicators: [
        'High agency mindset: actively seeks unowned problems and resolves them autonomously.',
        'Thrives in fast-moving, high-autonomy environments with minimal supervisory overhead.',
        'Communicates complex technical trade-offs with clarity and humility.',
      ],
      redFlagWarnings: [
        'Requires rigidly defined tickets and exhaustive specifications before writing code.',
        'Displays defensiveness during architecture critique or technical whiteboard discussions.',
      ],
      interviewPrompt: 'When you encounter ambiguity or conflicting architectural patterns in an existing codebase, what is your first 48-hour protocol?',
    },
  ];

  // ==========================================
  // 7. LIVE PIPELINE SNAPSHOT (FROM TRACKER)
  // ==========================================
  let storedCandidates: TrackedCandidate[] = [];
  try {
    storedCandidates = loadCandidatesFromStorage(report.id) || [];
  } catch {
    storedCandidates = [];
  }

  // Fallback defaults if no tracked candidates exist
  if (storedCandidates.length === 0) {
    storedCandidates = [
      {
        id: 'cand-1',
        name: 'Elena Rostova',
        currentTitle: `Senior ${roleTitle}`,
        currentCompany: competitorTiers[0].companies[0] || 'Stripe',
        location,
        matchScore: 97,
        stage: 'identified',
        sourceType: 'LinkedIn Boolean',
        labels: ['High Priority', 'Ex-Tier 1'],
        skills: primarySkills.slice(0, 3),
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'cand-2',
        name: 'Marcus Chen',
        currentTitle: `Staff ${roleTitle}`,
        currentCompany: competitorTiers[0].companies[1] || 'Datadog',
        location,
        matchScore: 94,
        stage: 'outreached',
        sourceType: 'Google X-Ray',
        labels: ['Staff Caliber', 'Comp Sensitive'],
        skills: primarySkills.slice(1, 4),
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'cand-3',
        name: 'Sarah Jenkins',
        currentTitle: `Lead ${roleTitle}`,
        currentCompany: competitorTiers[1].companies[0] || 'Twilio',
        location,
        matchScore: 91,
        stage: 'screening',
        sourceType: 'Target Company List',
        labels: ['Culture Fit', 'Ready for Interview'],
        skills: primarySkills.slice(0, 2),
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
    ];
  }

  const identifiedCount = storedCandidates.filter((c) => c.stage === 'identified').length;
  const screeningCount = storedCandidates.filter((c) => c.stage === 'screening').length;
  const outreachedCount = storedCandidates.filter((c) => c.stage === 'outreached').length;
  const interviewingCount = storedCandidates.filter((c) => c.stage === 'interviewing').length;
  const offeredCount = storedCandidates.filter((c) => c.stage === 'offered').length;

  // ==========================================
  // 8. RISK MITIGATIONS & SLAs
  // ==========================================
  const riskMitigations = [
    {
      risk: 'Counter-Offer Frequency & Incumbent Retention',
      severity: 'High',
      mitigationAction:
        'Deliver offer package anchored at the 75th percentile ($' +
        (report.compensationIntelligence?.percentiles?.p75 ?? 235000).toLocaleString() +
        ') with sign-on bonus to bridge unvested equity cliffs; close on mission ownership.',
    },
    {
      risk: 'Competitor Interview Speed & Competing Offers',
      severity: 'High',
      mitigationAction:
        'Compress full interview loop into under 12 business days with maximum 24-hour turnaround between stages.',
    },
    {
      risk: 'Work Model Friction',
      severity: workModel === 'ON-SITE' ? 'Critical' : 'Medium',
      mitigationAction:
        workModel === 'ON-SITE'
          ? 'Emphasize high-bandwidth collaboration, state-of-the-art office amenities, and flexible commuting stipends.'
          : 'Reiterate remote-first autonomy and flexible working core hours.',
    },
  ];

  const slaCommitments = [
    { processStep: 'Candidate Application / Sourced Review', timeframe: 'Within 24 Hours', owner: 'Recruiter' },
    { processStep: 'Initial Recruiter Screen to HM Submission', timeframe: 'Within 24 Hours', owner: 'Recruiter' },
    { processStep: 'HM Review & Screen Decision', timeframe: 'Within 24 Hours', owner: 'Hiring Manager' },
    { processStep: 'Technical Interview Loop Debrief', timeframe: 'Within 48 Hours', owner: 'Hiring Panel' },
    { processStep: 'Formal Written Offer Generation', timeframe: 'Within 24 Hours', owner: 'TA Leadership' },
  ];

  const channelMix = [
    { channel: 'Proactive Outbound Sourcing (LinkedIn & X-Ray)', allocationPct: 65, expectedYield: '60% of Pipeline' },
    { channel: 'Competitor Poaching & Target Account Lists', allocationPct: 20, expectedYield: '25% of Pipeline' },
    { channel: 'Executive & Engineering Peer Referrals', allocationPct: 10, expectedYield: '10% of Pipeline' },
    { channel: 'Direct Inbound Applications', allocationPct: 5, expectedYield: '5% of Pipeline' },
  ];

  return {
    roleTitle,
    seniority,
    location,
    workModel,
    industry,
    targetHires,
    timeToFillDays,
    recruitingDifficultyScore: diffScore,
    recruitingDifficultyBand: report.recruitingDifficultyScore.band,
    talentAvailabilityScore: availScore,
    talentAvailabilityBand: report.talentAvailabilityScore.band,
    addressablePoolSize: report.talentSupply.addressable.count,
    activePoolSize: report.talentSupply.active.count,
    funnelMath,
    weeklyRoadmap,
    competitorTiers,
    booleanArsenal,
    outreachSequence,
    screeningRubric,
    livePipelineSnapshot: {
      identifiedCount,
      screeningCount,
      outreachedCount,
      interviewingCount,
      offeredCount,
      totalActiveTracked: storedCandidates.length,
      sampleTrackedCandidates: storedCandidates.slice(0, 5).map((c) => ({
        name: c.name,
        title: c.currentTitle,
        company: c.currentCompany,
        stage: c.stage,
        matchScore: c.matchScore,
      })),
    },
    riskMitigations,
    slaCommitments,
    channelMix,
  };
}

/**
 * Generates an exhaustive, beautifully structured Markdown document
 * of the entire Sourcing & Recruiting Plan, ready for Notion, Jira, or Google Docs.
 */
export function generateSourcingPlanMarkdown(
  plan: SourcingPlanData,
  report: TalentMapReport
): string {
  const p50 = (report.compensationIntelligence?.percentiles?.p50 ?? 195000).toLocaleString();
  const p75 = (report.compensationIntelligence?.percentiles?.p75 ?? 235000).toLocaleString();
  const p90 = (report.compensationIntelligence?.percentiles?.p90 ?? 280000).toLocaleString();

  return `# STRATEGIC SOURCING & RECRUITING EXECUTION PLAN
**Role:** ${plan.roleTitle} (${plan.seniority})  
**Geography & Model:** ${plan.location} (${plan.workModel})  
**Target Hires:** ${plan.targetHires}  
**Expected Time to Fill:** ${plan.timeToFillDays} Business Days  
**Recruiting Difficulty Index:** ${plan.recruitingDifficultyScore}/100 (${plan.recruitingDifficultyBand})  
**Talent Availability Index:** ${plan.talentAvailabilityScore}/100 (${plan.talentAvailabilityBand})  
**Plan Generated:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}  

---

## 1. EXECUTIVE MISSION & CAPACITY PLANNING
This strategic sourcing plan synthesizes labor market data from the **23-Part Talent Map** and the **Sourcing War Room** to execute a surgical outbound search. 

### Key Funnel Metrics (Calibrated for ${plan.targetHires} Hire${plan.targetHires > 1 ? 's' : ''}):
| Funnel Stage | Volume Required | Conversion Benchmark | Stage Notes |
| :--- | :--- | :--- | :--- |
| **Top-of-Funnel Mapped Profiles** | **${plan.funnelMath.profilesToSource}** | 100% | Verified against target companies |
| **Outreach Messages Dispatched** | **${plan.funnelMath.outreachTarget}** | Multi-touch | 4-touch personalized cadence |
| **Positive Responses Expected** | **${plan.funnelMath.responsesExpected}** | ~${plan.funnelMath.responseRatePct}% response | Peer-to-peer / leadership sender |
| **Recruiter Phone Screens** | **${plan.funnelMath.screensCompleted}** | ~${plan.funnelMath.screenPassRatePct}% pass | Behavioral & Leveling rubrics |
| **HM Technical Discovery Screens** | **${plan.funnelMath.hmInterviews}** | ~${plan.funnelMath.hmPassRatePct}% pass | Technical problem statements |
| **Final Onsite / Virtual Loops** | **${plan.funnelMath.finalLoops}** | ~${plan.funnelMath.finalLoopPassRatePct}% pass | Full interview panel calibration |
| **Formal Offers Extended** | **${plan.funnelMath.offersExtended}** | ~${plan.funnelMath.offerAcceptanceRatePct}% accept | P75 comp target ($${p75}) |
| **Closed Hires** | **${plan.funnelMath.projectedHires}** | **Goal Reached** | Expected ~${plan.timeToFillDays} days |

---

## 2. CHANNEL MIX & SOURCING DISTRIBUTION
${plan.channelMix.map((c) => `- **${c.channel}** (${c.allocationPct}% Allocation): Expected yield: *${c.expectedYield}*`).join('\n')}

---

## 3. TARGET COMPETITOR POACHING MATRIX (4 TIERS)
${plan.competitorTiers
  .map(
    (tier) => `### ${tier.tier}: ${tier.tierLabel}
- **Target Companies:** ${tier.companies.join(', ')}
- **Tactical Poaching Angle:** ${tier.tacticalAngle}
- **Vulnerability Trigger:** ${tier.vulnerabilityNotes}
- **Targeted Skills:** ${tier.targetedSkills.join(', ')}
`
  )
  .join('\n')}

---

## 4. READY-TO-RUN BOOLEAN & SEARCH ARSENAL
Execute these pre-built Boolean queries directly inside your search tools:

${plan.booleanArsenal
  .map(
    (b) => `### ${b.name} (${b.platform})
*Purpose:* ${b.purpose}
\`\`\`text
${b.query}
\`\`\`
`
  )
  .join('\n')}

---

## 5. MULTI-TOUCH OUTREACH SEQUENCE (4 TOUCHPOINTS)
${plan.outreachSequence
  .map(
    (t) => `### ${t.touchpoint}
- **Timing:** ${t.timing}
- **Channel:** ${t.channel}
- **Subject:** \`${t.subjectLine}\`
- **Objective:** *${t.actionIntent}*

\`\`\`text
${t.messageTemplate}
\`\`\`
`
  )
  .join('\n')}

---

## 6. 8-WEEK PHASED EXECUTION ROADMAP
${plan.weeklyRoadmap
  .map(
    (w) => `### ${w.week} — ${w.phase}: ${w.title}
**Recruiter Actions:**
${w.recruiterMilestones.map((m) => `- ${m}`).join('\n')}

**Hiring Manager Actions:**
${w.hiringManagerMilestones.map((m) => `- ${m}`).join('\n')}

**Milestone Deliverable:** *${w.kpiDeliverable}*
`
  )
  .join('\n')}

---

## 7. TECHNICAL SCREENING & CALIBRATION RUBRIC
${plan.screeningRubric
  .map(
    (r) => `### ${r.category}
**Must-Have Indicators:**
${r.mustHaveIndicators.map((m) => `- [x] ${m}`).join('\n')}

**Red Flag Warnings:**
${r.redFlagWarnings.map((w) => `- [!] ${w}`).join('\n')}

**Diagnostic Interview Prompt:**
> *"${r.interviewPrompt}"*
`
  )
  .join('\n')}

---

## 8. SOURCING WAR ROOM LIVE PIPELINE STATUS
- **Currently Identified:** ${plan.livePipelineSnapshot.identifiedCount} candidates
- **Outreached:** ${plan.livePipelineSnapshot.outreachedCount} candidates
- **Screening:** ${plan.livePipelineSnapshot.screeningCount} candidates
- **Interviewing:** ${plan.livePipelineSnapshot.interviewingCount} candidates
- **Offered:** ${plan.livePipelineSnapshot.offeredCount} candidates
- **Total Tracked:** ${plan.livePipelineSnapshot.totalActiveTracked} profiles

---

## 9. SERVICE LEVEL AGREEMENTS (SLAs) & RISK MITIGATION
| Workflow Stage | SLA Commitment | Accountable Owner |
| :--- | :--- | :--- |
${plan.slaCommitments.map((s) => `| ${s.processStep} | **${s.timeframe}** | ${s.owner} |`).join('\n')}

### Key Risks & Countermeasures:
${plan.riskMitigations.map((r) => `- **${r.risk}** (${r.severity} Severity): ${r.mitigationAction}`).join('\n')}

---
*Generated via TalentIQ Enterprise Intelligence Platform · Integrated 23-Part Talent Map & Sourcing War Room*
`;
}

/**
 * Generates a clean CSV file containing the Funnel Plan, Target Companies, and Action Schedule.
 */
export function generateSourcingPlanCSV(plan: SourcingPlanData): string {
  const sections: string[] = [];

  // Section 1: Meta
  sections.push(['"Role"', `"${plan.roleTitle}"`].join(','));
  sections.push(['"Seniority"', `"${plan.seniority}"`].join(','));
  sections.push(['"Location"', `"${plan.location}"`].join(','));
  sections.push(['"Work Model"', `"${plan.workModel}"`].join(','));
  sections.push(['"Target Hires"', `"${plan.targetHires}"`].join(','));
  sections.push(['"Expected Time to Fill Days"', `"${plan.timeToFillDays}"`].join(','));
  sections.push(['"Difficulty Index"', `"${plan.recruitingDifficultyScore}/100"`].join(','));
  sections.push('');

  // Section 2: Funnel Math
  sections.push('"FUNNEL CAPACITY PLANNING"');
  sections.push('"Stage","Volume Target","Conversion Rate","Notes"');
  sections.push(`"Profiles to Source","${plan.funnelMath.profilesToSource}","100%","Top of funnel mapping"`);
  sections.push(`"Outreach Sent","${plan.funnelMath.outreachTarget}","Multi-touch","4-touch sequence"`);
  sections.push(`"Responses Expected","${plan.funnelMath.responsesExpected}","${plan.funnelMath.responseRatePct}%","Peer-to-peer hook"`);
  sections.push(`"Recruiter Screens","${plan.funnelMath.screensCompleted}","${plan.funnelMath.screenPassRatePct}%","Leveling & fit"`);
  sections.push(`"HM Technical Screens","${plan.funnelMath.hmInterviews}","${plan.funnelMath.hmPassRatePct}%","Deep-dive architecture"`);
  sections.push(`"Final Calibration Loops","${plan.funnelMath.finalLoops}","${plan.funnelMath.finalLoopPassRatePct}%","Interview panel"`);
  sections.push(`"Offers Extended","${plan.funnelMath.offersExtended}","${plan.funnelMath.offerAcceptanceRatePct}%","P75 comp band"`);
  sections.push(`"Closed Hires","${plan.funnelMath.projectedHires}","Goal Reached","Target achieved"`);
  sections.push('');

  // Section 3: Target Companies
  sections.push('"TARGET COMPETITOR POACHING TIERS"');
  sections.push('"Tier","Tier Label","Companies","Poaching Angle","Vulnerabilities"');
  plan.competitorTiers.forEach((tier) => {
    sections.push(
      [
        `"${tier.tier}"`,
        `"${tier.tierLabel}"`,
        `"${tier.companies.join('; ')}"`,
        `"${tier.tacticalAngle.replace(/"/g, '""')}"`,
        `"${tier.vulnerabilityNotes.replace(/"/g, '""')}"`,
      ].join(',')
    );
  });
  sections.push('');

  // Section 4: SLAs
  sections.push('"RECRUITING SERVICE LEVEL AGREEMENTS (SLAs)"');
  sections.push('"Workflow Stage","Commitment Timeframe","Owner"');
  plan.slaCommitments.forEach((sla) => {
    sections.push([`"${sla.processStep}"`, `"${sla.timeframe}"`, `"${sla.owner}"`].join(','));
  });

  return sections.join('\n');
}

/**
 * Generates a clean JSON string representation of the Sourcing Plan.
 */
export function generateSourcingPlanJSON(plan: SourcingPlanData): string {
  return JSON.stringify(plan, null, 2);
}
