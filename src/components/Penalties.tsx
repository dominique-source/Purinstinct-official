"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

const LIME = "#84cc16";
const RED = "#ef4444";
const ORANGE = "#f97316";
const CYAN = "#38bdf8";

function Field({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 440 280" width="100%" style={{ display: "block" }} role="img">
      <rect x="8" y="8" width="424" height="264" rx="16" fill="#0a1410" stroke="rgba(132,204,22,0.18)" strokeWidth="1.5" />
      {[115, 220, 325].map((x) => (
        <line key={x} x1={x} y1="16" x2={x} y2="264" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" strokeDasharray="3 7" />
      ))}
      <circle cx="220" cy="140" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
      {/* end zone right */}
      <rect x="372" y="8" width="60" height="264" fill="rgba(132,204,22,0.08)" />
      <line x1="372" y1="8" x2="372" y2="272" stroke={LIME} strokeOpacity="0.5" strokeWidth="2" />
      <text x="402" y="140" fill={LIME} fillOpacity="0.45" fontFamily="var(--font-barlow), sans-serif" fontWeight="900" fontSize="15" letterSpacing="0.3em" textAnchor="middle" transform="rotate(90 402 140)">ZONE</text>
      {/* offensive start zone left */}
      <rect x="8" y="8" width="72" height="264" fill={`${CYAN}08`} />
      <line x1="80" y1="8" x2="80" y2="272" stroke={CYAN} strokeOpacity="0.5" strokeWidth="2" strokeDasharray="5 4" />
      <text x="44" y="275" fill={CYAN} fillOpacity="0.5" fontFamily="var(--font-barlow), sans-serif" fontWeight="700" fontSize="8" letterSpacing="0.1em" textAnchor="middle">DÉPART OFF.</text>
      {children}
    </svg>
  );
}

function SceneEarlyEntry({ lang }: { lang: "fr" | "en" }) {
  return (
    <Field>
      {/* Ball at center — on the ground, not yet picked up */}
      <circle cx="220" cy="140" r="9" fill="#eaffd1" stroke={LIME} strokeWidth="2.5" />
      <circle cx="220" cy="140" r="2.6" fill={LIME} />

      {/* Defenders — in play area, facing the offense */}
      <g transform="translate(270,110)">
        <circle r="15" fill={RED} stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
        <text y="5.5" textAnchor="middle" fill="#06070f" fontFamily="var(--font-barlow), sans-serif" fontWeight="900" fontSize="15">D</text>
      </g>
      <g transform="translate(270,170)">
        <circle r="15" fill={RED} stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
        <text y="5.5" textAnchor="middle" fill="#06070f" fontFamily="var(--font-barlow), sans-serif" fontWeight="900" fontSize="15">D</text>
      </g>

      {/* O1 — porteur, stays legal, centered facing D gap */}
      <g className="pen1-o1">
        <circle r="15" fill={LIME} stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
        <text y="5.5" textAnchor="middle" fill="#06070f" fontFamily="var(--font-barlow), sans-serif" fontWeight="900" fontSize="15">1</text>
      </g>

      {/* O2 — rushes in early, gets penalized, faces D1 */}
      <g className="pen1-o2-group">
        <g className="pen1-o2-pawn">
          <circle r="15" fill={LIME} stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
          <text y="5.5" textAnchor="middle" fill="#06070f" fontFamily="var(--font-barlow), sans-serif" fontWeight="900" fontSize="15">2</text>
        </g>
        <g className="pen1-o2-out">
          <circle r="15" fill="rgba(6,7,15,0.85)" stroke={RED} strokeWidth="2.5" strokeDasharray="3 3" />
          <line x1="-8" y1="-8" x2="8" y2="8" stroke={RED} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="8" y1="-8" x2="-8" y2="8" stroke={RED} strokeWidth="2.5" strokeLinecap="round" />
          <text y="32" textAnchor="middle" fill={RED} fillOpacity="0.9" fontFamily="var(--font-barlow), sans-serif" fontWeight="900" fontSize="10" letterSpacing="0.1em">
            {lang === "fr" ? "RETIRÉ" : "OUT"}
          </text>
        </g>
      </g>

      {/* O3 — also rushes in early, faces D2 */}
      <g className="pen1-o3-group">
        <circle r="15" fill={LIME} stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
        <text y="5.5" textAnchor="middle" fill="#06070f" fontFamily="var(--font-barlow), sans-serif" fontWeight="900" fontSize="15">3</text>
      </g>

      {/* Start line warning flash */}
      <line className="pen1-line-flash" x1="80" y1="8" x2="80" y2="272" stroke={RED} strokeWidth="3" strokeOpacity="0" />

      {/* FAUTE badge — positioned via CSS view-box % */}
      <g className="pen1-foul-badge">
        <rect x="-58" y="-18" width="116" height="36" rx="18" fill={ORANGE} />
        <text y="6" textAnchor="middle" fill="#06070f" fontFamily="var(--font-barlow), sans-serif" fontWeight="900" fontSize="17" letterSpacing="0.04em">
          {lang === "fr" ? "FAUTE !" : "FOUL!"}
        </text>
      </g>

      {/* 2 vs 2 result badge — positioned via CSS view-box % */}
      <g className="pen1-result-badge">
        <rect x="-66" y="-18" width="132" height="36" rx="18" fill={`${LIME}18`} stroke={LIME} strokeWidth="1.5" />
        <text y="6" textAnchor="middle" fill={LIME} fontFamily="var(--font-barlow), sans-serif" fontWeight="900" fontSize="17" letterSpacing="0.04em">
          2 vs 2
        </text>
      </g>
    </Field>
  );
}

export default function Penalties() {
  const { lang } = useLang();
  const fr = lang === "fr";
  const sectionRef = useRef<HTMLElement>(null);
  const [, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="penalties"
      ref={sectionRef}
      style={{
        background: "#0d0f1c",
        padding: "clamp(80px,10vw,130px) clamp(16px,4vw,40px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ambient glow */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 50% 55% at 30% 45%, ${RED}0d 0%, transparent 65%)` }} />

      <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto clamp(40px,5vw,64px)" }}>
          <span style={{
            display: "inline-block", marginBottom: 16,
            fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 11,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: ORANGE, border: `1px solid ${ORANGE}44`,
            background: `${ORANGE}10`, borderRadius: 999, padding: "5px 16px",
          }}>
            {fr ? "Pénalités" : "Penalties"}
          </span>
          <h2 style={{
            fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900,
            fontSize: "clamp(36px,5vw,68px)", lineHeight: 0.95, textTransform: "uppercase",
            color: "#fff", letterSpacing: "-0.01em", margin: "0 0 18px",
          }}>
            {fr ? (
              <>Les{" "}
                <span style={{ background: `linear-gradient(135deg, ${ORANGE}, ${RED})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>pénalités</span>
              </>
            ) : (
              <>The{" "}
                <span style={{ background: `linear-gradient(135deg, ${ORANGE}, ${RED})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Penalties</span>
              </>
            )}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, lineHeight: 1.65, maxWidth: 500, margin: "0 auto" }}>
            {fr
              ? "Certaines actions sont interdites. Voici les pénalités offensives et leurs conséquences directes sur le jeu."
              : "Some actions are forbidden. Here are the offensive penalties and their direct impact on play."}
          </p>
        </div>

        {/* ── Penalty 1 card ── */}
        <div className="pen-grid">

          {/* Animated field */}
          <div style={{
            borderRadius: 22, overflow: "hidden", background: "#0c0d17",
            border: `1px solid ${ORANGE}22`, boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
            position: "relative",
          }}>
            {/* corner brackets */}
            {(["top","bottom"] as const).flatMap((v) =>
              (["left","right"] as const).map((h) => (
                <div key={`${v}${h}`} aria-hidden style={{
                  position: "absolute", [v]: 14, [h]: 14, width: 18, height: 18,
                  [`border${v[0].toUpperCase() + v.slice(1)}`]: `1.5px solid ${ORANGE}55`,
                  [`border${h[0].toUpperCase() + h.slice(1)}`]: `1.5px solid ${ORANGE}55`,
                  zIndex: 3, pointerEvents: "none",
                } as React.CSSProperties} />
              ))
            )}
            {/* top bar */}
            <div style={{ position: "absolute", top: 16, left: 18, zIndex: 4, display: "inline-flex", alignItems: "center", gap: 7 }}>
              <span className="pen-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: ORANGE, display: "inline-block" }} />
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>
                {fr ? "PÉNALITÉ OFFENSIVE" : "OFFENSIVE PENALTY"}
              </span>
            </div>
            <div style={{ position: "absolute", top: 16, right: 18, zIndex: 4, fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: `${ORANGE}90` }}>
              TYPE 01/02
            </div>
            <div style={{ padding: "clamp(40px,5vw,56px) clamp(20px,3vw,32px) clamp(24px,3vw,32px)" }}>
              <div key={lang} className="pen-scene">
                <SceneEarlyEntry lang={lang} />
              </div>
            </div>
          </div>

          {/* Description panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* penalty type header */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{
                width: 48, height: 48, borderRadius: 13, flexShrink: 0,
                display: "grid", placeItems: "center",
                background: `${ORANGE}18`, border: `1px solid ${ORANGE}44`,
                fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 20, color: ORANGE,
              }}>1</span>
              <div>
                <p style={{ margin: 0, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: ORANGE, marginBottom: 4 }}>
                  {fr ? "Type 1 · Pénalité offensive" : "Type 1 · Offensive penalty"}
                </p>
                <h3 style={{ margin: 0, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: "clamp(20px,2.5vw,28px)", textTransform: "uppercase", color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.05 }}>
                  {fr ? "Entrée anticipée" : "Early entry"}
                </h3>
              </div>
            </div>

            {/* rule box */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 16, padding: "20px 22px",
            }}>
              <p style={{ margin: "0 0 10px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                {fr ? "La faute" : "The foul"}
              </p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.72 }}>
                {fr
                  ? "Les joueurs offensifs (2 et 3) entrent dans l'aire de jeu avant que le porteur de ballon (joueur 1) touche le ballon au sol au centre du jeu."
                  : "Offensive players (2 and 3) enter the playing area before the ball carrier (player 1) touches the ball on the ground at the center of play."}
              </p>
            </div>

            {/* consequence box */}
            <div style={{
              background: `${RED}0c`, border: `1px solid ${RED}2e`,
              borderRadius: 16, padding: "20px 22px",
            }}>
              <p style={{ margin: "0 0 10px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: RED }}>
                {fr ? "Conséquence" : "Consequence"}
              </p>
              <p style={{ margin: "0 0 16px", color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.72 }}>
                {fr
                  ? "Le joueur fautif se retire pour la séquence. L'équipe offensive joue à 2 contre 2 au lieu de 3 contre 2."
                  : "The offending player sits out for the sequence. The offensive team plays 2 vs 2 instead of 3 vs 2."}
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 18px" }}>
                <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 22, color: RED, letterSpacing: "-0.02em" }}>3 vs 2</span>
                <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 20, lineHeight: 1 }}>→</span>
                <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 22, color: LIME, letterSpacing: "-0.02em" }}>2 vs 2</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Layout ── */
        .pen-grid { display: grid; grid-template-columns: 1.15fr 1fr; gap: clamp(20px,3vw,40px); align-items: center; }
        @media (max-width: 860px) { .pen-grid { grid-template-columns: 1fr; } }

        /* ── Scene entrance ── */
        .pen-scene { animation: penIn 0.5s cubic-bezier(0.16,1,0.3,1); }
        @keyframes penIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }

        /* ── Blinking dot ── */
        .pen-dot { animation: penBlink 1.4s ease-in-out infinite; }
        @keyframes penBlink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }

        /*
          Positions as % of viewBox (440×280).
          transform-box:view-box makes translate(X%,Y%) use SVG viewport units.
          O1  start:(52,140) end:(62,140)   → X:11.818%→14.091%  Y:50%
          O2  start:(52,95)  end:(164,95)   → X:11.818%→37.273%  Y:33.929%
          O3  start:(52,185) end:(164,185)  → X:11.818%→37.273%  Y:66.071%
          FAUTE (220,62)  → 50%, 22.143%
          RESULT (220,232)→ 50%, 82.857%
        */

        /* ── O1: stays legal — only a slight lean ── */
        .pen1-o1 { transform-box: view-box; animation: pen1o1 6s cubic-bezier(0.16,1,0.3,1) infinite; }
        @keyframes pen1o1 {
          0%,35%   { transform: translate(11.818%, 50%); }
          50%,100% { transform: translate(14.091%, 50%); }
        }

        /* ── O2 group: rushes in early ── */
        .pen1-o2-group { transform-box: view-box; animation: pen1o2g 6s cubic-bezier(0.16,1,0.3,1) infinite; }
        @keyframes pen1o2g {
          0%,35%   { transform: translate(11.818%, 33.929%); }
          50%,100% { transform: translate(37.273%, 33.929%); }
        }

        /* ── O2 normal pawn: fades when penalized ── */
        .pen1-o2-pawn { animation: pen1o2p 6s ease infinite; }
        @keyframes pen1o2p { 0%,62% { opacity: 1; } 72%,100% { opacity: 0; } }

        /* ── O2 "out" overlay: scales in after foul ── */
        .pen1-o2-out { opacity: 0; transform-box: fill-box; transform-origin: center; animation: pen1o2out 6s ease infinite; }
        @keyframes pen1o2out {
          0%,66% { opacity: 0; transform: scale(0.4); }
          75%    { opacity: 1; transform: scale(1.12); }
          82%,100% { opacity: 1; transform: scale(1); }
        }

        /* ── O3 group: rushes in early (same timing as O2) ── */
        .pen1-o3-group { transform-box: view-box; animation: pen1o3g 6s cubic-bezier(0.16,1,0.3,1) infinite; }
        @keyframes pen1o3g {
          0%,35%   { transform: translate(11.818%, 66.071%); }
          50%,100% { transform: translate(37.273%, 66.071%); }
        }

        /* ── Start line warning flash ── */
        .pen1-line-flash { animation: pen1flash 6s ease infinite; }
        @keyframes pen1flash {
          0%,47%  { stroke-opacity: 0; }
          51%     { stroke-opacity: 0.85; }
          55%     { stroke-opacity: 0.15; }
          59%     { stroke-opacity: 0.85; }
          63%     { stroke-opacity: 0; }
          100%    { stroke-opacity: 0; }
        }

        /* ── FAUTE badge at (220,62) → translate(50%, 22.143%) ── */
        .pen1-foul-badge { opacity: 0; transform-box: view-box; animation: pen1foul 6s ease infinite; }
        @keyframes pen1foul {
          0%,53% { opacity: 0; transform: translate(50%, 22.143%) scale(0.5); }
          61%    { opacity: 1; transform: translate(50%, 22.143%) scale(1.1); }
          68%,100% { opacity: 1; transform: translate(50%, 22.143%) scale(1); }
        }

        /* ── 2 vs 2 result badge at (220,232) → translate(50%, 82.857%) ── */
        .pen1-result-badge { opacity: 0; transform-box: view-box; animation: pen1result 6s ease infinite; }
        @keyframes pen1result {
          0%,75%   { opacity: 0; transform: translate(50%, 82.857%) scale(0.5); }
          83%      { opacity: 1; transform: translate(50%, 82.857%) scale(1.1); }
          90%,100% { opacity: 1; transform: translate(50%, 82.857%) scale(1); }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .pen-scene *, .pen-dot { animation: none !important; }
          .pen1-foul-badge, .pen1-result-badge, .pen1-o2-out { opacity: 1 !important; transform: scale(1) !important; }
          .pen1-o2-pawn { opacity: 0 !important; }
          .pen1-line-flash { stroke-opacity: 0 !important; }
        }
      `}</style>
    </section>
  );
}
