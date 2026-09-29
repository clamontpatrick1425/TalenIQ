import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TalentMapReport, SourcingPlanData } from '../types';
import { generateDetailedSourcingPlan } from './sourcingPlanGenerator';

export interface SourcingPlanPdfOptions {
  filename?: string;
  customHiringVolume?: number;
  recruiterLeadName?: string;
  hiringManagerName?: string;
}

/**
 * Builds a multi-page, executive-grade PDF document of the Strategic Sourcing & Recruiting Plan.
 */
export function generateSourcingPlanPDF(
  report: TalentMapReport,
  options?: SourcingPlanPdfOptions
): jsPDF {
  const plan: SourcingPlanData = generateDetailedSourcingPlan(
    report,
    options?.customHiringVolume
  );

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Colors
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

  const renderRunningHeader = (sectionTitle: string) => {
    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(0, 0, pageWidth, 4.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.text(`STRATEGIC SOURCING & RECRUITING PLAN  •  ${sectionTitle.toUpperCase()}`, margin, 9.5);
    doc.setFont('helvetica', 'normal');
    doc.text(plan.roleTitle, pageWidth - margin, 9.5, { align: 'right' });
    doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, 12, pageWidth - margin, 12);
    cursorY = 16;
  };

  const checkPageBreak = (neededHeight: number, titleForNext: string) => {
    if (cursorY + neededHeight > pageHeight - 16) {
      doc.addPage();
      renderRunningHeader(titleForNext);
    }
  };

  // ==========================================
  // PAGE 1: MISSION, KPIS & FUNNEL MATH
  // ==========================================
  // Header accent bar
  doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.rect(0, 0, pageWidth, 7, 'F');
  doc.setFillColor(BLUE[0], BLUE[1], BLUE[2]);
  doc.rect(0, 7, pageWidth * 0.45, 2.5, 'F');
  doc.setFillColor(INDIGO[0], INDIGO[1], INDIGO[2]);
  doc.rect(pageWidth * 0.45, 7, pageWidth * 0.55, 2.5, 'F');

  cursorY = 16;

  // Confidentiality Badge
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, cursorY, 130, 5.5, 1.2, 1.2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(BLUE[0], BLUE[1], BLUE[2]);
  doc.text('CONFIDENTIAL: TALENT ACQUISITION & SOURCING WAR ROOM EXECUTION PLAN', margin + 3, cursorY + 3.8);

  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
  doc.setFontSize(7.5);
  doc.text(`Generated: ${dateStr} | Sourcing Engine v2.5`, pageWidth - margin, cursorY + 3.8, { align: 'right' });

  cursorY += 9;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text(`Sourcing Execution Plan: ${plan.roleTitle}`, margin, cursorY);
  cursorY += 6;

  // Meta line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
  doc.text(
    `Target Hires: ${plan.targetHires}  |  Location: ${plan.location} (${plan.workModel})  |  Seniority: ${plan.seniority}  |  Industry: ${plan.industry}`,
    margin,
    cursorY
  );
  cursorY += 7;

  // Executive Mission Narrative
  doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
  doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
  doc.roundedRect(margin, cursorY, contentWidth, 14, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(INDIGO[0], INDIGO[1], INDIGO[2]);
  doc.text('STRATEGIC OBJECTIVE & CALIBRATION MANDATE:', margin + 3, cursorY + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
  const missionText = `Execute a targeted, multi-touch outbound search targeting Tier 1-4 competitor employers. Backed by the 23-Part Talent Map and Sourcing War Room data, this plan establishes required pipeline volumes, boolean strings, weekly milestones, and closing playbooks to secure ${plan.targetHires} hire(s) in ~${plan.timeToFillDays} days.`;
  const splitMission = doc.splitTextToSize(missionText, contentWidth - 6);
  doc.text(splitMission.slice(0, 2), margin + 3, cursorY + 8.5);

  cursorY += 18;

  // 6 Score KPI Tiles
  const tileWidth = (contentWidth - 10) / 3;
  const tileHeight = 16;
  const kpis = [
    { label: 'DIFFICULTY SCORE', val: `${plan.recruitingDifficultyScore}/100`, sub: plan.recruitingDifficultyBand, color: ROSE },
    { label: 'TALENT AVAILABILITY', val: `${plan.talentAvailabilityScore}/100`, sub: plan.talentAvailabilityBand, color: AMBER },
    { label: 'EST. TIME TO FILL', val: `${plan.timeToFillDays} Days`, sub: 'Kickoff to acceptance', color: INDIGO },
    { label: 'ADDRESSABLE SUPPLY', val: plan.addressablePoolSize.toLocaleString(), sub: 'Profiles in market', color: NAVY },
    { label: 'ACTIVE SEEKERS', val: plan.activePoolSize.toLocaleString(), sub: `${Math.round((plan.activePoolSize / Math.max(1, plan.addressablePoolSize)) * 100)}% responsiveness`, color: EMERALD },
    { label: 'MEDIAN BASE COMP', val: `$${(report.compensationIntelligence?.percentiles?.p50 ?? 195000).toLocaleString()}`, sub: `P75: $${(report.compensationIntelligence?.percentiles?.p75 ?? 235000).toLocaleString()}`, color: BLUE },
  ];

  kpis.forEach((tile, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = margin + col * (tileWidth + 5);
    const y = cursorY + row * (tileHeight + 4);

    doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
    doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
    doc.roundedRect(x, y, tileWidth, tileHeight, 1.2, 1.2, 'FD');

    doc.setFillColor(tile.color[0], tile.color[1], tile.color[2]);
    doc.rect(x + 1.2, y + 2, 2, tileHeight - 4, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.text(tile.label, x + 5, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(tile.color[0], tile.color[1], tile.color[2]);
    doc.text(tile.val, x + 5, y + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.text(tile.sub, x + 5, y + 13.8);
  });

  cursorY += tileHeight * 2 + 8;

  // Funnel Capacity Mathematics Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('SOURCING FUNNEL CAPACITY MATHEMATICS & CONVERSION BENCHMARKS', margin, cursorY);
  cursorY += 4;

  const fm = plan.funnelMath;
  const tableData = [
    ['1. Top-of-Funnel Mapped Profiles', `${fm.profilesToSource}`, '100%', 'Mapped via Boolean, GitHub & Target Company lists'],
    ['2. Outbound Messages Dispatched', `${fm.outreachTarget}`, 'Multi-touch', '4-touch personalized outreach sequence cadence'],
    ['3. Positive Responses Expected', `${fm.responsesExpected}`, `~${fm.responseRatePct}%`, 'Engaged candidates requesting 15-min discovery chat'],
    ['4. Recruiter Screens Completed', `${fm.screensCompleted}`, `~${fm.screenPassRatePct}%`, 'Calibrated against behavioral & leveling rubric'],
    ['5. HM Technical Deep-Dives', `${fm.hmInterviews}`, `~${fm.hmPassRatePct}%`, 'Technical architecture and domain problem-solving'],
    ['6. Final Onsite / Calibration Loops', `${fm.finalLoops}`, `~${fm.finalLoopPassRatePct}%`, 'Full cross-functional panel evaluation'],
    ['7. Formal Offers Extended', `${fm.offersExtended}`, `~${fm.offerAcceptanceRatePct}%`, 'Calibrated at P75 market compensation ($' + (report.compensationIntelligence?.percentiles?.p75 ?? 235000).toLocaleString() + ')'],
    ['8. Target Hires Completed', `${fm.projectedHires}`, '100% Target', `Search closed in approximately ~${plan.timeToFillDays} business days`],
  ];

  autoTable(doc, {
    startY: cursorY,
    head: [['Funnel Stage', 'Volume Target', 'Conversion Rate', 'Operational Notes & Execution Rationale']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
      cellPadding: 2.5,
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [51, 65, 85],
      cellPadding: 2.2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { fontStyle: 'bold', halign: 'center', cellWidth: 26 },
      2: { halign: 'center', cellWidth: 26 },
      3: { cellWidth: 'auto' },
    },
    margin: { left: margin, right: margin },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 6;

  // ==========================================
  // PAGE 2: TARGET COMPETITOR POACHING TIERS
  // ==========================================
  doc.addPage();
  renderRunningHeader('Target Competitor Poaching Matrix');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('TARGET COMPETITOR POACHING MATRIX & TALENT POOLS', margin, cursorY);
  cursorY += 4;

  const competitorTableData = plan.competitorTiers.map((t) => [
    `${t.tier}: ${t.tierLabel}`,
    t.companies.join(', '),
    t.tacticalAngle,
    t.vulnerabilityNotes,
    t.targetedSkills.join(', '),
  ]);

  autoTable(doc, {
    startY: cursorY,
    head: [['Tier & Label', 'Target Accounts', 'Poaching Tactical Angle', 'Key Vulnerability Trigger', 'Targeted Skills']],
    body: competitorTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
      cellPadding: 2.5,
    },
    bodyStyles: {
      fontSize: 6.8,
      textColor: [51, 65, 85],
      cellPadding: 2.5,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 36 },
      1: { cellWidth: 32 },
      2: { cellWidth: 40 },
      3: { cellWidth: 42 },
      4: { cellWidth: 'auto' },
    },
    margin: { left: margin, right: margin },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 8;

  // Channel Mix Breakdown Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('SOURCING CHANNEL MIX & PIPELINE ALLOCATION', margin, cursorY);
  cursorY += 4;

  const channelTableData = plan.channelMix.map((c) => [
    c.channel,
    `${c.allocationPct}%`,
    c.expectedYield,
    `Prioritize high-conviction direct approaches to preserve budget and accelerate quality.`
  ]);

  autoTable(doc, {
    startY: cursorY,
    head: [['Sourcing Channel', 'Effort Allocation', 'Expected Pipeline Yield', 'Strategic Directive']],
    body: channelTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [2, 132, 199],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
      cellPadding: 2.2,
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [51, 65, 85],
      cellPadding: 2.2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { halign: 'center', fontStyle: 'bold', cellWidth: 26 },
      2: { cellWidth: 40 },
      3: { cellWidth: 'auto' },
    },
    margin: { left: margin, right: margin },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 8;

  // Talent Movement Insight Box
  doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
  doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
  doc.roundedRect(margin, cursorY, contentWidth, 22, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(EMERALD[0], EMERALD[1], EMERALD[2]);
  doc.text('FEEDER ECOSYSTEM & TALENT MIGRATION PATTERNS:', margin + 3, cursorY + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
  const feederText = (report.talentMovement?.feederCompanies?.slice(0, 3) || [])
    .map((f) => `• ${f.name}: ${f.talentFlow} — ${f.rationale}`)
    .join('\n');
  const splitFeeder = doc.splitTextToSize(feederText || 'Established tech incubators and scale-ups act as reliable talent providers.', contentWidth - 6);
  doc.text(splitFeeder.slice(0, 3), margin + 3, cursorY + 9);

  // ==========================================
  // PAGE 3: SEARCH COMMAND ARSENAL
  // ==========================================
  doc.addPage();
  renderRunningHeader('Ready-to-Run Boolean & Search Arsenal');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('OPERATIONAL SOURCING COMMAND ARSENAL', margin, cursorY);
  cursorY += 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
  doc.text('Execute these exact query strings directly in LinkedIn Recruiter, Google, and GitHub to surface high-match passive profiles.', margin, cursorY + 3);
  cursorY += 7;

  plan.booleanArsenal.slice(0, 4).forEach((b) => {
    checkPageBreak(38, 'Ready-to-Run Boolean & Search Arsenal');

    doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
    doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
    doc.roundedRect(margin, cursorY, contentWidth, 28, 1.5, 1.5, 'FD');

    // Platform Tag
    doc.setFillColor(238, 242, 255);
    doc.roundedRect(margin + 3, cursorY + 3, 34, 4.5, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(INDIGO[0], INDIGO[1], INDIGO[2]);
    doc.text(b.platform.toUpperCase(), margin + 5, cursorY + 6.2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text(b.name, margin + 40, cursorY + 6.2);

    // Purpose line
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.text(`Purpose: ${b.purpose}`, margin + 3, cursorY + 11.5);

    // Code block
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(margin + 3, cursorY + 13.5, contentWidth - 6, 12, 1, 1, 'F');
    doc.setFont('courier', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(56, 189, 248); // cyan
    const splitQuery = doc.splitTextToSize(b.query, contentWidth - 10);
    doc.text(splitQuery.slice(0, 2), margin + 5, cursorY + 18);

    cursorY += 31;
  });

  // ==========================================
  // PAGE 4: MULTI-TOUCH OUTREACH SEQUENCE
  // ==========================================
  doc.addPage();
  renderRunningHeader('Multi-Touch Outreach Playbook');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('CANDIDATE OUTREACH & CONVERSION SEQUENCE (4 TOUCHPOINTS)', margin, cursorY);
  cursorY += 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
  doc.text('Spaced multi-touch sequence combining peer-level engineering pitches, leadership touchpoints, and value propositions.', margin, cursorY + 3);
  cursorY += 7;

  plan.outreachSequence.slice(0, 3).forEach((seq) => {
    checkPageBreak(48, 'Multi-Touch Outreach Playbook');

    doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
    doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
    doc.roundedRect(margin, cursorY, contentWidth, 42, 1.5, 1.5, 'FD');

    // Accent line
    doc.setFillColor(BLUE[0], BLUE[1], BLUE[2]);
    doc.rect(margin, cursorY, 2, 42, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text(seq.touchpoint, margin + 4, cursorY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.text(`Timing: ${seq.timing}  |  Channel: ${seq.channel}`, margin + 4, cursorY + 9);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(INDIGO[0], INDIGO[1], INDIGO[2]);
    doc.text(`Subject: ${seq.subjectLine}`, margin + 4, cursorY + 13.5);

    // Message Box
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin + 4, cursorY + 15.5, contentWidth - 8, 24, 1, 1, 'F');
    doc.setFont('courier', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(15, 23, 42);
    const splitMsg = doc.splitTextToSize(seq.messageTemplate, contentWidth - 12);
    doc.text(splitMsg.slice(0, 7), margin + 6, cursorY + 19.5);

    cursorY += 45;
  });

  // ==========================================
  // PAGE 5: 8-WEEK EXECUTION ROADMAP & RUBRIC
  // ==========================================
  doc.addPage();
  renderRunningHeader('8-Week Phased Execution Roadmap');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('8-WEEK PHASED RECRUITING EXECUTION ROADMAP', margin, cursorY);
  cursorY += 4;

  const roadmapTableData = plan.weeklyRoadmap.map((w) => [
    `${w.week}\n${w.phase}`,
    w.title,
    w.recruiterMilestones.join('\n• '),
    w.hiringManagerMilestones.join('\n• '),
    w.kpiDeliverable,
  ]);

  autoTable(doc, {
    startY: cursorY,
    head: [['Phase & Timing', 'Focus Area', 'Recruiter Deliverables', 'Hiring Manager Commitments', 'Target KPI Deliverable']],
    body: roadmapTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 7,
      fontStyle: 'bold',
      cellPadding: 2.2,
    },
    bodyStyles: {
      fontSize: 6.5,
      textColor: [51, 65, 85],
      cellPadding: 2.2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 26 },
      1: { fontStyle: 'bold', cellWidth: 30 },
      2: { cellWidth: 44 },
      3: { cellWidth: 42 },
      4: { fontStyle: 'bold', cellWidth: 'auto' },
    },
    margin: { left: margin, right: margin },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 8;

  // Screening Rubric Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('CANDIDATE TECHNICAL CALIBRATION & INTERVIEW RUBRIC', margin, cursorY);
  cursorY += 4;

  const rubricTableData = plan.screeningRubric.map((r) => [
    r.category,
    r.mustHaveIndicators.slice(0, 2).join('\n• '),
    r.redFlagWarnings.slice(0, 2).join('\n• '),
    r.interviewPrompt,
  ]);

  autoTable(doc, {
    startY: cursorY,
    head: [['Competency Area', 'Green Flag Indicators', 'Red Flag Warnings', 'Diagnostic Interview Question']],
    body: rubricTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [5, 150, 105],
      textColor: [255, 255, 255],
      fontSize: 7,
      fontStyle: 'bold',
      cellPadding: 2.2,
    },
    bodyStyles: {
      fontSize: 6.5,
      textColor: [51, 65, 85],
      cellPadding: 2.2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 34 },
      1: { cellWidth: 46 },
      2: { cellWidth: 44 },
      3: { cellWidth: 'auto' },
    },
    margin: { left: margin, right: margin },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 6;

  // ==========================================
  // PAGE 6: LIVE PIPELINE, SLAS & SIGN-OFF
  // ==========================================
  doc.addPage();
  renderRunningHeader('Live Pipeline Status & SLAs');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('SOURCING WAR ROOM LIVE PIPELINE & ACTIVE SLAS', margin, cursorY);
  cursorY += 4;

  // 5 Pipeline Stage Pills
  const lp = plan.livePipelineSnapshot;
  const stageColW = (contentWidth - 8) / 5;
  const stages = [
    { label: 'IDENTIFIED', count: lp.identifiedCount, color: BLUE },
    { label: 'OUTREACH SENT', count: lp.outreachedCount, color: AMBER },
    { label: 'SCREENING', count: lp.screeningCount, color: INDIGO },
    { label: 'INTERVIEWING', count: lp.interviewingCount, color: NAVY },
    { label: 'OFFER STAGE', count: lp.offeredCount, color: EMERALD },
  ];

  stages.forEach((st, idx) => {
    const x = margin + idx * (stageColW + 2);
    doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
    doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
    doc.roundedRect(x, cursorY, stageColW, 14, 1.2, 1.2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.text(st.label, x + 3, cursorY + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(st.color[0], st.color[1], st.color[2]);
    doc.text(`${st.count}`, x + 3, cursorY + 10.5);
  });

  cursorY += 19;

  // SLAs Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('RECRUITING SERVICE LEVEL AGREEMENTS (SLAs)', margin, cursorY);
  cursorY += 3;

  const slaTableData = plan.slaCommitments.map((s) => [s.processStep, s.timeframe, s.owner]);

  autoTable(doc, {
    startY: cursorY,
    head: [['Hiring Workflow Stage', 'Strict SLA Commitment', 'Accountable Owner']],
    body: slaTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 7,
      fontStyle: 'bold',
      cellPadding: 2,
    },
    bodyStyles: {
      fontSize: 6.8,
      textColor: [51, 65, 85],
      cellPadding: 2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 90 },
      1: { fontStyle: 'bold', cellWidth: 44 },
      2: { cellWidth: 'auto' },
    },
    margin: { left: margin, right: margin },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 8;

  // Risk Mitigations
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('SEARCH RISK MATRIX & CONTINGENCY MITIGATION', margin, cursorY);
  cursorY += 3;

  const riskTableData = plan.riskMitigations.map((r) => [r.risk, r.severity, r.mitigationAction]);

  autoTable(doc, {
    startY: cursorY,
    head: [['Identified Search Risk', 'Severity', 'Strategic Mitigation Playbook']],
    body: riskTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [225, 29, 72],
      textColor: [255, 255, 255],
      fontSize: 7,
      fontStyle: 'bold',
      cellPadding: 2,
    },
    bodyStyles: {
      fontSize: 6.8,
      textColor: [51, 65, 85],
      cellPadding: 2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 55 },
      1: { halign: 'center', cellWidth: 24 },
      2: { cellWidth: 'auto' },
    },
    margin: { left: margin, right: margin },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 8;

  // Stakeholder Sign-Off Block
  doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
  doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
  doc.roundedRect(margin, cursorY, contentWidth, 24, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('HIRING LEADERSHIP & TALENT ACQUISITION ALIGNMENT SIGN-OFF', margin + 4, cursorY + 5);

  doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
  doc.line(margin + 4, cursorY + 7, margin + contentWidth - 4, cursorY + 7);

  const sigColW = (contentWidth - 12) / 3;
  // Box 1: Recruiter Lead
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
  doc.text('Principal Sourcing Lead:', margin + 4, cursorY + 11);
  doc.line(margin + 4, cursorY + 19, margin + 4 + sigColW - 6, cursorY + 19);
  doc.setFont('helvetica', 'bold');
  doc.text(options?.recruiterLeadName || 'Talent Intelligence Lead', margin + 4, cursorY + 22);

  // Box 2: Hiring Manager
  doc.setFont('helvetica', 'normal');
  doc.text('Hiring Manager Alignment:', margin + 4 + sigColW, cursorY + 11);
  doc.line(margin + 4 + sigColW, cursorY + 19, margin + 4 + sigColW * 2 - 6, cursorY + 19);
  doc.setFont('helvetica', 'bold');
  doc.text(options?.hiringManagerName || 'Engineering Leadership', margin + 4 + sigColW, cursorY + 22);

  // Box 3: Status
  doc.setFont('helvetica', 'normal');
  doc.text('Search Execution Status:', margin + 4 + sigColW * 2, cursorY + 11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(EMERALD[0], EMERALD[1], EMERALD[2]);
  doc.text('ACTIVE SEARCH KICKOFF', margin + 4 + sigColW * 2, cursorY + 16);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
  doc.text(`Approved: ${dateStr}`, margin + 4 + sigColW * 2, cursorY + 22);

  // ==========================================
  // FOOTER & PAGE NUMBERS ACROSS ALL PAGES
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.text(
      'TalentIQ Enterprise  •  Strategic Sourcing & Recruiting Execution Plan  •  23-Part Map & War Room',
      margin,
      pageHeight - 6
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
  }

  return doc;
}

/**
 * Directly generates and triggers download of the Sourcing Plan PDF.
 */
export function downloadSourcingPlanPDF(
  report: TalentMapReport,
  customHiringVolume?: number,
  preferredFilename?: string
): void {
  try {
    const roleSlug = report.input.role.value.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = preferredFilename || `Sourcing_Plan_${roleSlug}_${report.input.geography.location}.pdf`;
    const doc = generateSourcingPlanPDF(report, {
      customHiringVolume,
      filename,
    });
    doc.save(filename);
  } catch (err) {
    console.error('Error generating Sourcing Plan PDF:', err);
    window.print();
  }
}
