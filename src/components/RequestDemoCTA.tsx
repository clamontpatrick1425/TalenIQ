import React, { useState } from 'react';
import { Sparkles, Calendar, CheckCircle2, ArrowRight, X, ShieldCheck, Mail, Building, User } from 'lucide-react';

export interface RequestDemoCTAProps {
  /** Visual variant: 'header' for compact navbar button, 'footer' or 'banner' for high-contrast section CTA */
  variant?: 'header' | 'footer' | 'banner';
  /** Optional custom button label (default: 'Request a Demo') */
  label?: string;
  /** Custom wrapper class */
  className?: string;
}

export const RequestDemoCTA: React.FC<RequestDemoCTAProps> = ({
  variant = 'header',
  label = 'Request a Demo',
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    hiringNeeds: '1-5 Technical Hires',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      // Auto close after 3 seconds
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSubmitted(false);
      }, 3000);
    }, 500);
  };

  return (
    <>
      {/* Trigger CTA Button */}
      {variant === 'header' ? (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:via-indigo-400 hover:to-purple-500 text-white border border-cyan-400/40 glow ${className}`}
          aria-label="Request a 1-on-1 executive demo of TalentIQ"
        >
          <Calendar className="w-3.5 h-3.5 text-cyan-200" />
          <span>{label}</span>
        </button>
      ) : variant === 'banner' ? (
        <div
          className={`w-full rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-slate-950 via-indigo-950/70 to-slate-950 border border-indigo-500/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 ${className}`}
        >
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Executive Talent Intelligence</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Ready to de-risk your critical technical searches?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Get custom market intelligence maps, competitor compensation benchmarks, and passive talent liquidity indices for your open requisitions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 px-6 py-3.5 rounded-xl text-sm font-bold text-white accent-gradient accent-gradient-hover glow shadow-xl transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <Calendar className="w-4 h-4 text-cyan-200" />
            <span>{label}</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      ) : (
        /* Footer variant */
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={`px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400/60 transition-all flex items-center gap-2 cursor-pointer shadow-sm ${className}`}
        >
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>{label}</span>
        </button>
      )}

      {/* Interactive Request a Demo Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
        >
          <div className="relative max-w-md w-full rounded-3xl p-6 sm:p-8 glass-card border border-cyan-500/40 shadow-2xl bg-slate-900/98 text-slate-100 ring-1 ring-cyan-500/20">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              /* Success State */
              <div className="py-8 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-white">Executive Demo Requested</h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                    Thank you! Our technical recruiting intelligence team has reserved a priority slot for {formData.company || 'your organization'}. Check your inbox for confirmation.
                  </p>
                </div>
              </div>
            ) : (
              /* Input Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 mb-2">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Executive Product Tour</span>
                  </div>
                  <h3 id="demo-modal-title" className="text-xl font-bold text-white">
                    Request a Personalized TalentIQ Demo
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">
                    See live talent maps, competitor supply indices, and Boolean sourcing workflows configured for your requisitions.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="Sarah Jenkins"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Work Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="email"
                        required
                        placeholder="sarah@enterprise.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Company / Organization
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="Acme Autonomous Systems"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Target Hiring Volume
                    </label>
                    <select
                      value={formData.hiringNeeds}
                      onChange={(e) => setFormData({ ...formData, hiringNeeds: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="1-5 Technical Hires">1-5 Senior / Staff Hires</option>
                      <option value="6-20 Technical Hires">6-20 Specialized Technical Hires</option>
                      <option value="20+ Strategic Scale">20+ Scale or New Engineering Hub</option>
                      <option value="Executive Search">Confidential C-Suite / VP Search</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-white accent-gradient accent-gradient-hover glow shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                  >
                    <span>Schedule 20-Min Executive Walkthrough</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Confidential NDA Guaranteed • No Vendor Spam</span>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
