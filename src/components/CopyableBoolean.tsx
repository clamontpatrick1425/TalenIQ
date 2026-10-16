import React, { useState } from 'react';
import { Copy, Check, Terminal, ExternalLink, Sparkles } from 'lucide-react';

export interface CopyableBooleanProps {
  /** The raw Boolean search string */
  string: string;
  /** Optional title or role headline */
  label?: string;
  /** Optional target platform (e.g. 'LinkedIn Recruiter', 'Google X-Ray', 'GitHub') */
  platform?: string;
  /** Optional explanatory purpose */
  description?: string;
  /** Optional external test URL */
  searchUrl?: string;
  /** Custom wrapper class */
  className?: string;
  /** Callback fired upon successful clipboard copy */
  onCopy?: (copiedString: string) => void;
}

export const CopyableBoolean: React.FC<CopyableBooleanProps> = ({
  string,
  label,
  platform,
  description,
  searchUrl,
  className = '',
  onCopy,
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(string);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textarea = document.createElement('textarea');
        textarea.value = string;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setIsCopied(true);
      if (onCopy) onCopy(string);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2.5 transition-all hover:border-slate-700/80 ${className}`}
    >
      {/* Header (if label or platform provided) */}
      {(label || platform) && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            {label && (
              <span className="text-xs font-semibold text-slate-200">
                {label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {platform && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-900 border border-slate-800 text-slate-400">
                {platform}
              </span>
            )}

            {searchUrl && (
              <a
                href={searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                title="Execute live search in new tab"
              >
                <span>Run</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Boolean Display Box with Monospace Font and Prominent Copy Button */}
      <div className="relative rounded-lg border border-slate-800/90 bg-slate-900/90 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
        {/* Monospace Query Box */}
        <div className="font-mono text-xs text-cyan-300 select-all break-all overflow-x-auto leading-relaxed pr-2 flex-1">
          {string}
        </div>

        {/* Prominent Copy Action Button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`shrink-0 px-3.5 py-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 ${
            isCopied
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 glow-dot-emerald'
              : 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-400'
          }`}
          title="Copy exact Boolean search string to clipboard"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400 animate-scale-in" />
              <span className="text-emerald-300">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Description / Recruiting note */}
      {description && (
        <p className="text-[11px] text-slate-400 leading-snug">
          {description}
        </p>
      )}
    </div>
  );
};
