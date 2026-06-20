import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
});

const dm = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PurInstinct — Le sport à l'état pur",
  description:
    "PurInstinct est un sport révolutionnaire qui combine vitesse, habileté et intelligence de jeu. 2 équipes, pur instinct.",
  keywords: ["PurInstinct", "sport", "athlétique", "Québec", "jeu", "championnat"],
  openGraph: {
    title: "PurInstinct — Le sport à l'état pur",
    description:
      "Un jeu révolutionnaire qui combine vitesse, habileté et intelligence. Découvrez PurInstinct.",
    url: "https://purinstinct.com",
    siteName: "PurInstinct",
    locale: "fr_CA",
    type: "website",
    images: [
      {
        url: "https://purinstinct.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PurInstinct — Le sport à l'état pur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@purinstincthq",
    title: "PurInstinct — Le sport à l'état pur",
    description: "Un jeu révolutionnaire qui combine vitesse, habileté et intelligence.",
  },
  alternates: { canonical: "https://purinstinct.com" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${barlow.variable} ${dm.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
