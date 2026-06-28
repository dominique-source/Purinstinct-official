"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { useLang } from "@/lib/i18n";
import dynamic from "next/dynamic";

const AnimationsTabs = dynamic(() => import("@/components/AnimationsTabs"), { ssr: false });

const LIME = "#84cc16";
const CYAN = "#38bdf8";

const SHEET_ENDPOINT = process.env.NEXT_PUBLIC_GUIDE_SHEET_ENDPOINT || "";

const PDF_URLS: Record<string, string> = {
  fr: "/guides/purinstinct-guide-fr.pdf",
  en: "/guides/purinstinct-guide-en.pdf",
};

async function logToSheet(payload: Record<string, string>) {
  if (!SHEET_ENDPOINT.startsWith("http")) return;
  try {
    await fetch(SHEET_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
  } catch {
    // logging is best-effort — never block the user
  }
}

/* ── Lock icon SVG ── */
function LockIcon({ open }: { open: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {open ? (
        <>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 9.9-1" />
        </>
      ) : (
        <>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </>
      )}
    </svg>
  );
}

/* ── Download icon ── */
function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

/* ── Section wrapper with lock overlay ── */
function LockedSection({
  unlocked,
  title,
  badge,
  children,
}: {
  unlocked: boolean;
  title: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative", marginBottom: 0 }}>
      {/* Dimmed content */}
      <div
        style={{
          filter: unlocked ? "none" : "blur(3px)",
          opacity: unlocked ? 1 : 0.22,
          pointerEvents: unlocked ? "auto" : "none",
          transition: "filter 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.7s cubic-bezier(0.16,1,0.3,1)",
          userSelect: unlocked ? "auto" : "none",
        }}
      >
        {children}
      </div>

      {/* Lock overlay (hidden when unlocked) */}
      {!unlocked && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            background: "linear-gradient(180deg, transparent 0%, rgba(6,7,15,0.55) 40%, rgba(6,7,15,0.75) 100%)",
          }}
        >
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            padding: "24px 32px", borderRadius: 18,
            background: "rgba(6,7,15,0.72)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(132,204,22,0.18)",
          }}>
            <span style={{ color: LIME, opacity: 0.7 }}><LockIcon open={false} /></span>
            <span style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 800, fontSize: 11, letterSpacing: "0.2em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.4)",
            }}>{badge}</span>
            <p style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 700, fontSize: 15, color: "#fff",
              textAlign: "center", margin: 0,
            }}>{title}</p>
          </div>
        </div>
      )}

      {/* Unlocked badge */}
      {unlocked && (
        <div style={{
          position: "absolute", top: 20, right: 20, zIndex: 5,
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "rgba(132,204,22,0.12)", border: "1px solid rgba(132,204,22,0.35)",
          borderRadius: 999, padding: "5px 14px",
          animation: "gFadeIn 0.5s ease both",
        }}>
          <span style={{ color: LIME }}><LockIcon open={true} /></span>
          <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: LIME }}>
            Débloqué
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Main guide client ── */
export default function GuideClient() {
  const { lang, setLang, t } = useLang();
  const [unlocked, setUnlocked] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wantPdf, setWantPdf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const fr = lang === "fr";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError(fr ? "Entre ton prénom." : "Enter your name."); return; }
    if (!email.includes("@")) { setError(fr ? "Adresse courriel invalide." : "Invalid email address."); return; }
    setError("");
    setLoading(true);
    await logToSheet({
      name: name.trim(),
      email: email.trim(),
      lang,
      wantPdf: wantPdf ? "Oui" : "Non",
      pdfLang: "",
      source: "guide-unlock",
    });
    setLoading(false);
    setUnlocked(true);
  }

  function downloadPdf(pdfLang: string) {
    logToSheet({
      name: name.trim(),
      email: email.trim(),
      lang,
      wantPdf: wantPdf ? "Oui" : "Non",
      pdfLang: pdfLang.toUpperCase(),
      source: `guide-pdf-${pdfLang}`,
    });
    const a = document.createElement("a");
    a.href = PDF_URLS[pdfLang] || PDF_URLS.fr;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div style={{ minHeight: "100dvh", background: "#06070f", color: "#fff" }}>

      {/* ── Guide Nav ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(6,7,15,0.92)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 clamp(16px,4vw,40px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 60,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }} aria-label="Retour au site">
            <Image src="/logo-icon.png" alt="" width={26} height={25} style={{ height: 24, width: "auto" }} />
            <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 18, color: "#fff" }}>
              Pur<span style={{ color: LIME }}>Instinct</span>
            </span>
          </a>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 16 }}>/</span>
          <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
            {fr ? "Le Guide" : "The Guide"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {unlocked && (
            <button
              onClick={() => downloadPdf(lang)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 13,
                letterSpacing: "0.06em", textTransform: "uppercase",
                color: "#06070f", background: LIME, borderRadius: 8,
                padding: "8px 16px", border: "none", cursor: "pointer",
                animation: "gFadeIn 0.5s ease both",
              }}
            >
              <DownloadIcon />
              {fr ? "PDF FR" : "PDF EN"}
            </button>
          )}
          <button
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 6, color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700,
              letterSpacing: "0.08em", padding: "5px 10px", cursor: "pointer",
              fontFamily: "var(--font-barlow), sans-serif",
            }}
          >
            {lang === "fr" ? "EN" : "FR"}
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header style={{
        textAlign: "center",
        padding: "clamp(56px,8vw,96px) clamp(16px,4vw,40px) clamp(40px,5vw,64px)",
        maxWidth: 720, margin: "0 auto", position: "relative",
      }}>
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(132,204,22,0.12) 0%, transparent 70%)",
        }} />
        <span style={{
          display: "inline-block", marginBottom: 20,
          fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 11,
          letterSpacing: "0.22em", textTransform: "uppercase",
          color: LIME, border: "1px solid rgba(132,204,22,0.3)",
          background: "rgba(132,204,22,0.08)", borderRadius: 999, padding: "5px 16px",
        }}>
          {fr ? "Guide interactif" : "Interactive guide"}
        </span>
        <h1 style={{
          fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900,
          fontSize: "clamp(40px,7vw,88px)", lineHeight: 0.92, textTransform: "uppercase",
          letterSpacing: "-0.02em", margin: "0 0 20px",
        }}>
          {fr ? (
            <><span style={{ color: "#fff" }}>Le guide</span><br />
            <span style={{ background: `linear-gradient(135deg, ${LIME}, ${CYAN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PurInstinct</span></>
          ) : (
            <><span style={{ color: "#fff" }}>The</span><br />
            <span style={{ background: `linear-gradient(135deg, ${LIME}, ${CYAN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PurInstinct Guide</span></>
          )}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(15px,2vw,18px)", lineHeight: 1.65, maxWidth: 540, margin: "0 auto" }}>
          {fr
            ? "Les règles, les gestes, les transitions — tout ce qu'il faut savoir pour jouer. Débloque l'accès complet en quelques secondes."
            : "The rules, moves, and transitions — everything you need to play. Unlock full access in seconds."}
        </p>
      </header>

      {/* ── Gate form ── */}
      {!unlocked ? (
        <div ref={formRef} style={{
          maxWidth: 500, margin: "0 auto clamp(32px,5vw,56px)",
          padding: "0 clamp(16px,4vw,24px)",
        }}>
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(132,204,22,0.22)",
            borderRadius: 20, padding: "clamp(24px,4vw,36px)",
            boxShadow: "0 0 60px rgba(132,204,22,0.06), 0 20px 60px rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{
                width: 38, height: 38, borderRadius: 10,
                background: "rgba(132,204,22,0.12)", border: "1px solid rgba(132,204,22,0.3)",
                display: "grid", placeItems: "center", color: LIME, flexShrink: 0,
              }}><LockIcon open={false} /></span>
              <div>
                <p style={{ margin: 0, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: 15, color: "#fff" }}>
                  {fr ? "Débloque l'accès gratuit" : "Unlock free access"}
                </p>
                <p style={{ margin: 0, fontSize: 12.5, color: "rgba(255,255,255,0.4)" }}>
                  {fr ? "Animations interactives + guide PDF" : "Interactive animations + PDF guide"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label htmlFor="g-name" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
                  {fr ? "Prénom" : "First name"}
                </label>
                <input
                  id="g-name"
                  type="text"
                  autoComplete="given-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={fr ? "Ton prénom" : "Your first name"}
                  style={{
                    height: 46, borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)", color: "#fff",
                    fontSize: 15, padding: "0 14px", outline: "none",
                    fontFamily: "var(--font-barlow), sans-serif",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = LIME)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label htmlFor="g-email" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
                  {fr ? "Courriel" : "Email"}
                </label>
                <input
                  id="g-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={fr ? "ton@courriel.com" : "your@email.com"}
                  style={{
                    height: 46, borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)", color: "#fff",
                    fontSize: 15, padding: "0 14px", outline: "none",
                    fontFamily: "var(--font-barlow), sans-serif",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = LIME)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                />
              </div>

              {/* PDF opt-in */}
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "6px 0" }}>
                <span style={{
                  width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                  border: `1.5px solid ${wantPdf ? LIME : "rgba(255,255,255,0.2)"}`,
                  background: wantPdf ? `rgba(132,204,22,0.2)` : "transparent",
                  display: "grid", placeItems: "center", transition: "all 0.15s ease",
                }}>
                  {wantPdf && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke={LIME} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <input type="checkbox" checked={wantPdf} onChange={(e) => setWantPdf(e.target.checked)} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
                <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>
                  {fr ? "Je veux aussi télécharger le guide PDF" : "I also want to download the PDF guide"}
                </span>
              </label>

              {error && (
                <p role="alert" style={{ margin: 0, fontSize: 13, color: "#f87171", paddingLeft: 2 }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 4, height: 50, borderRadius: 12, border: "none", cursor: loading ? "wait" : "pointer",
                  background: loading ? "rgba(132,204,22,0.5)" : LIME,
                  color: "#06070f", fontFamily: "var(--font-barlow), sans-serif",
                  fontWeight: 900, fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase",
                  transition: "all 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                {loading ? (
                  <span style={{ display: "inline-block", width: 18, height: 18, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#06070f", borderRadius: "50%", animation: "gSpin 0.7s linear infinite" }} />
                ) : null}
                {loading
                  ? (fr ? "Chargement…" : "Loading…")
                  : (fr ? "Débloquer l'accès" : "Unlock access")}
              </button>

              <p style={{ margin: 0, textAlign: "center", fontSize: 11.5, color: "rgba(255,255,255,0.25)", lineHeight: 1.5 }}>
                {fr ? "Accès 100% gratuit. Aucune carte de crédit." : "100% free. No credit card required."}
              </p>
            </form>
          </div>
        </div>
      ) : (
        /* ── Unlocked success banner ── */
        <div style={{
          maxWidth: 500, margin: "0 auto clamp(32px,5vw,56px)",
          padding: "0 clamp(16px,4vw,24px)",
          animation: "gFadeIn 0.5s ease both",
        }}>
          <div style={{
            background: "rgba(132,204,22,0.06)", border: "1px solid rgba(132,204,22,0.3)",
            borderRadius: 20, padding: "20px 24px",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <span style={{ color: LIME, flexShrink: 0 }}><LockIcon open={true} /></span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: 15, color: LIME }}>
                {fr ? `Bienvenue, ${name} !` : `Welcome, ${name}!`}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                {fr ? "Toutes les activations sont débloquées." : "All activations are unlocked."}
              </p>
            </div>
            {wantPdf && (
              <button
                onClick={() => downloadPdf(lang)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7, flexShrink: 0,
                  fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: 13,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  color: "#06070f", background: LIME, borderRadius: 10,
                  padding: "10px 18px", border: "none", cursor: "pointer",
                }}
              >
                <DownloadIcon />
                {fr ? "Télécharger FR" : "Download EN"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Chapter label ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px,4vw,40px) 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{
            fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 10,
            letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
          }}>
            {fr ? "Animations interactives" : "Interactive animations"}
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          <span style={{
            fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 10,
            letterSpacing: "0.12em", color: "rgba(255,255,255,0.2)",
          }}>
            6 {fr ? "sections" : "sections"}
          </span>
        </div>
      </div>

      {/* ── Animations complètes ── */}
      <LockedSection
        unlocked={unlocked}
        title={fr ? "Débloque pour accéder aux animations" : "Unlock to access the animations"}
        badge={fr ? "Contenu interactif" : "Interactive content"}
      >
        <AnimationsTabs />
      </LockedSection>

      {/* ── Coming soon teaser ── */}
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "clamp(40px,6vw,72px) clamp(16px,4vw,40px)",
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12,
        }}>
          {(fr
            ? ["Les 5 gestes", "Les 6 niveaux", "Les zones de jeu", "Les stratégies"]
            : ["The 5 moves", "The 6 levels", "The play zones", "Strategies"]
          ).map((label, i) => (
            <div key={i} style={{
              padding: "18px 20px", borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
              display: "flex", alignItems: "center", gap: 12,
              opacity: 0.45,
            }}>
              <span style={{
                width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)", display: "grid", placeItems: "center",
                flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                </svg>
              </span>
              <div>
                <p style={{ margin: 0, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{label}</p>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{fr ? "Bientôt disponible" : "Coming soon"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        textAlign: "center", padding: "32px 24px 48px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <a href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Image src="/logo-icon.png" alt="" width={20} height={19} style={{ height: 18, width: "auto", opacity: 0.5 }} />
          <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
            PurInstinct © 2025
          </span>
        </a>
      </div>

      <style>{`
        @keyframes gFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes gSpin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px #0e1020 inset; -webkit-text-fill-color: #fff; }
      `}</style>
    </div>
  );
}
