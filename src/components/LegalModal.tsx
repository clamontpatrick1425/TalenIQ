import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  FileText,
  X,
  Copy,
  Check,
  Printer,
  Download,
  ExternalLink,
  Search,
  Lock,
  Scale,
  Sparkles,
  AlertCircle,
  Eye,
  CheckCircle2,
  Building,
  UserCheck,
} from 'lucide-react';

export type LegalDocType = 'privacy' | 'terms';

interface LegalModalProps {
  isOpen: boolean;
  initialDoc?: LegalDocType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialDoc = 'privacy',
  onClose,
}) => {
  const [activeDoc, setActiveDoc] = useState<LegalDocType>(initialDoc);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setActiveDoc(initialDoc);
  }, [initialDoc, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    const textToCopy =
      activeDoc === 'privacy' ? privacyPolicyContent : termsAndConditionsContent;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Window */}
      <div
        className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:px-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              {activeDoc === 'privacy' ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <Scale className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="legal-modal-title"
                  className="text-lg font-bold text-white tracking-tight"
                >
                  {activeDoc === 'privacy'
                    ? 'Privacy Policy & Data Protection'
                    : 'Terms & Conditions of Service'}
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  GDPR &amp; CCPA Compliant
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                TalentIQ Enterprise &bull; Effective Date: September 29, 2026 &bull; Version 2.4
              </p>
            </div>
          </div>

          {/* Doc Switcher Tabs & Actions */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Tabs */}
            <div className="flex items-center p-1 bg-slate-950/80 border border-slate-800 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setActiveDoc('privacy')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeDoc === 'privacy'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Privacy Policy</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveDoc('terms')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeDoc === 'terms'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Terms &amp; Conditions</span>
              </button>
            </div>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs"
              title="Copy legal text to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Print document"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 border border-slate-700 text-slate-400 transition-all cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 px-6 bg-slate-950/40 border-b border-slate-800 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Zero Public Model Training</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Human-in-the-Loop AI</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Customer Data Ownership</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>TLS 1.3 / AES-256 Storage</span>
          </div>
        </div>

        {/* Scrollable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm leading-relaxed text-slate-300 scrollbar-thin">
          {activeDoc === 'privacy' ? (
            <div className="space-y-6">
              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono text-xs">01.</span>
                  <span>Scope, Commitment &amp; Overview</span>
                </h3>
                <p>
                  TalentIQ Enterprise (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the Senior Technical Talent Intelligence &amp; Market Mapping System. We provide enterprise-grade talent intelligence, labor supply analytics, compensation benchmarking, and talent acquisition decision-support tools.
                </p>
                <p>
                  This Privacy Policy details how we collect, process, safeguard, and retain information when recruiters, talent acquisition executives, and organizational administrators interact with our application. We adhere to the <strong>General Data Protection Regulation (GDPR)</strong> (Regulation (EU) 2016/679), the <strong>UK GDPR</strong>, the <strong>California Consumer Privacy Act (CCPA)</strong> as amended by the California Privacy Rights Act (CPRA), and applicable federal and state labor and data privacy statutes.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono text-xs">02.</span>
                  <span>Data We Collect and Process</span>
                </h3>
                <p>We process information solely to deliver customized talent market intelligence and sourcing strategies:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                  <li>
                    <strong className="text-white">Job Description &amp; Requisition Data:</strong> Text, job titles, technical skills, core competencies, geographic parameters, seniority levels, compensation targets, and hiring requirements input into the system or uploaded via DOCX, PDF, or text files.
                  </li>
                  <li>
                    <strong className="text-white">Aggregate Labor Market Information:</strong> Publicly available workforce statistics, regional labor liquidity data, competitor company talent movement trends, and standard industry compensation percentiles.
                  </li>
                  <li>
                    <strong className="text-white">Recruitment Strategy Artifacts:</strong> User-customized candidate sourcing strings, boolean queries, executive briefing notes, outreach message templates, and recruiter bookmarks.
                  </li>
                  <li>
                    <strong className="text-white">Technical &amp; Telemetry Data:</strong> IP addresses, browser specifications, diagnostic logs, and platform telemetry utilized strictly for system reliability, security enforcement, and rate-limiting.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono text-xs">03.</span>
                  <span>Artificial Intelligence Processing &amp; Zero Model Training Guarantee</span>
                </h3>
                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs font-mono uppercase">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Strict Model Training Boundaries</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Zero Foundation Model Training:</strong> Customer job descriptions, internal hiring notes, candidate names, proprietary tech stack specifications, and company compensation data are <strong>never</strong> used to train, retrain, fine-tune, or improve public or foundation large language models (including Google Gemini or third-party AI models).
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    All generative AI requests are executed through isolated, stateless enterprise APIs with strict zero-data-retention agreements where prompts are discarded immediately following completion.
                  </p>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono text-xs">04.</span>
                  <span>Human-in-the-Loop &amp; Anti-Bias Safeguards</span>
                </h3>
                <p>
                  Our platform functions solely as a <strong>talent intelligence and decision-support tool</strong>. We maintain strict adherence to the EEOC Uniform Guidelines on Employee Selection Procedures and New York City Local Law 144:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                  <li>
                    <strong className="text-white">No Automated Rejections:</strong> The system does not make autonomous hiring, screening, or employment rejection decisions. All recommendations, candidate match percentages, and market viability scores require human review and judgment.
                  </li>
                  <li>
                    <strong className="text-white">Algorithmic Neutrality:</strong> Market sizing, talent availability, and compensation calculations are grounded in objective skill requirements and economic indices, stripped of protected demographic traits (gender, race, age, religion, national origin, or disability status).
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono text-xs">05.</span>
                  <span>GDPR, UK GDPR &amp; International Data Subject Rights</span>
                </h3>
                <p>
                  If you reside in the European Economic Area (EEA), United Kingdom, or Switzerland, you possess distinct legal rights regarding your personal information under GDPR Articles 15–22:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <strong className="text-white block mb-1">Right to Access &amp; Portability:</strong>
                    You may request a machine-readable export of all data stored within your instance.
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <strong className="text-white block mb-1">Right to Erasure (Forgotten):</strong>
                    You may request the permanent deletion of your account and saved talent intelligence files.
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <strong className="text-white block mb-1">Right to Rectification:</strong>
                    You may update or correct inaccurate requisition parameters and sourcing profiles.
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <strong className="text-white block mb-1">Right to Human Review:</strong>
                    You may request human intervention regarding any automated heuristic estimation.
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono text-xs">06.</span>
                  <span>California Privacy Rights (CCPA / CPRA Notice)</span>
                </h3>
                <p>
                  Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have specific entitlements:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li><strong>Notice at Collection:</strong> We collect only business contact and job requisition data necessary to generate talent intelligence.</li>
                  <li><strong>We Do Not Sell or Share Personal Data:</strong> We have not sold, rented, or shared personal information for monetary or cross-context behavioral advertising in the preceding 12 months.</li>
                  <li><strong>Non-Discrimination:</strong> Exercising your privacy rights will never result in degraded service, price differences, or altered quality.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono text-xs">07.</span>
                  <span>Data Security, Encryption &amp; Retention</span>
                </h3>
                <p>
                  We implement multi-layered administrative, physical, and technical safeguards including TLS 1.3 protocol encryption for all data in transit and AES-256 encryption at rest. Local browser storage is managed strictly via client-side scoped persistence and can be cleared instantly via the application settings or the browser data management panel.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono text-xs">08.</span>
                  <span>Data Protection Officer &amp; Contact</span>
                </h3>
                <p>
                  For privacy inquiries, GDPR data subject access requests (DSAR), or CCPA compliance inquiries, please contact our Data Protection Office at:
                </p>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-300 space-y-0.5">
                  <div><strong>Email:</strong> privacy@talentiq-enterprise.com</div>
                  <div><strong>Attn:</strong> Data Privacy &amp; AI Compliance Officer</div>
                  <div><strong>Enterprise Reference:</strong> TalentIQ Intelligence Platform v2.4</div>
                </div>
              </section>
            </div>
          ) : (
            <div className="space-y-6">
              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono text-xs">01.</span>
                  <span>Acceptance of Terms</span>
                </h3>
                <p>
                  By accessing, browsing, or utilizing the TalentIQ Enterprise Talent Intelligence &amp; Market Mapping System (&quot;Platform&quot; or &quot;Service&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions of Service (&quot;Terms&quot;). If you are accessing this Service on behalf of a company, corporation, staffing agency, or other legal entity, you represent and warrant that you possess the full legal authority to bind such entity to these Terms.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono text-xs">02.</span>
                  <span>Description of SaaS Services</span>
                </h3>
                <p>
                  The Platform provides automated talent market mapping, heuristic job requisition analysis, passive candidate sourcing string generation, compensation percentile modeling, and competitor employer poaching vulnerability assessments. The Service is provided as a Software-as-a-Service (&quot;SaaS&quot;) decision-support utility.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono text-xs">03.</span>
                  <span>Human-in-the-Loop &amp; Non-Reliance Disclaimer</span>
                </h3>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2 leading-relaxed">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-400 font-mono">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Advisory Decision-Support Notice</span>
                  </div>
                  <p>
                    All talent pool estimations, compensation benchmarks, competitor vulnerability rankings, and AI-synthesized market briefs provided by the Service are <strong>advisory estimates and statistical approximations</strong>.
                  </p>
                  <p>
                    The Platform does not make hiring decisions, offer legal or employment counseling, or guarantee candidate availability. The customer maintains exclusive, non-delegable responsibility for all recruiting actions, employment offers, salary determinations, and compliance with federal, state, and local labor legislation (including Title VII of the Civil Rights Act, the Age Discrimination in Employment Act, and the Americans with Disabilities Act).
                  </p>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono text-xs">04.</span>
                  <span>Customer Data Ownership &amp; Intellectual Property</span>
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                  <li>
                    <strong className="text-white">Customer Data:</strong> You retain 100% sole and exclusive ownership of all proprietary job descriptions, internal hiring notes, compensation figures, candidate records, and specific custom queries entered into the Platform.
                  </li>
                  <li>
                    <strong className="text-white">Exported Deliverables:</strong> All exported reports, PDFs, markdown briefs, CSV spreadsheets, and boolean strings generated for your requisitions are your sole property for internal recruitment and executive presentations.
                  </li>
                  <li>
                    <strong className="text-white">Platform Intellectual Property:</strong> TalentIQ Enterprise retains all rights, title, and interest in and to the Platform, including algorithms, heuristic calculation formulas, UI components, stylesheets, and software documentation.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono text-xs">05.</span>
                  <span>Acceptable Use &amp; Prohibited Conduct</span>
                </h3>
                <p>When utilizing the Service, you agree not to:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li>Attempt to reverse-engineer, decompile, or disassemble any part of the algorithmic scoring engines.</li>
                  <li>Use the Service to generate unlawful discriminatory screening criteria or violate equal opportunity employment mandates.</li>
                  <li>Execute automated scraping, data extraction spiders, or excessive API loads that exceed reasonable human user rates.</li>
                  <li>Introduce malicious code, viruses, or harmful payloads through uploaded files.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono text-xs">06.</span>
                  <span>Disclaimer of Warranties</span>
                </h3>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE,&quot; WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT LABOR MARKET CALCULATIONS ARE UNERRING OR THAT CANDIDATE PROFILES ARE GUARANTEED TO CONVERT.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono text-xs">07.</span>
                  <span>Limitation of Liability</span>
                </h3>
                <p>
                  IN NO EVENT SHALL TALENTIQ ENTERPRISE, ITS AFFILIATES, OFFICERS, DIRECTORS, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES (INCLUDING LOSS OF PROFITS, LOSS OF RECRUITMENT REVENUE, OR BUSINESS INTERRUPTION) ARISING OUT OF OR IN CONNECTION WITH THE USE OF OR INABILITY TO USE THE SERVICE. OUR TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE TOTAL FEES PAID BY YOU IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400 font-mono text-xs">08.</span>
                  <span>Governing Law &amp; Dispute Resolution</span>
                </h3>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law principles. Any dispute arising out of these Terms shall be resolved through confidential, binding commercial arbitration administered by the American Arbitration Association (AAA).
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 px-6 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Session &bull; ISO/IEC 27001 &amp; SOC-2 Type II Certified Hosting</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all cursor-pointer border border-slate-700 hover:border-slate-600 shadow-sm"
          >
            I Understand &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Plain text versions for the copy-to-clipboard action
const privacyPolicyContent = `TALENTIQ ENTERPRISE - PRIVACY POLICY & DATA PROTECTION
Effective Date: September 29, 2026 | Version 2.4 | GDPR & CCPA Compliant

1. Scope, Commitment & Overview
TalentIQ Enterprise ("Company", "we", "our") operates the Senior Technical Talent Intelligence & Market Mapping System. We adhere to the General Data Protection Regulation (GDPR) (EU 2016/679), UK GDPR, and California Consumer Privacy Act (CCPA/CPRA).

2. Data We Collect and Process
- Job Description & Requisition Data (titles, skills, competencies, compensation targets).
- Aggregate Labor Market Information (workforce demographics, liquidity, market benchmarks).
- Recruitment Strategy Artifacts (custom Boolean strings, outreach templates, executive briefs).
- Telemetry & Diagnostic Logs (IP addresses, browser details for security and rate limiting).

3. Artificial Intelligence & Zero Model Training Guarantee
Zero Foundation Model Training: Customer job descriptions, internal hiring notes, candidate names, proprietary tech stack specifications, and company compensation data are NEVER used to train, retrain, or fine-tune public foundation AI models. All generative AI requests are executed through isolated, stateless enterprise APIs.

4. Human-in-the-Loop & Anti-Bias Safeguards
The platform is an advisory decision-support tool. No automated rejections or candidate disqualifications occur without human recruiter oversight, adhering strictly to EEOC Uniform Guidelines and NYC Local Law 144.

5. Global Privacy Rights (GDPR & CCPA)
Users maintain the right to access, rectify, port, and permanently erase their data at any time. We do not sell or share personal information for cross-context behavioral advertising.

6. Security & Encryption
All data in transit is protected via TLS 1.3 protocol encryption, and stored data is encrypted using AES-256.

Contact: privacy@talentiq-enterprise.com | Attn: Data Privacy & AI Compliance Officer`;

const termsAndConditionsContent = `TALENTIQ ENTERPRISE - TERMS & CONDITIONS OF SERVICE
Effective Date: September 29, 2026 | Version 2.4

1. Acceptance of Terms
By accessing or using the TalentIQ Enterprise Talent Intelligence & Market Mapping System ("Platform"), you agree to be bound by these Terms and Conditions.

2. Description of SaaS Services
The Platform provides automated talent market mapping, heuristic job requisition analysis, passive candidate sourcing string generation, compensation percentile modeling, and competitor poaching vulnerability assessments.

3. Human-in-the-Loop & Non-Reliance Disclaimer
All talent pool estimations, compensation benchmarks, competitor vulnerability rankings, and AI-synthesized market briefs are advisory estimates and statistical approximations. The customer retains sole and non-delegable responsibility for all recruiting actions, hiring decisions, and labor law compliance (Title VII, ADEA, ADA, EEOC).

4. Customer Data Ownership
You retain 100% sole and exclusive ownership of all proprietary job descriptions, internal requisition notes, candidate pipelines, and custom exported talent maps and briefs.

5. Acceptable Use
Users agree not to reverse-engineer algorithmic models, scrape platform data, or utilize outputs to violate employment anti-discrimination laws.

6. Limitation of Liability
The service is provided "AS IS". To the maximum extent permitted by law, TalentIQ Enterprise's total aggregate liability shall not exceed fees paid in the twelve (12) months preceding any claim.

7. Governing Law
These Terms are governed by the laws of the State of Delaware, with disputes resolved via binding commercial arbitration.

Contact: legal@talentiq-enterprise.com`;
