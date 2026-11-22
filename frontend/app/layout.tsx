import type { Metadata } from "next";
import localFont from "next/font/local";
import { MotionConfig } from "framer-motion";
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CodeQuest 3D — Master DSA Through 3D Gaming",
  description: "Level up your data structures and algorithms skills through interactive 3D mini-games, visual simulations, and gamified challenges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative min-h-[100dvh] bg-[#070814] font-sans text-slate-100 antialiased selection:bg-purple-600/40 selection:text-white`}
      >
        <div
          aria-hidden="true"
          className="app-wallpaper fixed inset-0 z-0 scale-[1.015]"
        />
        <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none bg-[#070814]/75 backdrop-blur-[3px]" />
        <div className="global-content relative z-10 min-h-[100dvh]">
          <MotionConfig reducedMotion="user">
            <AuthProvider>{children}</AuthProvider>
          </MotionConfig>
        </div>
      </body>
    </html>
  );
}
