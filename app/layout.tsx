import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="bg-wire-bg text-wire-black font-sans antialiased selection:bg-wire-yellow selection:text-wire-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
