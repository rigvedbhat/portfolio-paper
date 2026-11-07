import type { Metadata } from "next";
import "./globals.css";
import { YouTubeVinylPlayer } from "@/components/YouTubeVinylPlayer";

export const metadata: Metadata = {
  title: "Wireframe Portfolio — Design & Development",
  description: "A faithful recreation of the Wireframe portfolio template by Huehaus Studio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('portfolio-theme');
                  var theme = saved || 'dark';
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-wire-bg text-wire-black font-sans antialiased selection:bg-wire-yellow selection:text-[#111111] min-h-screen">
        {children}
        <YouTubeVinylPlayer videoId="n61ULEU7CO0" accent="#ff6a00" autoplay={false} />
      </body>
    </html>
  );
}
