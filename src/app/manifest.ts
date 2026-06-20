import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PurInstinct",
    short_name: "PurInstinct",
    description: "PurInstinct — Le sport à l'état pur.",
    start_url: "/",
    display: "standalone",
    background_color: "#06070f",
    theme_color: "#84cc16",
    icons: [
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
