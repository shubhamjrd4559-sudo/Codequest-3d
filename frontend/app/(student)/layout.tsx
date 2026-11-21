import React from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { MobileNav } from "@/components/ui/MobileNav";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] bg-[#070814] text-slate-100 flex flex-col md:flex-row items-start p-3 md:p-4 gap-4 relative overflow-x-hidden">
      {/* Background Ambient Nebula Glows */}
      <div className="fixed top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-purple-700/15 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-cyan-600/10 blur-[130px] pointer-events-none -z-10" />
      <div className="fixed top-[40%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-pink-600/10 blur-[140px] pointer-events-none -z-10" />

      {/* Desktop Sticky Sidebar */}
      <div className="hidden md:block sticky top-4 h-[calc(100dvh-2rem)] shrink-0 self-start">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="min-h-0 min-w-0 flex-1 pb-24 md:pb-2">
        {children}
      </main>

      {/* Mobile Fixed Bottom Dock */}
      <MobileNav />
    </div>
  );
}
