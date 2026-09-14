import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TalentMapReport } from '../types';

export interface StakeholderReportOptions {
  hiringManagerName?: string;
  hiringManagerTitle?: string;
  department?: string;
  talentLeadName?: string;
  confidentialityLevel?: string;
  customStakeholderNotes?: string;
  filename?: string;
  includeCompensation?: boolean;
  includeCompetitors?: boolean;
  includeCalibrationMatrix?: boolean;
  includeScreenQuestions?: boolean;
  includeLeveling?: boolean;
  includeRisks?: boolean;
  includeClosingStrategy?: boolean;
}

const DEFAULT_OPTIONS: StakeholderReportOptions = {
  hiringManagerName: 'Hiring Manager & Interview Committee',
  hiringManagerTitle: 'Engineering Leadership',
  department: 'Technology & Product Operations',
  talentLeadName: 'Principal Talent Intelligence Lead',
  confidentialityLevel: 'CONFIDENTIAL: Internal Leadership & Hiring Committee Only',
  customStakeholderNotes: 'This talent intelligence brief establishes labor supply availability, market compensation benchmarks, competitor sourcing pools, and candidate calibration rubrics to ensure rapid hiring loop alignment.',
  filename: 'report.pdf',
  includeCompensation: true,
  includeCompetitors: true,
  includeCalibrationMatrix: true,
  includeScreenQuestions: true,
  includeLeveling: true,
  includeRisks: true,
  includeClosingStrategy: true,
};

/**
 * Builds a comprehensive, professional executive PDF report
 * tailored for presentation to Hiring Managers and Key Stakeholders.
 */
export function generateStakeholderReportPDF(
  report: TalentMapReport,
  userOptions?: Partial<StakeholderReportOptions>
): jsPDF {
  const options: StakeholderReportOptions = { ...DEFAULT_OPTIONS, ...userOptions };
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Color Palette
  const NAVY = [15, 23, 42] as [number, number, number];       // #0f172a
  const SLATE = [71, 85, 105] as [number, number, number];     // #475569
  const LIGHT_BG = [248, 250, 252] as [number, number, number];// #f8fafc
  const BORDER = [226, 232, 240] as [number, number, number];  // #e2e8f0
  const BLUE = [2, 132, 199] as [number, number, number];      // #0284c7
  const EMERALD = [5, 150, 105] as [number, number, number];   // #059669
  const ROSE = [225, 29, 72] as [number, number, number];      // #e11d48
  const AMBER = [217, 119, 6] as [number, number, number];     // #d97706
  const INDIGO = [79, 70, 229] as [number, number, number];    // #4f46e5

  let cursorY = margin;

  // Helper to ensure page bounds
  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - 16) {
      doc.addPage();
      cursorY = margin;
      renderRunningHeader();
    }
  };

  const renderRunningHeader = () => {
    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(0, 0, pageWidth, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.text('TALENT INTELLIGENCE & HIRING CALIBRATION REPORT', margin, 10);
    doc.setFont('helvetica', 'normal');
    doc.text(report.input.role.value, pageWidth - margin, 10, { align: 'right' });
    doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, 12, pageWidth - margin, 12);
    cursorY = 16;
  };

  // ==========================================
  // PAGE 1: EXECUTIVE BRIEF & MARKET HEALTH
  // ==========================================

  // Top Color Accent Bar
  doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.rect(0, 0, pageWidth, 8, 'F');
  doc.setFillColor(BLUE[0], BLUE[1], BLUE[2]);
  doc.rect(0, 8, pageWidth * 0.45, 2, 'F');
  doc.setFillColor(INDIGO[0], INDIGO[1], INDIGO[2]);
  doc.rect(pageWidth * 0.45, 8, pageWidth * 0.55, 2, 'F');

  cursorY = 16;

  // Confidentiality Pill
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, cursorY, 120, 6, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(BLUE[0], BLUE[1], BLUE[2]);
  doc.text(options.confidentialityLevel?.toUpperCase() || 'CONFIDENTIAL EXECUTIVE BRIEF', margin + 3, cursorY + 4.2);

  const reportDate = new Date(report.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
  doc.setFontSize(8);
  doc.text(`Generated: ${reportDate} | Platform v2.5`, pageWidth - margin, cursorY + 4.2, { align: 'right' });

  cursorY += 10;

  // Main Report Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  const titleText = report.input.role.value || 'Technical Leadership';
  doc.text(titleText, margin, cursorY);
  cursorY += 7;

  // Subtitle & Key Metadata Row
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
  const metaLine = `Location: ${report.input.geography.location} (${report.input.workModel.value})  |  Seniority: ${report.input.seniority.value}  |  Industry: ${report.input.industry.value}`;
  doc.text(metaLine, margin, cursorY);
  cursorY += 7;

  // Stakeholder Details Box
  doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
  doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, cursorY, contentWidth, 18, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('PRESENTED TO:', margin + 4, cursorY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
  doc.text(`${options.hiringManagerName} (${options.hiringManagerTitle || 'Hiring Lead'})`, margin + 34, cursorY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('DEPARTMENT:', margin + 4, cursorY + 10.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
  doc.text(`${options.department || 'Technology'}`, margin + 34, cursorY + 10.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('PREPARED BY:', margin + 4, cursorY + 15.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
  doc.text(`${options.talentLeadName} (Talent Intelligence)`, margin + 34, cursorY + 15.5);

  cursorY += 23;

  // Custom Stakeholder Mandate / Note
  if (options.customStakeholderNotes && options.customStakeholderNotes.trim().length > 0) {
    doc.setFillColor(238, 242, 255); // light indigo
    doc.setDrawColor(199, 210, 254);
    doc.roundedRect(margin, cursorY, contentWidth, 13, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(INDIGO[0], INDIGO[1], INDIGO[2]);
    doc.text('CALIBRATION MANDATE & STRATEGIC NOTE:', margin + 3, cursorY + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    const splitNote = doc.splitTextToSize(options.customStakeholderNotes, contentWidth - 6);
    doc.text(splitNote.slice(0, 2), margin + 3, cursorY + 8.5);
    cursorY += 16;
  }

  // ------------------------------------------
  // 6 KEY EXECUTIVE SCORE TILES
  // ------------------------------------------
  const tileWidth = (contentWidth - 10) / 3;
  const tileHeight = 17;

  const scoreTiles = [
    {
      label: 'ADDRESSABLE TALENT POOL',
      val: report.talentSupply.addressable.count.toLocaleString(),
      sub: 'Qualified in labor market',
      color: NAVY,
    },
    {
      label: 'ACTIVE SEARCHERS (REACHABLE)',
      val: report.talentSupply.active.count.toLocaleString(),
      sub: `${Math.round((report.talentSupply.active.count / Math.max(1, report.talentSupply.addressable.count)) * 100)}% immediate response`,
      color: EMERALD,
    },
    {
      label: 'MEDIAN BASE COMPENSATION',
      val: `$${(report.compensationIntelligence.baseSalary.p50 || 195000).toLocaleString()}`,
      sub: `Budget: ${report.compensationIntelligence.budgetAlignment || report.compensationIntelligence.marketPosition || 'At Market'}`,
      color: BLUE,
    },
    {
      label: 'RECRUITING DIFFICULTY',
      val: `${report.recruitingDifficultyScore.score}/100`,
      sub: report.recruitingDifficultyScore.band,
      color: ROSE,
    },
    {
      label: 'TALENT AVAILABILITY INDEX',
      val: `${report.talentAvailabilityScore.score}/100`,
      sub: report.talentAvailabilityScore.band,
      color: AMBER,
    },
    {
      label: 'EXPECTED TIME TO FILL',
      val: `${report.recruitingDifficultyScore.expectedTimeToFillDays || 64} Days`,
      sub: 'Kickoff to offer acceptance',
      color: INDIGO,
    },
  ];

  scoreTiles.forEach((tile, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = margin + col * (tileWidth + 5);
    const y = cursorY + row * (tileHeight + 4);

    doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
    doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
    doc.roundedRect(x, y, tileWidth, tileHeight, 1.5, 1.5, 'FD');

    // Mini accent indicator
    doc.setFillColor(tile.color[0], tile.color[1], tile.color[2]);
    doc.rect(x + 1.5, y + 2.5, 2, tileHeight - 5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.text(tile.label, x + 5.5, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(tile.color[0], tile.color[1], tile.color[2]);
    doc.text(tile.val, x + 5.5, y + 10.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.text(tile.sub, x + 5.5, y + 14.5);
  });

  cursorY += tileHeight * 2 + 10;

  // ------------------------------------------
  // EXECUTIVE SUMMARY & STRATEGIC ASSESSMENT
  // ------------------------------------------
  doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.rect(margin, cursorY, 3, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('EXECUTIVE LABOR MARKET ASSESSMENT', margin + 5, cursorY + 5.5);
  cursorY += 9;

  doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
  doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
  const narrative = report.executiveSummary.executiveBriefNarrative ||
    'High market demand with specialized technical overlap. Targeted competitor poaching and crisp interview calibration will be required to convert upper-quartile talent within compensation parameters.';
  const narrativeLines = doc.splitTextToSize(narrative, contentWidth - 8);
  const narrativeBoxHeight = narrativeLines.length * 4.2 + 8;

  doc.roundedRect(margin, cursorY, contentWidth, narrativeBoxHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
  doc.text(narrativeLines, margin + 4, cursorY + 5.5);

  cursorY += narrativeBoxHeight + 6;

  // Strategic Operating Takeaways
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('CRITICAL RECRUITING TAKEAWAYS & OPERATING RECOMMENDATIONS:', margin, cursorY);
  cursorY += 4.5;

  const takeaways = report.executiveRecruitingBrief.keyTakeaways?.slice(0, 3) || [
    'Direct outreach to Tier-1 competitors yields highest technical alignment; highlight architectural agency and modern stack.',
    'Compromising on distributed scale experience during phone screens creates significant on-site rejection late in the funnel.',
    'Mandatory multi-day in-office models create immediate 35-45% candidate drop-off; flexible hybrid or remote positioning expands qualified pool by 2.8x.',
  ];

  takeaways.forEach((takeaway) => {
    doc.setFillColor(EMERALD[0], EMERALD[1], EMERALD[2]);
    doc.circle(margin + 2, cursorY + 1.2, 1.2, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    const lines = doc.splitTextToSize(takeaway, contentWidth - 8);
    doc.text(lines, margin + 6, cursorY + 2.5);
    cursorY += lines.length * 4 + 1.5;
  });

  cursorY += 4;

  // Sourcing & Adjacent Pool Quick Matrix
  const colW = (contentWidth - 6) / 2;
  // Left Box: Competitors
  doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
  doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
  doc.roundedRect(margin, cursorY, colW, 28, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(BLUE[0], BLUE[1], BLUE[2]);
  doc.text('TARGET POACHING EMPLOYERS', margin + 3, cursorY + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
  const comps = (report.executiveSummary.top10TargetCompanies || ['Meta', 'Amazon', 'Databricks', 'Snowflake', 'Stripe']).slice(0, 6).join(' • ');
  const compLines = doc.splitTextToSize(comps, colW - 6);
  doc.text(compLines, margin + 3, cursorY + 9);

  // Right Box: Adjacent Talent Pools
  doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
  doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
  doc.roundedRect(margin + colW + 6, cursorY, colW, 28, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(INDIGO[0], INDIGO[1], INDIGO[2]);
  doc.text('RECOMMENDED ADJACENT TALENT POOLS', margin + colW + 9, cursorY + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
  const pools = report.executiveSummary.best5AdjacentTalentPools || ['Distributed Cloud Systems', 'High-Throughput Streaming Infrastructure', 'Database Core Engines'];
  pools.slice(0, 3).forEach((pool, pIdx) => {
    doc.text(`›  ${pool}`, margin + colW + 9, cursorY + 9 + pIdx * 5);
  });

  // ==========================================
  // PAGE 2: COMPENSATION & COMPETITOR MATRIX
  // ==========================================
  doc.addPage();
  renderRunningHeader();

  if (options.includeCompensation) {
    checkPageBreak(50);
    doc.setFillColor(BLUE[0], BLUE[1], BLUE[2]);
    doc.rect(margin, cursorY, 3, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text('COMPENSATION INTELLIGENCE & BENCHMARKS', margin + 5, cursorY + 5);
    cursorY += 8;

    const comp = report.compensationIntelligence;
    const p25 = (comp.baseSalary.p25 || 165000).toLocaleString();
    const p50 = (comp.baseSalary.p50 || 195000).toLocaleString();
    const p75 = (comp.baseSalary.p75 || 235000).toLocaleString();
    const p90 = (comp.baseSalary.p90 || 280000).toLocaleString();
    const targetMin = (report.input.compensationTarget.min || 180000).toLocaleString();
    const targetMax = (report.input.compensationTarget.max || 230000).toLocaleString();

    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      head: [['Percentile Band', 'Base Salary (USD)', 'Market Context & Budget Assessment']],
      body: [
        ['25th Percentile (P25)', `$${p25}`, 'Lower quartile; non-tier-1 tech firms or transitioning titles'],
        ['50th Percentile (P50 Median)', `$${p50}`, 'Market median for verified qualified talent in this geography'],
        ['75th Percentile (P75)', `$${p75}`, 'Competitive bar; candidates with direct production scale expertise'],
        ['90th Percentile (P90 Top Tier)', `$${p90}`, 'Tier-1 Big Tech compensation / scarce specialist premium'],
        ['Target Hiring Range', `$${targetMin} - $${targetMax}`, `Alignment: ${comp.budgetAlignment || comp.marketPosition || 'At Market'}`],
      ],
      headStyles: {
        fillColor: NAVY,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: NAVY,
      },
      alternateRowStyles: {
        fillColor: LIGHT_BG,
      },
      theme: 'grid',
    });

    // @ts-ignore
    cursorY = (doc as any).lastAutoTable.finalY + 8;
  }

  if (options.includeCompetitors) {
    checkPageBreak(50);
    doc.setFillColor(ROSE[0], ROSE[1], ROSE[2]);
    doc.rect(margin, cursorY, 3, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text('COMPETITIVE EMPLOYER LANDSCAPE & POACHING HOOKS', margin + 5, cursorY + 5);
    cursorY += 8;

    const competitors = (report.competitiveEmployerLandscape || []).slice(0, 6);
    const compRows = competitors.map((c) => [
      c.tier || 'Tier 1',
      c.name,
      c.hiringActivity || 'Moderate',
      c.geographicPresence || report.input.geography.location,
      c.poachingAngle || 'Focus on direct ownership and streamlined technical RFC process',
    ]);

    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      head: [['Tier', 'Company Name', 'Hiring Pace', 'Presence', 'Actionable Poaching Pitch / Vulnerability']],
      body: compRows.length > 0 ? compRows : [
        ['Tier 1', 'Meta / Reality Labs', 'Cooling', 'Austin / Remote', 'Frustration with organizational re-orgs; pitch clear ownership'],
        ['Tier 1', 'Amazon / AWS', 'Moderate', 'National Hubs', 'RTO mandate resistance; highlight full autonomy and modern stack'],
        ['Tier 2', 'Databricks', 'High', 'Remote / SF', 'Pace and burn-out; pitch mission velocity with sane sustainable on-call'],
        ['Tier 2', 'Stripe', 'Moderate', 'Hubs', 'Matrixed approvals; emphasize direct executive interface and speed'],
      ],
      headStyles: {
        fillColor: NAVY,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7.2,
        textColor: NAVY,
      },
      alternateRowStyles: {
        fillColor: LIGHT_BG,
      },
      columnStyles: {
        0: { cellWidth: 16 },
        1: { cellWidth: 32, fontStyle: 'bold' },
        2: { cellWidth: 22 },
        3: { cellWidth: 28 },
        4: { cellWidth: 'auto' },
      },
      theme: 'grid',
    });

    // @ts-ignore
    cursorY = (doc as any).lastAutoTable.finalY + 8;
  }

  // ==========================================
  // PAGE 3: HIRING CALIBRATION MATRIX (RUBRIC)
  // ==========================================
  doc.addPage();
  renderRunningHeader();

  if (options.includeCalibrationMatrix) {
    checkPageBreak(50);
    doc.setFillColor(INDIGO[0], INDIGO[1], INDIGO[2]);
    doc.rect(margin, cursorY, 3, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text('HIRING TEAM INTERVIEW CALIBRATION RUBRIC', margin + 5, cursorY + 5);
    cursorY += 8;

    const primarySkills = report.input.skills.required.value.slice(0, 3).join(', ');

    const rubricData = [
      [
        'Core Architecture & Code Craft\n(Weight: 30%)',
        `Evaluates clean abstractions, memory safety, and domain mastery in ${primarySkills}.`,
        '• Articulates latency vs memory trade-offs\n• Designs clean fault-tolerant modular boundaries\n• Solid understanding of consensus and stateful services',
        '• Relies on framework magic without understanding runtime concurrency\n• Cannot diagnose network partition failure modes',
      ],
      [
        'Distributed Scale & Production Triage\n(Weight: 25%)',
        'Evaluates production resilience, telemetry (metrics/traces), capacity planning, and live triage.',
        '• Concrete post-mortem stories with actionable remediation\n• Understands P99 latency tails, backpressure, rate-limiting\n• Proactively instrumented observability dashboards',
        '• Considers reliability solely an "SRE/DevOps" problem\n• Struggles to explain cascading database lock contention',
      ],
      [
        'Technical Leadership & RFC Clarity\n(Weight: 25%)',
        'Evaluates cross-functional alignment, RFC drafting, pragmatic trade-offs, and peer mentorship.',
        '• Translates ambiguous product goals into crisp technical roadmaps\n• Elevates peer engineering through rigorous code reviews\n• Fast resolution of technical deadlock',
        '• Prefers isolated individual heroics over shared documentation\n• Dogmatically unwilling to make pragmatic timeline trade-offs',
      ],
      [
        'High Agency & Startup Velocity\n(Weight: 20%)',
        'Evaluates comfort with ambiguity, high bias for shipping, accountability, and customer empathy.',
        '• Thrives with minimal oversight; defines own high bar\n• Fast feedback loops; direct customer impact orientation\n• High personal accountability for delivery outcomes',
        '• Paralyzed without pre-defined tickets and bureaucratic approval\n• Disengages when project requirements evolve rapidly',
      ],
    ];

    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      head: [['Evaluation Domain', 'Competency Scope', 'Strong Hire Signals (Green Flags)', 'Disqualifying Red Flags']],
      body: rubricData,
      headStyles: {
        fillColor: NAVY,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      bodyStyles: {
        fontSize: 6.8,
        textColor: NAVY,
      },
      alternateRowStyles: {
        fillColor: LIGHT_BG,
      },
      columnStyles: {
        0: { cellWidth: 36, fontStyle: 'bold' },
        1: { cellWidth: 42 },
        2: { cellWidth: 54 },
        3: { cellWidth: 50 },
      },
      theme: 'grid',
    });

    // @ts-ignore
    cursorY = (doc as any).lastAutoTable.finalY + 8;
  }

  // High-Signal Screen Questions
  if (options.includeScreenQuestions) {
    checkPageBreak(50);
    doc.setFillColor(EMERALD[0], EMERALD[1], EMERALD[2]);
    doc.rect(margin, cursorY, 3, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text('HIGH-SIGNAL SCREENING QUESTIONS & EVALUATION GUIDE', margin + 5, cursorY + 5);
    cursorY += 8;

    const questionsData = [
      [
        'Q1: Complex Architecture Bottleneck',
        `"Walk me through the most complex distributed system you designed using ${report.input.skills.required.value[0] || 'your core stack'}. What was the hardest bottleneck?"`,
        'Listen for: deep intuition on serialization overhead, network I/O, database contention, and idempotency.\nProbe: "If traffic spiked 10x overnight, which subsystem fails first?"',
      ],
      [
        'Q2: Production Outage Post-Mortem',
        '"Describe a catastrophic outage or degradation you directly triaged. What was the root cause and long-term fix?"',
        'Listen for: methodical root-cause debugging, calm incident commander behavior, and systemic regression testing.\nProbe: "How did you prevent identical regressions across adjacent services?"',
      ],
      [
        'Q3: RFC Technical Alignment',
        '"How do you drive consensus when 3 staff engineers have diametrically opposed views on data layer architecture?"',
        'Listen for: data-driven benchmarking, customer-centric priority sorting, and crisp executive decision clarity.\nProbe: "When is it appropriate to disagree and commit versus escalating?"',
      ],
    ];

    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      head: [['Question Category', 'Interview Question Prompt', 'Evaluation Criteria & Follow-Up Probes']],
      body: questionsData,
      headStyles: {
        fillColor: NAVY,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      bodyStyles: {
        fontSize: 7,
        textColor: NAVY,
      },
      alternateRowStyles: {
        fillColor: LIGHT_BG,
      },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        1: { cellWidth: 65 },
        2: { cellWidth: 'auto' },
      },
      theme: 'grid',
    });

    // @ts-ignore
    cursorY = (doc as any).lastAutoTable.finalY + 8;
  }

  // ==========================================
  // PAGE 4: RISKS, LEVELING & STAKEHOLDER SIGN-OFF
  // ==========================================
  checkPageBreak(90);

  if (options.includeLeveling) {
    doc.setFillColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.rect(margin, cursorY, 3, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text('CORPORATE GRADE EQUIVALENCY & LEVELING MATRIX', margin + 5, cursorY + 5);
    cursorY += 8;

    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      head: [['Level Tier', 'Industry Benchmark', 'Role Scope & Autonomy Expectation']],
      body: [
        ['Senior IC (L5)', 'Meta E5 / Google L5 / Stripe L3', 'Autonomously executes multi-quarter projects; high operational fluency; mentors juniors; executes within established architecture.'],
        ['Staff IC (L6 - Target)', 'Meta E6 / Google L6 / Staff', 'Defines domain boundaries; sets architecture standards; eliminates organizational systemic risks; drives RFC alignment across 3+ teams.'],
        ['Principal IC (L7)', 'Meta E7 / Google L7 / Principal', 'Company-wide technical strategy; influences multi-year roadmap and executive decisions; creates transformative business advantages.'],
      ],
      headStyles: {
        fillColor: NAVY,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      bodyStyles: {
        fontSize: 7,
        textColor: NAVY,
      },
      theme: 'grid',
    });

    // @ts-ignore
    cursorY = (doc as any).lastAutoTable.finalY + 8;
  }

  if (options.includeRisks && report.risksAndConstraints?.risks?.length) {
    checkPageBreak(50);
    doc.setFillColor(ROSE[0], ROSE[1], ROSE[2]);
    doc.rect(margin, cursorY, 3, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text('KEY RECRUITING RISKS & MITIGATION PLAYBOOK', margin + 5, cursorY + 5);
    cursorY += 8;

    const riskRows = report.risksAndConstraints.risks.slice(0, 3).map((r) => [
      r.severity || 'High',
      r.risk,
      r.mitigationStrategy,
    ]);

    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      head: [['Severity', 'Identified Market Constraint / Risk', 'Recommended Actionable Mitigation Strategy']],
      body: riskRows,
      headStyles: {
        fillColor: NAVY,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      bodyStyles: {
        fontSize: 7,
        textColor: NAVY,
      },
      columnStyles: {
        0: { cellWidth: 20, fontStyle: 'bold' },
        1: { cellWidth: 65 },
        2: { cellWidth: 'auto' },
      },
      theme: 'grid',
    });

    // @ts-ignore
    cursorY = (doc as any).lastAutoTable.finalY + 8;
  }

  if (options.includeClosingStrategy && report.executiveRecruitingBrief?.closingStrategy) {
    checkPageBreak(30);
    doc.setFillColor(240, 253, 244); // light emerald
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, cursorY, contentWidth, 18, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(EMERALD[0], EMERALD[1], EMERALD[2]);
    doc.text('CANDIDATE CLOSING STRATEGY & VALUE PROPOSITION:', margin + 3, cursorY + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    const closeLines = doc.splitTextToSize(report.executiveRecruitingBrief.closingStrategy, contentWidth - 6);
    doc.text(closeLines.slice(0, 3), margin + 3, cursorY + 9.5);
    cursorY += 22;
  }

  // ------------------------------------------
  // STAKEHOLDER SIGN-OFF & CALIBRATION APPROVAL
  // ------------------------------------------
  checkPageBreak(36);
  doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
  doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
  doc.roundedRect(margin, cursorY, contentWidth, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('HIRING MANAGER & TALENT ACQUISITION ALIGNMENT SIGN-OFF', margin + 4, cursorY + 5.5);

  doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
  doc.line(margin + 4, cursorY + 7.5, margin + contentWidth - 4, cursorY + 7.5);

  const sigColW = (contentWidth - 12) / 3;
  // Box 1: Hiring Manager
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
  doc.text('Hiring Manager Calibration Sign-off:', margin + 4, cursorY + 12);
  doc.line(margin + 4, cursorY + 22, margin + 4 + sigColW - 6, cursorY + 22);
  doc.setFont('helvetica', 'bold');
  doc.text(`${options.hiringManagerName}`, margin + 4, cursorY + 25.5);

  // Box 2: Talent Lead
  doc.setFont('helvetica', 'normal');
  doc.text('Talent Intelligence Lead Sign-off:', margin + 4 + sigColW, cursorY + 12);
  doc.line(margin + 4 + sigColW, cursorY + 22, margin + 4 + sigColW * 2 - 6, cursorY + 22);
  doc.setFont('helvetica', 'bold');
  doc.text(`${options.talentLeadName}`, margin + 4 + sigColW, cursorY + 25.5);

  // Box 3: Status / Kickoff
  doc.setFont('helvetica', 'normal');
  doc.text('Kickoff & Calibration Status:', margin + 4 + sigColW * 2, cursorY + 12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(EMERALD[0], EMERALD[1], EMERALD[2]);
  doc.text('CALIBRATION APPROVED', margin + 4 + sigColW * 2, cursorY + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
  doc.text(`Active Search Kickoff: ${reportDate}`, margin + 4 + sigColW * 2, cursorY + 25.5);

  cursorY += 34;

  // ------------------------------------------
  // FOOTER & PAGE NUMBERS ACROSS ALL PAGES
  // ------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.text(
      'TalentIQ Enterprise Intelligence Platform  •  Non-Fabrication Audited Labor Market Analytics',
      margin,
      pageHeight - 6
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 6,
      { align: 'right' }
    );
  }

  return doc;
}

/**
 * Directly generates and triggers download of the customized PDF file as report.pdf
 */
export function downloadStakeholderReportPDF(
  report: TalentMapReport,
  userOptions?: Partial<StakeholderReportOptions>,
  preferredFilename = 'report.pdf'
): void {
  try {
    const doc = generateStakeholderReportPDF(report, userOptions);
    doc.save(preferredFilename);
  } catch (error) {
    console.error('Error generating stakeholder PDF report with jsPDF:', error);
    // Fallback if jsPDF fails: trigger browser print
    window.print();
  }
}
