"use client";
import { useEffect, useRef, useState } from "react";
import { LangProvider, useLang } from "@/lib/i18n";
import Image from "next/image";
import dynamic from "next/dynamic";

const CoreRules = dynamic(() => import("@/components/CoreRules"), { ssr: false });
const Transition = dynamic(() => import("@/components/Transition"), { ssr: false });
const TransitionPenalties = dynamic(() => import("@/components/TransitionPenalties"), { ssr: false });
const Penalties = dynamic(() => import("@/components/Penalties"), { ssr: false });
const Timer16s = dynamic(() => import("@/components/Timer16s"), { ssr: false });
const PointSystem = dynamic(() => import("@/components/PointSystem"), { ssr: false });
const GameDuration = dynamic(() => import("@/components/GameDuration"), { ssr: false });

const LIME = "#84cc16";

const SECTIONS = [
  { key: "regles",     fr: "3 règles de base",    en: "3 basic rules"   },
  { key: "transition", fr: "La transition",        en: "The transition"  },
  { key: "punitions",  fr: "Les punitions",        en: "Penalties"       },
  { key: "chrono",     fr: "16 secondes",          en: "16 seconds"      },
  { key: "points",     fr: "Système de points",    en: "Point system"    },
  { key: "duree",      fr: "Durée d'une partie",   en: "Game duration"   },
] as const;

type Key = typeof SECTIONS[number]["key"];

/* ── TOP NAV + SECTION TABS ── */
const TOP_H = 60;
const TAB_H = 50;
const OFFSET = TOP_H + TAB_H;

function AnimationsInner() {
  const { lang, setLang } = useLang();
  const fr = lang === "fr";
  const [active, setActive] = useState<Key>("regles");
  const wrapRefs = useRef<Partial<Record<Key, HTMLDivElement>>>({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const userNav = useRef(false);

  /* ── scroll spy: pick topmost visible section ── */
  useEffect(() => {
    function onScroll() {
      if (userNav.current) return;
      for (const { key } of SECTIONS) {
        const el = wrapRefs.current[key];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.bottom > OFFSET + 40) { setActive(key); break; }
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── keep active tab visible in nav bar ── */
  useEffect(() => {
    const nav = tabsRef.current;
    if (!nav) return;
    const btn = nav.querySelector<HTMLElement>(`[data-key="${active}"]`);
    btn?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  function goTo(key: Key) {
    const el = wrapRefs.current[key];
    if (!el) return;
    setActive(key);
    userNav.current = true;
    const top = el.getBoundingClientRect().top + window.scrollY - OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
    el.classList.remove("sec-zoom");
    void el.offsetWidth; // force reflow
    el.classList.add("sec-zoom");
    setTimeout(() => { userNav.current = false; }, 1000);
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
            {fr ? "Animations" : "Animations"}
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
        } as React.CSSProperties}
      >
        {SECTIONS.map(({ key, fr: labelFr, en: labelEn }) => {
          const on = active === key;
          return (
            <button
              key={key}
              data-key={key}
              onClick={() => goTo(key)}
              style={{
                flex: "0 0 auto",
                padding: "0 clamp(14px,2.2vw,26px)",
                height: "100%",
                border: "none",
                borderBottom: `2px solid ${on ? LIME : "transparent"}`,
                background: "transparent",
                color: on ? LIME : "rgba(255,255,255,0.36)",
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: on ? 800 : 600,
                fontSize: "clamp(10px,1.4vw,12px)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "color 0.2s ease, border-color 0.2s ease",
                WebkitTapHighlightColor: "transparent",
              } as React.CSSProperties}
            >
              {fr ? labelFr : labelEn}
            </button>
          );
        })}
      </div>

      {/* ── Sections ── */}
      <div ref={el => { if (el) wrapRefs.current["regles"] = el; }}>
        <CoreRules />
      </div>
      <div ref={el => { if (el) wrapRefs.current["transition"] = el; }}>
        <Transition />
      </div>
      <div ref={el => { if (el) wrapRefs.current["punitions"] = el; }}>
        <TransitionPenalties />
        <Penalties />
      </div>
      <div ref={el => { if (el) wrapRefs.current["chrono"] = el; }}>
        <Timer16s />
      </div>
      <div ref={el => { if (el) wrapRefs.current["points"] = el; }}>
        <PointSystem />
      </div>
      <div ref={el => { if (el) wrapRefs.current["duree"] = el; }}>
        <GameDuration />
      </div>

      <style>{`
        .sec-zoom { animation: secZoom 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes secZoom { from { transform: scale(0.985); opacity: 0.6; } to { transform: scale(1); opacity: 1; } }
        [data-key]::-webkit-scrollbar { display: none; }
      `}</style>
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
