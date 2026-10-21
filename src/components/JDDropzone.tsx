import React, { useState, useRef, DragEvent, ChangeEvent, KeyboardEvent } from 'react';
import {
  Upload,
  FileText,
  FileCheck,
  X,
  Loader2,
  FileType,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export interface JDDropzoneProps {
  /** Callback invoked when a valid file is dropped or selected */
  onFileSelected: (file: File) => void;
  /** Optional callback when user removes or clears the selected file */
  onClearFile?: () => void;
  /** Currently selected file name */
  selectedFileName?: string | null;
  /** Currently selected file size string */
  selectedFileSize?: string | null;
  /** Whether document extraction / OCR parsing is in progress */
  isExtracting?: boolean;
  /** Status or error message from document extraction */
  extractStatus?: string | null;
  /** Accepted file formats string (e.g. '.txt,.pdf,.docx,.doc,.md') */
  accept?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Custom wrapper class */
  className?: string;
}

export const JDDropzone: React.FC<JDDropzoneProps> = ({
  onFileSelected,
  onClearFile,
  selectedFileName,
  selectedFileSize,
  isExtracting = false,
  extractStatus,
  accept = '.txt,.pdf,.docx,.doc,.md,.rtf',
  disabled = false,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dropError, setDropError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateAndProcessFile = (file: File) => {
    setDropError(null);

    // Max 15MB file size limit
    if (file.size > 15 * 1024 * 1024) {
      setDropError('File exceeds 15MB limit. Please upload a smaller document.');
      return;
    }

    const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const acceptedList = accept.split(',').map((a) => a.trim().toLowerCase());

    if (!acceptedList.includes(ext) && !file.type.includes('text') && !file.type.includes('pdf')) {
      setDropError(`Unsupported format (${ext}). Supported: PDF, DOCX, TXT, MD`);
      return;
    }

    onFileSelected(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
    // Reset file input value so re-selecting same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleZoneClick = () => {
    if (disabled || isExtracting) return;
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleZoneClick();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden native accessible file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
        aria-label="Upload Job Description document"
      />

      {/* Primary Dropzone Container */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleZoneClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-disabled={disabled}
        className={`glass-card rounded-2xl p-8 border-2 border-dashed text-center transition-all duration-200 cursor-pointer relative overflow-hidden select-none focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          isDragging
            ? 'border-cyan-400 bg-cyan-500/15 scale-[1.01] shadow-[0_0_35px_rgba(6,182,212,0.25)]'
            : selectedFileName
            ? 'border-emerald-500/50 bg-slate-950/60 hover:border-emerald-400'
            : 'border-slate-700/80 hover:border-cyan-500/60 bg-slate-950/40 hover:bg-slate-900/60'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {/* Glow ambient background aura */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {isExtracting ? (
          /* Loading & Extracting State */
          <div className="py-4 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Loader2 className="w-7 h-7 animate-spin text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Extracting Job Description...</div>
              <p className="text-xs text-slate-400 mt-1">
                Parsing unstructured role taxonomy, technical requirements, and compensation bands.
              </p>
            </div>
          </div>
        ) : selectedFileName ? (
          /* File Selected & Ready State */
          <div className="py-2 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-md">
              <FileCheck className="w-7 h-7 text-emerald-400" />
            </div>

            <div>
              <div className="text-sm font-bold text-white truncate max-w-md mx-auto">
                {selectedFileName}
              </div>
              <div className="text-xs font-mono text-emerald-400 mt-1 flex items-center justify-center gap-2">
                <span>Document Ready</span>
                {selectedFileSize && <span>• {selectedFileSize}</span>}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <span className="text-xs text-slate-400 underline underline-offset-2 hover:text-white">
                Click to replace document
              </span>
              {onClearFile && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearFile();
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-700 text-rose-400 hover:text-rose-300 hover:border-rose-500/50 flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Standard Default Idle State */
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl accent-gradient glow flex items-center justify-center text-white shadow-xl ring-2 ring-white/10 group-hover:scale-105 transition-transform">
              <Upload className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-white">
                Drag & drop your Job Description here, or click to browse
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Upload your requisition in PDF, DOCX, TXT, or Markdown format for automatic 5-layer taxonomy decomposition.
              </p>
            </div>

            {/* Supported Formats Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              {['.PDF', '.DOCX', '.TXT', '.MD'].map((fmt) => (
                <span
                  key={fmt}
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-900 border border-slate-800 text-slate-400"
                >
                  {fmt}
                </span>
              ))}
              <span className="text-[10px] font-mono text-slate-500 ml-1">Up to 15MB</span>
            </div>
          </div>
        )}
      </div>

      {/* Validation Error Message */}
      {dropError && (
        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{dropError}</span>
        </div>
      )}

      {/* Extraction Status Feedback */}
      {extractStatus && (
        <div className="text-xs font-mono text-slate-400 flex items-center justify-between px-1">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{extractStatus}</span>
          </span>
        </div>
      )}
    </div>
  );
};
