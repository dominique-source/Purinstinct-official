"use client";
import { useState } from "react";
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

const SECTIONS = [
  { key: "regles",     fr: "3 règles de base",  en: "3 basic rules"  },
  { key: "transition", fr: "La transition",      en: "The transition" },
  { key: "punitions",  fr: "Les punitions",      en: "Penalties"      },
  { key: "chrono",     fr: "16 secondes",        en: "16 seconds"     },
  { key: "points",     fr: "Système de points",  en: "Point system"   },
  { key: "duree",      fr: "Durée d'une partie", en: "Game duration"  },
] as const;

type Key = typeof SECTIONS[number]["key"];

const TOP_H = 60;
const TAB_H = 50;

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

function AnimationsInner() {
  const { lang, setLang } = useLang();
  const fr = lang === "fr";
  const [active, setActive] = useState<Key>("regles");

  function switchTab(key: Key) {
    if (key === active) return;
    setActive(key);
    window.scrollTo({ top: TOP_H + TAB_H, behavior: "smooth" });
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
      <div style={{
        position: "sticky", top: TOP_H, zIndex: 40,
        background: "rgba(6,7,15,0.98)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", overflowX: "auto",
        scrollbarWidth: "none", msOverflowStyle: "none",
        height: TAB_H,
      } as React.CSSProperties}>
        {SECTIONS.map(({ key, fr: labelFr, en: labelEn }) => {
          const on = active === key;
          return (
            <button
              key={key}
              onClick={() => switchTab(key)}
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

      {/* ── Panel ── */}
      <div key={active} style={{ animation: "panelIn 0.35s cubic-bezier(0.16,1,0.3,1) both" }}>
        <Panel active={active} />
      </div>

      <style>{`
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }
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
