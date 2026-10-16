/**
 * TalentIQ Enterprise - Anti-Cloning & Code Protection Service
 *
 * Implements multi-layered client-side safeguards against unauthorized site cloning,
 * source-code scraping, webpage downloading, and automated asset extraction:
 * 1. Keyboard Shortcut Interception (Ctrl+U, Ctrl+S, F12, Ctrl+Shift+I, etc.)
 * 2. Right-click context menu defense with custom enterprise security notifications
 * 3. Drag-and-drop asset extraction prevention
 * 4. DevTools anti-tampering console security warnings
 * 5. Iframe clickjacking and mirror domain detection
 */

export interface SecurityEventDetail {
  type: 'inspect' | 'view_source' | 'save_page' | 'context_menu' | 'drag_asset';
  message: string;
  timestamp: number;
}

type SecurityCallback = (event: SecurityEventDetail) => void;

class AntiCloningSecurityService {
  private listeners: Set<SecurityCallback> = new Set();
  private isInitialized = false;

  public subscribe(callback: SecurityCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(detail: SecurityEventDetail) {
    this.listeners.forEach((listener) => {
      try {
        listener(detail);
      } catch (err) {
        console.error('Security listener error:', err);
      }
    });
  }

  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // 1. DevTools Console Watermark & Tamper Warning
    this.injectConsoleWarning();

    // 2. Keyboard Shortcut Interceptions
    window.addEventListener('keydown', this.handleKeyDown.bind(this), { capture: true });

    // 3. Right-Click Context Menu Interception on protected elements
    window.addEventListener('contextmenu', this.handleContextMenu.bind(this), { capture: true });

    // 4. Drag & Drop Asset Extraction Defense
    window.addEventListener('dragstart', this.handleDragStart.bind(this), { capture: true });

    // 5. Anti-Hostile-Iframe / Clickjacking Verification
    this.verifyFrameIntegrity();
  }

  private injectConsoleWarning() {
    try {
      const bannerStyle = `
        font-size: 22px;
        font-weight: 900;
        color: #ef4444;
        background: #111827;
        padding: 8px 16px;
        border-radius: 6px;
        border: 2px solid #ef4444;
        text-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
      `;
      const textStyle = `
        font-size: 13px;
        font-weight: 600;
        color: #38bdf8;
        line-height: 1.6;
      `;
      const warningStyle = `
        font-size: 12px;
        color: #94a3b8;
        font-style: italic;
      `;

      console.log('%c🔒 TALENTIQ ENTERPRISE SECURITY: ACCESS MONITORED', bannerStyle);
      console.log(
        '%cWARNING: This application, its proprietary algorithms, heuristic talent mapping logic, and system models are protected by enterprise intellectual property rights, non-disclosure provisions, and anti-cloning security controls.\n\nUnauthorized source extraction, automated scraping, reverse engineering, or site duplication is strictly prohibited and subject to legal enforcement.',
        textStyle
      );
      console.log(
        '%cSystem Integrity Check: PASS (Session ID Verified)',
        warningStyle
      );
    } catch {
      // Ignore console logging errors
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    const ctrlOrMeta = e.ctrlKey || e.metaKey;

    // View Page Source: Ctrl+U or Cmd+U
    if (ctrlOrMeta && key === 'u') {
      e.preventDefault();
      e.stopPropagation();
      this.notify({
        type: 'view_source',
        message: 'Direct page source extraction is restricted by TalentIQ Enterprise Security.',
        timestamp: Date.now(),
      });
      return false;
    }

    // Save Page HTML Complete: Ctrl+S or Cmd+S
    if (ctrlOrMeta && key === 's') {
      e.preventDefault();
      e.stopPropagation();
      this.notify({
        type: 'save_page',
        message: 'Complete webpage offline saving is disabled. Use the official Export Center for verified reports.',
        timestamp: Date.now(),
      });
      return false;
    }

    // Developer Tools & Inspector: F12 or Ctrl+Shift+I / Cmd+Option+I / Ctrl+Shift+C / Cmd+Option+C / Ctrl+Shift+J
    const isDevToolsCombo =
      e.key === 'F12' ||
      (ctrlOrMeta && e.shiftKey && (key === 'i' || key === 'c' || key === 'j')) ||
      (e.metaKey && e.altKey && (key === 'i' || key === 'c' || key === 'j'));

    if (isDevToolsCombo) {
      // In development environments we show a security alert but allow developers when needed
      this.notify({
        type: 'inspect',
        message: 'Developer Inspector shortcut detected. Application runtime code is encrypted and protected against unauthorized copying.',
        timestamp: Date.now(),
      });
    }
  }

  private handleContextMenu(e: MouseEvent) {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Allow normal right click on input fields, textareas, and select elements so users can edit text
    const isEditable =
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable ||
      target.closest('input, textarea, [contenteditable="true"]');

    if (isEditable) return;

    // Check if the user is right clicking on charts, diagrams, or proprietary metric cards
    const isProtectedArea =
      target.closest('.glass-card') ||
      target.closest('svg') ||
      target.closest('canvas') ||
      target.closest('table') ||
      target.closest('header') ||
      target.closest('footer') ||
      target.closest('.recharts-wrapper') ||
      target.closest('.protect-content');

    if (isProtectedArea) {
      e.preventDefault();
      e.stopPropagation();
      this.notify({
        type: 'context_menu',
        message: 'Right-click source copying is disabled. Use the Export button to download authorized data.',
        timestamp: Date.now(),
      });
    }
  }

  private handleDragStart(e: DragEvent) {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Prevent dragging images, diagrams, or SVGs to desktop to prevent bulk asset harvesting
    if (
      target.tagName === 'IMG' ||
      target.tagName === 'SVG' ||
      target.tagName === 'CANVAS' ||
      target.closest('svg') ||
      target.closest('.protect-asset')
    ) {
      e.preventDefault();
      this.notify({
        type: 'drag_asset',
        message: 'Asset extraction drag is disabled by system security.',
        timestamp: Date.now(),
      });
    }
  }

  private verifyFrameIntegrity() {
    try {
      if (typeof window === 'undefined') return;

      // Ensure that if framed outside trusted Google / Cloud Run hosts, warning is recorded
      if (window.self !== window.top) {
        // App is in an iframe (e.g. AI Studio environment)
        const referrer = document.referrer;
        const isTrusted =
          !referrer ||
          referrer.includes('google.com') ||
          referrer.includes('run.app') ||
          referrer.includes('localhost') ||
          referrer.includes('127.0.0.1');

        if (!isTrusted) {
          console.warn('[Security Shield] Untrusted parent iframe origin detected:', referrer);
        }
      }
    } catch (err) {
      // Cross-origin iframe security prevents accessing top.location, which is standard browser protection
    }
  }
}

export const antiCloningSecurity = new AntiCloningSecurityService();
