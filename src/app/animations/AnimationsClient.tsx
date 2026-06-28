"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { LangProvider, useLang } from "@/lib/i18n";
import Image from "next/image";
import dynamic from "next/dynamic";

const CoreRules          = dynamic(() => import("@/components/CoreRules"),          { ssr: false });
const Transition         = dynamic(() => import("@/components/Transition"),         { ssr: false });
const TransitionPenalties = dynamic(() => import("@/components/TransitionPenalties"), { ssr: false });
const Penalties          = dynamic(() => import("@/components/Penalties"),          { ssr: false });
const Timer16s           = dynamic(() => import("@/components/Timer16s"),           { ssr: false });
const PointSystem        = dynamic(() => import("@/components/PointSystem"),        { ssr: false });
const GameDuration       = dynamic(() => import("@/components/GameDuration"),       { ssr: false });

const LIME = "#84cc16";

/* ── Section icons ── */
function IconRules({ active }: { active: boolean }) {
  const c = active ? LIME : "rgba(255,255,255,0.45)";
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 9h14M14 5l4 4-4 4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 17H8M12 21l-4-4 4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPenalties({ active }: { active: boolean }) {
  const c = active ? LIME : "rgba(255,255,255,0.45)";
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 3L2 22h22L13 3z" stroke={c} strokeWidth="2" strokeLinejoin="round" />
      <rect x="12" y="10" width="2" height="6" rx="1" fill={c} />
      <circle cx="13" cy="19" r="1.2" fill={c} />
    </svg>
  );
}

function IconChrono({ active }: { active: boolean }) {
  const c = active ? LIME : "rgba(255,255,255,0.45)";
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="13" cy="14" r="9" stroke={c} strokeWidth="2" />
      <path d="M13 9v5l3 2" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 3h6M13 3v2" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconPoints({ active }: { active: boolean }) {
  const c = active ? LIME : "rgba(255,255,255,0.45)";
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 3l2.5 5 5.5.8-4 3.9.94 5.5L13 15.7l-4.94 2.5L10 12.7 6 8.8l5.5-.8L13 3z" stroke={c} strokeWidth="1.8" strokeLinejoin="round" fill={active ? `${LIME}28` : "none"} />
    </svg>
  );
}

function IconDuration({ active }: { active: boolean }) {
  const c = active ? LIME : "rgba(255,255,255,0.45)";
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  { key: "regles",     fr: "3 règles",    en: "3 rules"    },
  { key: "transition", fr: "Transition",  en: "Transition" },
  { key: "punitions",  fr: "Punitions",   en: "Penalties"  },
  { key: "chrono",     fr: "16 sec",      en: "16 sec"     },
  { key: "points",     fr: "Points",      en: "Points"     },
  { key: "duree",      fr: "Durée",       en: "Duration"   },
] as const;

type Key = typeof SECTIONS[number]["key"];

const TOP_H = 60;
const TAB_H = 72;

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

/* Tag scrollable blocks with .zoom-block (CSS scroll-driven) or .zoom-block-fallback (JS) */
function ScrollZoomFallback({ panelKey }: { panelKey: Key }) {
  useEffect(() => {
    const supportsScrollTimeline =
      typeof CSS !== "undefined" && CSS.supports("animation-timeline", "view()");

    const timer = setTimeout(() => {
      const panelInner = document.querySelector<HTMLElement>(".panel-root > *");
      if (!panelInner) return;

      /* Collect candidates: elements between 48px and 620px tall.
         Then keep only the OUTERMOST ones (skip descendants of already-tagged parents)
         so we don't double-zoom nested elements. */
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

      /* Fallback: IntersectionObserver */
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

function AnimationsInner() {
  const { lang, setLang } = useLang();
  const fr = lang === "fr";
  const [active, setActive] = useState<Key>("regles");
  const tabsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [iconScales, setIconScales] = useState<Record<string, number>>(() =>
    Object.fromEntries(SECTIONS.map((s, i) => [s.key, i === 0 ? 1 : 0]))
  );
  const [iconZoom, setIconZoom] = useState(1.0);

  /* Dock-style mouse proximity zoom — direct DOM + RAF, zero React re-renders */
  useEffect(() => {
    const bar = tabsRef.current;
    if (!bar) return;
    const INFLUENCE = 160;
    const BOOST = 1.2; // scale 1.0 → 2.2 at center

    let mx = -9999, my = -9999;
    let raf = 0;
    let active = false;

    function tick() {
      const spans = bar.querySelectorAll<HTMLSpanElement>("span[data-icon-span]");
      spans.forEach((span) => {
        const r = span.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(mx - cx, my - cy);
        const t = Math.max(0, 1 - dist / INFLUENCE);
        const scale = 1 + BOOST * t * t;
        span.style.transform = `scale(${scale})`;
        span.style.filter = t > 0.15 ? `drop-shadow(0 0 ${8 * t}px ${LIME}cc)` : "none";
      });
      if (active) raf = requestAnimationFrame(tick);
    }

    function onMouseMove(e: MouseEvent) { mx = e.clientX; my = e.clientY; }

    function onMouseEnter() {
      active = true;
      raf = requestAnimationFrame(tick);
    }

    function onMouseLeave() {
      active = false;
      cancelAnimationFrame(raf);
      bar.querySelectorAll<HTMLSpanElement>("span[data-icon-span]").forEach((span) => {
        span.style.transform = "";
        span.style.filter = "";
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

  /* Compute per-icon scale based on distance from container center */
  const updateScales = useCallback(() => {
    const bar = tabsRef.current;
    if (!bar) return;
    const barRect = bar.getBoundingClientRect();
    const centerX = barRect.left + barRect.width / 2;
    const buttons = bar.querySelectorAll<HTMLButtonElement>("button");
    const next: Record<string, number> = {};
    buttons.forEach((btn) => {
      const key = btn.dataset.key!;
      const r = btn.getBoundingClientRect();
      const btnCenter = r.left + r.width / 2;
      const dist = Math.abs(btnCenter - centerX);
      const maxDist = barRect.width / 2 + r.width;
      // 0 = at center (max zoom), 1 = at edge (min zoom)
      const t = Math.min(dist / maxDist, 1);
      next[key] = 1 - t * 0.55; // range: 0.45 → 1.0
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

  /* Scroll-driven zoom for the active tab icon: 1.0 → 1.5 → 1.0 as panel scrolls through viewport */
  useEffect(() => {
    setIconZoom(1.0);
    function onScroll() {
      const panel = panelRef.current;
      if (!panel) return;
      const rect = panel.getBoundingClientRect();
      const viewH = window.innerHeight;
      // t: 0 when panel enters bottom of viewport, 1 when panel exits top
      const t = (viewH - rect.top) / (rect.height + viewH);
      const scale = 1.0 + 0.5 * Math.sin(Math.max(0, Math.min(1, t)) * Math.PI);
      setIconZoom(scale);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [active]);

  function switchTab(key: Key) {
    if (key === active) return;
    setActive(key);
    window.scrollTo({ top: 0, behavior: "smooth" });
    /* Scroll the clicked tab toward the center of the bar */
    const bar = tabsRef.current;
    const btn = bar?.querySelector<HTMLButtonElement>(`[data-key="${key}"]`);
    if (bar && btn) {
      const barCenter = bar.offsetWidth / 2;
      const btnCenter = btn.offsetLeft + btn.offsetWidth / 2;
      bar.scrollTo({ left: btnCenter - barCenter, behavior: "smooth" });
    }
  }

  return (
    <div style={{ minHeight: "100dvh", background: "#06070f", color: "#fff" }}>

      {/* ── Top nav ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(6,7,15,0.96)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 clamp(16px,4vw,32px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: TOP_H,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <Image src="/logo-icon.png" alt="" width={24} height={23} style={{ height: 22, width: "auto" }} />
            <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 17, color: "#fff" }}>
              Pur<span style={{ color: LIME }}>Instinct</span>
            </span>
          </a>
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 14 }}>/</span>
          <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)" }}>
            Animations
          </span>
        </div>
        <button
          onClick={() => setLang(lang === "fr" ? "en" : "fr")}
          style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6, color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 700,
            letterSpacing: "0.1em", padding: "5px 11px", cursor: "pointer",
            fontFamily: "var(--font-barlow), sans-serif",
          }}
        >
          {lang === "fr" ? "EN" : "FR"}
        </button>
      </nav>

      {/* ── Section tabs ── */}
      <div
        ref={tabsRef}
        style={{
          position: "sticky", top: TOP_H, zIndex: 40,
          background: "rgba(6,7,15,0.98)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", overflowX: "auto",
          scrollbarWidth: "none", msOverflowStyle: "none",
          height: TAB_H,
          gap: 2,
          padding: "0 4px",
        } as React.CSSProperties}
      >
        {SECTIONS.map(({ key, fr: labelFr, en: labelEn }) => {
          const on = active === key;
          /* scroll-driven scale (mouse proximity handled via direct DOM in RAF loop) */
          const iconScale = on ? iconZoom : Math.min(iconScales[key] ?? 0.7, 0.88);
          const dimmed = !on;
          return (
            <button
              key={key}
              data-key={key}
              onClick={() => switchTab(key)}
              aria-pressed={on}
              style={{
                flex: "1 0 auto",
                minWidth: 72,
                padding: "0 clamp(10px,1.8vw,20px)",
                height: "100%",
                border: "none",
                borderBottom: `2.5px solid ${on ? LIME : "transparent"}`,
                background: on ? "rgba(132,204,22,0.06)" : "transparent",
                borderRadius: "4px 4px 0 0",
                color: on ? LIME : `rgba(255,255,255,${dimmed ? 0.28 : 0.45})`,
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: on ? 800 : 600,
                fontSize: "clamp(9px,1.2vw,11px)",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "color 0.22s ease, border-color 0.22s ease, background 0.22s ease",
                WebkitTapHighlightColor: "transparent",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                opacity: on ? 1 : 0.55 + (iconScales[key] ?? 0.7) * 0.45,
              } as React.CSSProperties}
            >
              <span
                data-icon-span=""
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${iconScale})`,
                  filter: on ? `drop-shadow(0 0 8px ${LIME}aa)` : "none",
                  transition: "transform 0.18s cubic-bezier(0.34,1.4,0.6,1), filter 0.18s ease",
                  willChange: "transform",
                }}>
                {SECTION_ICONS[key](on)}
              </span>
              <span style={{ lineHeight: 1 }}>
                {fr ? labelFr : labelEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Panel ── */}
      <div key={active} ref={panelRef} className="panel-root" style={{ animation: "panelIn 0.35s cubic-bezier(0.16,1,0.3,1) both" }}>
        <Panel active={active} />
      </div>

      <style>{`
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }

        /* ── Scroll-zoom: blocks zoom in as they enter viewport, zoom out as they leave ── */
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
          entry 40%  { transform: scale(1)    translateY(0);     opacity: 1;    }
          exit  60%  { transform: scale(1)    translateY(0);     opacity: 1;    }
          exit  100% { transform: scale(0.90) translateY(-18px); opacity: 0.25; }
        }

        /* Fallback: IntersectionObserver-based zoom for non-supporting browsers */
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

export default function AnimationsClient() {
  return (
    <LangProvider>
      <AnimationsInner />
    </LangProvider>
  );
}
