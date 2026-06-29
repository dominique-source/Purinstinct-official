"use client";
import { useState, useRef, useEffect } from "react";
import { useLang } from "@/lib/i18n";

const GUIDES: Record<string, string> = {
  fr: "/Guide_Francais_PurInstinct-final.pdf",
  en: "/English_Guide_PurInstinct-final.pdf",
};

const SHEET_ENDPOINT =
  process.env.NEXT_PUBLIC_SHEET_ENDPOINT || "";

const LIME = "#84cc16";

type Action = "animations" | "download";

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
      <path d="M10 3v9m0 0l-3.5-3.5M10 12l3.5-3.5M4 16h12"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* ── Gate modal ── */
function GateModal({
  action,
  lang,
  onClose,
}: {
  action: Action;
  lang: string;
  onClose: () => void;
}) {
  const fr = lang === "fr";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  /* Focus first field on open */
  useEffect(() => {
    const t = setTimeout(() => nameRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  async function logToSheet(payload: Record<string, string>) {
    if (!SHEET_ENDPOINT.startsWith("http")) return;
    try {
      await fetch(SHEET_ENDPOINT, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
    } catch { /* best-effort */ }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError(fr ? "Entre ton prénom." : "Enter your name."); return; }
    if (!email.includes("@")) { setError(fr ? "Courriel invalide." : "Invalid email."); return; }
    setError("");
    setLoading(true);

    await logToSheet({ name: name.trim(), email: email.trim(), lang, source: `cta-${action}` });

    if (action === "download") {
      const a = document.createElement("a");
      a.href = GUIDES[lang];
      a.download = "";
      document.body.appendChild(a);
      a.click();
      a.remove();
      onClose();
    } else {
      window.location.href = "/animations";
    }
    setLoading(false);
  }

  const isAnim = action === "animations";

  return (
    /* Backdrop */
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(4,5,12,0.82)",
        backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        animation: "backdropIn 0.22s ease both",
      }}
    >
      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width: "100%", maxWidth: 440,
          background: "#0c0e1b",
          border: `1px solid rgba(132,204,22,0.2)`,
          borderRadius: 20,
          padding: "36px 32px 32px",
          position: "relative",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
          animation: "modalIn 0.28s cubic-bezier(0.34,1.4,0.6,1) both",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Fermer"
          style={{
            position: "absolute", top: 14, right: 14,
            width: 32, height: 32, borderRadius: 8,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.45)", cursor: "pointer",
            display: "grid", placeItems: "center",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.11)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
        >
          <IconClose />
        </button>

        {/* Icon badge */}
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: `rgba(132,204,22,0.1)`,
          border: `1px solid rgba(132,204,22,0.25)`,
          display: "grid", placeItems: "center",
          color: LIME, marginBottom: 18,
        }}>
          {isAnim ? <IconPlay /> : <IconDownload />}
        </div>

        {/* Header — dominant */}
        <p style={{
          fontFamily: "var(--font-barlow), sans-serif",
          fontWeight: 900, fontSize: 22,
          color: "#fff", margin: "0 0 6px",
          letterSpacing: "-0.01em", textTransform: "uppercase",
          lineHeight: 1.1,
        }}>
          {isAnim
            ? (fr ? "Apprendre à jouer" : "Learn to play")
            : (fr ? "Télécharger le guide" : "Download the guide")}
        </p>

        {/* Sub — supporting */}
        <p style={{
          margin: "0 0 28px",
          color: "rgba(255,255,255,0.45)", fontSize: 13.5, lineHeight: 1.55,
        }}>
          {isAnim
            ? (fr ? "Laisse ton nom et ton courriel pour accéder aux animations interactives." : "Leave your name and email to access the interactive animations.")
            : (fr ? "Laisse ton nom et ton courriel pour télécharger le guide PDF officiel." : "Leave your name and email to download the official PDF guide.")}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Prénom */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
              fontFamily: "var(--font-barlow), sans-serif",
            }}>
              {fr ? "Prénom" : "First name"}
            </label>
            <input
              ref={nameRef}
              type="text"
              autoComplete="given-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={fr ? "Ton prénom" : "Your first name"}
              style={{
                height: 48, borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                color: "#fff", fontSize: 15, padding: "0 14px",
                outline: "none", fontFamily: "var(--font-barlow), sans-serif",
                transition: "border-color 0.18s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = `${LIME}55`)}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Courriel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
              fontFamily: "var(--font-barlow), sans-serif",
            }}>
              {fr ? "Courriel" : "Email"}
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={fr ? "ton@courriel.com" : "your@email.com"}
              style={{
                height: 48, borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                color: "#fff", fontSize: 15, padding: "0 14px",
                outline: "none", fontFamily: "var(--font-barlow), sans-serif",
                transition: "border-color 0.18s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = `${LIME}55`)}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {error && (
            <p role="alert" style={{ margin: 0, fontSize: 12.5, color: "#f87171" }}>{error}</p>
          )}

          {/* CTA — the one lime element */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8, height: 52, borderRadius: 12, border: "none",
              background: loading ? `${LIME}88` : LIME,
              color: "#06070f",
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 900, fontSize: 14, letterSpacing: "0.08em",
              textTransform: "uppercase", cursor: loading ? "wait" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: loading ? "none" : "0 0 28px rgba(132,204,22,0.35)",
              transition: "background 0.18s, box-shadow 0.18s, transform 0.15s",
            }}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = "#a3e635"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.background = loading ? `${LIME}88` : LIME; e.currentTarget.style.transform = ""; }}
          >
            {loading
              ? <span style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.25)", borderTopColor: "#06070f", borderRadius: "50%", animation: "ctaSpin 0.7s linear infinite", display: "inline-block" }} />
              : (isAnim ? <IconPlay /> : <IconDownload />)}
            {loading
              ? (fr ? "Chargement…" : "Loading…")
              : (isAnim ? (fr ? "Accéder aux animations" : "Access animations") : (fr ? "Télécharger le PDF" : "Download PDF"))}
          </button>
        </form>

        {/* Disclaimer — subordinate */}
        <p style={{ margin: "14px 0 0", textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.04em" }}>
          {fr ? "Gratuit · Aucune carte de crédit" : "Free · No credit card required"}
        </p>
      </div>

      <style>{`
        @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.90) translateY(20px); } to { opacity: 1; transform: none; } }
        @keyframes ctaSpin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.18); }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px #0c0e1b inset; -webkit-text-fill-color: #fff; }
      `}</style>
    </div>
  );
}

/* ── Main section ── */
export default function EmailCapture() {
  const { lang } = useLang();
  const fr = lang === "fr";
  const [modal, setModal] = useState<Action | null>(null);

  return (
    <>
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
            <button
              onClick={() => setModal("animations")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                height: 58, padding: "0 36px", borderRadius: 12,
                background: LIME, color: "#06070f", border: "none",
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 900, fontSize: 15, letterSpacing: "0.06em",
                textTransform: "uppercase", cursor: "pointer",
                boxShadow: "0 0 36px rgba(132,204,22,0.4)",
                transition: "background 0.18s, transform 0.15s, box-shadow 0.18s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#a3e635"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 52px rgba(132,204,22,0.6)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = LIME; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 0 36px rgba(132,204,22,0.4)"; }}
            >
              <IconPlay />
              {fr ? "Apprendre à jouer" : "Learn to play"}
            </button>

            {/* Secondary — PDF download */}
            <button
              onClick={() => setModal("download")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                height: 52, padding: "0 32px", borderRadius: 12,
                background: "transparent",
                border: "1.5px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.7)",
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 700, fontSize: 14, letterSpacing: "0.06em",
                textTransform: "uppercase", cursor: "pointer",
                transition: "border-color 0.18s, color 0.18s, transform 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${LIME}66`; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.transform = ""; }}
            >
              <IconDownload />
              {fr ? "Télécharger le guide PDF" : "Download PDF guide"}
            </button>
          </div>

          <p style={{ marginTop: 22, color: "rgba(255,255,255,0.25)", fontSize: 12, letterSpacing: "0.04em" }}>
            {fr ? "Gratuit · Aucune carte de crédit" : "Free · No credit card required"}
          </p>
        </div>
      </section>

      {/* Gate modal */}
      {modal && (
        <GateModal
          action={modal}
          lang={lang}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
