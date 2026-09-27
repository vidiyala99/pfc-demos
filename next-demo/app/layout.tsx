import type { ReactNode } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata = {
  title: "Partnerships For Change | Stories that move real change",
  description:
    "Partnerships For Change is a San Francisco 501(c)(3) that brings issue-based films, books and on-the-ground projects under one roof, with fiscal sponsorship as the engine.",
  // Demo only: keep it out of search results so it is never mistaken for PFC's real website.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href={`${BASE}/design/fonts/anton-400.woff2`} as="font" type="font/woff2" crossOrigin="" />
        <link rel="stylesheet" href={`${BASE}/design/pfc.css`} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
