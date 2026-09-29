export interface SampleJDPreset {
  id: string;
  title: string;
  role: string;
  location: string;
  seniority: string;
  industry: string;
  workModel: string;
  category: 'Engineering & AI' | 'Product & Design' | 'Data & Analytics' | 'Security & DevOps' | 'Sales & GTM' | 'Marketing' | 'Finance & Strategy';
  summary: string;
  jdText: string;
}

export const SAMPLE_JD_PRESETS: SampleJDPreset[] = [
  {
    id: 'staff-ml-austin',
    title: 'Staff Machine Learning Engineer',
    role: 'Staff Machine Learning Engineer',
    location: 'Austin, TX',
    seniority: 'STAFF',
    industry: 'Artificial Intelligence & Autonomous Systems',
    workModel: 'HYBRID',
    category: 'Engineering & AI',
    summary: 'Distributed model inference, PyTorch, CUDA kernel optimization, LLM fine-tuning, latency-critical real-time serving pipelines.',
    jdText: `Job Title: Staff Machine Learning Engineer
Location: Austin, TX (Hybrid - 3 days on-site in Downtown Austin office)
Department: AI Platform & Intelligent Infrastructure
Employment Type: Full-Time
Experience Level: Staff / Principal (8+ years industry experience)

About the Role:
We are looking for a Staff Machine Learning Engineer to lead the architectural evolution of our large-scale foundation model training and high-throughput real-time inference platform. You will serve as the technical authority across our AI engineering org, bridging deep algorithmic expertise with distributed systems engineering.

Key Responsibilities:
- Architect, build, and optimize low-latency distributed model serving systems processing >50,000 requests/sec with p99 latency < 25ms.
- Lead LLM fine-tuning (LoRA, QLoRA, DPO), model quantization (AWQ, GPTQ), and custom CUDA/Triton kernel optimizations.
- Design resilient MLOps pipelines utilizing Kubernetes, Ray, Kubeflow, and Triton Inference Server.
- Mentor senior engineers, establish AI reliability standards, and collaborate closely with product and infrastructure executives.
- Drive cost-efficiency across large GPU clusters (H100/A100) via smart batching and vLLM integration.

Requirements:
- 8+ years of production software engineering experience, with 5+ years dedicated to ML Systems and Deep Learning engineering.
- Deep mastery of Python, C++, PyTorch, and distributed training paradigms (FSDP, DeepSpeed, Megatron-LM).
- Proven hands-on experience deploying latency-sensitive ML models to production at hyper-scale.
- Strong knowledge of vector databases (Milvus, Pinecone, Qdrant) and RAG architecture.
- B.S., M.S., or Ph.D. in Computer Science, Electrical Engineering, Machine Learning, or related quantitative field.

Preferred Qualifications:
- Prior experience in Autonomous Vehicles, Robotics, or high-throughput Generative AI consumer platforms.
- Active contributor to open-source ML frameworks (e.g., vLLM, HuggingFace, Ray, PyTorch).
- Experience with AWS/GCP GPU orchestration, Slurm, and NCCL network tuning.

Compensation & Benefits:
Target Base Salary: $230,000 - $285,000 USD + Meaningful Equity (RSUs) + 15% Annual Target Bonus.`
  },
  {
    id: 'sr-director-product-b2b',
    title: 'Senior Director of Product Management',
    role: 'Senior Director of Product Management',
    location: 'San Francisco, CA',
    seniority: 'DIRECTOR',
    industry: 'Enterprise B2B SaaS',
    workModel: 'HYBRID',
    category: 'Product & Design',
    summary: 'Enterprise SaaS roadmapping, 0-to-1 product discovery, multi-sided marketplace, PLG to enterprise sales motions, GTM alignment.',
    jdText: `Job Title: Senior Director of Product Management
Company: CloudScale Enterprise Solutions
Location: San Francisco, CA (Hybrid - 2 days/week in Financial District)
Seniority Level: Senior Director / Executive
Compensation: $260,000 - $320,000 Base Salary + Equity + 25% Performance Bonus

Position Overview:
CloudScale is looking for a Senior Director of Product Management to spearhead our Core Enterprise Platform division. In this role, you will lead a team of 6 Principal and Group Product Managers responsible for driving multi-product expansion, API monetization, and self-serve to enterprise product-led growth (PLG) strategies across 12,000 corporate customers.

Core Responsibilities:
- Define the 3-year vision, strategy, and roadmap for our flagship Enterprise Workflow Platform.
- Partner with Engineering, Design, Product Marketing, and Enterprise Sales leadership to execute high-impact product launches.
- Lead user research, competitive benchmarking, customer advisory councils, and quantitative telemetry to identify unaddressed customer pain points.
- Oversee pricing & packaging strategy, usage-based billing models, and churn reduction initiatives across mid-market and enterprise cohorts.
- Mentor and develop high-performing product managers, cultivating rigorous discovery and quantitative experimentation practices.

Required Qualifications:
- 10+ years of product management experience within B2B SaaS or cloud software platforms, with 4+ years managing product managers.
- Proven track record taking enterprise products from discovery to $50M+ ARR scale.
- Exceptional analytical fluency with product analytics tools: Amplitude, Mixpanel, SQL, Tableau, and LaunchDarkly.
- Strong technical depth and ability to earn credibility with Principal Architects and Engineering Directors.
- Master's Degree or B.S. in Computer Science, Business, Human-Computer Interaction, or equivalent experience.

Preferred Experience:
- Background at hyper-growth tech companies (e.g., Figma, Stripe, Atlassian, Notion, Datadog).
- Prior experience managing marketplace dynamics, developer APIs, or workflow automation platforms.`
  },
  {
    id: 'principal-data-architect',
    title: 'Principal Data Architect & Engineering Lead',
    role: 'Principal Data Architect',
    location: 'New York, NY',
    seniority: 'PRINCIPAL',
    industry: 'FinTech & Capital Markets',
    workModel: 'HYBRID',
    category: 'Data & Analytics',
    summary: 'Enterprise modern data stack, Snowflake, dbt, Apache Spark, real-time Kafka event streaming, financial data mesh, lakehouse governance.',
    jdText: `Title: Principal Data Architect & Engineering Lead
Organization: Horizon Global Financial
Location: New York, NY (Hybrid - 2 days in Midtown Manhattan)
Seniority: Principal Technical Lead (Staff+ IC)
Target Compensation: $240,000 - $310,000 Base + Up to 40% Performance Bonus + Equity

Role Summary:
Horizon Financial is seeking a Principal Data Architect to design and govern our enterprise-wide Data Mesh and real-time streaming analytics architecture. You will be the highest-level individual contributor data leader, directing architectural standards for petabyte-scale transactional, risk, and portfolio analytics engines.

Key Responsibilities:
- Architect our next-generation Lakehouse utilizing Snowflake, Apache Iceberg, dbt, and Databricks across AWS.
- Design high-throughput, low-latency streaming pipelines processing over 2 billion daily market data and ledger transactions via Kafka and Apache Flink.
- Establish enterprise data governance, lineage, automated schema validation (Great Expectations), and role-based data access controls (RBAC/ABAC).
- Partner with Quant Researchers, Risk Officers, and Engineering squads to build self-serve analytical data domains.
- Mentor 20+ Senior Data Engineers and establish company-wide RFC architectural review boards.

Requirements:
- 10+ years in Data Engineering and Data Architecture, with at least 4 years in Staff or Principal leadership roles.
- Expert-level mastery of SQL, Python, Snowflake internals, dbt core/cloud, and Apache Spark / PySpark.
- Deep experience with event-driven architectures, Kafka, Flink, and schema registries (Avro/Protobuf).
- Solid grasp of financial instruments, trade lifecycles, ledger consistency, or regulatory reporting frameworks (SOX, BCBS 239).
- B.S. or M.S. in Computer Science, Applied Mathematics, or related field.

Nice-to-Have:
- Experience migrating legacy on-prem Hadoop/Oracle data warehouses to modern cloud data lakes.
- Hands-on familiarity with data observability platforms (Monte Carlo, Bigeye, Acceldata).`
  },
  {
    id: 'lead-devops-sre',
    title: 'Lead Cloud Platform & DevOps / SRE Architect',
    role: 'Lead Cloud Platform & SRE Architect',
    location: 'Seattle, WA',
    seniority: 'STAFF',
    industry: 'Enterprise Cloud Infrastructure',
    workModel: 'REMOTE',
    category: 'Security & DevOps',
    summary: 'Multi-region Kubernetes, Terraform, ArgoCD, Prometheus, AWS/GCP, FinOps, zero-trust cloud security, automated self-healing infrastructure.',
    jdText: `Job Title: Lead Cloud Platform & DevOps / SRE Architect
Company: Nexus Infrastructure Technologies
Location: 100% Remote (US-based)
Seniority: Staff / Lead Architect
Compensation: $210,000 - $265,000 Base Salary + Equity + Full Benefits

Overview:
Nexus is seeking a Lead Cloud Platform & SRE Architect to design, automate, and govern our multi-tenant cloud platform supporting 500+ microservices across AWS and GCP. In this role, you will champion platform engineering practices, infrastructure-as-code, and 99.99% availability standards.

Responsibilities:
- Own the architectural roadmap for our multi-region Kubernetes clusters (EKS/GKE) managed via GitOps (ArgoCD) and Terraform.
- Build resilient observability and telemetry platforms utilizing Prometheus, Grafana, Datadog, OpenTelemetry, and automated paging workflows.
- Partner with product engineering squads to accelerate deployment velocity, reducing build and test cycle times by 50%.
- Implement automated chaos engineering, disaster recovery failover automation, and multi-cloud egress cost optimizations (FinOps).
- Lead incident post-mortems, root cause analyses, and operational runbook standardization.

Qualifications:
- 8+ years of production experience in DevOps, Site Reliability Engineering (SRE), or Cloud Infrastructure Engineering.
- Deep expertise in Kubernetes, Docker, Helm, Terraform, Linux systems administration, and Go or Python scripting.
- Proven experience operating high-scale production systems with stringent latency and uptime SLAs.
- Solid background in cloud security guardrails, IAM least-privilege, and network policies (Cilium/Calico).
- Bachelor's degree in STEM or equivalent practical experience.`
  },
  {
    id: 'ciso-vp-security',
    title: 'Vice President of Information Security (CISO)',
    role: 'Vice President of Information Security',
    location: 'Boston, MA',
    seniority: 'VP',
    industry: 'Cybersecurity & HealthTech',
    workModel: 'HYBRID',
    category: 'Security & DevOps',
    summary: 'Enterprise InfoSec governance, SOC2 Type II, HIPAA, Zero Trust, Incident Response, Red Team operations, board-level risk management.',
    jdText: `Position: Vice President of Information Security (Chief Information Security Officer)
Company: HealthGuard Cloud Systems
Location: Boston, MA (Hybrid - 2 days/week)
Seniority: Vice President / Executive
Compensation: $290,000 - $360,000 Base Salary + Significant Executive Equity + 30% Bonus

About the Role:
HealthGuard is seeking a visionary Vice President of Information Security to lead our global cybersecurity, compliance, and product security organization. Reporting directly to the Chief Technology Officer, you will safeguard sensitive patient data, ensure rigorous regulatory adherence, and serve as the executive voice of security to enterprise hospital customers and the Board of Directors.

Key Responsibilities:
- Lead and mentor a 25-person security organization spanning SecOps, AppSec, GRC (Governance, Risk & Compliance), and Security Engineering.
- Oversee compliance certifications including SOC 2 Type II, HIPAA / HITECH, ISO 27001, and HITRUST.
- Direct our enterprise Threat Intelligence, Security Operations Center (SOC), Incident Response, and 24/7 Red/Blue team penetration testing.
- Design Zero Trust Network Architecture (ZTNA), identity-first access control (Okta/Ping), and endpoint threat detection (CrowdStrike).
- Manage executive relationships with enterprise hospital CISOs and participate in customer security architecture reviews during late-stage enterprise sales deals.

Requirements:
- 12+ years of progressive leadership in Information Security, with 5+ years at the Director or VP/CISO level.
- Proven experience within regulated cloud environments (Healthcare, BioTech, or FinTech).
- Active executive security credentials preferred (CISSP, CISM, CCSP, or CISA).
- Exceptional executive presence, communication, and crisis-management capabilities under high stakes.
- Bachelor's degree required; Master's degree in Cybersecurity, Computer Science, or MBA preferred.`
  },
  {
    id: 'sales-director-gtm',
    title: 'Enterprise Sales Director - Strategic Accounts',
    role: 'Enterprise Sales Director',
    location: 'Chicago, IL',
    seniority: 'DIRECTOR',
    industry: 'Enterprise Software & SaaS',
    workModel: 'HYBRID',
    category: 'Sales & GTM',
    summary: 'Strategic enterprise B2B sales leadership, MEDDPICC methodology, $3M+ annual quota, C-suite executive selling, deal coaching, pipeline execution.',
    jdText: `Job Title: Enterprise Sales Director - Strategic Accounts
Company: Vantage Global Software
Location: Chicago, IL (Hybrid - travel up to 35% for strategic client meetings)
Seniority: Sales Director / Executive
Compensation: $190,000 - $225,000 Base Salary | $380,000 - $450,000 OTE (50/50 uncapped split) + Equity

Role Summary:
Vantage Global Software is recruiting an Enterprise Sales Director to lead our Strategic Accounts team across the Midwest and Eastern regions. You will lead a team of 7 Senior Enterprise Account Executives selling multi-million-dollar annual recurring revenue (ARR) enterprise software contracts to Fortune 500 corporations.

Primary Responsibilities:
- Drive team attainment of an annual $22M net new ARR quota with disciplined quarterly forecasting.
- Coach account executives through complex multi-threaded enterprise sales cycles using MEDDPICC and Challenger sales frameworks.
- Personally co-sell and build direct relationships with Chief Information Officers (CIOs), Chief Operating Officers, and SVPs of Technology.
- Partner with Solutions Engineering, Marketing, Customer Success, and Product to maximize deal size and multi-year contract commitments.
- Recruit, onboard, and develop top-tier quota-carrying sales talent, ensuring high employee retention and quota attainment.

Qualifications:
- 8+ years of B2B enterprise software sales experience, with at least 3 years of first-line or second-line sales management.
- Demonstrated track record of consecutive quota over-achievement (100%+ club) managing deal sizes of $250k - $2M+ ARR.
- Expert command of Salesforce, Gong, Outreach, ZoomInfo, and modern sales engagement stacks.
- Proven expertise navigating complex enterprise procurement, legal review, and C-level negotiation.
- Bachelor's degree in Business, Marketing, Communications, or related discipline.`
  },
  {
    id: 'growth-marketing-director',
    title: 'Director of Growth Marketing & Demand Generation',
    role: 'Director of Growth Marketing',
    location: 'Los Angeles, CA',
    seniority: 'DIRECTOR',
    industry: 'Digital Consumer & E-Commerce',
    workModel: 'HYBRID',
    category: 'Marketing',
    summary: 'Full-funnel digital marketing, performance marketing, paid acquisition (Meta/Google), CAC/LTV unit economics, lifecycle email marketing, SEO.',
    jdText: `Title: Director of Growth Marketing & Demand Generation
Company: Aura Brands
Location: Los Angeles, CA (Hybrid - 3 days in Santa Monica office)
Seniority: Director Level
Target Compensation: $190,000 - $240,000 Base Salary + Annual Performance Bonus + Equity

Role Overview:
Aura Brands is looking for an analytical, data-obsessed Director of Growth Marketing to lead our multi-channel customer acquisition and retention engine. Managing an annual performance marketing budget of $25M+, you will scale customer acquisition across digital paid channels, organic search, and lifecycle marketing.

Key Responsibilities:
- Own paid acquisition strategy across Meta Ads, Google Ads (Search/PMax/YouTube), TikTok, and programmatic display.
- Partner with Creative and Brand teams to build high-converting creative testing loops, deploying 50+ new ad variations weekly.
- Oversee customer lifecycle and retention programs (email/SMS via Klaviyo/Braze), driving 40%+ customer repeat purchase rates.
- Manage conversion rate optimization (CRO) testing on landing pages and web checkout flows using Optimizely and VWO.
- Maintain rigorous attribution modeling, MMM (Marketing Mix Modeling), and CAC/LTV forecasting in partnership with Finance.

Qualifications:
- 7+ years in Growth Marketing, Performance Marketing, or Demand Generation, with 3+ years managing teams and large budgets ($10M+).
- Deep technical mastery of Google Analytics 4, Segment, Google Tag Manager, Meta Ads Manager, and BI visualization tools.
- Strong analytical and statistical foundation; comfortable building cohort retention curves and LTV projections in SQL or Excel.
- High aesthetic standard paired with data-driven creative instincts.
- Bachelor's degree in Marketing, Business, Economics, or quantitative field.`
  },
  {
    id: 'sr-finance-fpa-lead',
    title: 'Senior Finance Manager - Corporate FP&A & Strategy',
    role: 'Senior Finance Manager',
    location: 'Denver, CO',
    seniority: 'SENIOR',
    industry: 'FinTech & High-Growth Technology',
    workModel: 'HYBRID',
    category: 'Finance & Strategy',
    summary: 'Corporate financial planning, three-statement financial modeling, SaaS unit economics (Rule of 40, CAC payback), Board reporting, capital allocation.',
    jdText: `Job Title: Senior Finance Manager - Corporate FP&A & Strategy
Organization: PeakTech Ventures
Location: Denver, CO (Hybrid - 2 days/week in Downtown Denver)
Seniority: Senior / Manager Level
Compensation: $165,000 - $205,000 Base Salary + 20% Target Bonus + Equity

Role Summary:
PeakTech is seeking a high-caliber Senior Finance Manager to lead Corporate FP&A and strategic financial modeling. Reporting directly to the VP of Finance, you will orchestrate long-range financial planning, annual operating budgets, departmental variance analysis, and executive Board deck presentations.

Key Responsibilities:
- Build and maintain the company's master three-statement financial model (P&L, Balance Sheet, Cash Flow) in Adaptive Planning and Excel.
- Drive the annual budgeting process across Engineering, GTM, and G&A departments, partnering with department SVPs.
- Deliver monthly executive financial packages, SaaS metric dashboards (ARR, Net Retention Rate, CAC Payback, Rule of 40), and Board presentations.
- Provide strategic finance support for M&A due diligence, debt financing, and international market expansion scenarios.
- Supervise and develop two financial analysts, fostering analytical rigor and automated financial workflows.

Requirements:
- 6+ years of experience in Corporate FP&A, Investment Banking, Private Equity, or Strategic Finance, with tech/SaaS industry background.
- World-class financial modeling skills in Excel; proficiency with modern ERP and planning software (NetSuite, Workday Adaptive, Planful, Anaplan).
- Thorough understanding of GAAP accounting principles, revenue recognition (ASC 606), and subscription financial metrics.
- Prior experience preparing board presentations and communicating financial performance to C-level executives.
- Bachelor's degree in Finance, Accounting, Economics, or related field; CPA, CFA, or MBA is a strong plus.`
  }
];
