import React, { useState, useEffect, useRef } from 'react';
import { TalentMapInput, JDSourceInfo, SeniorityLevel, WorkModel } from '../types';
import { parseJDHeuristically } from '../services/talentIntelligenceEngine';
import { extractTextFromFile } from '../services/documentParser';
import { saveIntakeDraftToStorage, loadIntakeDraftFromStorage } from '../services/storageService';
import { ConfidenceBadge } from './ConfidenceBadge';
import { SAMPLE_JD_PRESETS, SampleJDPreset } from '../data/sampleJDs';
import { InclusiveLanguageChecker } from './InclusiveLanguageChecker';
import { JDDropzone } from './JDDropzone';
import {
  Upload,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  MapPin,
  RotateCcw,
  Loader2,
  FileType,
  X,
  FileCheck,
  FileSpreadsheet,
  FileCode,
} from 'lucide-react';

interface IntakeViewProps {
  onGenerateReport: (input: TalentMapInput, source: JDSourceInfo) => Promise<void>;
  isGenerating: boolean;
}

export const IntakeView: React.FC<IntakeViewProps> = ({ onGenerateReport, isGenerating }) => {
  // Load any previously saved draft from localStorage
  const savedDraft = typeof window !== 'undefined' ? loadIntakeDraftFromStorage() : null;

  // Step 1: Upload, Step 2: Extraction Review
  const [currentStep, setCurrentStep] = useState<1 | 2>(savedDraft?.currentStep || 1);
  const [rawText, setRawText] = useState<string>(savedDraft?.rawText || '');
  const [fileName, setFileName] = useState<string | null>(savedDraft?.fileName || null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [isExtractingFile, setIsExtractingFile] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fileExtractStatus, setFileExtractStatus] = useState<string | null>(savedDraft?.fileExtractStatus || null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extracted data state for Step 2
  const [formData, setFormData] = useState<TalentMapInput>(savedDraft?.formData || {
    role: { value: '', confidence: 'unknown' },
    geography: { location: '', radiusMiles: 35, confidence: 'unknown' },
    seniority: { value: 'SENIOR', confidence: 'unknown' },
    industry: { value: '', confidence: 'unknown' },
    companyType: { value: [], confidence: 'unknown' },
    skills: {
      required: { value: [], confidence: 'unknown' },
      preferred: { value: [], confidence: 'unknown' },
    },
    technologies: { value: [], confidence: 'unknown' },
    education: { value: '', confidence: 'unknown' },
    yearsExperience: { min: 5, max: 10, confidence: 'unknown' },
    workModel: { value: 'HYBRID', confidence: 'unknown' },
    compensationTarget: { min: 160000, max: 240000, currency: 'USD', confidence: 'unknown' },
    targetCompanies: { value: [], confidence: 'unknown' },
    excludedCompanies: { value: [], confidence: 'unknown' },
    hiringUrgency: { value: 'HIGH', confidence: 'unknown' },
    hiringVolume: { value: 1, confidence: 'unknown' },
  });

  // Auto-save intake draft whenever data changes
  useEffect(() => {
    if (rawText.trim() || fileName || formData.role.value) {
      saveIntakeDraftToStorage({
        rawText,
        fileName,
        formData,
        currentStep,
        fileExtractStatus,
        lastUpdated: new Date().toISOString(),
      });
    }
  }, [rawText, fileName, formData, currentStep, fileExtractStatus]);

  // Tag inputs state
  const [reqSkillInput, setReqSkillInput] = useState('');
  const [prefSkillInput, setPrefSkillInput] = useState('');
  const [techInput, setTechInput] = useState('');

  // Process File Object through documentParser
  const processUploadedFile = async (file: File) => {
    setFileName(file.name);
    const sizeKb = Math.round(file.size / 1024);
    setFileSize(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`);
    setIsExtractingFile(true);
    setFileExtractStatus(`Extracting text from ${file.name}...`);

    try {
      const extracted = await extractTextFromFile(file);
      if (extracted && extracted.trim().length > 0) {
        setRawText(extracted);
        const ext = file.name.split('.').pop()?.toUpperCase() || 'DOCUMENT';
        setFileExtractStatus(`${ext} parsed successfully (${extracted.length.toLocaleString()} characters extracted)`);
      } else {
        setFileExtractStatus('Could not automatically parse text. Please paste text directly into the box below.');
      }
    } catch (err) {
      console.error('Error extracting text from file:', err);
      setFileExtractStatus('Failed to read file contents. Please paste text directly into the box below.');
    } finally {
      setIsExtractingFile(false);
    }
  };

  // Handle File Input Change
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processUploadedFile(file);
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Clear current upload
  const handleClearFile = () => {
    setFileName(null);
    setFileSize(null);
    setRawText('');
    setFileExtractStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Step 1 -> Step 2 Parser Execution
  const handleParseJD = async () => {
    if (!rawText.trim()) return;

    setIsParsing(true);
    try {
      const response = await fetch('/api/parse-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, fileName }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setFormData(json.data);
        setCurrentStep(2);
        return;
      }
    } catch (err) {
      console.warn('Network parse JD error, using client-side heuristic parser:', err);
    } finally {
      setIsParsing(false);
    }

    // Client-side deterministic parse fallback
    const parsed = parseJDHeuristically(rawText, fileName || undefined);
    setFormData(parsed);
    setCurrentStep(2);
  };

  // Manual Mode Jump
  const handleManualEntry = () => {
    setFileName(null);
    setFileSize(null);
    setRawText('');
    setFormData({
      role: { value: '', confidence: 'unknown' },
      geography: { location: '', radiusMiles: 35, confidence: 'unknown' },
      seniority: { value: 'SENIOR', confidence: 'unknown' },
      industry: { value: '', confidence: 'unknown' },
      companyType: { value: ['Enterprise Tech'], confidence: 'unknown' },
      skills: {
        required: { value: [], confidence: 'unknown' },
        preferred: { value: [], confidence: 'unknown' },
      },
      technologies: { value: [], confidence: 'unknown' },
      education: { value: 'B.S. in Computer Science or equivalent', confidence: 'unknown' },
      yearsExperience: { min: 5, max: 10, confidence: 'unknown' },
      workModel: { value: 'HYBRID', confidence: 'unknown' },
      compensationTarget: { min: 160000, max: 240000, currency: 'USD', confidence: 'unknown' },
      targetCompanies: { value: [], confidence: 'unknown' },
      excludedCompanies: { value: [], confidence: 'unknown' },
      hiringUrgency: { value: 'HIGH', confidence: 'unknown' },
      hiringVolume: { value: 1, confidence: 'unknown' },
    });
    setCurrentStep(2);
  };

  // Helper to mark field as Verified upon user edit
  const updateField = (updater: (prev: TalentMapInput) => TalentMapInput) => {
    setFormData((prev) => updater(prev));
  };

  // Validation: Required fields must not be empty
  const isRequiredValid =
    formData.role.value.trim().length > 0 &&
    formData.geography.location.trim().length > 0;

  return (
    <div id="intake-workflow-container" className="max-w-4xl mx-auto space-y-8">
      {/* Step Indicator Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <div className="text-xs uppercase font-mono font-bold tracking-widest text-cyan-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 glow-dot-cyan"></span>
            Intake Engine · Section 01
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            {currentStep === 1 ? 'Job Description Intake & Document Upload' : 'Extracted Talent Requirement Review'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold font-mono transition-all cursor-pointer ${
              currentStep === 1
                ? 'accent-gradient text-white glow'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 glow-dot-emerald hover:bg-emerald-500/30'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">01</span>
            <span>Upload & Paste</span>
          </button>
          <div className="w-6 h-0.5 bg-slate-800" />
          <button
            onClick={() => {
              if (rawText.trim()) handleParseJD();
            }}
            disabled={!rawText.trim()}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold font-mono transition-all ${
              currentStep === 2
                ? 'accent-gradient text-white glow'
                : 'bg-slate-900 text-slate-500 border border-slate-800 disabled:opacity-50'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">02</span>
            <span>Taxonomy Review</span>
          </button>
        </div>
      </div>

      {/* ================= STEP 1: UPLOAD & PASTE ================= */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Universal Capability Banner */}
          <div className="p-4 bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-900 border border-cyan-500/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glow-subtle">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  Universal Job Description Competitive Intelligence
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full">All Roles & Industries</span>
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Upload any job specification — <span className="text-slate-100 font-medium">Software, AI/ML, Product Management, Data, Cybersecurity, DevOps, Sales/GTM, Marketing, or Finance</span>. The engine performs full taxonomy extraction, talent supply sizing, and competitor poaching analysis.
                </p>
              </div>
            </div>
          </div>

          {/* Quick-Load Sample JD Presets */}
          <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Or Test With Diverse Preset Job Descriptions:</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Click to instantly populate</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {SAMPLE_JD_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setRawText(preset.jdText);
                    setFileName(`${preset.id}.txt`);
                    setFileSize('Preset Spec');
                    setFileExtractStatus(`Loaded: ${preset.title}`);
                  }}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-1">
                    <span className="truncate">{preset.category}</span>
                    <span className="text-slate-500 group-hover:text-cyan-300 transition-colors">Load &rarr;</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                    {preset.title}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {preset.location} · {preset.seniority}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Drag-and-Drop JD Intake Dropzone */}
          <JDDropzone
            onFileSelected={processUploadedFile}
            onClearFile={handleClearFile}
            selectedFileName={fileName}
            selectedFileSize={fileSize}
            isExtracting={isExtractingFile}
            extractStatus={fileExtractStatus}
          />

          {/* Paste / Edit Raw JD Text Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="raw-jd-textarea" className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>Job Description Content (Parsed Text):</span>
              </label>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                <span>{rawText.length.toLocaleString()} characters</span>
                <span>•</span>
                <span>{rawText.trim() ? rawText.trim().split(/\s+/).length.toLocaleString() : 0} words</span>
              </div>
            </div>

            <textarea
              id="raw-jd-textarea"
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste complete job description, hiring requirements, or upload a Word document / PDF above..."
              className="w-full p-4 text-xs font-mono bg-slate-950/80 border border-slate-800 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-hidden text-slate-100 placeholder-slate-600 leading-relaxed shadow-inner"
            />

            {/* D&I Inclusive Language Scanner (Layer 01) */}
            <InclusiveLanguageChecker
              jdText={rawText}
              onApplyFixes={(updatedText) => setRawText(updatedText)}
            />
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={handleManualEntry}
              className="text-xs font-medium text-slate-400 hover:text-indigo-300 underline cursor-pointer transition-colors"
            >
              Or fill out taxonomy fields manually (skip upload & extraction)
            </button>

            <button
              id="btn-extract-jd"
              onClick={handleParseJD}
              disabled={!rawText.trim() || isParsing || isExtractingFile}
              className="flex items-center gap-2.5 px-7 py-3 accent-gradient accent-gradient-hover disabled:opacity-50 text-white rounded-full text-xs font-bold transition-all glow cursor-pointer hover:shadow-[0_0_25px_rgba(6,182,212,0.45)]"
            >
              {isParsing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Extracting & Tagging Taxonomy...</span>
                </>
              ) : (
                <>
                  <span>Extract & Review Fields</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: EXTRACTION REVIEW FORM ================= */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Instructions Banner */}
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-start gap-3 glow-subtle">
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="font-semibold text-white">
                Extraction Review & Confidence Auditing:
              </strong>{' '}
              Review extracted fields below. Fields tagged with dashed borders and{' '}
              <strong className="text-rose-400">Unknown</strong> were not detected in the JD. Editing any field automatically promotes its confidence to{' '}
              <strong className="text-emerald-400">Verified</strong>.
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isRequiredValid) {
                onGenerateReport(formData, {
                  method: fileName ? 'upload' : 'manual',
                  fileName: fileName || undefined,
                  rawText: rawText || undefined,
                });
              }
            }}
            className="space-y-6"
          >
            {/* 1. Core Role & Geography (Required) */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase font-mono tracking-widest text-indigo-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 glow-dot"></span>
                1. Core Role & Geographic Market (Required)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Target Role */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">
                      Target Role Title <span className="text-rose-400">*</span>
                    </label>
                    <ConfidenceBadge level={formData.role.confidence} />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.role.value}
                    onChange={(e) =>
                      updateField((prev) => ({
                        ...prev,
                        role: { value: e.target.value, confidence: 'verified' },
                      }))
                    }
                    placeholder="e.g. Staff Machine Learning Engineer"
                    className={`w-full px-3.5 py-2.5 text-xs bg-slate-950/70 rounded-xl border text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden ${
                      formData.role.confidence === 'unknown'
                        ? 'border-rose-500/60 border-dashed bg-rose-950/10'
                        : 'border-slate-800'
                    }`}
                  />
                </div>

                {/* Geographic Market */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">
                      Geographic Market <span className="text-rose-400">*</span>
                    </label>
                    <ConfidenceBadge level={formData.geography.confidence} />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.geography.location}
                    onChange={(e) =>
                      updateField((prev) => ({
                        ...prev,
                        geography: { ...prev.geography, location: e.target.value, confidence: 'verified' },
                      }))
                    }
                    placeholder="e.g. Austin, TX or San Francisco, CA"
                    className={`w-full px-3.5 py-2.5 text-xs bg-slate-950/70 rounded-xl border text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden ${
                      formData.geography.confidence === 'unknown'
                        ? 'border-rose-500/60 border-dashed bg-rose-950/10'
                        : 'border-slate-800'
                    }`}
                  />
                </div>

                {/* Seniority */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">
                      Seniority Level <span className="text-rose-400">*</span>
                    </label>
                    <ConfidenceBadge level={formData.seniority.confidence} />
                  </div>
                  <select
                    value={formData.seniority.value}
                    onChange={(e) =>
                      updateField((prev) => ({
                        ...prev,
                        seniority: { value: e.target.value as SeniorityLevel, confidence: 'verified' },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950/70 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="ENTRY">ENTRY (0-2 years)</option>
                    <option value="MID">MID (2-5 years)</option>
                    <option value="SENIOR">SENIOR (5-8 years)</option>
                    <option value="STAFF">STAFF (8-12 years)</option>
                    <option value="PRINCIPAL">PRINCIPAL (12+ years)</option>
                    <option value="DIRECTOR">DIRECTOR (Leadership)</option>
                    <option value="VP">VP (Executive)</option>
                    <option value="EXECUTIVE">EXECUTIVE / C-Level</option>
                  </select>
                </div>

                {/* Work Model */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">
                      Work Model
                    </label>
                    <ConfidenceBadge level={formData.workModel.confidence} />
                  </div>
                  <div className="flex gap-2">
                    {(['HYBRID', 'REMOTE', 'ON-SITE'] as WorkModel[]).map((wm) => (
                      <button
                        type="button"
                        key={wm}
                        onClick={() =>
                          updateField((prev) => ({
                            ...prev,
                            workModel: { value: wm, confidence: 'verified' },
                          }))
                        }
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          formData.workModel.value === wm
                            ? 'accent-gradient text-white glow'
                            : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        {wm}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Skills & Technologies */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase font-mono tracking-widest text-cyan-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 glow-dot-cyan"></span>
                2. Skills & Technology Stack
              </h3>

              {/* Required Skills Tags */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    Required Skills (Must-Have)
                  </label>
                  <ConfidenceBadge level={formData.skills.required.confidence} />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {formData.skills.required.value.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() =>
                          updateField((prev) => ({
                            ...prev,
                            skills: {
                              ...prev.skills,
                              required: {
                                value: prev.skills.required.value.filter((_, i) => i !== idx),
                                confidence: 'verified',
                              },
                            },
                          }))
                        }
                        className="hover:text-rose-400 font-bold ml-1 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reqSkillInput}
                    onChange={(e) => setReqSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (reqSkillInput.trim()) {
                          updateField((prev) => ({
                            ...prev,
                            skills: {
                              ...prev.skills,
                              required: {
                                value: [...prev.skills.required.value, reqSkillInput.trim()],
                                confidence: 'verified',
                              },
                            },
                          }));
                          setReqSkillInput('');
                        }
                      }
                    }}
                    placeholder="Type skill & press Enter (e.g. Distributed Systems, PyTorch)..."
                    className="flex-1 px-3.5 py-2 text-xs bg-slate-950/70 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (reqSkillInput.trim()) {
                        updateField((prev) => ({
                          ...prev,
                          skills: {
                            ...prev.skills,
                            required: {
                              value: [...prev.skills.required.value, reqSkillInput.trim()],
                              confidence: 'verified',
                            },
                          },
                        }));
                        setReqSkillInput('');
                      }
                    }}
                    className="px-4 py-2 text-xs bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Technologies Tags */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    Technology Stack & Frameworks
                  </label>
                  <ConfidenceBadge level={formData.technologies.confidence} />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {formData.technologies.value.map((tech, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-medium"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() =>
                          updateField((prev) => ({
                            ...prev,
                            technologies: {
                              value: prev.technologies.value.filter((_, i) => i !== idx),
                              confidence: 'verified',
                            },
                          }))
                        }
                        className="hover:text-rose-400 font-bold ml-1 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (techInput.trim()) {
                          updateField((prev) => ({
                            ...prev,
                            technologies: {
                              value: [...prev.technologies.value, techInput.trim()],
                              confidence: 'verified',
                            },
                          }));
                          setTechInput('');
                        }
                      }
                    }}
                    placeholder="Type tech & press Enter (e.g. Kubernetes, CUDA, vLLM)..."
                    className="flex-1 px-3.5 py-2 text-xs bg-slate-950/70 border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (techInput.trim()) {
                        updateField((prev) => ({
                          ...prev,
                          technologies: {
                            value: [...prev.technologies.value, techInput.trim()],
                            confidence: 'verified',
                          },
                        }));
                        setTechInput('');
                      }
                    }}
                    className="px-4 py-2 text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Industry & Compensation */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase font-mono tracking-widest text-emerald-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 glow-dot-emerald"></span>
                3. Industry Domain & Compensation Band
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Industry */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">
                      Industry Domain
                    </label>
                    <ConfidenceBadge level={formData.industry.confidence} />
                  </div>
                  <input
                    type="text"
                    value={formData.industry.value}
                    onChange={(e) =>
                      updateField((prev) => ({
                        ...prev,
                        industry: { value: e.target.value, confidence: 'verified' },
                      }))
                    }
                    placeholder="e.g. Artificial Intelligence & Cloud Infrastructure"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950/70 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Compensation Range */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">
                      Target Base Compensation (USD)
                    </label>
                    <ConfidenceBadge level={formData.compensationTarget.confidence} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={formData.compensationTarget.min}
                      onChange={(e) =>
                        updateField((prev) => ({
                          ...prev,
                          compensationTarget: {
                            ...prev.compensationTarget,
                            min: parseInt(e.target.value, 10) || 0,
                            confidence: 'verified',
                          },
                        }))
                      }
                      className="w-1/2 px-3 py-2.5 text-xs bg-slate-950/70 border border-slate-800 rounded-xl text-white font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                    <span className="text-xs text-slate-500">to</span>
                    <input
                      type="number"
                      value={formData.compensationTarget.max}
                      onChange={(e) =>
                        updateField((prev) => ({
                          ...prev,
                          compensationTarget: {
                            ...prev.compensationTarget,
                            max: parseInt(e.target.value, 10) || 0,
                            confidence: 'verified',
                          },
                        }))
                      }
                      className="w-1/2 px-3 py-2.5 text-xs bg-slate-950/70 border border-slate-800 rounded-xl text-white font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit & Generate Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-white cursor-pointer font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>← Re-upload / Upload Different JD</span>
              </button>

              <button
                type="submit"
                id="btn-generate-talent-map"
                disabled={!isRequiredValid || isGenerating}
                className="flex items-center gap-2.5 px-8 py-3.5 accent-gradient accent-gradient-hover disabled:opacity-50 text-white rounded-full text-xs font-bold transition-all glow cursor-pointer hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Synthesizing Talent Market Intelligence Map...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-200" />
                    <span>Generate Full Talent Market Map</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
