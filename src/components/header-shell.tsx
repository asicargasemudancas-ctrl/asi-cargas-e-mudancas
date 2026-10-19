"use client";

import { useScrollState } from "@/hooks/use-window-state";

const readScrolled = () => window.scrollY > 24;

export function HeaderShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const scrolled = useScrollState(readScrolled, false);

  return (
    <header data-scrolled={scrolled ? "true" : "false"} className="glass-header site-header fixed inset-x-0 top-0 z-40 text-white">
      {children}
    </header>
  );
}
