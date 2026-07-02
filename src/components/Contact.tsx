"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import useScrollReveal from "@/lib/useScrollReveal";

export default function Contact() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  const revealRef = useScrollReveal();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const subject = encodeURIComponent(`PurInstinct — ${data.get("name") || ""}`);
    const body = encodeURIComponent(`${data.get("message") || ""}\n\n— ${data.get("name") || ""} (${data.get("email") || ""})`);
    window.location.href = `mailto:${t.contact.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 52,
    padding: "0 18px",
    borderRadius: 11,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    fontSize: 15,
    outline: "none",
    fontFamily: "var(--font-dm), sans-serif",
    transition: "border-color 0.18s ease",
  };

  return (
    <section id="contact" style={{ padding: "110px 24px", background: "#06070f", position: "relative", overflow: "hidden" }}>
      {/* Glow */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 50% at 18% 30%, rgba(132,204,22,0.07) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div
        ref={revealRef}
        style={{
          maxWidth: 1000, margin: "0 auto", position: "relative",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "start",
        }}
      >
        {/* Left — info */}
        <div className="reveal">
          <span className="section-label" style={{ display: "inline-block", marginBottom: 18 }}>{t.contact.label}</span>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: "clamp(40px, 5.5vw, 68px)", lineHeight: 0.95, textTransform: "uppercase", color: "#fff", marginBottom: 18, letterSpacing: "-0.01em" }}>
            {t.contact.title}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 17, lineHeight: 1.65, marginBottom: 36, maxWidth: 380 }}>
            {t.contact.sub}
          </p>

          {/* Email only */}
          <a href={`mailto:${t.contact.email}`} style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
            <span style={{ width: 44, height: 44, borderRadius: 11, background: "rgba(132,204,22,0.1)", border: "1px solid rgba(132,204,22,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h18v14H3V5zm0 0l9 7 9-7" /></svg>
            </span>
            <span>
              <span style={{ display: "block", fontFamily: "var(--font-barlow), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{t.contact.emailLabel}</span>
              <span style={{ display: "block", color: "#fff", fontSize: 16, marginTop: 2 }}>{t.contact.email}</span>
            </span>
          </a>
        </div>

        {/* Right — form */}
        <form
          onSubmit={handleSubmit}
          className="reveal"
          style={{
            background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 14,
            ...({ "--reveal-delay": "120ms" } as React.CSSProperties),
          }}
        >
          <input name="name" required placeholder={t.contact.formName} style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(132,204,22,0.5)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
          <input name="email" type="email" required placeholder={t.contact.formEmail} style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(132,204,22,0.5)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
          <textarea name="message" required rows={5} placeholder={t.contact.formMessage}
            style={{ ...inputStyle, height: "auto", padding: "14px 18px", resize: "vertical", lineHeight: 1.6 }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(132,204,22,0.5)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
          <button type="submit" className="btn-primary" style={{ height: 52, justifyContent: "center", fontSize: 14 }}>
            {t.contact.formBtn}
          </button>
          {sent && (
            <p style={{ color: "#84cc16", fontSize: 14, textAlign: "center", marginTop: 4 }}>{t.contact.formSent}</p>
          )}
        </form>
      </div>
    </section>
  );
}
