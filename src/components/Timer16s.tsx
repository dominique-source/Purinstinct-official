"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

const LIME = "#84cc16";
const CYAN = "#38bdf8";
const RED = "#ef4444";
const AMBER = "#f59e0b";
const TOTAL = 16;
const R = 52;
const CIRC = 2 * Math.PI * R;

function Card({ color, label, title, children }: { color: string; label: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: `${color}0a`, border: `1px solid ${color}28`, borderRadius: 14, padding: "18px 20px" }}>
      <p style={{ margin: "0 0 4px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color }}>{label}</p>
      <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: 16, color: "#fff" }}>{title}</h3>
      <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.7 }}>{children}</p>
    </div>
  );
}

function btnStyle(color: string): React.CSSProperties {
  return {
    padding: "9px 22px", borderRadius: 10, cursor: "pointer",
    border: `1.5px solid ${color}`,
    background: `${color}14`,
    color,
    fontFamily: "var(--font-barlow), sans-serif",
    fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase",
    transition: "all 0.2s ease",
  };
}

export default function Timer16s() {
  const { lang } = useLang();
  const fr = lang === "fr";
  const [mode, setMode] = useState<"jeu" | "transition">("jeu");
  const [time, setTime] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const timeRef = useRef(TOTAL);
  timeRef.current = time;

  /* reset when mode changes */
  useEffect(() => {
    setRunning(false);
    setTime(TOTAL);
  }, [mode]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const next = timeRef.current - 1;
      setTime(next);
      if (next <= 0) setRunning(false);
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const expired = time <= 0;
  const accent = expired ? RED : mode === "jeu" ? LIME : CYAN;
  const dashoffset = CIRC * (1 - time / TOTAL);

  function restart() {
    setRunning(false);
    setTime(TOTAL);
    requestAnimationFrame(() => setRunning(true));
  }

  return (
    <section
      id="chrono"
      style={{ background: "#090b14", padding: "clamp(36px,4vw,56px) clamp(16px,4vw,40px)", position: "relative", overflow: "hidden" }}
    >
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 50% 55% at 65% 35%, ${accent}10 0%, transparent 65%)`, transition: "background 0.5s ease" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>

        {/* header */}
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto clamp(36px,5vw,56px)" }}>
          <span style={{ display: "inline-block", marginBottom: 16, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: LIME, border: `1px solid ${LIME}44`, background: `${LIME}10`, borderRadius: 999, padding: "5px 16px" }}>
            {fr ? "Chronomètre" : "Timer"}
          </span>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: "clamp(40px,5.5vw,72px)", lineHeight: 0.95, textTransform: "uppercase", color: "#fff", letterSpacing: "-0.01em", margin: "0 0 16px" }}>
            <span style={{ color: LIME }}>16</span> {fr ? "secondes" : "seconds"}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, lineHeight: 1.65, maxWidth: 520, margin: "0 auto" }}>
            {fr
              ? "L'équipe offensive a 16 secondes pour marquer. Chaque séquence repart à zéro."
              : "The offensive team has 16 seconds to score. Each sequence resets to zero."}
          </p>
        </div>

        {/* mode toggle */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 48 }}>
          {([
            { key: "jeu" as const,        fr: "Pendant le jeu",      en: "During play",        color: LIME },
            { key: "transition" as const, fr: "Lors de transition",   en: "During transition",  color: CYAN },
          ]).map(m => {
            const on = mode === m.key;
            return (
              <button key={m.key} onClick={() => setMode(m.key)} style={{
                padding: "9px 22px", borderRadius: 999, cursor: "pointer",
                border: `1.5px solid ${on ? m.color : "rgba(255,255,255,0.12)"}`,
                background: on ? `${m.color}18` : "transparent",
                color: on ? m.color : "rgba(255,255,255,0.45)",
                fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700,
                fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase",
                transition: "all 0.25s ease",
              }}>
                {fr ? m.fr : m.en}
              </button>
            );
          })}
        </div>

        {/* timer + info */}
        <div className="t16-grid">

          {/* circle */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
            <div style={{ position: "relative", width: 220, height: 220 }}>
              <svg width="220" height="220" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
                <circle
                  cx="60" cy="60" r={R} fill="none"
                  stroke={accent} strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={CIRC} strokeDashoffset={dashoffset}
                  style={{ transition: running ? `stroke-dashoffset 0.9s linear, stroke 0.3s ease` : "stroke 0.3s ease" }}
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 56, lineHeight: 1, color: expired ? RED : "#fff", transition: "color 0.3s ease" }}>
                  {time}
                </span>
                <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginTop: 6 }}>
                  sec
                </span>
              </div>
            </div>

            {/* controls */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
              {expired ? (
                <>
                  <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 14, color: RED, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {fr ? "Retrait !" : "Out!"}
                  </span>
                  <button onClick={restart} style={btnStyle(LIME)}>
                    {fr ? "Rejouer" : "Replay"}
                  </button>
                </>
              ) : running ? (
                <>
                  <button onClick={() => setRunning(false)} style={btnStyle("rgba(255,255,255,0.4)")}>Pause</button>
                  <button onClick={() => { setRunning(false); setTime(TOTAL); }} style={btnStyle("rgba(255,255,255,0.18)")}>Reset</button>
                </>
              ) : (
                <button onClick={() => setRunning(true)} style={btnStyle(accent)}>
                  {time === TOTAL ? (fr ? "Démarrer" : "Start") : (fr ? "Reprendre" : "Resume")}
                </button>
              )}
            </div>
          </div>

          {/* info cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "jeu" ? (
              <>
                <Card color={LIME} label={fr ? "Règle" : "Rule"} title={fr ? "16 secondes pour marquer" : "16 seconds to score"}>
                  {fr ? "L'équipe offensive dispose de 16 secondes par séquence pour traverser le terrain et marquer dans la zone de but." : "The offensive team has 16 seconds per sequence to cross the field and score in the end zone."}
                </Card>
                <Card color={RED} label={fr ? "Temps écoulé" : "Time expired"} title={fr ? "Retrait automatique" : "Automatic out"}>
                  {fr ? "Si le chrono atteint zéro sans score, la défense obtient un retrait. Après 3 retraits : transition." : "If the clock hits zero without a score, the defense gets an out. After 3 outs: transition."}
                </Card>
                <Card color={CYAN} label={fr ? "Départ immédiat" : "Immediate start"} title={fr ? "Pas de pause entre les séquences" : "No break between sequences"}>
                  {fr ? "Le chrono repart à 16 dès la fin de la séquence précédente. Les joueurs doivent se dépêcher d'entrer en jeu — il n'y a pas d'attente." : "The clock restarts at 16 the moment the previous sequence ends. Players must rush onto the field — there is no wait."}
                </Card>
                <Card color={AMBER} label={fr ? "Interception" : "Interception"} title={fr ? "Chrono suspendu pour la séquence" : "Clock frozen for the sequence"}>
                  {fr ? "Dès qu'une interception survient, le chrono s'arrête et reste figé jusqu'à la fin de la séquence — même si une deuxième interception se produit ensuite." : "As soon as an interception occurs, the clock stops and stays frozen until the end of the sequence — even if a second interception follows."}
                </Card>
              </>
            ) : (
              <>
                <Card color={CYAN} label={fr ? "Transition" : "Transition"} title={fr ? "Chrono à l'arrêt" : "Clock not running"}>
                  {fr ? "Pendant la transition, le chrono n'est pas en fonction. Les joueurs pivotent librement sans contrainte de temps." : "During the transition itself, the clock is not running. Players rotate freely without any time constraint."}
                </Card>
                <Card color={LIME} label={fr ? "Déclencheur" : "Trigger"} title={fr ? "La défense entre sur le terrain" : "Defense enters the field"}>
                  {fr ? "Le chrono de 16 secondes se déclenche uniquement lorsque la défense entre sur le terrain lors de la transition. C'est ce moment qui lance la séquence." : "The 16-second clock only starts when the defense steps onto the field during the transition. That moment triggers the next sequence."}
                </Card>
                <Card color={RED} label={fr ? "Urgence défensive" : "Defensive urgency"} title={fr ? "Entrer vite pour ne pas perdre du temps" : "Enter fast to avoid losing time"}>
                  {fr ? "Plus la défense tarde à entrer, moins il reste de temps à l'attaque. Chaque seconde de retard est un avantage offensif direct." : "The longer the defense takes to enter, the less time the offense has. Every second of delay is a direct offensive advantage."}
                </Card>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .t16-grid { display: grid; grid-template-columns: auto 1fr; gap: clamp(32px,5vw,72px); align-items: center; }
        @media (max-width: 720px) {
          .t16-grid { grid-template-columns: 1fr; }
          .t16-grid > div:first-child { justify-self: center; }
        }
      `}</style>
    </section>
  );
}
