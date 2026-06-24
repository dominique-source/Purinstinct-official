"use client";
import dynamic from "next/dynamic";
import { LangProvider } from "@/lib/i18n";

const CoreRules = dynamic(() => import("@/components/CoreRules"), { ssr: false });
const Transition = dynamic(() => import("@/components/Transition"), { ssr: false });
const Penalties = dynamic(() => import("@/components/Penalties"), { ssr: false });

const LIME = "#84cc16";

const chip: React.CSSProperties = {
  fontFamily: "var(--font-barlow), sans-serif",
  fontWeight: 700, fontSize: 11,
  letterSpacing: "0.1em", textTransform: "uppercase",
  color: "rgba(255,255,255,0.5)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 6, padding: "4px 10px",
  textDecoration: "none",
};

export default function AnimationsClient() {
  return (
    <LangProvider>
      <div style={{ minHeight: "100dvh", background: "#06070f", color: "#fff" }}>

        {/* ── Nav ── */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(6,7,15,0.92)", backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "0 clamp(16px,4vw,32px)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 54,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/" style={{ textDecoration: "none", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 16, color: "#fff" }}>
              Pur<span style={{ color: LIME }}>Instinct</span>
            </a>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
              Animations
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="#core-rules" style={chip}>Règles</a>
            <a href="#transition" style={chip}>Transition</a>
            <a href="#penalties" style={chip}>Pénalités</a>
          </div>
        </nav>

        <div id="core-rules"><CoreRules /></div>
        <div id="transition"><Transition /></div>
        <div id="penalties"><Penalties /></div>

      </div>
    </LangProvider>
  );
}
