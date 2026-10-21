import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { parseJDHeuristically, generateSynthesizedTalentMap } from './src/services/talentIntelligenceEngine.ts';
import type { TalentMapInput, JDSourceInfo, TalentMapReport } from './src/types.ts';

interface GeminiCallParams {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
  responseSchema?: any;
  temperature?: number;
}

const CANDIDATE_MODELS = [
  'gemini-3.7-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
];

async function callGeminiWithResilience(
  ai: GoogleGenAI,
  params: GeminiCallParams,
  timeoutMs: number = 7000
): Promise<string | null> {
  for (const model of CANDIDATE_MODELS) {
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const config: any = {};
        if (params.systemInstruction) config.systemInstruction = params.systemInstruction;
        if (params.responseMimeType) config.responseMimeType = params.responseMimeType;
        if (params.responseSchema) config.responseSchema = params.responseSchema;
        if (params.temperature !== undefined) config.temperature = params.temperature;

        // Wrap call with explicit timeout to prevent hanging requests
        const generatePromise = ai.models.generateContent({
          model,
          contents: params.contents,
          config,
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini call timeout')), timeoutMs)
        );

        const response: any = await Promise.race([generatePromise, timeoutPromise]);

        if (response && response.text) {
          return response.text;
        }
      } catch (err: any) {
        const status = err?.status || err?.code || (err?.message?.includes('503') ? 503 : null);
        const isTransient =
          status === 503 ||
          status === 429 ||
          err?.message?.includes('timeout') ||
          err?.message?.includes('high demand') ||
          err?.message?.includes('UNAVAILABLE') ||
          err?.message?.includes('RESOURCE_EXHAUSTED');

        if (isTransient) {
          if (attempts < maxAttempts) {
            // Short backoff before retrying
            await new Promise((resolve) => setTimeout(resolve, 400 * attempts));
            continue;
          }
          console.warn(`Model ${model} timed out/unavailable, trying fallback model...`);
          break;
        } else {
          console.warn(`Gemini call error on model ${model}:`, err?.message || err);
          break;
        }
      }
    }
  }
  return null;
}

async function startServer() {
  const app = express();
  // The app dev server MUST bind to port 3000 in this container environment,
  // as Nginx (on port 8080) and Control Plane API proxy incoming traffic directly to port 3000.
  let targetPort = 3000;
  const portArgIdx = process.argv.indexOf('--port');
  if (portArgIdx !== -1 && process.argv[portArgIdx + 1]) {
    const parsed = parseInt(process.argv[portArgIdx + 1], 10);
    if (!isNaN(parsed) && parsed > 0 && parsed !== 8080) {
      targetPort = parsed;
    }
  }

  app.use(express.json({ limit: '15mb' }));

  // Enterprise Security & Anti-Cloning HTTP Headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Robots-Tag', 'noarchive, noimageindex');
    next();
  });

  // Anti-Cloning & Malicious Web-Downloader Bot Shield
  const CLONER_BOT_PATTERNS = [
    /httrack/i,
    /teleport\s?pro/i,
    /webcopy/i,
    /webcollector/i,
    /sitecopy/i,
    /offline\s?explorer/i,
    /page-mirror/i,
    /screaming\s?frog/i,
    /site-clone/i,
    /rip\s?site/i,
  ];

  app.use((req, res, next) => {
    // Exclude health check from bot shield
    if (req.path === '/api/health') return next();

    const userAgent = req.headers['user-agent'] || '';
    const isClonerBot = CLONER_BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
    if (isClonerBot) {
      return res.status(403).json({
        error: 'Access Denied: Automated site duplication, cloning, and unauthorized scraping are strictly prohibited.',
        code: 'SECURITY_VIOLATION_CLONE_DETECTED',
      });
    }
    next();
  });

  // Robots.txt to instruct crawlers and archiving tools
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Disallow: /api/
Disallow: /assets/
Noarchive: /

User-agent: HTTrack
Disallow: /

User-agent: WebCopy
Disallow: /

User-agent: TeleportPro
Disallow: /
`);
  });

  // Lazy initialize Gemini AI client
  let aiClient: GoogleGenAI | null = null;
  function getGenAI(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
      service: 'Talent Mapping AI Agent v2.0',
    });
  });

  // 1. JD Parsing & Extraction Endpoint
  app.post('/api/parse-jd', async (req, res) => {
    try {
      const { rawText, fileName } = req.body;
      if (!rawText || typeof rawText !== 'string') {
        return res.status(400).json({ error: 'rawText is required' });
      }

      const ai = getGenAI();
      if (!ai) {
        // Deterministic high quality heuristic parser
        const parsed = parseJDHeuristically(rawText, fileName);
        return res.json({ success: true, data: parsed, engine: 'heuristic-engine' });
      }

      const systemPrompt = `You are a Senior Talent Intelligence Sourcer and Labor Market Strategist.
Your job is to parse ANY Job Description (JD) across any industry or function — whether AI/ML, Software Engineering, Data & Analytics, Product Management, Cybersecurity, DevOps, Sales & GTM, Marketing, Finance & Accounting, Legal, Human Resources, or Healthcare.
Extract structured fields according to the following strict rules:
1. Tag every extracted field with a confidence level:
   - "verified": directly stated in the JD (e.g. "Location: Austin, TX", "Salary: $230k-$285k", "Title: Senior Director of Product")
   - "inferred": logically implied by context (e.g. a B2B SaaS platform implies Industry: Enterprise B2B SaaS; 8+ years exp implies Senior/Staff/Director)
   - "unknown": not mentioned or covered in the JD
2. DO NOT fabricate or invent target companies or excluded companies unless explicitly mentioned in the JD text.
3. Return clean, valid JSON matching the specified schema.`;

      const prompt = `Extract all fields from the following Job Description text:
${rawText.slice(0, 15000)}`;

      const responseText = await callGeminiWithResilience(ai, {
        contents: prompt,
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            role: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.STRING },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            geography: {
              type: Type.OBJECT,
              properties: {
                location: { type: Type.STRING },
                radiusMiles: { type: Type.NUMBER },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['location', 'radiusMiles', 'confidence'],
            },
            seniority: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.STRING, enum: ['ENTRY', 'MID', 'SENIOR', 'STAFF', 'PRINCIPAL', 'DIRECTOR', 'VP', 'EXECUTIVE'] },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            industry: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.STRING },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            companyType: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.ARRAY, items: { type: Type.STRING } },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            skills: {
              type: Type.OBJECT,
              properties: {
                required: {
                  type: Type.OBJECT,
                  properties: {
                    value: { type: Type.ARRAY, items: { type: Type.STRING } },
                    confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
                  },
                  required: ['value', 'confidence'],
                },
                preferred: {
                  type: Type.OBJECT,
                  properties: {
                    value: { type: Type.ARRAY, items: { type: Type.STRING } },
                    confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
                  },
                  required: ['value', 'confidence'],
                },
              },
              required: ['required', 'preferred'],
            },
            technologies: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.ARRAY, items: { type: Type.STRING } },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            education: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.STRING },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            yearsExperience: {
              type: Type.OBJECT,
              properties: {
                min: { type: Type.NUMBER },
                max: { type: Type.NUMBER },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['min', 'max', 'confidence'],
            },
            workModel: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.STRING, enum: ['REMOTE', 'HYBRID', 'ON-SITE'] },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            compensationTarget: {
              type: Type.OBJECT,
              properties: {
                min: { type: Type.NUMBER },
                max: { type: Type.NUMBER },
                currency: { type: Type.STRING },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['min', 'max', 'currency', 'confidence'],
            },
            targetCompanies: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.ARRAY, items: { type: Type.STRING } },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            excludedCompanies: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.ARRAY, items: { type: Type.STRING } },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            hiringUrgency: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            hiringVolume: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.NUMBER },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
          },
          required: [
            'role',
            'geography',
            'seniority',
            'industry',
            'skills',
            'technologies',
            'yearsExperience',
            'workModel',
            'compensationTarget',
          ],
        },
      });

      if (responseText) {
        try {
          const parsedJson = JSON.parse(responseText);
          return res.json({ success: true, data: parsedJson, engine: 'gemini-ai' });
        } catch (jsonErr) {
          console.warn('JSON parse error on Gemini output, falling back to heuristic engine.');
        }
      }

      // Graceful fallback to heuristic engine
      const parsed = parseJDHeuristically(rawText, fileName);
      res.json({ success: true, data: parsed, engine: 'fallback-heuristic' });
    } catch (err: any) {
      console.warn('Handling /api/parse-jd with fallback:', err?.message || err);
      const parsed = parseJDHeuristically(req.body?.rawText || '', req.body?.fileName);
      res.json({ success: true, data: parsed, engine: 'fallback-heuristic' });
    }
  });

  // 2. Talent Market Map Full Generation Endpoint
  app.post('/api/generate-talent-map', async (req, res) => {
    try {
      const { input, jdSource, sourceInfo } = req.body as {
        input: TalentMapInput;
        jdSource?: JDSourceInfo;
        sourceInfo?: JDSourceInfo;
      };
      if (!input || !input.role?.value) {
        return res.status(400).json({ error: 'Valid TalentMapInput with role is required' });
      }

      const effectiveSource = jdSource || sourceInfo || { method: 'manual' };
      const baseReport = generateSynthesizedTalentMap(input, effectiveSource);

      const ai = getGenAI();
      if (!ai) {
        return res.json({ success: true, report: baseReport, engine: 'synthesizer' });
      }

      // Attempt AI-powered strategic deep-dive with resilient retry
      const prompt = `You are a Senior Talent Intelligence Strategist, Executive Recruiter, and Labor Market Analyst.
Perform an in-depth competitive talent intelligence and labor market analysis for ANY uploaded job description across any domain or industry.
Analyze the following role requirement:
Role: ${input.role.value} (${input.seniority.value})
Geography: ${input.geography.location} (${input.workModel.value})
Industry: ${input.industry.value}
Required Skills: ${input.skills.required.value.join(', ')}
Technologies / Platforms: ${input.technologies.value.join(', ')}
Compensation Target: $${input.compensationTarget.min.toLocaleString()} - $${input.compensationTarget.max.toLocaleString()} ${input.compensationTarget.currency}

Provide an enriched executive recruiting briefing, tailored competitor insights, Boolean search optimizations, and candidate messaging hooks in valid JSON:
1. Competitor Poaching Hooks: Identify 4 to 6 real competitor employers that employ this exact profile in this industry or geography, complete with specific poaching pitches, compensation angles, and organizational vulnerabilities.
2. Custom Boolean Strings: Formulate 3 to 4 high-precision LinkedIn/X-Ray search queries designed specifically for this role and technical/domain stack.
3. Geographic Context: Base this ONLY on ${input.geography.location} specifically — real companies with an actual presence there, real university or professional pipelines, and real nearby regional metros with approximate driving distance.
4. Executive Brief: Deliver strategic narrative, key takeaways, and closing angles tailored directly to this role and industry.`;

      try {
        const responseText = await callGeminiWithResilience(ai, {
          contents: prompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveBrief: {
                type: Type.OBJECT,
                properties: {
                  strategicNarrative: { type: Type.STRING },
                  keyPointers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  closingAngle: { type: Type.STRING },
                },
                required: ['strategicNarrative', 'keyPointers', 'closingAngle'],
              },
              competitorPoachingHooks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    companyName: { type: Type.STRING },
                    tier: { type: Type.STRING },
                    poachingPitch: { type: Type.STRING },
                    vulnerability: { type: Type.STRING },
                  },
                  required: ['companyName', 'poachingPitch'],
                },
              },
              customBooleanStrings: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    query: { type: Type.STRING },
                    notes: { type: Type.STRING },
                  },
                  required: ['title', 'query'],
                },
              },
              geographicContext: {
                type: Type.OBJECT,
                properties: {
                  majorEmployers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  universityPipeline: { type: Type.ARRAY, items: { type: Type.STRING } },
                  adjacentMetros: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        distanceMiles: { type: Type.NUMBER },
                        talentDensity: { type: Type.STRING, enum: ['High', 'Moderate', 'Low'] },
                      },
                      required: ['name', 'distanceMiles', 'talentDensity'],
                    },
                  },
                },
                required: ['majorEmployers', 'universityPipeline', 'adjacentMetros'],
              },
            },
          },
        });

        if (responseText) {
          const enrichment = JSON.parse(responseText);
          if (enrichment.executiveBrief?.strategicNarrative) {
            baseReport.executiveSummary.executiveBriefNarrative = enrichment.executiveBrief.strategicNarrative;
          }
          if (enrichment.executiveBrief?.closingAngle) {
            baseReport.executiveRecruitingBrief.closingStrategy = enrichment.executiveBrief.closingAngle;
          }
          if (Array.isArray(enrichment.executiveBrief?.keyPointers) && enrichment.executiveBrief.keyPointers.length > 0) {
            baseReport.executiveRecruitingBrief.keyTakeaways = enrichment.executiveBrief.keyPointers;
          }
          if (Array.isArray(enrichment.customBooleanStrings) && enrichment.customBooleanStrings.length > 0) {
            enrichment.customBooleanStrings.forEach((b: any) => {
              baseReport.sourcingStrings.linkedinBoolean.push({
                name: b.title || 'AI Optimized Query',
                query: b.query,
                purpose: b.notes || 'Targeted candidate pool',
              });
            });
          }

          // Geography-specific data — replaces the generic placeholder from the synthesizer
          // with something scoped to the actual metro instead of a static template.
          const geo = enrichment.geographicContext;
          if (geo?.majorEmployers?.length) {
            baseReport.geographicMarket.majorEmployers = geo.majorEmployers;
          }
          if (geo?.universityPipeline?.length) {
            baseReport.geographicMarket.universityPipeline = geo.universityPipeline;
          }
          if (geo?.adjacentMetros?.length) {
            baseReport.geographicMarket.adjacentMetros = geo.adjacentMetros;
          }
          if (geo) {
            baseReport.geographicMarket.marketConfidence = 'inferred';
          }

          // Was requested from Gemini but never actually used — now it augments the
          // curated competitor landscape instead of being silently discarded.
          if (Array.isArray(enrichment.competitorPoachingHooks) && enrichment.competitorPoachingHooks.length > 0) {
            const existingNames = new Set(
              baseReport.competitiveEmployerLandscape.map((c: any) => c.name?.toLowerCase())
            );
            const aiCompetitors = enrichment.competitorPoachingHooks
              .filter((hook: any) => hook?.companyName && hook?.poachingPitch)
              .filter((hook: any) => !existingNames.has(hook.companyName.toLowerCase()))
              .map((hook: any, idx: number) => ({
                id: `comp-ai-${idx + 1}`,
                name: hook.companyName,
                tier: hook.tier === 'Tier 1' || hook.tier === 'Tier 2' || hook.tier === 'Tier 3' ? hook.tier : 'Tier 2',
                tierLabel: hook.tier === 'Tier 1' ? 'Direct Competitor' : 'Adjacent Competitor',
                workforceRelevance: 'AI-Identified Match',
                hiringActivity: 'Moderate',
                relevantTitles: [input.role.value],
                relevantSkills: input.skills.required.value.slice(0, 4),
                geographicPresence: input.geography.location,
                talentConcentration: 'Moderate',
                employerAttractiveness: 'Moderate',
                recruitingDifficulty: 'Moderate',
                rationale: hook.vulnerability || 'Identified via AI market analysis for this specific role and metro.',
                poachingAngle: hook.poachingPitch,
              }));
            // Curated Tier-1 entries stay first, AI-sourced additions appended after —
            // keeps your hand-tuned copy intact while adding metro-specific coverage.
            baseReport.competitiveEmployerLandscape = [
              ...baseReport.competitiveEmployerLandscape,
              ...aiCompetitors,
            ];
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini enrichment skipped, delivering synthesized market map report:', geminiErr);
      }

      res.json({ success: true, report: baseReport, engine: 'talent-map-engine' });
    } catch (err: any) {
      console.error('Error in /api/generate-talent-map:', err);
      res.status(500).json({ error: err.message || 'Failed to generate talent map' });
    }
  });

  // 3. Conversational Refinement / Recruiter Copilot
  app.post('/api/refine-talent-map', async (req, res) => {
    try {
      const { report, userMessage, conversationHistory } = req.body;
      const roleTitle = report?.input?.role?.value || 'Senior Technical Lead';
      const metro = report?.input?.geography?.location || 'Target Metro';
      const radius = report?.input?.geography?.radiusMiles || 35;
      const workModel = report?.input?.workModel?.value || 'HYBRID';
      const diffScore = report?.recruitingDifficultyScore?.score || 68;
      const availScore = report?.talentAvailabilityScore?.score || 42;
      const compP50 = report?.compensationBenchmark?.totalComp?.p50
        ? `$${Math.round(report.compensationBenchmark.totalComp.p50 / 1000)}k`
        : '$240k';
      const compP75 = report?.compensationBenchmark?.totalComp?.p75
        ? `$${Math.round(report.compensationBenchmark.totalComp.p75 / 1000)}k`
        : '$290k';

      // Format target companies correctly
      const targetCompanyNames = (report?.targetCompanies || [])
        .map((c: any) => (typeof c === 'string' ? c : c?.company || c?.name || ''))
        .filter(Boolean)
        .slice(0, 8);

      const competitorLandscape = (report?.competitiveEmployerLandscape || [])
        .map((c: any) => `${c.name} (${c.tier || 'Competitor'})`)
        .slice(0, 6);

      const archetypes = (report?.candidateArchetypes || [])
        .map((a: any) => `${a.archetypeName}: ${a.targetProfile}`)
        .slice(0, 3);

      const ai = getGenAI();
      if (ai) {
        // Build recent conversation context
        let historyPrompt = '';
        if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
          const recentHistory = conversationHistory.slice(-4);
          historyPrompt = `\nRecent Conversation History:\n` + recentHistory
            .map((m: any) => `${m.sender === 'user' ? 'Recruiter' : 'AI Copilot'}: ${m.text}`)
            .join('\n');
        }

        const systemPrompt = `You are a high-level Senior Technical Talent Intelligence Director advising executive search recruiters and engineering hiring managers.
Role Context:
- Target Position: ${roleTitle}
- Location & Work Model: ${metro} (${radius} mi radius) · ${workModel}
- Market Difficulty Index: ${diffScore}/100 | Talent Availability Index: ${availScore}/100
- Comp Benchmark: Median (P50) ${compP50} · 75th Percentile ${compP75}
- Target/Competitor Companies: ${targetCompanyNames.join(', ') || competitorLandscape.join(', ') || 'Leading Tech Firms'}
- Archetypes: ${archetypes.join(' | ') || 'High-scale infrastructure and distributed systems'}

Guidelines:
1. Provide concrete, highly specific, data-backed talent intelligence advice.
2. If asked for outreach copy, provide a compelling, personalized InMail with subject line, hook, technical value proposition, and frictionless CTA.
3. If asked about remote vs hybrid or compensation, provide quantitative impact estimates (e.g. +35% pool expansion, P75 benchmark).
4. If asked about competitors or poaching, identify specific retention friction points (unvested equity cliffs, RTO mandates, reorgs).
5. Format with crisp markdown (bullet points, bold highlights, code blocks for Boolean strings).`;

        const userPrompt = `${historyPrompt}

Recruiter Question: "${userMessage}"

Deliver direct, actionable strategy and specific recommendations.`;

        const replyText = await callGeminiWithResilience(ai, {
          contents: userPrompt,
          systemInstruction: systemPrompt,
          temperature: 0.3,
        }, 6500);

        if (replyText) {
          return res.json({ reply: replyText });
        }
      }

      // Domain-specific tailored fallback generator for immediate response
      const queryLower = (userMessage || '').toLowerCase();
      let fallbackText = '';

      if (queryLower.includes('remote') || queryLower.includes('hybrid') || queryLower.includes('location')) {
        fallbackText = `### Geographic & Work Model Impact Analysis for **${roleTitle}**

1. **Market Expansion Dynamics**:
   - **Switching from ${workModel} to 100% Remote**: Expands the addressable qualified talent pool by **+280%** (from ~${report?.summaryMetrics?.qualifiedTalentPool || 850} to ~3,200+ qualified engineers nationally).
   - **Commute Radius Extension (+25 miles)**: Unlocks adjacent secondary talent hubs within commuting distance, adding an estimated **+35% to +45%** candidate liquidity without requiring full remote infrastructure.

2. **Compensation Differential**:
   - Remote hiring in Tier-2 tech hubs (e.g., Raleigh, Denver, Salt Lake City) reduces P50 compensation pressure by **12%–18%** compared to ${metro}.
   - In ${metro}, mandatory 3-4 day onsite policies currently incur a **15%–20% salary premium** to overcome candidate resistance.

3. **Strategic Recommendation**:
   - If hiring velocity is critical (<45 days to fill), open sourcing to **Remote across North America with quarterly on-sites** to lower recruiting difficulty from **${diffScore}/100 to ~38/100**.`;
      } else if (queryLower.includes('inmail') || queryLower.includes('outreach') || queryLower.includes('sequence') || queryLower.includes('message')) {
        fallbackText = `### High-Converting 3-Touch Sourcing Sequence for **${roleTitle}**

#### Touch 1: The Technical Impact Hook (Day 1)
**Subject**: *${roleTitle} challenge: core architecture ownership at [Company]*
> *Hi [First Name],*
> *I came across your work on distributed systems at [Current Company]. We are scaling our core engineering platform to handle [Key Technical Challenge] and are looking for a ${roleTitle} to own the end-to-end technical direction.*
> *Unlike typical high-level roles, this position reports directly to our VP of Engineering with immediate architecture authority, compensation pegged at the ${compP75} mark, and zero legacy bureaucracy.*
> *Open to a 10-minute technical sync this Thursday or Friday?*

#### Touch 2: Peer Credibility & Stack Detail (Day 4)
**Subject**: *Quick follow-up on architecture scope*
> *Hi [First Name], wanted to share a quick data point: our team recently solved [System Metric, e.g., sub-10ms latency at 50k QPS]. We’re building out the next iteration with ${report?.input?.requiredSkills?.value?.slice(0, 3)?.join(', ') || 'modern cloud native tooling'}.*
> *Would love to connect you directly with our Principal Architect for an informal chat.*

#### Touch 3: Respectful Breakaway (Day 8)
**Subject**: *Closing the loop for now*
> *Hi [First Name], I know you are deeply focused at [Current Company]. If the timing isn't right today, no worries at all. Feel free to connect here on LinkedIn, and let's stay in touch as our technical roadmap unfolds.*`;
      } else if (queryLower.includes('equity') || queryLower.includes('comp') || queryLower.includes('salary') || queryLower.includes('golden') || queryLower.includes('handcuff')) {
        fallbackText = `### Countering Unvested Big Tech Equity & Golden Handcuffs

1. **Structured Sign-On Buyout Structure**:
   - For candidates at ${targetCompanyNames[0] || 'Tier-1 firms'} facing 1–2 year unvested RSU cliffs, implement a **Tranche-Based Sign-On Bonus** (e.g. 50% paid on Day 30, 50% at Month 12) rather than attempting to match gross unvested paper value with base salary.
   - Example Structure: **Base ($220k–$250k) + $45k Sign-On + Equity Grant (4-year vest with 1-year cliff)**.

2. **Upside vs. Liquid Framing**:
   - Frame startup/growth equity as an **asymmetric liquidity opportunity** versus mature stock with limited multiple expansion.
   - Highlight current market median: **${compP50} Total Comp** with top quartile at **${compP75}**.

3. **Closing Angle**:
   - Emphasize total impact velocity: "At your current company, promotional cycles for Staff/Lead average 24-36 months. Here, you define the architecture on Day 1 with direct equity appreciation."`;
      } else if (queryLower.includes('poach') || queryLower.includes('competitor') || queryLower.includes('target')) {
        fallbackText = `### Competitor Poaching Strategy for **${roleTitle}**

1. **Primary Donor Targets**:
   - **Tier-1 Exporters**: Focus outreach on *${targetCompanyNames.slice(0, 3).join(', ') || 'major technology providers'}* where recent organizational shifts or return-to-office mandates have increased passive candidate dissatisfaction.
   - **Poaching Angle**: Autonomy, modern tech stack (${report?.input?.requiredSkills?.value?.slice(0, 2)?.join(', ') || 'modern infrastructure'}), and direct executive visibility.

2. **Optimal Sourcing String**:
   \`\`\`text
   ("${roleTitle}" OR "${archetypes[0]?.split(':')[0] || 'Staff Engineer'}") AND ("${metro}" OR "Remote") AND (${report?.input?.requiredSkills?.value?.slice(0, 3)?.map((s: string) => `"${s}"`).join(' OR ') || '"Distributed Systems"'}) NOT ("Junior" OR "Intern")
   \`\`\`

3. **Action Plan**:
   - Schedule outreach during mid-week mornings (Tuesday/Wednesday 8:30 AM–10:00 AM local time) for 32% higher response rates.`;
      } else {
        fallbackText = `### Talent Intelligence Advisory for **${roleTitle}** (${metro})

1. **Market Supply & Liquidity**:
   - **Availability Score**: **${availScore}/100** (Competitive Market).
   - Target compensation benchmark: **${compP50}** (50th percentile) to **${compP75}** (75th percentile total comp).
   - Qualified talent pool in ${metro}: Approximately **${report?.summaryMetrics?.qualifiedTalentPool || 850}+ profiles**.

2. **Recommended Sourcing Tactics**:
   - **Primary Channels**: Direct GitHub / LinkedIn sourcing targeting senior engineers at *${targetCompanyNames.slice(0, 2).join(', ') || 'Tier 1 tech firms'}*.
   - **Value Proposition**: Lead with system ownership, tech stack flexibility, and rapid engineering decision-making.

3. **Next Steps**:
   - Use our **Candidate Tracker** and **Outreach Studio** to initiate personalized message sequences with automated 3-touch cadence.`;
      }

      res.json({ reply: fallbackText });
    } catch (err: any) {
      console.warn('Error in /api/refine-talent-map, returning graceful copilot advice:', err);
      res.json({
        reply: `### Talent Intelligence Strategic Summary
1. **Talent Supply Strategy**: Target senior engineers at high-export companies experiencing compensation stagnation or return-to-office mandates.
2. **Compensation Alignment**: Benchmark offers at the 75th percentile to maintain a >70% offer acceptance rate in competitive markets.
3. **Closing Angle**: Emphasize technical autonomy, architecture ownership, and clear executive visibility.`,
      });
    }
  });

  // Vite & Static assets integration
  const distPath = path.join(process.cwd(), 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  const isProduction = process.env.NODE_ENV === 'production' && hasDist;

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(targetPort, '0.0.0.0', () => {
    console.log(`Talent Mapping AI Agent server running at http://0.0.0.0:${targetPort}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE' && targetPort !== 3000) {
      console.warn(`Port ${targetPort} is in use (e.g. by Nginx proxy). Falling back to port 3000...`);
      app.listen(3000, '0.0.0.0', () => {
        console.log(`Talent Mapping AI Agent server running at http://0.0.0.0:3000`);
      });
    } else {
      console.error('Server listen error:', err);
    }
  });
}

startServer();
