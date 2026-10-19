import { ArrowUpRight, Clock3, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import Link from "next/link";

import { SocialIconButton } from "@/components/brand-icons";
import { reputation } from "@/data/reputation";
import { DISPLAY_PHONE } from "@/data/site-content";
import { servicePages } from "@/data/services";
import { buildQuickQuoteMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=ASI%20Cargas%20e%20Mudan%C3%A7as%20Petrolina%20PE";
const GOOGLE_MAPS_EMBED_URL = "https://www.google.com/maps?q=ASI%20Cargas%20e%20Mudan%C3%A7as%20Petrolina%20PE&output=embed";

const linkClass = "group mt-3 flex w-fit items-center gap-1.5 text-sm text-white/62 transition-colors hover:text-[#ffc107]";

export function SiteFooter() {
  const whatsapp = buildWhatsAppUrl(buildQuickQuoteMessage("footer", { page: "home" }));
  return (
    <footer className="site-footer relative isolate overflow-hidden bg-[#050d24] pb-10 pt-16 text-white">
      <div className="mx-auto w-full max-w-[75rem] px-4 sm:px-6">
        <div className="footer-cta relative overflow-hidden rounded-[1.2rem] border border-white/12 p-7 sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_auto] lg:items-center">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ffc107]">Próximo passo</span>
              <h2 className="type-display-sm mt-3 max-w-[38rem] font-sans">Vamos planejar a sua mudança?</h2>
              <p className="mt-3 max-w-[36rem] text-sm leading-6 text-white/66">Mande origem, destino e fotos pelo WhatsApp. O Sr. Alexandre responde com as opções de orçamento.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="fluid-press inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-[#25d366] px-7 text-sm font-black text-[#07142f] hover:bg-[#47dd7c]"><MessageCircle className="size-5" aria-hidden="true" /> Falar no WhatsApp</a>
              <a href="tel:+5587981703225" className="fluid-press inline-flex min-h-14 items-center justify-center gap-2 rounded-md border border-white/20 px-7 text-sm font-extrabold text-white hover:border-[#ffc107] hover:text-[#ffc107]"><Phone className="size-4" aria-hidden="true" /> {DISPLAY_PHONE}</a>
            </div>
          </div>
        </div>

        <div className="grid gap-10 border-b border-white/10 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <strong className="text-xl font-black uppercase leading-tight tracking-[-0.01em]">ASI — Alexandre<br /><span className="text-white/70">Soluções Integradas</span></strong>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/58">Mudanças, fretes e cargas saindo de Petrolina e Juazeiro para o Nordeste, Brasília, São Paulo e todo o Brasil sob agenda.</p>
            <div className="mt-6 flex gap-2">
              <SocialIconButton brand="instagram" href="/redes?canal=instagram&origem=footer_home" label="Instagram da ASI" testId="footer-instagram" />
              <SocialIconButton brand="facebook" href="/redes?canal=facebook&origem=footer_home" label="Facebook da ASI" testId="footer-facebook" />
              <SocialIconButton brand="whatsapp" href={whatsapp} label="WhatsApp da ASI" testId="footer-whatsapp" />
            </div>
          </div>
          <div><FooterTitle>Serviços</FooterTitle>{servicePages.slice(0, 5).map((item) => <Link key={item.slug} href={`/${item.slug}`} className={linkClass}>{item.serviceType}</Link>)}</div>
          <div><FooterTitle>Rotas</FooterTitle><Link href="/mudanca-interestadual" className={linkClass}>São Paulo e Brasília</Link><Link href="/mudanca-interestadual" className={linkClass}>Capitais do Nordeste</Link><Link href="/rotas" className={linkClass}>Petrolina ↔ Juazeiro</Link><Link href="/rotas-vale-do-sao-francisco" className={linkClass}>Vale do São Francisco</Link></div>
          <div><FooterTitle>Contato</FooterTitle><a href="tel:+5587981703225" className={linkClass}>{DISPLAY_PHONE}</a><a href={whatsapp} target="_blank" rel="noopener noreferrer" className={linkClass}>WhatsApp <ArrowUpRight className="size-3.5 opacity-0 transition group-hover:opacity-100" aria-hidden="true" /></a><a href="https://www.linkedin.com/in/jos%C3%A9-alexandre-rodrigues-a005bb132/" target="_blank" rel="noopener noreferrer" className={linkClass}>LinkedIn <ArrowUpRight className="size-3.5 opacity-0 transition group-hover:opacity-100" aria-hidden="true" /></a><Link href="/orçamento" className={linkClass}>Orçamento completo</Link></div>
        </div>

        <section data-testid="footer-location" aria-labelledby="footer-location-title" className="grid gap-6 border-b border-white/10 py-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch lg:gap-10">
          <div data-testid="footer-location-info" className="flex flex-col justify-center">
            <h2 id="footer-location-title" className="font-mono text-xs font-black uppercase tracking-[0.16em] text-[#ffc107]">Base operacional</h2>
            <p className="mt-3 max-w-md text-base font-bold leading-7 text-white">Petrolina, PE — de onde saem as rotas para todo o Brasil.</p>
            <ul className="mt-5 grid gap-3 text-sm text-white/72">
              <li className="flex items-center gap-3"><Clock3 className="size-4 text-[#ffc107]" aria-hidden="true" />Todos os dias, das 06h às 22h</li>
              <li className="flex items-center gap-3"><MapPin className="size-4 text-[#ffc107]" aria-hidden="true" />Nordeste · Brasília · São Paulo</li>
              <li className="flex items-center gap-3"><MessageCircle className="size-4 text-[#ffc107]" aria-hidden="true" />WhatsApp direto com o dono</li>
            </ul>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" aria-label="Abrir localização da ASI no Google Maps" className="fluid-press mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-[#ffc107]/50 px-5 text-sm font-bold text-[#ffdd6b] hover:border-[#ffc107] hover:bg-[#ffc107] hover:text-[#07142f]">Como chegar no Google Maps <ArrowUpRight className="size-4" aria-hidden="true" /></a>
          </div>
          <figure data-testid="footer-map-frame" className="footer-map relative h-[220px] overflow-hidden rounded-[1rem] border border-white/14 bg-[#0a1230] shadow-[0_30px_80px_rgba(0,0,0,.4)] lg:h-[260px]">
            <iframe
              title="Google Maps - ASI Cargas e Mudanças em Petrolina"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={GOOGLE_MAPS_EMBED_URL}
              className="h-full w-full border-0"
            />
            <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-[#07142f]/88 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur"><span className="size-2 rounded-full bg-[#ffc107]" aria-hidden="true" />ASI · Petrolina, PE</span>
            <figcaption className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#0a1230] shadow-lg"><Star className="size-3.5 fill-[#ffc107] text-[#ffc107]" aria-hidden="true" />{reputation.rating} · {reputation.totalReviews} avaliações</figcaption>
          </figure>
        </section>

        <div className="grid gap-6 border-b border-white/10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <Trust value={reputation.rating} label={`Google · ${reputation.totalReviews} avaliações`} />
          <Trust value="2024" label="ASI fundada em Petrolina" />
          <Trust value="06h–22h" label="Atendimento todos os dias" />
          <Trust value="NE · DF · SP" label="Rotas sob agenda" />
        </div>
        <div className="flex flex-col gap-2 pt-8 text-xs text-white/40 sm:flex-row sm:justify-between"><span>© 2026 Alexandre Soluções Integradas · Petrolina, PE</span><span>Site por PageForce</span></div>
      </div>
    </footer>
  );
}

function FooterTitle({ children }: Readonly<{ children: React.ReactNode }>) { return <h2 className="font-mono text-xs font-black uppercase tracking-[0.16em] text-[#ffc107]">{children}</h2>; }
function Trust({ value, label }: Readonly<{ value: string; label: string }>) { return <div className="border-l-2 border-[#ffc107]/60 pl-4"><b className="block text-3xl font-black tracking-[-0.03em] text-white">{value}</b><small className="mt-1 block text-sm text-white/50">{label}</small></div>; }
