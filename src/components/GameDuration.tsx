"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";

const LIME = "#84cc16";
const CYAN = "#38bdf8";

function InfoRow({ color, label, title, desc }: { color: string; label: string; title: string; desc: string }) {
  return (
    <div style={{ padding: "15px 18px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <p style={{ margin: "0 0 3px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color }}>{label}</p>
      <p style={{ margin: "0 0 6px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: 15, color: "#fff" }}>{title}</p>
      <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 13.5, lineHeight: 1.65 }}>{desc}</p>
    </div>
  );
}

function TempsContent({ fr }: { fr: boolean }) {
  return (
    <>
      {/* Visual */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ borderRadius: 20, padding: "clamp(28px,4vw,40px)", background: `${LIME}0e`, border: `1px solid ${LIME}28`, textAlign: "center" }}>
          {/* clock SVG */}
          <svg width="130" height="130" viewBox="0 0 130 130" style={{ margin: "0 auto 20px", display: "block" }}>
            <circle cx="65" cy="65" r="58" fill="none" stroke={`${LIME}18`} strokeWidth="2" />
            <circle cx="65" cy="65" r="50" fill="#0a0d16" stroke={`${LIME}30`} strokeWidth="2" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
              const r1 = 43, r2 = 48;
              return (
                <line key={i}
                  x1={65 + r1 * Math.cos(a)} y1={65 + r1 * Math.sin(a)}
                  x2={65 + r2 * Math.cos(a)} y2={65 + r2 * Math.sin(a)}
                  stroke={`${LIME}55`} strokeWidth={i % 3 === 0 ? 2.5 : 1} strokeLinecap="round"
                />
              );
            })}
            {/* minute hand pointing to 4 (~20 min) */}
            <line x1="65" y1="65" x2="93" y2="83" stroke={LIME} strokeWidth="3" strokeLinecap="round" style={{ animation: "clockMin 120s linear infinite" }} />
            {/* hour hand pointing up */}
            <line x1="65" y1="65" x2="65" y2="26" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            <circle cx="65" cy="65" r="4.5" fill={LIME} />
          </svg>
          <p style={{ margin: "0 0 8px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: LIME }}>
            {fr ? "Option Temps" : "Time option"}
          </p>
          <div style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 52, lineHeight: 1, color: "#fff", margin: "4px 0 8px" }}>
            2 <span style={{ fontSize: 24, color: "rgba(255,255,255,0.35)" }}>×</span> 20<span style={{ fontSize: 28, color: "rgba(255,255,255,0.4)" }}> min</span>
          </div>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.38)", fontSize: 13 }}>
            {fr ? "+ mi-temps de 5 min" : "+ 5 min halftime"}
          </p>
        </div>
      </div>

      {/* Info */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <InfoRow color={LIME} label={fr ? "Format" : "Format"} title={fr ? "2 périodes de 20 min" : "2 periods of 20 min"} desc={fr ? "La partie est divisée en deux périodes de 20 minutes avec une mi-temps de 5 minutes." : "The game is split into two 20-minute periods with a 5-minute halftime break."} />
        <InfoRow color={LIME} label={fr ? "Séquences" : "Sequences"} title={fr ? "16 sec en continu" : "16 sec non-stop"} desc={fr ? "Les séquences de 16 secondes s'enchaînent sans interruption jusqu'à la fin de chaque période." : "The 16-second sequences continue back-to-back until the end of each period."} />
        <InfoRow color={LIME} label={fr ? "Score final" : "Final score"} title={fr ? "Points cumulés" : "Cumulated points"} desc={fr ? "L'équipe avec le plus de points après deux périodes remporte la partie." : "The team with the most points after two periods wins the game."} />
        <InfoRow color={LIME} label={fr ? "Idéal pour" : "Best for"} title={fr ? "Championnats & événements" : "Championships & events"} desc={fr ? "Parfait pour les tournois, les championnats et les événements avec un horaire fixe." : "Perfect for tournaments, championships, and events with a fixed schedule."} />
      </div>

      <style>{`@keyframes clockMin { to { transform-origin: 65px 65px; transform: rotate(360deg); } }`}</style>
    </>
  );
}

function MancheContent({ fr }: { fr: boolean }) {
  const [score, setScore] = useState<[number, number]>([0, 0]);
  const TARGET = 3;
  const winner = score[0] >= TARGET ? 0 : score[1] >= TARGET ? 1 : null;

  function add(team: 0 | 1) {
    if (winner !== null) return;
    setScore(s => { const n: [number, number] = [s[0], s[1]]; n[team]++; return n; });
  }

  return (
    <>
      {/* Visual: interactive scoreboard */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ borderRadius: 20, padding: "clamp(24px,4vw,38px)", background: `${CYAN}0e`, border: `1px solid ${CYAN}28`, textAlign: "center" }}>
          <p style={{ margin: "0 0 20px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: CYAN }}>
            {fr ? "Option Manche — Meilleur de 5" : "Round option — Best of 5"}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 14, alignItems: "center", marginBottom: 20 }}>
            {/* Team A */}
            <div>
              <div style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.32)", marginBottom: 8 }}>
                {fr ? "Équipe A" : "Team A"}
              </div>
              <div style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 72, lineHeight: 1, color: winner === 0 ? LIME : "#fff", transition: "color 0.3s" }}>
                {score[0]}
              </div>
              <button
                onClick={() => add(0)}
                disabled={winner !== null}
                style={{ marginTop: 10, padding: "7px 16px", borderRadius: 8, border: `1px solid ${LIME}40`, background: `${LIME}10`, color: LIME, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: winner !== null ? "default" : "pointer", opacity: winner !== null ? 0.35 : 1, transition: "opacity 0.2s" }}
              >
                + manche
              </button>
            </div>

            <div style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 20, color: "rgba(255,255,255,0.18)" }}>vs</div>

            {/* Team B */}
            <div>
              <div style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.32)", marginBottom: 8 }}>
                {fr ? "Équipe B" : "Team B"}
              </div>
              <div style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 72, lineHeight: 1, color: winner === 1 ? LIME : "#fff", transition: "color 0.3s" }}>
                {score[1]}
              </div>
              <button
                onClick={() => add(1)}
                disabled={winner !== null}
                style={{ marginTop: 10, padding: "7px 16px", borderRadius: 8, border: `1px solid ${CYAN}40`, background: `${CYAN}10`, color: CYAN, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: winner !== null ? "default" : "pointer", opacity: winner !== null ? 0.35 : 1, transition: "opacity 0.2s" }}
              >
                + manche
              </button>
            </div>
          </div>

          {winner !== null ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 15, color: LIME, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {fr ? `Équipe ${winner === 0 ? "A" : "B"} gagne !` : `Team ${winner === 0 ? "A" : "B"} wins!`}
              </div>
              <button onClick={() => setScore([0, 0])} style={{ padding: "7px 20px", borderRadius: 8, border: `1px solid ${LIME}40`, background: `${LIME}10`, color: LIME, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                {fr ? "Rejouer" : "Replay"}
              </button>
            </div>
          ) : (
            <p style={{ margin: 0, color: "rgba(255,255,255,0.28)", fontSize: 12 }}>
              {fr ? "Premier à 3 manches gagne" : "First to 3 rounds wins"}
            </p>
          )}
        </div>
      </div>

      {/* Info */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <InfoRow color={CYAN} label={fr ? "Format" : "Format"} title={fr ? "Meilleur de 5 manches" : "Best of 5 rounds"} desc={fr ? "La partie se joue en manches. La première équipe à remporter 3 manches gagne la partie." : "The game is played in rounds. The first team to win 3 rounds wins the match."} />
        <InfoRow color={CYAN} label={fr ? "Une manche" : "One round"} title={fr ? "3 retraits défensifs" : "3 defensive outs"} desc={fr ? "Une manche se termine quand l'équipe défensive cumule 3 retraits. Les équipes pivotent." : "A round ends when the defensive team accumulates 3 outs. Teams swap roles."} />
        <InfoRow color={CYAN} label={fr ? "Avantage" : "Advantage"} title={fr ? "Pas de limite de temps" : "No time limit"} desc={fr ? "Idéal pour les contextes où le temps est flexible — chaque manche se termine naturellement." : "Ideal for flexible time contexts — each round ends naturally at its own pace."} />
        <InfoRow color={CYAN} label={fr ? "Idéal pour" : "Best for"} title={fr ? "Cliniques & écoles" : "Clinics & schools"} desc={fr ? "Parfait pour les cours d'éducation physique, les cliniques et les entraînements d'équipe." : "Perfect for physical education classes, clinics, and team training sessions."} />
      </div>
    </>
  );
}

export default function GameDuration() {
  const { lang } = useLang();
  const fr = lang === "fr";
  const [mode, setMode] = useState<"temps" | "manche">("temps");
  const accent = mode === "temps" ? LIME : CYAN;

  return (
    <section
      id="duree"
      style={{ background: "#08090f", padding: "clamp(80px,10vw,130px) clamp(16px,4vw,40px)", position: "relative", overflow: "hidden" }}
    >
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 45% 50% at 70% 35%, ${accent}0e 0%, transparent 65%)`, transition: "background 0.5s ease" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>

        {/* header */}
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto clamp(36px,5vw,56px)" }}>
          <span style={{ display: "inline-block", marginBottom: 16, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: LIME, border: `1px solid ${LIME}44`, background: `${LIME}10`, borderRadius: 999, padding: "5px 16px" }}>
            {fr ? "Format de jeu" : "Game format"}
          </span>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: "clamp(36px,5.5vw,70px)", lineHeight: 0.95, textTransform: "uppercase", color: "#fff", letterSpacing: "-0.01em", margin: "0 0 16px" }}>
            {fr ? "Durée d'une partie" : "Game duration"}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, lineHeight: 1.65, maxWidth: 520, margin: "0 auto" }}>
            {fr
              ? "Deux formats selon le contexte. Choisis en fonction du temps disponible."
              : "Two formats depending on context. Choose based on available time."}
          </p>
        </div>

        {/* toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 52 }}>
          <div style={{ display: "inline-flex", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, overflow: "hidden" }}>
            {([
              { key: "temps" as const,  fr: "Option Temps",  en: "Time option",  color: LIME },
              { key: "manche" as const, fr: "Option Manche", en: "Round option", color: CYAN },
            ]).map((o, i) => {
              const on = mode === o.key;
              return (
                <button
                  key={o.key}
                  onClick={() => setMode(o.key)}
                  style={{
                    padding: "13px 28px", border: "none", cursor: "pointer",
                    borderRight: i === 0 ? "1px solid rgba(255,255,255,0.1)" : "none",
                    background: on ? `${o.color}18` : "transparent",
                    transition: "background 0.25s ease",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: on ? o.color : "rgba(255,255,255,0.38)", transition: "color 0.2s" }}>
                    {fr ? o.fr : o.en}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* content */}
        <div key={mode} className="dur-grid" style={{ animation: "durIn 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
          {mode === "temps" ? <TempsContent fr={fr} /> : <MancheContent fr={fr} />}
        </div>
      </div>

      <style>{`
        .dur-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(20px,3vw,48px); align-items: start; }
        @keyframes durIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @media (max-width: 720px) { .dur-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
