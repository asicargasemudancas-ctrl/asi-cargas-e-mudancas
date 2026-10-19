"use client";

import { MessageCircle } from "lucide-react";

import { useScrollState } from "@/hooks/use-window-state";

const readVisible = () => {
  const nearBottom = window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 520;
  return window.scrollY > window.innerHeight * 0.85 && !nearBottom;
};

export function StickyWhatsApp({ href }: Readonly<{ href: string }>) {
  const visible = useScrollState(readVisible, false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="sticky-whatsapp"
      data-visible={visible ? "true" : "false"}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className="sticky-whatsapp fixed inset-x-4 bottom-4 z-50 flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#25d366] px-6 text-sm font-black text-[#07142f] shadow-[0_18px_40px_rgba(4,12,32,.35)] lg:hidden"
    >
      <MessageCircle className="size-5" aria-hidden="true" /> Pedir orçamento pelo WhatsApp
    </a>
  );
}
