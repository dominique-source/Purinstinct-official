"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";

export default function EmailCapture() {
  const { t, lang } = useLang();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  };

  return (
    <section
      id="cta"
      style={{
        padding: "100px 24px",
        background: "#06070f",
        position: "relative",
        overflow: "hidden",
      }}
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

      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
        }}
      >
        <span className="section-label" style={{ display: "block", marginBottom: 20 }}>
          {t.cta.label}
        </span>

        <h2
          style={{
            fontFamily: "var(--font-barlow), sans-serif",
            fontWeight: 900,
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 0.95,
            textTransform: "uppercase",
            color: "#fff",
            marginBottom: 20,
          }}
        >
          {t.cta.title.split("?")[0]}
          <span className="gradient-text">?</span>
        </h2>

        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 17,
            lineHeight: 1.65,
            marginBottom: 40,
            maxWidth: 480,
            margin: "0 auto 40px",
          }}
        >
          {t.cta.sub}
        </p>

        {sent ? (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(132,204,22,0.12)",
              border: "1px solid rgba(132,204,22,0.3)",
              borderRadius: 12,
              padding: "16px 28px",
              color: "#84cc16",
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10l5 5 7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {lang === "fr" ? "Guide envoyé ! Vérifiez votre courriel." : "Guide sent! Check your email."}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              maxWidth: 500,
              margin: "0 auto",
              justifyContent: "center",
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.cta.placeholder}
              style={{
                flex: "1 1 240px",
                height: 52,
                padding: "0 18px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                fontSize: 15,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(132,204,22,0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ height: 52, fontSize: 14, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "..." : t.cta.btn}
            </button>
          </form>
        )}

        <p
          style={{
            marginTop: 16,
            color: "rgba(255,255,255,0.25)",
            fontSize: 12,
            letterSpacing: "0.04em",
          }}
        >
          {t.cta.disclaimer}
        </p>
      </div>
    </section>
  );
}
