import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PWARegister } from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "SYSTEM: ARCHITECT",
  description: "Solo-inspired System character manager.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png"
  }
};

export const viewport: Viewport = {
  themeColor: "#2ee4ff"
};


export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-systemBg text-slate-100">
        <PWARegister />
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1c1e3a,_#05080f)] text-slate-100">
          <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 animate-pulse rounded-full bg-systemAccent" />
                <span className="text-sm font-semibold tracking-widest text-systemAccentSoft">
                  SYSTEM: ARCHITECT v0.5.0
                </span>
              </div>
              <nav className="flex gap-3 text-xs uppercase tracking-wide text-slate-300">
                <a href="/" className="hover:text-systemAccent">
                  Dashboard
                </a>
                <a href="/characters" className="hover:text-systemAccent">
                  Characters
                </a>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
