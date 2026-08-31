import Link from "next/link";

import { DISPLAY_PHONE } from "@/data/site-content";
import { servicePages } from "@/data/services";
import { buildQuickQuoteMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=ASI%20Cargas%20e%20Mudan%C3%A7as%20Petrolina%20PE";
const GOOGLE_MAPS_EMBED_URL = "https://www.google.com/maps?q=ASI%20Cargas%20e%20Mudan%C3%A7as%20Petrolina%20PE&output=embed";

export function SiteFooter() {
  const whatsapp = buildWhatsAppUrl(buildQuickQuoteMessage("footer", { page: "home" }));
  return (
    <footer className="bg-[#06102a] py-16 text-white">
      <div className="mx-auto w-full max-w-[75rem] px-4 sm:px-6">
        <div className="grid gap-10 border-b border-white/12 pb-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div><strong className="text-xl font-black uppercase tracking-[-0.02em]">ASI — Alexandre<br />Soluções Integradas</strong><p className="mt-5 max-w-md text-sm leading-7 text-white/54">Mudanças, fretes e cargas em Petrolina, Juazeiro e rotas nacionais sob agenda. Atendimento direto com o Sr. Alexandre.</p><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center rounded-md bg-[#25d366] px-5 text-sm font-black text-[#07142f]">Falar comigo →</a></div>
          <div><FooterTitle>Serviços</FooterTitle>{servicePages.slice(0, 5).map((item) => <Link key={item.slug} href={`/${item.slug}`} className="mt-3 block text-sm text-white/58 hover:text-[#ffc107]">{item.serviceType}</Link>)}</div>
          <div><FooterTitle>Rotas</FooterTitle><Link href="/rotas" className="mt-3 block text-sm text-white/58 hover:text-[#ffc107]">Petrolina ↔ Juazeiro</Link><Link href="/rotas-vale-do-sao-francisco" className="mt-3 block text-sm text-white/58 hover:text-[#ffc107]">Vale do São Francisco</Link><Link href="/rotas" className="mt-3 block text-sm text-white/58 hover:text-[#ffc107]">Rotas interestaduais</Link></div>
          <div><FooterTitle>Contato</FooterTitle><a href="tel:+5587981703225" className="mt-3 block text-sm text-white/58 hover:text-[#ffc107]">{DISPLAY_PHONE}</a><a href="/redes?canal=instagram&origem=footer_home" target="_blank" rel="noopener noreferrer" className="mt-3 block text-sm text-white/58 hover:text-[#ffc107]">Instagram</a><a href="/redes?canal=facebook&origem=footer_home" target="_blank" rel="noopener noreferrer" className="mt-3 block text-sm text-white/58 hover:text-[#ffc107]">Facebook</a><a href="https://www.linkedin.com/in/jos%C3%A9-alexandre-rodrigues-a005bb132/" target="_blank" rel="noopener noreferrer" className="mt-3 block text-sm text-white/58 hover:text-[#ffc107]">LinkedIn</a></div>
        </div>
        <section data-testid="footer-location" aria-labelledby="footer-location-title" className="grid gap-6 border-b border-white/12 py-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-stretch">
          <div data-testid="footer-location-info" className="flex flex-col justify-center">
            <h2 id="footer-location-title" className="font-mono text-xs font-black uppercase tracking-[0.16em] text-[#ffc107]">Base operacional</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/68">Petrolina, PE · atendimento em Petrolina, Juazeiro e rotas sob agenda confirmada com o Sr. Alexandre.</p>
            <ul className="mt-5 border-t border-white/12 text-xs">
              <LocationMeta label="Horário">Todos os dias · 06h às 22h</LocationMeta>
              <LocationMeta label="Cobertura">PE · BA · CE sob agenda</LocationMeta>
              <LocationMeta label="Atendimento">WhatsApp direto com o dono</LocationMeta>
            </ul>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" aria-label="Abrir localização da ASI no Google Maps" className="fluid-action mt-5 inline-flex w-fit items-center gap-2 border-b border-[#ffc107]/45 pb-1 font-mono text-xs font-bold uppercase tracking-[0.1em] text-[#ffc107] hover:border-[#ffd64a] hover:text-[#ffd64a]">Abrir localização no Google Maps →</a>
          </div>
          <figure data-testid="footer-map-frame" className="relative h-[220px] overflow-hidden rounded-[0.8rem] border border-white/14 bg-[#0a1230] shadow-[0_24px_60px_rgba(0,0,0,.28)] lg:h-[260px]">
            <iframe
              title="Google Maps - ASI Cargas e Mudanças em Petrolina"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={GOOGLE_MAPS_EMBED_URL}
              className="h-full w-full border-0 grayscale contrast-125 brightness-75 saturate-50"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,20,47,.32)_0%,transparent_25%,transparent_65%,rgba(7,20,47,.9)_100%)]" />
            <span className="pointer-events-none absolute left-3 top-3 rounded-sm bg-[#ffc107] px-3 py-1.5 font-mono text-[0.65rem] font-black uppercase tracking-[0.14em] text-[#07142f] shadow-lg">Petrolina · PE</span>
            <figcaption className="pointer-events-none absolute inset-x-3 bottom-3 border-l-2 border-[#ffc107] bg-[#07142f]/82 px-3 py-2 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/84 backdrop-blur-sm">Base operacional · ASI Cargas &amp; Mudanças</figcaption>
          </figure>
        </section>
        <div className="grid gap-4 border-b border-white/12 py-8 sm:grid-cols-2 lg:grid-cols-4"><Trust value="5,0" label="Google · 131 avaliações" /><Trust value="2024" label="ASI fundada em Petrolina" /><Trust value="06h—22h" label="Atendimento todos os dias" /><Trust value="PE · BA · CE" label="Rotas sob agenda" /></div>
        <div className="flex flex-col gap-2 pt-8 text-xs text-white/34 sm:flex-row sm:justify-between"><span>© 2026 Alexandre Soluções Integradas · Petrolina, PE</span><span>Site por PageForce</span></div>
      </div>
    </footer>
  );
}

function FooterTitle({ children }: Readonly<{ children: React.ReactNode }>) { return <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[#ffc107]">{children}</h2>; }
function Trust({ value, label }: Readonly<{ value: string; label: string }>) { return <div><b className="block text-xl text-white">{value}</b><small className="mt-1 block text-white/45">{label}</small></div>; }
function LocationMeta({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) { return <li className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-white/10 py-2.5"><b className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[#ffc107]">{label}</b><span className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-white/78">{children}</span></li>; }
