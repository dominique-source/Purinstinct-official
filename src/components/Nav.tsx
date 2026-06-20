"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/lib/i18n";

export default function Nav() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "background 0.3s ease, border-color 0.3s ease",
        background: scrolled ? "rgba(6,7,15,0.92)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 900,
              fontSize: 22,
              letterSpacing: "0.02em",
              color: "#fff",
            }}
          >
            Pur<span style={{ color: "#84cc16" }}>Instinct</span>
          </span>
        </a>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden-mobile">
          {[
            { label: t.nav.learn, href: "#how" },
                        { label: t.nav.shop, href: "https://purinstinct.com/boutique/" },
            { label: t.nav.contact, href: "https://purinstinct.com/contact-us-2/" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                color: "rgba(255,255,255,0.65)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#fff")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.65)")}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Lang toggle */}
          <button
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 6,
              color: "rgba(255,255,255,0.7)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              padding: "5px 10px",
              cursor: "pointer",
              transition: "background 0.2s",
              fontFamily: "var(--font-barlow), sans-serif",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}
          >
            {lang === "fr" ? "EN" : "FR"}
          </button>

          <a href="#cta" className="btn-primary hidden-mobile" style={{ fontSize: 13, padding: "10px 20px" }}>
            {t.nav.cta}
          </a>

          {/* Hamburger */}
          <button
            className="show-mobile"
            onClick={() => setOpen(!open)}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
            aria-label="Menu"
          >
            <span style={{ display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2, transition: "transform 0.2s", transform: open ? "rotate(45deg) translate(5px,5px)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2, opacity: open ? 0 : 1, transition: "opacity 0.2s" }} />
            <span style={{ display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2, transition: "transform 0.2s", transform: open ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            background: "rgba(6,7,15,0.97)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            padding: "20px 24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {[
            { label: t.nav.learn, href: "#how" },
                        { label: t.nav.shop, href: "https://purinstinct.com/boutique/" },
            { label: t.nav.contact, href: "https://purinstinct.com/contact-us-2/" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                color: "rgba(255,255,255,0.8)",
                textDecoration: "none",
                fontSize: 18,
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                padding: "12px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {link.label}
            </a>
          ))}
          <a href="#cta" className="btn-primary" style={{ marginTop: 16, textAlign: "center", justifyContent: "center" }} onClick={() => setOpen(false)}>
            {t.nav.cta}
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
