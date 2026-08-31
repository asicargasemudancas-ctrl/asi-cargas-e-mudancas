import Link from "next/link";

import { SocialIconButton } from "@/components/brand-icons";
import { buildQuickQuoteMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

const socialBridge = (channel: "instagram" | "facebook") =>
  `/redes?canal=${channel}&origem=header_home`;

export function SiteHeader() {
  const whatsappUrl = buildWhatsAppUrl(
    buildQuickQuoteMessage("header_home", { page: "home" }),
  );

  return (
    <header className="glass-header absolute inset-x-0 top-0 z-40 text-white">
      <div className="mx-auto flex min-h-20 w-full max-w-[75rem] items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="mr-auto min-w-0 leading-none" aria-label="ASI Cargas e Mudanças - início">
          <strong className="block truncate text-base font-extrabold uppercase tracking-[0.045em]">ASI — Alexandre</strong>
          <span className="mt-1 block truncate text-xs font-medium uppercase tracking-[0.16em] text-white/62">Soluções Integradas</span>
        </Link>
        <nav aria-label="Navegação principal" className="hidden items-center gap-6 text-sm font-semibold text-white/74 lg:flex">
          <Link href="/#servicos" className="hover:text-[#ffc107]">Serviços</Link>
          <Link href="/#rotas" className="hover:text-[#ffc107]">Rotas</Link>
          <Link href="/#avaliacoes" className="hover:text-[#ffc107]">Avaliações</Link>
          <Link href="/#contato" className="hover:text-[#ffc107]">Contato</Link>
        </nav>
        <div className="flex gap-2" aria-label="Canais rápidos">
          <SocialIconButton brand="instagram" href={socialBridge("instagram")} label="Abrir Instagram da ASI" testId="social-instagram" />
          <SocialIconButton brand="facebook" href={socialBridge("facebook")} label="Abrir Facebook da ASI" testId="social-facebook" />
          <SocialIconButton brand="whatsapp" href={whatsappUrl} label="Falar com a ASI pelo WhatsApp" testId="social-whatsapp" />
        </div>
      </div>
    </header>
  );
}
