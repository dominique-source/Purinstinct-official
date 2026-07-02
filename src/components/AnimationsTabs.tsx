"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useLang } from "@/lib/i18n";
import dynamic from "next/dynamic";

const CoreRules           = dynamic(() => import("@/components/CoreRules"),           { ssr: false });
const Transition          = dynamic(() => import("@/components/Transition"),          { ssr: false });
const TransitionPenalties = dynamic(() => import("@/components/TransitionPenalties"), { ssr: false });
const Penalties           = dynamic(() => import("@/components/Penalties"),           { ssr: false });
const Timer16s            = dynamic(() => import("@/components/Timer16s"),            { ssr: false });
const PointSystem         = dynamic(() => import("@/components/PointSystem"),         { ssr: false });
const GameDuration        = dynamic(() => import("@/components/GameDuration"),        { ssr: false });

const LIME = "#84cc16";
const TAB_H = 72;
/* Height of the sticky nav above this component (Guide nav or Animations nav — both 60px) */
const NAV_H = 60;

/* ── Section icons ── */
function IconRules({ active }: { active: boolean }) {
  const c = active ? LIME : "rgba(255,255,255,0.45)";
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <rect x="3" y="5" width="14" height="2" rx="1" fill={c} />
      <rect x="3" y="12" width="14" height="2" rx="1" fill={c} />
      <rect x="3" y="19" width="14" height="2" rx="1" fill={c} />
      <circle cx="21" cy="6" r="2.5" stroke={c} strokeWidth="1.8" />
      <path d="M19.5 6l1.2 1.2 2-2" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconTransition({ active }: { active: boolean }) {
  const c = active ? LIME : "rgba(255,255,255,0.45)";
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M4 9h14M14 5l4 4-4 4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 17H8M12 21l-4-4 4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconPenalties({ active }: { active: boolean }) {
  const c = active ? LIME : "rgba(255,255,255,0.45)";
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M13 3L2 22h22L13 3z" stroke={c} strokeWidth="2" strokeLinejoin="round" />
      <rect x="12" y="10" width="2" height="6" rx="1" fill={c} />
      <circle cx="13" cy="19" r="1.2" fill={c} />
    </svg>
  );
}
function IconChrono({ active }: { active: boolean }) {
  const c = active ? LIME : "rgba(255,255,255,0.45)";
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="14" r="9" stroke={c} strokeWidth="2" />
      <path d="M13 9v5l3 2" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 3h6M13 3v2" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconPoints({ active }: { active: boolean }) {
  const c = active ? LIME : "rgba(255,255,255,0.45)";
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M13 3l2.5 5 5.5.8-4 3.9.94 5.5L13 15.7l-4.94 2.5L10 12.7 6 8.8l5.5-.8L13 3z"
        stroke={c} strokeWidth="1.8" strokeLinejoin="round" fill={active ? `${LIME}28` : "none"} />
    </svg>
  );
}
function IconDuration({ active }: { active: boolean }) {
  const c = active ? LIME : "rgba(255,255,255,0.45)";
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <rect x="3" y="5" width="20" height="18" rx="2.5" stroke={c} strokeWidth="2" />
      <path d="M3 10h20" stroke={c} strokeWidth="2" />
      <path d="M8 3v4M18 3v4" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <rect x="7" y="14" width="4" height="4" rx="0.8" fill={c} />
    </svg>
  );
}

const SECTION_ICONS: Record<string, (a: boolean) => React.ReactNode> = {
  regles:     (a) => <IconRules active={a} />,
  transition: (a) => <IconTransition active={a} />,
  punitions:  (a) => <IconPenalties active={a} />,
  chrono:     (a) => <IconChrono active={a} />,
  points:     (a) => <IconPoints active={a} />,
  duree:      (a) => <IconDuration active={a} />,
};

const SECTIONS = [
  { key: "regles",     fr: "3 règles",   en: "3 rules"   },
  { key: "transition", fr: "Transition", en: "Transition" },
  { key: "punitions",  fr: "Punitions",  en: "Penalties"  },
  { key: "chrono",     fr: "16 sec",     en: "16 sec"     },
  { key: "points",     fr: "Points",     en: "Points"     },
  { key: "duree",      fr: "Durée",      en: "Duration"   },
] as const;

type Key = typeof SECTIONS[number]["key"];

function Panel({ active }: { active: Key }) {
  switch (active) {
    case "regles":     return <CoreRules />;
    case "transition": return <Transition />;
    case "punitions":  return <><TransitionPenalties /><Penalties /></>;
    case "chrono":     return <Timer16s />;
    case "points":     return <PointSystem />;
    case "duree":      return <GameDuration />;
  }
}

function ScrollZoomFallback({ panelKey }: { panelKey: Key }) {
  useEffect(() => {
    const supportsScrollTimeline =
      typeof CSS !== "undefined" && CSS.supports("animation-timeline", "view()");
    const timer = setTimeout(() => {
      const panelInner = document.querySelector<HTMLElement>(".panel-root > *");
      if (!panelInner) return;
      const all = Array.from(panelInner.querySelectorAll<HTMLElement>("*"));
      const candidates = all.filter((el) => {
        const h = el.getBoundingClientRect().height;
        return h >= 48 && h <= 620 && el.tagName !== "STYLE";
      });
      const candidateSet = new Set(candidates);
      const blocks = candidates.filter((el) => {
        let p = el.parentElement;
        while (p && p !== panelInner) {
          if (candidateSet.has(p)) return false;
          p = p.parentElement;
        }
        return true;
      });
      const cls = supportsScrollTimeline ? "zoom-block" : "zoom-block-fallback";
      blocks.forEach((el) => el.classList.add(cls));
      if (supportsScrollTimeline) return;
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) =>
          (e.target as HTMLElement).classList.toggle("in-view", e.isIntersecting)
        ),
        { threshold: 0.1 }
      );
      blocks.forEach((el) => obs.observe(el));
      return () => obs.disconnect();
    }, 80);
    return () => clearTimeout(timer);
  }, [panelKey]);
  return null;
}

export default function AnimationsTabs() {
  const { lang } = useLang();
  const fr = lang === "fr";
  const [active, setActive] = useState<Key>("regles");
  const tabsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [iconScales, setIconScales] = useState<Record<string, number>>(() =>
    Object.fromEntries(SECTIONS.map((s, i) => [s.key, i === 0 ? 1 : 0]))
  );
  const [iconZoom, setIconZoom] = useState(1.0);

  /* Dock-style mouse proximity — gentle scale + glow only; color/background
     stay CSS-driven so the active state always reads unambiguously */
  useEffect(() => {
    const bar = tabsRef.current;
    if (!bar) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const INFLUENCE = 160;
    const BOOST = 0.14;
    let mx = -9999, my = -9999;
    let raf = 0;
    let running = false;

    function tick() {
      if (!bar) return;
      bar.querySelectorAll<HTMLButtonElement>("button[data-key]").forEach((btn) => {
        const r = btn.getBoundingClientRect();
        const dist = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
        const t = Math.max(0, 1 - dist / INFLUENCE);
        const t2 = t * t;
        btn.style.transform = t > 0.05 ? `scale(${1 + BOOST * t2})` : "";
        btn.style.filter    = t > 0.1  ? `drop-shadow(0 0 ${10 * t}px ${LIME}66)` : "";
      });
      if (running) raf = requestAnimationFrame(tick);
    }

    function onMouseMove(e: MouseEvent) { mx = e.clientX; my = e.clientY; }
    function onMouseEnter() { running = true; raf = requestAnimationFrame(tick); }
    function onMouseLeave() {
      running = false;
      cancelAnimationFrame(raf);
      if (!bar) return;
      bar.querySelectorAll<HTMLButtonElement>("button[data-key]").forEach((btn) => {
        btn.style.transform = btn.style.filter = "";
      });
    }

    bar.addEventListener("mousemove", onMouseMove);
    bar.addEventListener("mouseenter", onMouseEnter);
    bar.addEventListener("mouseleave", onMouseLeave);
    return () => {
      bar.removeEventListener("mousemove", onMouseMove);
      bar.removeEventListener("mouseenter", onMouseEnter);
      bar.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* Per-icon scale from scroll position */
  const updateScales = useCallback(() => {
    const bar = tabsRef.current;
    if (!bar) return;
    const barRect = bar.getBoundingClientRect();
    const centerX = barRect.left + barRect.width / 2;
    const next: Record<string, number> = {};
    bar.querySelectorAll<HTMLButtonElement>("button").forEach((btn) => {
      const r = btn.getBoundingClientRect();
      const dist = Math.abs(r.left + r.width / 2 - centerX);
      next[btn.dataset.key!] = 1 - Math.min(dist / (barRect.width / 2 + r.width), 1) * 0.55;
    });
    setIconScales(next);
  }, []);

  useEffect(() => {
    const bar = tabsRef.current;
    if (!bar) return;
    updateScales();
    bar.addEventListener("scroll", updateScales, { passive: true });
    window.addEventListener("resize", updateScales, { passive: true });
    return () => {
      bar.removeEventListener("scroll", updateScales);
      window.removeEventListener("resize", updateScales);
    };
  }, [updateScales]);

  /* Sliding ink indicator — carries the active state from tab to tab */
  const [ink, setInk] = useState<{ x: number; w: number } | null>(null);
  const measureInk = useCallback(() => {
    const bar = tabsRef.current;
    const btn = bar?.querySelector<HTMLButtonElement>(`[data-key="${active}"]`);
    if (!bar || !btn) return;
    const inset = 14;
    setInk({ x: btn.offsetLeft + inset, w: Math.max(btn.offsetWidth - inset * 2, 24) });
  }, [active]);

  useEffect(() => {
    measureInk();
    /* Re-measure once webfonts settle (tab widths depend on Barlow) */
    document.fonts?.ready?.then(measureInk);
    window.addEventListener("resize", measureInk);
    return () => window.removeEventListener("resize", measureInk);
  }, [measureInk, lang]);

  /* Scroll-driven zoom for active tab icon */
  useEffect(() => {
    setIconZoom(1.0);
    function onScroll() {
      const panel = panelRef.current;
      if (!panel) return;
      const rect = panel.getBoundingClientRect();
      const t = (window.innerHeight - rect.top) / (rect.height + window.innerHeight);
      setIconZoom(1.0 + 0.5 * Math.sin(Math.max(0, Math.min(1, t)) * Math.PI));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [active]);

  /* Arrow-key navigation between tabs (ArrowLeft/Right, Home, End) */
  function onTabsKeyDown(e: React.KeyboardEvent) {
    const idx = SECTIONS.findIndex((s) => s.key === active);
    let next = -1;
    if (e.key === "ArrowRight") next = (idx + 1) % SECTIONS.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + SECTIONS.length) % SECTIONS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = SECTIONS.length - 1;
    if (next < 0) return;
    e.preventDefault();
    const key = SECTIONS[next].key;
    switchTab(key);
    tabsRef.current?.querySelector<HTMLButtonElement>(`[data-key="${key}"]`)?.focus();
  }

  function switchTab(key: Key) {
    if (key === active) return;
    setActive(key);
    /* Scroll so the tab bar is just below the sticky nav */
    const bar = tabsRef.current;
    if (bar) {
      const top = bar.getBoundingClientRect().top + window.scrollY - NAV_H;
      window.scrollTo({ top, behavior: "smooth" });
      /* Center the clicked tab in the bar */
      const btn = bar.querySelector<HTMLButtonElement>(`[data-key="${key}"]`);
      if (btn) {
        bar.scrollTo({ left: btn.offsetLeft + btn.offsetWidth / 2 - bar.offsetWidth / 2, behavior: "smooth" });
      }
    }
  }

  return (
    <div style={{ background: "#06070f", color: "#fff" }}>

      {/* ── Tab bar ── */}
      <div
        ref={tabsRef}
        role="tablist"
        aria-label={fr ? "Sections du guide" : "Guide sections"}
        onKeyDown={onTabsKeyDown}
        style={{
          position: "sticky", top: NAV_H, zIndex: 40,
          background: "rgba(6,7,15,0.98)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", overflowX: "auto",
          scrollbarWidth: "none", msOverflowStyle: "none",
          height: TAB_H, gap: 2, padding: "0 4px",
        } as React.CSSProperties}
      >
        {SECTIONS.map(({ key, fr: labelFr, en: labelEn }) => {
          const on = active === key;
          const iconScale = on ? iconZoom : Math.min(iconScales[key] ?? 0.7, 0.88);
          return (
            <button
              key={key}
              data-key={key}
              onClick={() => switchTab(key)}
              role="tab"
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              className={`gtab${on ? " gtab-on" : ""}`}
              style={{
                flex: "1 0 auto", minWidth: 72,
                padding: "0 clamp(10px,1.8vw,20px)",
                height: "100%",
                border: "none",
                borderRadius: 10,
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: on ? 800 : 600,
                fontSize: "clamp(9px,1.2vw,11px)",
                letterSpacing: "0.10em", textTransform: "uppercase",
                cursor: "pointer", whiteSpace: "nowrap",
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 4,
                opacity: on ? 1 : 0.55 + (iconScales[key] ?? 0.7) * 0.45,
              } as React.CSSProperties}
            >
              <span
                data-icon-span=""
                key={`${key}-${on ? "on" : "off"}`}
                className={on ? "gtab-icon-pop" : undefined}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transform: `scale(${iconScale})`,
                  filter: on ? `drop-shadow(0 0 8px ${LIME}aa)` : "none",
                  transition: "transform 0.18s cubic-bezier(0.34,1.4,0.6,1), filter 0.18s ease",
                  willChange: "transform",
                }}>
                {SECTION_ICONS[key](on)}
              </span>
              <span style={{ lineHeight: 1 }}>{fr ? labelFr : labelEn}</span>
            </button>
          );
        })}

        {/* Sliding ink indicator — one element, follows the active tab */}
        {ink && (
          <div
            aria-hidden
            className="gtab-ink"
            style={{ transform: `translateX(${ink.x}px)`, width: ink.w }}
          />
        )}
      </div>

      {/* ── Panel ── */}
      <div key={active} ref={panelRef} className="panel-root" role="tabpanel" aria-label={SECTIONS.find((s) => s.key === active)?.[fr ? "fr" : "en"]} style={{ animation: "panelIn 0.35s cubic-bezier(0.16,1,0.3,1) both" }}>
        <Panel active={active} />
      </div>

      <style>{`
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }
        /* ── Tab activation states ── */
        .gtab {
          color: rgba(255,255,255,0.5);
          background: transparent;
          transition: color 0.22s ease, background 0.22s ease, opacity 0.22s ease;
        }
        .gtab:not(.gtab-on):hover { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.04); }
        .gtab-on { color: ${LIME}; background: rgba(132,204,22,0.08); }
        .gtab:active { background: rgba(132,204,22,0.16); }
        .gtab:focus-visible { outline: 2px solid ${LIME}; outline-offset: -3px; }
        .gtab-ink {
          position: absolute;
          left: 0; bottom: 0;
          height: 2.5px;
          background: ${LIME};
          border-radius: 2px;
          box-shadow: 0 0 10px rgba(132,204,22,0.8);
          pointer-events: none;
          transition: transform 0.32s cubic-bezier(0.16,1,0.3,1), width 0.32s cubic-bezier(0.16,1,0.3,1);
        }
        /* One-shot pop when a tab becomes active (replaces the infinite pulse) */
        @keyframes gtabIconPop {
          0%   { transform: scale(0.72); }
          55%  { transform: scale(1.16); }
          100% { transform: scale(1); }
        }
        .gtab-icon-pop { animation: gtabIconPop 0.35s cubic-bezier(0.34,1.4,0.6,1); }
        @media (prefers-reduced-motion: reduce) {
          .gtab, .gtab-ink { transition: none; }
          .gtab-icon-pop { animation: none; }
        }
        @supports (animation-timeline: view()) {
          @media (prefers-reduced-motion: no-preference) {
            .zoom-block {
              animation: scrollZoom linear both;
              animation-timeline: view();
              animation-range: entry 0% exit 100%;
            }
          }
        }
        @keyframes scrollZoom {
          entry 0%   { transform: scale(0.84) translateY(32px); opacity: 0.15; }
          entry 40%  { transform: scale(1)    translateY(0);    opacity: 1;    }
          exit  60%  { transform: scale(1)    translateY(0);    opacity: 1;    }
          exit  100% { transform: scale(0.90) translateY(-18px); opacity: 0.25; }
        }
        .zoom-block-fallback {
          transform: scale(0.88) translateY(24px);
          opacity: 0.25;
          transition: transform 0.55s cubic-bezier(0.34,1.4,0.6,1), opacity 0.4s ease;
        }
        .zoom-block-fallback.in-view {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
      `}</style>

      <ScrollZoomFallback panelKey={active} />
    </div>
  );
}
