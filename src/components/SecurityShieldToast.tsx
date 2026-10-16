import React, { useState, useEffect } from 'react';
import { ShieldAlert, Lock, X, ShieldCheck } from 'lucide-react';
import { antiCloningSecurity, SecurityEventDetail } from '../services/antiCloningSecurity';

export const SecurityShieldToast: React.FC = () => {
  const [activeAlert, setActiveAlert] = useState<SecurityEventDetail | null>(null);

  useEffect(() => {
    antiCloningSecurity.init();
    const unsubscribe = antiCloningSecurity.subscribe((event) => {
      setActiveAlert(event);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (activeAlert) {
      const timer = setTimeout(() => {
        setActiveAlert(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [activeAlert]);

  if (!activeAlert) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-bounce-short">
      <div className="p-4 rounded-xl bg-slate-900/95 border border-indigo-500/50 shadow-2xl backdrop-blur-xl text-white flex items-start gap-3.5 ring-1 ring-indigo-500/20">
        <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5 border border-indigo-500/30">
          <ShieldAlert className="w-5 h-5 text-indigo-400" />
        </div>

        <div className="flex-1 text-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] font-mono text-indigo-300">
              <Lock className="w-3 h-3" />
              <span>Anti-Cloning Shield Active</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">TalentIQ Enterprise</span>
          </div>

          <p className="mt-1 text-slate-300 font-medium leading-relaxed">
            {activeAlert.message}
          </p>

          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Proprietary Algorithms Protected</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              AES-256 / IP Shield
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveAlert(null)}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800"
          title="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
