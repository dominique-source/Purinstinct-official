"use client";
import { useLang } from "@/lib/i18n";

const CYAN = "#38bdf8";
const LIME = "#84cc16";
const RED = "#ef4444";
const ORANGE = "#f97316";
const TEAL = "#15596b";
const MAROON = "#7e2244";

/* viewBox 0 0 340 470 — same field as Transition */
/* Left cone at (52,348) — the one the offensive player must go around */

/* Correct paths: goes from OFF box → wraps around left cone → DEF box
   The correct path dips to y>348 at x~46 (goes BELOW the cone, around the outside) */
const CORRECT_PATH_1 = "M296,400 C190,372 96,366 70,356 C46,360 34,350 42,336 C46,310 48,290 48,268";
const CORRECT_PATH_2 = "M306,406 C200,378 102,370 74,360 C50,364 38,354 46,340 C50,314 52,294 52,272";

/* Wrong path: cuts diagonally, never dips below y=348 — skips going around the cone */
const WRONG_PATH = "M300,408 C210,385 130,344 82,316 C62,300 52,282 50,266";

function Cone({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y + 7} rx="7" ry="2.4" fill="rgba(0,0,0,0.45)" />
      <path d={`M${x - 6},${y + 7} L${x},${y - 9} L${x + 6},${y + 7} Z`} fill="#f59e0b" />
      <rect x={x - 3.4} y={y - 1.5} width="6.8" height="2.6" rx="1" fill="#fff" opacity="0.85" />
    </g>
  );
}

export default function TransitionPenalties() {
  const { lang } = useLang();
  const fr = lang === "fr";

  return (
    <section
      id="transition-penalties"
      style={{
        background: "#0b0d18",
        padding: "clamp(80px,10vw,130px) clamp(16px,4vw,40px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 50% 55% at 30% 45%, ${RED}0d 0%, transparent 65%)` }} />

      <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto clamp(40px,5vw,64px)" }}>
          <span style={{
            display: "inline-block", marginBottom: 16,
            fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 11,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: CYAN, border: `1px solid ${CYAN}44`,
            background: `${CYAN}10`, borderRadius: 999, padding: "5px 16px",
          }}>
            {fr ? "Punitions de transition" : "Transition penalties"}
          </span>
          <h2 style={{
            fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900,
            fontSize: "clamp(36px,5vw,68px)", lineHeight: 0.95, textTransform: "uppercase",
            color: "#fff", letterSpacing: "-0.01em", margin: "0 0 18px",
          }}>
            {fr ? (
              <>Punitions de{" "}
                <span style={{ background: `linear-gradient(135deg, ${CYAN}, ${ORANGE})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>transition</span>
              </>
            ) : (
              <>Transition{" "}
                <span style={{ background: `linear-gradient(135deg, ${CYAN}, ${ORANGE})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>penalties</span>
              </>
            )}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, lineHeight: 1.65, maxWidth: 500, margin: "0 auto" }}>
            {fr
              ? "Certaines actions lors de la transition sont interdites et entraînent des conséquences pour la prochaine séquence."
              : "Some actions during the transition phase are forbidden and impact the next sequence."}
          </p>
        </div>

        {/* ── Card ── */}
        <div className="trpen-grid">

          {/* Animated field */}
          <div style={{
            borderRadius: 22, overflow: "hidden", background: "#0c0d17",
            border: `1px solid ${ORANGE}22`, boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
            position: "relative",
          }}>
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
            <div style={{ position: "absolute", top: 16, left: 18, zIndex: 4, display: "inline-flex", alignItems: "center", gap: 7 }}>
              <span className="trpen-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: ORANGE, display: "inline-block" }} />
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>
                {fr ? "PÉNALITÉ TRANSITION OFF." : "OFFENSIVE TRANSITION PENALTY"}
              </span>
            </div>
            <div style={{ position: "absolute", top: 16, right: 18, zIndex: 4, fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: `${ORANGE}90` }}>
              TYPE 01/01
            </div>
            <div style={{ padding: "clamp(40px,5vw,56px) clamp(20px,3vw,32px) clamp(24px,3vw,32px)" }}>
              <svg viewBox="0 0 340 470" width="100%" style={{ display: "block", maxHeight: "66vh" }} role="img">

                {/* ── Zones ── */}
                <rect x="72" y="24" width="196" height="98" fill={TEAL} />
                <rect x="72" y="122" width="196" height="226" fill={MAROON} />
                <rect x="72" y="348" width="196" height="98" fill={TEAL} />
                <line x1="72" y1="336" x2="268" y2="336" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.4" strokeDasharray="5 5" />
                <rect x="72" y="24" width="196" height="422" fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="2.5" />

                <text x="170" y="72" textAnchor="middle" fill="#fff" fontFamily="var(--font-barlow), sans-serif" fontWeight="800" fontSize="12" letterSpacing="0.14em">{fr ? "ZONE DE FIN" : "END ZONE"}</text>
                <text x="170" y="210" textAnchor="middle" fill="#fff" fillOpacity="0.85" fontFamily="var(--font-barlow), sans-serif" fontWeight="800" fontSize="12" letterSpacing="0.14em">{fr ? "AIRE DE JEU" : "PLAY AREA"}</text>
                <text x="170" y="402" textAnchor="middle" fill="#fff" fontFamily="var(--font-barlow), sans-serif" fontWeight="800" fontSize="12" letterSpacing="0.14em">{fr ? "ZONE DE DÉPART" : "START ZONE"}</text>

                {/* DEF box */}
                <rect x={33} y={243} width="30" height="30" rx="3" fill={`${CYAN}1a`} stroke={CYAN} strokeWidth="1.7" strokeDasharray="3 3" />
                <text x={48} y={287} textAnchor="middle" fill={CYAN} fontFamily="var(--font-barlow), sans-serif" fontWeight="800" fontSize="9" letterSpacing="0.12em">DÉF</text>

                {/* OFF box */}
                <rect x={290} y={390} width="30" height="30" rx="3" fill={`${CYAN}1a`} stroke={CYAN} strokeWidth="1.7" strokeDasharray="3 3" />
                <text x={305} y={434} textAnchor="middle" fill={CYAN} fontFamily="var(--font-barlow), sans-serif" fontWeight="800" fontSize="9" letterSpacing="0.12em">OFF</text>

                {/* ── Left cone ── */}
                <Cone x={52} y={348} />

                {/* ── Correct path guides (very dim) ── */}
                <path d={CORRECT_PATH_1} fill="none" stroke={CYAN} strokeOpacity="0.14" strokeWidth="1.3" strokeDasharray="2 5" strokeLinecap="round" />
                <path d={CORRECT_PATH_2} fill="none" stroke={CYAN} strokeOpacity="0.11" strokeWidth="1.3" strokeDasharray="2 5" strokeLinecap="round" />

                {/* ── Wrong path guide (red dashed, shows the shortcut) ── */}
                <path d={WRONG_PATH} fill="none" stroke={RED} strokeOpacity="0.22" strokeWidth="1.3" strokeDasharray="2 5" strokeLinecap="round" />

                {/* ── Ghost players (correct path, dim) ── */}
                <g>
                  <circle r="6" fill={CYAN} stroke="#06070f" strokeWidth="1.7" />
                  <circle r="1.9" cx="-1.8" cy="-1.8" fill="#fff" opacity="0.55" />
                  <animateMotion dur="7s" repeatCount="indefinite"
                    path={CORRECT_PATH_1}
                    keyPoints="0;0;1;1" keyTimes="0;0.35;0.78;1" calcMode="spline" keySplines="0 0 1 1;0.45 0 0.55 1;0 0 1 1" />
                  <animate attributeName="opacity" dur="7s" repeatCount="indefinite"
                    values="0;0.28;0.28;0;0" keyTimes="0;0.1;0.72;0.84;1" />
                </g>
                <g>
                  <circle r="6" fill={CYAN} stroke="#06070f" strokeWidth="1.7" />
                  <circle r="1.9" cx="-1.8" cy="-1.8" fill="#fff" opacity="0.55" />
                  <animateMotion dur="7s" repeatCount="indefinite"
                    path={CORRECT_PATH_2}
                    keyPoints="0;0;1;1" keyTimes="0;0.35;0.78;1" calcMode="spline" keySplines="0 0 1 1;0.45 0 0.55 1;0 0 1 1" />
                  <animate attributeName="opacity" dur="7s" repeatCount="indefinite"
                    values="0;0.28;0.28;0;0" keyTimes="0;0.1;0.72;0.84;1" />
                </g>

                {/* ── Wrong player (bright, cuts through) ── */}
                <g>
                  <circle r="7" fill={CYAN} stroke={RED} strokeWidth="2" />
                  <circle r="2.2" cx="-1.8" cy="-1.8" fill="#fff" opacity="0.95" />
                  <animateMotion dur="7s" repeatCount="indefinite"
                    path={WRONG_PATH}
                    keyPoints="0;0;1;1" keyTimes="0;0.35;0.78;1" calcMode="spline" keySplines="0 0 1 1;0.45 0 0.55 1;0 0 1 1" />
                  <animate attributeName="opacity" dur="7s" repeatCount="indefinite"
                    values="0;1;1;0;0" keyTimes="0;0.1;0.72;0.84;1" />
                </g>

                {/* ── Cone violation ring ── */}
                <circle className="trpen-cone-ring" cx={52} cy={348} r="16" fill="none" stroke={RED} strokeWidth="2.5" strokeOpacity="0" />

                {/* ── X mark over cone ── */}
                <g className="trpen-cone-x">
                  <line x1="44" y1="340" x2="60" y2="356" stroke={RED} strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="60" y1="340" x2="44" y2="356" stroke={RED} strokeWidth="2.5" strokeLinecap="round" />
                </g>

                {/* ── FAUTE badge — 170,50 → translate(50%, 10.638%) ── */}
                <g className="trpen-foul">
                  <rect x="-58" y="-18" width="116" height="36" rx="18" fill={ORANGE} />
                  <text y="6" textAnchor="middle" fill="#06070f" fontFamily="var(--font-barlow), sans-serif" fontWeight="900" fontSize="17" letterSpacing="0.04em">
                    {fr ? "FAUTE !" : "FOUL!"}
                  </text>
                </g>

                {/* ── 3vs2→2vs2 result badge — 170,430 → translate(50%, 91.489%) ── */}
                <g className="trpen-result">
                  <rect x="-66" y="-18" width="132" height="36" rx="18" fill={`${RED}18`} stroke={RED} strokeWidth="1.5" />
                  <text y="6" textAnchor="middle" fill={RED} fontFamily="var(--font-barlow), sans-serif" fontWeight="900" fontSize="17" letterSpacing="0.04em">
                    2 vs 2
                  </text>
                </g>

              </svg>
            </div>
          </div>

          {/* ── Description panel ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{
                width: 48, height: 48, borderRadius: 13, flexShrink: 0,
                display: "grid", placeItems: "center",
                background: `${ORANGE}18`, border: `1px solid ${ORANGE}44`,
                fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 20, color: ORANGE,
              }}>1</span>
              <div>
                <p style={{ margin: 0, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: ORANGE, marginBottom: 4 }}>
                  {fr ? "Type 1 · Pénalité offensive de transition" : "Type 1 · Offensive transition penalty"}
                </p>
                <h3 style={{ margin: 0, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: "clamp(20px,2.5vw,28px)", textTransform: "uppercase", color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.05 }}>
                  {fr ? "Contournement du cône" : "Cone bypass"}
                </h3>
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "20px 22px" }}>
              <p style={{ margin: "0 0 10px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                {fr ? "La faute" : "The foul"}
              </p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.72 }}>
                {fr
                  ? "Un joueur offensif en transition (en bleu) ne contourne pas le cône et passe de l'autre côté au lieu de le longer par l'extérieur."
                  : "An offensive player in transition (blue) does not go around the cone and cuts through the inside instead of going around the outside."}
              </p>
            </div>

            <div style={{ background: `${RED}0c`, border: `1px solid ${RED}2e`, borderRadius: 16, padding: "20px 22px" }}>
              <p style={{ margin: "0 0 10px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: RED }}>
                {fr ? "Conséquence" : "Consequence"}
              </p>
              <p style={{ margin: "0 0 16px", color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.72 }}>
                {fr
                  ? "Le joueur fautif doit se retirer de la prochaine séquence. L'équipe offensive joue à 2 contre 2 au lieu de 3 contre 2."
                  : "The offending player must sit out the next sequence. The offensive team plays 2 vs 2 instead of 3 vs 2."}
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
        .trpen-grid { display: grid; grid-template-columns: minmax(0,420px) 1fr; gap: clamp(20px,3vw,40px); align-items: center; }
        @media (max-width: 860px) { .trpen-grid { grid-template-columns: 1fr; } }

        .trpen-dot { animation: trpenBlink 1.4s ease-in-out infinite; }
        @keyframes trpenBlink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }

        /*
          viewBox 340×470
          FAUTE  (170, 50)  → translate(50%, 10.638%)
          RESULT (170, 430) → translate(50%, 91.489%)
        */

        /* ── Cone violation ring ── */
        .trpen-cone-ring { animation: trpenConeRing 7s ease infinite; }
        @keyframes trpenConeRing {
          0%,56%   { stroke-opacity: 0; }
          60%      { stroke-opacity: 0.85; }
          64%      { stroke-opacity: 0.15; }
          68%      { stroke-opacity: 0.85; }
          72%,100% { stroke-opacity: 0; }
        }

        /* ── X mark over cone ── */
        .trpen-cone-x { opacity: 0; animation: trpenConeX 7s ease infinite; }
        @keyframes trpenConeX {
          0%,64%   { opacity: 0; }
          70%,100% { opacity: 1; }
        }

        /* ── FAUTE badge ── */
        .trpen-foul { opacity: 0; transform-box: view-box; animation: trpenFoul 7s ease infinite; }
        @keyframes trpenFoul {
          0%,62%   { opacity: 0; transform: translate(50%, 10.638%) scale(0.5); }
          70%      { opacity: 1; transform: translate(50%, 10.638%) scale(1.1); }
          77%,100% { opacity: 1; transform: translate(50%, 10.638%) scale(1); }
        }

        /* ── 2vs2 result badge ── */
        .trpen-result { opacity: 0; transform-box: view-box; animation: trpenResult 7s ease infinite; }
        @keyframes trpenResult {
          0%,75%   { opacity: 0; transform: translate(50%, 91.489%) scale(0.5); }
          83%      { opacity: 1; transform: translate(50%, 91.489%) scale(1.1); }
          90%,100% { opacity: 1; transform: translate(50%, 91.489%) scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .trpen-cone-ring, .trpen-dot { animation: none !important; stroke-opacity: 0 !important; }
          .trpen-cone-x { opacity: 1 !important; animation: none !important; }
          .trpen-foul { opacity: 1 !important; animation: none !important; transform: translate(50%, 10.638%) scale(1); }
          .trpen-result { opacity: 1 !important; animation: none !important; transform: translate(50%, 91.489%) scale(1); }
        }
      `}</style>
    </section>
  );
}
