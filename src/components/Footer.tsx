"use client";
import Image from "next/image";
import { useLang } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer
      style={{
        background: "#0d1117",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "48px 24px 32px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 40,
        }}
      >
        {/* Brand */}
        <div style={{ maxWidth: 300 }}>
          <Image
            src="/logo-full.png"
            alt="PurInstinct"
            width={108}
            height={112}
            style={{ width: 100, height: "auto", display: "block", marginBottom: 16 }}
          />
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, lineHeight: 1.6 }}>
            {t.footer.tagline}
          </p>
        </div>

        {/* Links */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {t.footer.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                color: "rgba(255,255,255,0.45)",
                textDecoration: "none",
                fontSize: 14,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Social */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {[
            { label: "Instagram", href: "https://instagram.com/purinstinct", icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
              </svg>
            )},
            { label: "YouTube", href: "https://youtube.com/@PurInstinct", icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="4" />
                <path d="M10 9l6 3-6 3V9z" fill="currentColor" stroke="none" />
              </svg>
            )},
            { label: "Twitter", href: "https://twitter.com/purinstincthq", icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            )},
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(132,204,22,0.12)";
                el.style.color = "#84cc16";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(255,255,255,0.05)";
                el.style.color = "rgba(255,255,255,0.5)";
              }}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          paddingTop: 24,
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>{t.footer.copy}</span>
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 12 }}>
          Québec, Canada
        </span>
      </div>
    </footer>
  );
}
