import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";

export const metadata: Metadata = {
  title: "Rigved Bhat - A Cinematic Portfolio",
  description:
    "An immersive interactive world containing the work of Rigved Bhat: AI products, research systems, and thoughtful engineering.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Script id="scroll-guard" strategy="beforeInteractive">
          {`if(typeof window!=='undefined'){history.scrollRestoration='manual';window.scrollTo(0,0);}`}
        </Script>
        <Script src="https://platform.linkedin.com/in.js" type="text/javascript" strategy="lazyOnload" />
        {children}
      </body>
    </html>
  );
}