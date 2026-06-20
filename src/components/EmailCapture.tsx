"use client";
import { useLang } from "@/lib/i18n";

const GUIDES: Record<string, string> = {
  fr: "/guides/purinstinct-guide-fr.pdf",
  en: "/guides/purinstinct-guide-en.pdf",
};

export default function EmailCapture() {
  const { t, lang } = useLang();

  return (
    <section
      id="cta"
      style={{ padding: "110px 24px", background: "#06070f", position: "relative", overflow: "hidden" }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 60% 70% at 50% 100%, rgba(132,204,22,0.09) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <span className="section-label" style={{ display: "inline-block", marginBottom: 20 }}>
          {t.cta.label}
        </span>

        <h2
          style={{
            fontFamily: "var(--font-barlow), sans-serif",
            fontWeight: 900,
            fontSize: "clamp(48px, 7vw, 84px)",
            lineHeight: 0.92,
            textTransform: "uppercase",
            color: "#fff",
            marginBottom: 20,
            letterSpacing: "-0.01em",
          }}
        >
          {t.cta.title.split("?")[0]}
          <span className="gradient-text">?</span>
        </h2>

        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 17, lineHeight: 1.65, marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
          {t.cta.sub}
        </p>

        {/* Direct download — serves the guide in the selected language */}
        <a
          href={GUIDES[lang]}
          download
          className="btn-primary"
          style={{ fontSize: 16, padding: "18px 38px", boxShadow: "0 0 40px rgba(132,204,22,0.35)" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2v9m0 0l-3.5-3.5M9 11l3.5-3.5M3 14h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t.cta.btn}
        </a>

        <p style={{ marginTop: 18, color: "rgba(255,255,255,0.3)", fontSize: 12, letterSpacing: "0.04em" }}>
          {t.cta.disclaimer}
        </p>
      </div>
    </section>
  );
}
