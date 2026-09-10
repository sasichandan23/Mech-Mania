import type { Metadata, Viewport } from "next";
import "./globals.css";
import { EVENT_CONFIG } from "@/config/event";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: `${EVENT_CONFIG.EVENT_NAME} | ${EVENT_CONFIG.TAGLINE}`,
  description: `${EVENT_CONFIG.SUBTITLE} organized by ${EVENT_CONFIG.CLUB_NAME}, ${EVENT_CONFIG.COLLEGE_NAME}.`,
  keywords: ["Mechanical Engineering", "Quiz Game", "MECH-MANIA", "CAD", "Thermodynamics", "Robotics", "Automobile"],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: EVENT_CONFIG.EVENT_NAME,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a0c10",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-mech-dark text-slate-100 flex flex-col antialiased selection:bg-amber-500 selection:text-black">
        <Navbar />
        <main className="flex-1 flex flex-col relative z-10">
          {children}
        </main>
        <footer className="border-t border-mech-border/60 bg-mech-dark/80 backdrop-blur py-4 text-center text-xs text-slate-500 z-10">
          <p>
            ⚙️ {EVENT_CONFIG.EVENT_NAME} • Organized by {EVENT_CONFIG.CLUB_NAME} • {EVENT_CONFIG.COLLEGE_NAME}
          </p>
        </footer>
      </body>
    </html>
  );
}
