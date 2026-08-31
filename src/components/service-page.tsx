import { ArrowRight, BadgeCheck, Box, Clock3, MapPin, Route, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { LocalPage } from "@/data/local-pages";
import { localPages } from "@/data/local-pages";
import { reputation } from "@/data/reputation";
import type { ServicePage as ServicePageData } from "@/data/services";
import { buildQuickQuoteMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

type RoutedPage = ServicePageData | LocalPage;

function whatsapp(page: RoutedPage, source: string) {
  const route = page.kind === "city" ? page.route : page.headline;
  return buildWhatsAppUrl(buildQuickQuoteMessage(source, {
    page: page.slug,
    service: page.serviceType,
    route,
  }));
}

export function ServicePageView({ page }: Readonly<{ page: RoutedPage }>) {
  const city = page.kind === "city" ? `${page.city}, ${page.uf}` : null;

  return (
    <main className="bg-[#f4f5f8]">
      <section className="relative isolate min-h-[46rem] overflow-hidden bg-[#07142f] pb-16 pt-36 text-white lg:min-h-[42rem]">
        <Image src={page.image} alt={page.imageAlt} fill priority sizes="100vw" className="-z-20 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,14,38,.98)_0%,rgba(6,14,38,.89)_48%,rgba(6,14,38,.42)_100%)]" />
        <div className="mx-auto flex w-full max-w-[75rem] flex-col px-4 sm:px-6">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#ffc107]">{page.eyebrow}</span>
          <h1 className="type-hero mt-5 max-w-[53rem] font-sans">{page.headline}</h1>
          <p className="mt-7 max-w-[42rem] text-base leading-8 text-white/68 sm:text-lg">{page.lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={whatsapp(page, `${page.slug}_hero`)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-md bg-[#25d366] px-6 text-sm font-black text-[#07142f]">Pedir orçamento no WhatsApp <ArrowRight className="size-5" aria-hidden="true" /></a>
            <Link href={`/orçamento?servico=${encodeURIComponent(page.serviceType)}${city ? `&rota=${encodeURIComponent(city)}` : ""}`} className="glass-control inline-flex min-h-14 items-center justify-center rounded-md px-6 text-sm font-extrabold text-white">Montar pedido completo</Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-5 text-xs font-bold uppercase tracking-[0.1em] text-white/58"><span>Agenda confirmada</span><span>5,0 no Google</span><span>Atendimento 06h–22h</span></div>
        </div>
      </section>

      <section className="bg-[#ffc107]">
        <div className="mx-auto grid w-full max-w-[75rem] divide-y divide-[#0a1230]/14 px-4 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-6 lg:grid-cols-4">
          {[{ icon: Route, label: "Rota avaliada" }, { icon: Box, label: "Volume considerado" }, { icon: ShieldCheck, label: "Acesso conferido" }, { icon: Clock3, label: "Agenda combinada" }].map(({ icon: Icon, label }) => <div key={label} className="flex min-h-20 items-center gap-3 px-4 text-sm font-black text-[#0a1230]"><Icon className="size-5" aria-hidden="true" />{label}</div>)}
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto grid w-full max-w-[75rem] gap-10 px-4 sm:px-6 lg:grid-cols-[0.76fr_1.24fr] lg:gap-16">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#a66e00]">O que entra na avaliação</span>
            <h2 className="type-display mt-5 font-sans text-[#0a1230]">O combinado vem antes do caminhão.</h2>
            <p className="mt-6 text-base leading-8 text-[#5e687b]">A ASI confirma rota, volume, acesso, data, necessidade de embalagem e ajudantes. O atendimento é humano e nenhuma rota é prometida automaticamente.</p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[0.8rem] border border-[#d4d9e2] bg-[#d4d9e2] sm:grid-cols-2">
            {[{ icon: MapPin, title: "Origem e destino", text: "Cidade, bairro e referências de acesso." }, { icon: Truck, title: "Volume real", text: "Itens grandes, caixas e necessidade de equipe." }, { icon: BadgeCheck, title: "Serviços extras", text: "Embalagem, desmontagem e montagem sob avaliação." }, { icon: Clock3, title: "Data e agenda", text: "Flexibilidade pode facilitar o encaixe da rota." }].map(({ icon: Icon, title, text }) => <article key={title} className="bg-white p-7"><Icon className="size-6 text-[#a66e00]" aria-hidden="true" /><h3 className="mt-5 text-xl font-black text-[#0a1230]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#5e687b]">{text}</p></article>)}
          </div>
        </div>
      </section>

      {page.kind === "city" && <CityEvidence page={page} />}
      {page.kind === "hub" && <RegionalHub />}

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid w-full max-w-[75rem] gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center">
          <figure className="relative aspect-[16/10] overflow-hidden rounded-[0.8rem] bg-[#0a1230]"><Image src="/assets/context-pack-asi/03-bau-aberto-organizado-optimized.jpg" alt="Baú da ASI organizado com móveis e caixas protegidos" fill sizes="50vw" className="object-cover" /></figure>
          <div className="lg:p-8"><span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#a66e00]">Operação real</span><h2 className="type-display-sm mt-5 font-sans text-[#0a1230]">Proteção proporcional ao que será transportado.</h2><p className="mt-6 text-base leading-7 text-[#5e687b]">Mantas, amarração, plástico bolha e organização do baú entram conforme os itens e a rota.</p><ul className="mt-7 grid gap-3">{["Frota ASI identificada", "Atendimento direto com o Sr. Alexandre", `${reputation.rating} no Google · ${reputation.totalReviews} avaliações públicas`].map((item) => <li key={item} className="flex items-center gap-3 text-sm font-bold text-[#27334a]"><BadgeCheck className="size-5 text-[#a66e00]" aria-hidden="true" />{item}</li>)}</ul></div>
        </div>
      </section>

      <section className="bg-[#0b1738] py-20 text-white sm:py-24">
        <div className="mx-auto flex w-full max-w-[75rem] flex-col justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center"><div><span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#ffc107]">Próximo passo</span><h2 className="type-display mt-4 max-w-3xl font-sans">Envie rota e volume. A ASI avalia o restante.</h2></div><a href={whatsapp(page, `${page.slug}_footer`)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-md bg-[#25d366] px-7 text-sm font-black text-[#07142f]">Falar no WhatsApp <ArrowRight className="size-5" /></a></div>
      </section>
    </main>
  );
}

function CityEvidence({ page }: Readonly<{ page: Extract<LocalPage, { kind: "city" }> }>) {
  return <section className="border-y border-[#d5dae3] bg-[#e9ecf2] py-16"><div className="mx-auto grid w-full max-w-[75rem] gap-5 px-4 sm:grid-cols-3 sm:px-6"><Stat value={`${page.city} · ${page.uf}`} label="Página de cobertura local" /><Stat value={page.population} label="População de referência do conteúdo" /><Stat value={page.tier} label="Prioridade do cluster local" /><div className="sm:col-span-3 mt-3 rounded-[0.8rem] bg-white p-6"><strong className="text-[#0a1230]">Rota avaliada sob agenda</strong><p className="mt-3 text-sm leading-7 text-[#5e687b]">{page.route}.</p></div></div></section>;
}

function RegionalHub() {
  const cities = localPages.filter((item): item is Extract<LocalPage, { kind: "city" }> => item.kind === "city");
  return <section className="border-y border-[#d5dae3] bg-[#e9ecf2] py-20"><div className="mx-auto w-full max-w-[75rem] px-4 sm:px-6"><span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#a66e00]">16 cidades do cluster</span><h2 className="type-display-sm mt-4 font-sans text-[#0a1230]">Cobertura regional com páginas específicas.</h2><div className="mt-8 grid border-l border-t border-[#cbd1dc] sm:grid-cols-2 lg:grid-cols-4">{cities.map((city) => <Link key={city.slug} href={`/${city.slug}`} className="border-b border-r border-[#cbd1dc] bg-white p-5 text-sm font-black text-[#0e2f6d] hover:bg-[#ffc107]">{city.city}, {city.uf} →</Link>)}</div></div></section>;
}

function Stat({ value, label }: Readonly<{ value: string; label: string }>) { return <div className="rounded-[0.8rem] bg-white p-6"><strong className="block text-2xl font-black text-[#0a1230]">{value}</strong><span className="mt-2 block text-sm text-[#5e687b]">{label}</span></div>; }
