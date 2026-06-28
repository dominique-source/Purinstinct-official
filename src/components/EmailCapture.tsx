"use client";
import { useLang } from "@/lib/i18n";

const GUIDES: Record<string, string> = {
  fr: "/guides/purinstinct-guide-fr.pdf",
  en: "/guides/purinstinct-guide-en.pdf",
};

const LIME = "#84cc16";

function IconPlay() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 7l6 3-6 3V7z" fill="currentColor" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3v9m0 0l-3.5-3.5M10 12l3.5-3.5M4 16h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function EmailCapture() {
  const { lang } = useLang();
  const fr = lang === "fr";

  function downloadGuide() {
    const a = document.createElement("a");
    a.href = GUIDES[lang];
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <section id="cta" style={{ padding: "110px 24px", background: "#06070f", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 70% at 50% 100%, rgba(132,204,22,0.09) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <span className="section-label" style={{ display: "inline-block", marginBottom: 20 }}>
          {fr ? "Le guide de jeu" : "The game guide"}
        </span>

        <h2 style={{
          fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900,
          fontSize: "clamp(48px, 7vw, 84px)", lineHeight: 0.92,
          textTransform: "uppercase", color: "#fff",
          marginBottom: 20, letterSpacing: "-0.01em",
        }}>
          {fr ? <>Prêt à<br /><span className="gradient-text">jouer ?</span></> : <>Ready to<br /><span className="gradient-text">play?</span></>}
        </h2>

        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 17, lineHeight: 1.65, maxWidth: 480, margin: "0 auto 44px" }}>
          {fr
            ? "Explore les règles en animations interactives ou télécharge le guide PDF officiel — gratuitement."
            : "Explore the rules with interactive animations or download the official PDF guide — for free."}
        </p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          {/* Primary — animations */}
          <a
            href="/animations"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              height: 58, padding: "0 36px", borderRadius: 12,
              background: LIME, color: "#06070f",
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 900, fontSize: 15, letterSpacing: "0.06em",
              textTransform: "uppercase", textDecoration: "none",
              boxShadow: "0 0 36px rgba(132,204,22,0.4)",
              transition: "background 0.18s ease, transform 0.15s ease, box-shadow 0.18s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#a3e635";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 0 52px rgba(132,204,22,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = LIME;
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 0 36px rgba(132,204,22,0.4)";
            }}
          >
            <IconPlay />
            {fr ? "Apprendre à jouer" : "Learn to play"}
          </a>

          {/* Secondary — PDF download */}
          <button
            onClick={downloadGuide}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              height: 52, padding: "0 32px", borderRadius: 12,
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.7)",
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 700, fontSize: 14, letterSpacing: "0.06em",
              textTransform: "uppercase", cursor: "pointer",
              transition: "border-color 0.18s ease, color 0.18s ease, transform 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${LIME}66`;
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
              e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              e.currentTarget.style.transform = "";
            }}
          >
            <IconDownload />
            {fr ? "Télécharger le guide PDF" : "Download PDF guide"}
          </button>
        </div>

        <p style={{ marginTop: 22, color: "rgba(255,255,255,0.25)", fontSize: 12, letterSpacing: "0.04em" }}>
          {fr ? "Gratuit · Aucune inscription requise" : "Free · No sign-up required"}
        </p>
      </div>
    </section>
  );
}
