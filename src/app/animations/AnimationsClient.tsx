"use client";
import { LangProvider, useLang } from "@/lib/i18n";
import Image from "next/image";
import dynamic from "next/dynamic";

const AnimationsTabs = dynamic(() => import("@/components/AnimationsTabs"), { ssr: false });

const LIME = "#84cc16";
const TOP_H = 60;

function AnimationsInner() {
  const { lang, setLang } = useLang();
  const fr = lang === "fr";

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
          {fr ? "EN" : "FR"}
        </button>
      </nav>

      <AnimationsTabs />
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
