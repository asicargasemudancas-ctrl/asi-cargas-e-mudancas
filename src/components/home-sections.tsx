import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clock3,
  MapPin,
  PackageCheck,
  Route,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { HomeQuoteForm, QuickQuoteForm } from "@/components/quote-forms";
import { FluidHeroMedia } from "@/components/fluid-hero-media";
import { Reveal } from "@/components/reveal";
import { ReviewsCarousel } from "@/components/reviews-carousel";
import { homeContent } from "@/data/site-content";
import { reputation } from "@/data/reputation";
import { reviews } from "@/data/reviews";
import { servicePages } from "@/data/services";
import { buildQuickQuoteMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

const page = "home";

function whatsapp(source: string, service = "Mudança completa") {
  return buildWhatsAppUrl(buildQuickQuoteMessage(source, { page, service }));
}

const operationCards = [
  {
    number: "01",
    title: "Baú organizado",
    description: "Caixas etiquetadas, mantas de proteção e amarração: cada item entra no lugar certo antes de pegar a estrada.",
    image: "/assets/context-pack-asi/03-bau-aberto-organizado-optimized.jpg",
    alt: "Baú aberto do caminhão ASI com caixas e móveis protegidos por mantas",
    source: "op_bau",
  },
  {
    number: "02",
    title: "Carregamento combinado",
    description: "Ajudantes, acesso e proteção entram na avaliação antes da agenda, sem improvisar no dia.",
    image: "/assets/context-pack-asi/04-equipe-mudanca-residencial-optimized.jpg",
    alt: "Equipe da ASI carregando móvel protegido em uma mudança residencial",
    source: "op_equipe",
  },
  {
    number: "03",
    title: "Embalagem com cuidado",
    description: "Plástico bolha, proteção de cantos e caixas etiquetadas entram antes do caminhão sair.",
    image: "/assets/context-pack-asi/05-embalagem-protecao-close-optimized.jpg",
    alt: "Profissional da ASI embalando item frágil com proteção",
    source: "op_embalagem",
  },
] as const;

const videoCards = [
  ["01", "Peças protegidas na caixa", "Separar e envolver antes de fechar reduz atrito no transporte.", "/assets/asi-video-protecao-caixa-poster.jpg", "/assets/asi-video-protecao-caixa.mp4"],
  ["02", "Plástico bolha em itens delicados", "Proteção aplicada peça a peça quando o item exige cuidado.", "/assets/asi-video-embalagem-loucas-poster.jpg", "/assets/asi-video-embalagem-loucas.mp4"],
  ["03", "Caixa antes de seguir", "O volume entra na conversa para definir espaço, ordem e cuidado.", "/assets/asi-video-caixa-protegida-poster.jpg", "/assets/asi-video-caixa-protegida.mp4"],
  ["04", "Cuidado repetido no detalhe", "Quando o item é frágil, a proteção entra antes do caminhão.", "/assets/asi-video-plastico-bolha-poster.jpg", "/assets/asi-video-plastico-bolha.mp4"],
] as const;

const methodSteps = [
  ["01", "Pedido entra completo", "Origem, destino, serviço, volume aproximado e telefone chegam organizados.", "site"],
  ["02", "Pedido ganha contexto", "Data, urgência e acesso ajudam a estimar tempo, embalagem, ajudantes e agenda.", "triagem"],
  ["03", "WhatsApp abre com contexto", "A mensagem leva rota, volume, etapa do funil e origem do clique.", "atendimento"],
  ["04", "Agenda e acesso alinhados", "Horário, ajudantes, embalagem, montagem e acesso são conferidos antes da saída.", "operação"],
  ["05", "Entrega acompanhada", "O combinado vai até o destino: descarga, conferência e fechamento.", "pós-venda"],
] as const;

const routeCards = [
  { tag: "Rota local", title: "Petrolina ↔ Juazeiro", detail: "Atendimento diário · mudança, frete e carga", image: "/assets/context-pack-asi/01-hero-caminhao-real-premium-optimized.jpg", alt: "Caminhão ASI em rota entre Petrolina e Juazeiro", query: "Petrolina para Juazeiro" },
  { tag: "Regional", title: "Vale do São Francisco", detail: "Cidades vizinhas · agenda confirmada antes do dia", image: "/assets/asi-fleet-brand-proof-1600x900.webp", alt: "Caminhão ASI em rota regional no Vale do São Francisco", query: "Vale do São Francisco" },
  { tag: "Interestadual", title: "Recife · Salvador · Fortaleza", detail: "Sob agenda · PE · BA · CE", image: "/assets/asi-truck-door-closed-brand-1600x900.webp", alt: "Caminhão ASI identificado pronto para rota interestadual", query: "Interestadual" },
] as const;

export function HomeHero() {
  return (
    <section id="top" className="relative isolate min-h-[56rem] overflow-hidden bg-[#07142f] pb-8 pt-32 text-white lg:min-h-[48rem] lg:pt-36">
      <FluidHeroMedia />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,14,38,.98)_0%,rgba(6,14,38,.88)_42%,rgba(6,14,38,.3)_74%,rgba(6,14,38,.55)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(6,14,38,.95)_0%,transparent_45%)]" />
      <div className="mx-auto flex w-full max-w-[75rem] flex-col px-4 sm:px-6">
        <Reveal className="max-w-[49rem]">
          <a href={reputation.googleProfileUrl} target="_blank" rel="noreferrer" className="glass-pill mb-8 inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm font-bold text-[#ffdd6b]">
            <Star className="size-4 fill-current" aria-hidden="true" />
            <span>{reputation.rating} no Google · {reputation.totalReviews} avaliações</span>
          </a>
          <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#ffcf33]">{homeContent.eyebrow}</p>
          <h1 className="type-hero max-w-[46rem] font-sans">{homeContent.headline}</h1>
          <p className="mt-7 max-w-[42rem] text-base leading-7 text-white/74 sm:text-lg sm:leading-8">{homeContent.lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={whatsapp("hero_orcamento")} target="_blank" rel="noopener noreferrer" className="fluid-action fluid-press inline-flex min-h-14 items-center justify-center gap-3 rounded-md bg-[#25d366] px-6 text-center text-sm font-black text-[#07142f] hover:bg-[#47dd7c]" aria-label="Pedir orçamento pelo WhatsApp">
              Pedir orçamento pelo WhatsApp <ArrowRight className="size-5" aria-hidden="true" />
            </a>
            <a href={whatsapp("hero_fotos")} target="_blank" rel="noopener noreferrer" className="fluid-press glass-control inline-flex min-h-14 items-center justify-center rounded-md px-6 text-center text-sm font-extrabold text-white hover:border-[#ffc107] hover:text-[#ffc107]">Mandar fotos pelo WhatsApp</a>
          </div>
          <div className="mt-9 flex max-w-[47rem] flex-wrap gap-x-5 gap-y-3 border-t border-white/15 pt-5 text-xs font-bold uppercase tracking-[0.1em] text-white/65">
            <span>Todo o Brasil sob agenda</span><span>5,0 no Google</span><span>131 avaliações públicas</span><span>06h–22h</span>
          </div>
        </Reveal>
      </div>
      <div className="relative mt-12 px-4 sm:px-6">
        <QuickQuoteForm />
      </div>
    </section>
  );
}

export function FleetProofSection() {
  return (
    <section className="bg-[#f4f5f8] py-20 sm:py-28" aria-label="Identidade visual real da ASI">
      <div className="mx-auto grid w-full max-w-[75rem] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
        <Reveal>
          <SectionLabel>02 — Assinatura visual real</SectionLabel>
          <h2 className="type-display mt-5 font-sans text-[#0a1230]">A marca que o Vale reconhece na rua.</h2>
          <p className="mt-6 max-w-[35rem] text-base leading-7 text-[#5e687b]">Não é imagem decorativa. É o caminhão do Sr. Alexandre chegando, carregando e entregando mudanças com frota identificada.</p>
          <ol className="mt-8 divide-y divide-[#dfe3eb] border-y border-[#dfe3eb]">
            {["Caminhão identificado e reconhecível", "Baú, acesso e rota conferidos", "Marca real em campo"].map((item, index) => (
              <li key={item} className="flex gap-4 py-4"><b className="font-mono text-xs text-[#a66e00]">0{index + 1}</b><span className="font-bold text-[#17213a]">{item}</span></li>
            ))}
          </ol>
        </Reveal>
        <Reveal delay={0.08}>
          <figure className="fluid-card group relative aspect-[16/10] overflow-hidden rounded-[0.8rem] bg-[#0a1230] shadow-[0_28px_90px_rgba(10,18,48,.18)]">
            <Image src="/assets/context-pack-asi/02-porta-frota-asi-optimized.jpg" alt="Porta traseira do caminhão ASI com identidade Alexandre Soluções Integradas" fill sizes="(min-width:1024px) 58vw, 100vw" className="fluid-media object-cover" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-5 pt-16 text-xs font-bold uppercase tracking-[0.12em] text-white/72">Frota ASI · Petrolina, PE</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

export function ReputationSection() {
  return (
    <section id="avaliacoes" className="bg-white py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[75rem] px-4 sm:px-6">
        <div className="mb-12 flex flex-col justify-between gap-5 border-b border-[#dfe3eb] pb-8 lg:flex-row lg:items-end">
          <Reveal>
            <SectionLabel>03 — Reputação pública</SectionLabel>
            <h2 className="type-display mt-5 max-w-[52rem] font-sans text-[#0a1230]">Confiança visível antes do primeiro contato.</h2>
          </Reveal>
          <p className="max-w-sm text-sm leading-6 text-[#5e687b]">Avaliações disponíveis no perfil público do Google do Sr. Alexandre.</p>
        </div>
        <div className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="fluid-card flex flex-col rounded-[0.8rem] bg-[#0a1230] p-7 text-white sm:p-9">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/56">Reviews on Google</span>
            <strong className="mt-7 font-sans text-[clamp(4.5rem,7vw,6rem)] font-bold leading-none tracking-[-0.065em] text-[#ffc107]">{reputation.rating}</strong>
            <span className="mt-4 text-xl tracking-[0.2em] text-[#ffc107]" aria-label="cinco estrelas">★★★★★</span>
            <span className="mt-4 text-base font-bold">{reputation.totalReviews} avaliações verificáveis</span>
            <p className="mt-4 text-sm leading-6 text-white/62">Volume de avaliações 5 estrelas conferido no perfil público.</p>
            <a href={reputation.googleProfileUrl} target="_blank" rel="noreferrer" className="fluid-press mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-white px-5 text-sm font-black text-[#0a1230] hover:bg-[#ffc107]">Ver avaliações no Google</a>
          </aside>
          <ReviewsCarousel reviews={reviews} />
        </div>
        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-[#dfe3eb] pt-7 sm:flex-row sm:items-center">
          <a href={reputation.googleProfileUrl} target="_blank" rel="noreferrer" className="font-bold text-[#0e2f6d] underline decoration-[#ffc107] decoration-2 underline-offset-4">Ler as 131 avaliações no perfil público →</a>
          <a href={whatsapp("reviews_cta")} target="_blank" rel="noopener noreferrer" className="fluid-press inline-flex min-h-12 items-center justify-center rounded-md bg-[#25d366] px-5 text-sm font-black text-[#07142f]">Quero pedir meu orçamento</a>
        </div>
      </div>
    </section>
  );
}

export function FounderSection() {
  return (
    <section id="sobre" className="bg-[#0b1738] py-20 text-white sm:py-28">
      <div className="mx-auto grid w-full max-w-[75rem] gap-10 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-16">
        <Reveal>
          <div className="fluid-card group relative mx-auto aspect-[4/5] max-w-[27rem] overflow-hidden rounded-[0.8rem] bg-[#101f47]">
            <Image src="/assets/context-pack-asi/07-sr-alexandre-foto.jpg" alt="Sr. José Alexandre Rodrigues, diretor da ASI" fill sizes="(min-width:1024px) 36vw, 90vw" className="fluid-media object-cover object-top" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07142f] via-[#07142f]/85 to-transparent p-6 pt-24">
              <strong className="block text-lg">José Alexandre Rodrigues</strong>
              <small className="mt-1 block text-white/58">Diretor · ASI · Petrolina, PE</small>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <SectionLabel light>02B — Quem conduz a operação</SectionLabel>
          <h2 className="type-display mt-5 max-w-[45rem] font-sans">Atendimento direto com quem assina pelo trabalho.</h2>
          <p className="mt-7 max-w-[44rem] text-base leading-8 text-white/67">Sou o Sr. Alexandre. Bacharel em Administração, ex-professor do Instituto Federal do Sertão Pernambucano e empreendedor em Petrolina. Fundei a ASI para trazer disciplina de gestor e paciência de educador à operação de mudanças e fretes.</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Bacharel em Administração", "Ex-professor do IF Sertão", "Operação diária no Vale"].map((item) => <li key={item} className="border-l-2 border-[#ffc107] bg-white/5 p-4 text-sm font-bold text-white/82">{item}</li>)}
          </ul>
          <a href={whatsapp("founder")} target="_blank" rel="noopener noreferrer" className="fluid-action fluid-press mt-8 inline-flex min-h-13 items-center gap-3 rounded-md bg-[#25d366] px-6 text-sm font-black text-[#07142f]">Falar diretamente comigo <ArrowRight className="size-4" aria-hidden="true" /></a>
        </Reveal>
      </div>
    </section>
  );
}

export function ServicesSection() {
  return (
    <section id="servicos" className="bg-[#f4f5f8] py-16">
      <div className="mx-auto w-full max-w-[75rem] px-4 sm:px-6">
        <Reveal>
          <SectionLabel>03B — Serviços</SectionLabel>
          <div className="mt-4 flex flex-col justify-between gap-4 border-b border-[#cfd5df] pb-6 lg:flex-row lg:items-end">
            <h2 className="type-display-sm max-w-[50rem] font-sans text-[#0a1230]">Escolha o serviço antes de abrir conversa.</h2>
            <p className="max-w-sm text-sm leading-6 text-[#5e687b]">Rota, volume, acesso e serviço chegam organizados antes do WhatsApp.</p>
          </div>
        </Reveal>
        <div className="mt-6 grid border-l border-t border-[#cfd5df] sm:grid-cols-2 lg:grid-cols-3">
          {servicePages.map((service, index) => (
            <Reveal key={service.slug} delay={index * 0.045} className="h-full">
              <article className="fluid-card group flex h-full flex-col border-b border-r border-[#cfd5df] bg-white p-6">
                <span className="font-mono text-xs font-bold text-[#a66e00]">0{index + 1}</span>
                <h3 className="mt-6 text-2xl font-black tracking-[-0.035em] text-[#0a1230]">{service.serviceType}</h3>
                <p className="mt-3 text-sm leading-6 text-[#5e687b]">{service.lead}</p>
                <ul className="mt-5 grid gap-2 border-t border-[#dfe3eb] pt-4">
                  {service.cardDetails.map((detail) => (
                    <li key={detail} className="flex gap-2 text-xs leading-5 text-[#4b566b]">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-[#a66e00]" aria-hidden="true" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/${service.slug}`} className="fluid-action mt-auto inline-flex items-center gap-2 pt-5 text-sm font-black text-[#0e2f6d]">Ver detalhes <ArrowRight className="size-4" aria-hidden="true" /></Link>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-6 grid gap-4 rounded-[0.8rem] bg-[#0a1230] p-5 text-white sm:grid-cols-2 lg:grid-cols-4">
          {["Rota e distância", "Volume e acesso", "Embalagem e montagem", "Ajudantes e urgência"].map((item) => <div key={item} className="flex items-center gap-3"><Check className="size-5 text-[#ffc107]" aria-hidden="true" /><span className="text-sm font-bold">{item}</span></div>)}
        </div>
      </div>
    </section>
  );
}

export function OperationSection() {
  return (
    <section id="operacao" className="bg-white py-20 sm:py-28" aria-label="Como cuidamos da sua mudança">
      <div className="mx-auto w-full max-w-[75rem] px-4 sm:px-6">
        <Reveal>
          <SectionLabel>04 — Operação</SectionLabel>
          <h2 className="type-display mt-5 max-w-[56rem] font-sans text-[#0a1230]">O cuidado aparece no caminhão, no baú e em cada caixa.</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {operationCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.06}>
              <article className="fluid-card group h-full overflow-hidden rounded-[0.8rem] border border-[#dfe3eb] bg-[#f7f8fb]">
                <figure className="relative aspect-[4/3] overflow-hidden bg-[#0a1230]"><Image src={card.image} alt={card.alt} fill sizes="(min-width:1024px) 33vw, 100vw" className="fluid-media object-cover" /></figure>
                <div className="p-6">
                  <span className="font-mono text-xs font-bold text-[#a66e00]">{card.number}</span>
                  <h3 className="mt-4 text-2xl font-black tracking-[-0.035em] text-[#0a1230]">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#5e687b]">{card.description}</p>
                  <a href={whatsapp(card.source)} target="_blank" rel="noopener noreferrer" className="fluid-action mt-6 inline-flex items-center gap-2 text-sm font-black text-[#0e2f6d]">Perguntar no WhatsApp <ArrowRight className="size-4" aria-hidden="true" /></a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-16 border-t border-[#dfe3eb] pt-12">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><SectionLabel>04B — Vídeos reais</SectionLabel><h3 className="type-display-sm mt-4 max-w-3xl font-sans text-[#0a1230]">Proteção vista de perto.</h3></div><p className="max-w-sm text-sm leading-6 text-[#5e687b]">Registros reais da preparação de itens antes da rota.</p></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {videoCards.map(([number, title, description, poster, src]) => (
              <article key={number} className="fluid-card overflow-hidden rounded-[0.8rem] bg-[#0a1230] text-white">
                <video controls preload="metadata" playsInline poster={poster} className="aspect-[4/5] w-full bg-black object-cover" aria-label={`Vídeo: ${title}`}><source src={src} type="video/mp4" />Seu navegador não suporta vídeo em HTML5.</video>
                <div className="p-5"><span className="font-mono text-xs text-[#ffc107]">{number}</span><h4 className="mt-2 text-base font-black">{title}</h4><p className="mt-2 text-xs leading-5 text-white/60">{description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function MethodSection() {
  return (
    <section id="metodo" className="bg-[#0b1738] py-20 text-white sm:py-28">
      <div className="mx-auto grid w-full max-w-[75rem] gap-12 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
        <Reveal>
          <SectionLabel light>05 — Como o pedido avança</SectionLabel>
          <h2 className="type-display mt-5 font-sans">Do primeiro pedido ao destino.</h2>
          <p className="mt-6 text-base leading-8 text-white/64">O site recolhe o que normalmente se perde no WhatsApp: rota, volume, data, acesso, urgência e contato.</p>
          <div className="mt-8 rounded-[0.7rem] border border-white/12 bg-white/5 p-5 font-mono text-xs"><span className="text-white/40">ENTRADA</span><strong className="mt-2 block text-white">pedido com rota, volume e acesso</strong><span className="mt-5 block text-white/40">SAÍDA</span><strong className="mt-2 block text-[#ffc107]">agenda clara para fechar no WhatsApp</strong></div>
        </Reveal>
        <ol className="border-t border-white/14">
          {methodSteps.map(([number, title, description, stage]) => (
            <li key={number} className="grid grid-cols-[2rem_1fr_auto] gap-4 border-b border-white/14 py-5 transition-colors duration-300 hover:bg-white/[.035] sm:grid-cols-[3rem_1fr_auto] sm:gap-6 sm:px-4">
              <span className="font-mono text-xs text-[#ffc107]">{number}</span><div><h3 className="font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/62">{description}</p></div><small className="hidden font-mono text-xs uppercase tracking-[0.1em] text-white/45 sm:block">{stage}</small>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function RoutesSection() {
  return (
    <section id="rotas" className="bg-[#f4f5f8] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[75rem] px-4 sm:px-6">
        <Reveal>
          <SectionLabel>06 — Rotas</SectionLabel>
          <div className="mt-5 grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><h2 className="type-display font-sans text-[#0a1230]">Saindo do Vale para onde a agenda permitir.</h2><p className="max-w-xl text-base leading-7 text-[#5e687b]">Petrolina e Juazeiro são a base. Recife, Salvador, Fortaleza e outras cidades entram após avaliar volume, acesso, data e disponibilidade.</p></div>
        </Reveal>
        <figure className="fluid-card group relative mt-10 aspect-[16/7] min-h-72 w-full overflow-hidden rounded-[0.8rem] bg-[#0a1230]"><Image src="/assets/asi-routes-map-premium-1600x900.webp" alt="Mapa de rotas ASI saindo de Petrolina e Juazeiro" fill sizes="100vw" className="fluid-media object-cover" /></figure>
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {routeCards.map((route, index) => (
            <Reveal key={route.title} delay={index * 0.06} className="h-full">
              <article className="fluid-card group h-full overflow-hidden rounded-[0.8rem] border border-[#d7dce6] bg-white">
                <figure className="relative aspect-[16/9] overflow-hidden bg-[#0a1230]"><Image src={route.image} alt={route.alt} fill sizes="(min-width:1024px) 33vw, 100vw" className="fluid-media object-cover" /></figure>
                <div className="p-6"><span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#a66e00]">{route.tag}</span><h3 className="mt-3 text-xl font-extrabold text-[#0a1230]">{route.title}</h3><p className="mt-2 text-sm text-[#5e687b]">{route.detail}</p><Link href={`/orçamento?rota=${encodeURIComponent(route.query)}`} className="fluid-action mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#0e2f6d]">Cotar esta rota <ArrowRight className="size-4" aria-hidden="true" /></Link></div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contato" className="bg-white py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-[75rem] gap-10 px-4 sm:px-6 lg:grid-cols-[0.76fr_1.24fr] lg:items-start lg:gap-16">
        <Reveal>
          <SectionLabel>07 — Vamos conversar?</SectionLabel>
          <h2 className="type-display mt-5 font-sans text-[#0a1230]">Orçamento com base na sua mudança real.</h2>
          <p className="mt-6 text-base leading-7 text-[#5e687b]">Informe origem, destino, volume, data e acesso. O pedido chega organizado para o Sr. Alexandre responder com mais precisão.</p>
          <figure className="fluid-card group relative mt-8 aspect-[16/10] overflow-hidden rounded-[0.8rem] bg-[#0a1230]"><Image src="/assets/asi-lead-qualification-office-1600x900.webp" alt="Atendimento da ASI recebendo detalhes de uma mudança" fill sizes="(min-width:1024px) 40vw, 100vw" className="fluid-media object-cover" /></figure>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[{ icon: Clock3, text: "Atendimento 06h–22h" }, { icon: BadgeCheck, text: "Direto com o Sr. Alexandre" }, { icon: MapPin, text: "Base em Petrolina, PE" }, { icon: ShieldCheck, text: "Você confirma antes de enviar" }].map(({ icon: Icon, text }) => <div key={text} className="flex items-center gap-3 text-sm font-bold text-[#27334a]"><Icon className="size-5 text-[#a66e00]" aria-hidden="true" />{text}</div>)}
          </div>
        </Reveal>
        <HomeQuoteForm />
      </div>
    </section>
  );
}

export function FaqSection() {
  const items = [
    ["Atende todos os dias?", "Sim. O atendimento informado no Google vai das 6h às 22h, todos os dias. Você fala diretamente com o Sr. Alexandre."],
    ["Faz frete ou só mudança?", "A ASI atende mudanças residenciais, comerciais, fretes e cargas conforme rota, volume e disponibilidade."],
    ["Como peço o valor?", "Envie origem, destino, volume aproximado e data. O Sr. Alexandre responde com um orçamento contextualizado."],
    ["Atende interestadual?", "Sim. Recife, Salvador e Fortaleza são rotas frequentes. Outras cidades dependem de volume, distância e agenda."],
    ["Inclui embalagem e montagem?", "Sim, sob solicitação. Proteção de cantos, embalagem, desmontagem e montagem podem entrar no orçamento."],
  ] as const;

  return (
    <section id="faq" className="bg-[#f4f5f8] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[75rem] px-4 sm:px-6">
        <SectionLabel>08 — Dúvidas frequentes</SectionLabel>
        <h2 className="type-display mt-5 max-w-3xl font-sans text-[#0a1230]">Antes de mandar mensagem, talvez ajude.</h2>
        <div className="mt-10 border-t border-[#cfd5df]">
          {items.map(([question, answer]) => <details key={question} className="fluid-details group border-b border-[#cfd5df] py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black text-[#0a1230] transition-colors hover:text-[#0e2f6d]">{question}<span className="text-2xl font-light text-[#a66e00] transition-transform duration-300 group-open:rotate-45">+</span></summary><p className="max-w-3xl pt-4 text-sm leading-7 text-[#5e687b]">{answer}</p></details>)}
        </div>
      </div>
    </section>
  );
}

function SectionLabel({ children, light = false }: Readonly<{ children: React.ReactNode; light?: boolean }>) {
  return <span className={`font-mono text-xs font-semibold uppercase tracking-[0.14em] ${light ? "text-[#ffcf33]" : "text-[#a66e00]"}`}>{children}</span>;
}

export function HomeTrustStrip() {
  const items = [
    { icon: Truck, title: "Frota identificada", text: "Você sabe quem chega" },
    { icon: PackageCheck, title: "Volume avaliado", text: "Antes de definir a rota" },
    { icon: Route, title: "Agenda confirmada", text: "Sem prometer rota automática" },
    { icon: Star, title: "5,0 no Google", text: "Perfil público verificável" },
  ] as const;
  return <div className="bg-[#ffc107]"><div className="mx-auto grid w-full max-w-[75rem] divide-y divide-[#0a1230]/15 px-4 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-6 lg:grid-cols-4">{items.map(({ icon: Icon, title, text }) => <div key={title} className="flex items-center gap-4 py-5 sm:px-5"><Icon className="size-6 shrink-0 text-[#0a1230]" aria-hidden="true" /><div><strong className="block text-sm text-[#0a1230]">{title}</strong><small className="text-[#0a1230]/65">{text}</small></div></div>)}</div></div>;
}
