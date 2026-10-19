import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Camera,
  Check,
  Clock3,
  Dumbbell,
  FileCheck2,
  MapPin,
  MessageCircle,
  Route,
  ShieldCheck,
  Star,
  Stethoscope,
  Store,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { HomeQuoteForm, QuickQuoteForm } from "@/components/quote-forms";
import { FluidHeroMedia } from "@/components/fluid-hero-media";
import { LoopVideo } from "@/components/loop-video";
import { Reveal } from "@/components/reveal";
import { ReviewAvatar, ReviewsCarousel } from "@/components/reviews-carousel";
import { RouteMap3D } from "@/components/route-map-3d";
import { homeContent, DISPLAY_PHONE } from "@/data/site-content";
import { reputation } from "@/data/reputation";
import { faqItems } from "@/data/faq";
import { featuredReview, featuredReviewPhotos, reviews } from "@/data/reviews";
import { servicePages } from "@/data/services";
import { buildQuickQuoteMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

const page = "home";

function whatsapp(source: string, service = "Mudança completa") {
  return buildWhatsAppUrl(buildQuickQuoteMessage(source, { page, service }));
}

const quoteRoute = (route: string) => `/orçamento?rota=${encodeURIComponent(route)}`;

const commercialReview = reviews.find((review) => review.name === "Colégio Pequenos Criadores") ?? reviews[1];

const operationCards = [
  {
    number: "01",
    title: "Baú organizado",
    description: "Caixas identificadas, mantas de proteção e amarração: cada item entra no lugar certo antes de pegar a estrada.",
    image: "/assets/context-pack-asi/03-bau-aberto-organizado-optimized.jpg",
    alt: "Baú aberto do caminhão ASI com caixas e móveis protegidos por mantas",
    source: "op_bau",
  },
  {
    number: "02",
    title: "Equipe no carregamento",
    description: "Ajudantes, acesso e proteção combinados na conversa, para não improvisar no dia.",
    image: "/assets/context-pack-asi/04-equipe-mudanca-residencial-optimized.jpg",
    alt: "Equipe da ASI carregando móvel protegido em uma mudança residencial",
    source: "op_equipe",
  },
  {
    number: "03",
    title: "Embalagem com cuidado",
    description: "Plástico bolha, papel filme e proteção de cantos nos itens que pedem mais atenção.",
    image: "/assets/context-pack-asi/05-embalagem-protecao-close-optimized.jpg",
    alt: "Profissional da ASI embalando item frágil com proteção",
    source: "op_embalagem",
  },
] as const;

// Trechos de reels públicos do Instagram da ASI (@asi_cargas_e_mudancas).
const heroVideo = { poster: "/assets/instagram/asi-ig-embalagem-petrolina-bh-poster.jpg", src: "/assets/instagram/asi-ig-embalagem-petrolina-bh.mp4" } as const;

const videoCards = [
  { title: "Louças embaladas uma a uma", route: "Petrolina → Belo Horizonte", when: "Set 2026", poster: "/assets/instagram/asi-ig-cozinha-petrolina-bh-poster.jpg", src: "/assets/instagram/asi-ig-cozinha-petrolina-bh.mp4" },
  { title: "Entrega residencial exclusiva", route: "São Paulo · SP", when: "Set 2026", poster: "/assets/instagram/asi-ig-entrega-sao-paulo-poster.jpg", src: "/assets/instagram/asi-ig-entrega-sao-paulo.mp4" },
  { title: "Equipe na descarga", route: "São Paulo → Petrolina", when: "Out 2026", poster: "/assets/instagram/asi-ig-descarga-sao-paulo-petrolina-poster.jpg", src: "/assets/instagram/asi-ig-descarga-sao-paulo-petrolina.mp4" },
  { title: "Baú organizado na chegada", route: "Recife · PE", when: "Set 2026", poster: "/assets/instagram/asi-ig-bau-recife-poster.jpg", src: "/assets/instagram/asi-ig-bau-recife.mp4" },
] as const;

// Vídeos de embalagem que já estavam no site, agora em loop mudo como os do Instagram.
const packingVideos = [
  { title: "Peças protegidas na caixa", poster: "/assets/videos/asi-embalagem-protecao-caixa-poster.jpg", src: "/assets/videos/asi-embalagem-protecao-caixa.mp4" },
  { title: "Plástico bolha em itens delicados", poster: "/assets/videos/asi-embalagem-embalagem-loucas-poster.jpg", src: "/assets/videos/asi-embalagem-embalagem-loucas.mp4" },
  { title: "Caixa fechada só depois de proteger", poster: "/assets/videos/asi-embalagem-caixa-protegida-poster.jpg", src: "/assets/videos/asi-embalagem-caixa-protegida.mp4" },
  { title: "Cuidado repetido no detalhe", poster: "/assets/videos/asi-embalagem-plastico-bolha-poster.jpg", src: "/assets/videos/asi-embalagem-plastico-bolha.mp4" },
] as const;

const recentDeliveries = [
  ["Out 2026", "São Paulo → Petrolina"],
  ["Set 2026", "Entrega em São Paulo · SP"],
  ["Set 2026", "Entrega em Recife · PE"],
  ["Set 2026", "Entrega em Cataguases · MG"],
  ["Set 2026", "Petrolina → Belo Horizonte"],
] as const;

const routeGroups = [
  {
    tag: "Rotas prioritárias",
    title: "São Paulo · Brasília",
    detail: "Saídas frequentes de Petrolina, com caminhão dimensionado para a viagem.",
    links: [["São Paulo", "Petrolina para São Paulo"], ["Brasília", "Petrolina para Brasília"]],
    priority: true,
  },
  {
    tag: "Nordeste",
    title: "Recife · Salvador · Fortaleza · João Pessoa",
    detail: "Capitais e cidades do Nordeste sob agenda confirmada.",
    links: [["Recife", "Petrolina para Recife"], ["Salvador", "Petrolina para Salvador"], ["Fortaleza", "Petrolina para Fortaleza"]],
    priority: false,
  },
  {
    tag: "Base local",
    title: "Petrolina ↔ Juazeiro · Vale",
    detail: "Mudanças, fretes e cargas no dia a dia do Vale do São Francisco.",
    links: [["Juazeiro", "Petrolina para Juazeiro"], ["Vale do São Francisco", "Vale do São Francisco"]],
    priority: false,
  },
] as const;

const truckSizes = [
  { label: "Pequeno", scale: "size-5" },
  { label: "Médio", scale: "size-6" },
  { label: "Grande", scale: "size-8" },
  { label: "Carreta", scale: "size-10" },
] as const;

export function HomeHero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-[#07142f] pb-8 pt-32 text-white lg:pt-36">
      <FluidHeroMedia />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,14,38,.98)_0%,rgba(6,14,38,.9)_44%,rgba(6,14,38,.45)_74%,rgba(6,14,38,.7)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(6,14,38,.96)_0%,transparent_50%)]" />
      <div className="mx-auto grid w-full max-w-[75rem] gap-10 px-4 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
        <Reveal className="max-w-[49rem]">
          <a href={reputation.googleProfileUrl} target="_blank" rel="noreferrer" className="glass-pill mb-7 inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm font-bold text-[#ffdd6b]">
            <Star className="size-4 fill-current" aria-hidden="true" />
            <span>{reputation.rating} no Google · {reputation.totalReviews} avaliações</span>
          </a>
          <p className="hero-kicker mb-5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#ffcf33]">{homeContent.eyebrow}</p>
          <h1 className="type-hero max-w-[46rem] font-sans">{homeContent.headline}</h1>
          <p className="mt-7 max-w-[40rem] text-base leading-7 text-white/76 sm:text-lg sm:leading-8">{homeContent.lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={whatsapp("hero_orcamento")} target="_blank" rel="noopener noreferrer" className="fluid-action fluid-press cta-glow inline-flex min-h-14 items-center justify-center gap-3 rounded-md bg-[#25d366] px-7 text-center text-base font-black text-[#07142f] hover:bg-[#47dd7c]" aria-label="Pedir orçamento pelo WhatsApp">
              <MessageCircle className="size-5" aria-hidden="true" /> Pedir orçamento pelo WhatsApp
            </a>
            <a href="#rotas" className="fluid-press glass-control inline-flex min-h-14 items-center justify-center gap-2 rounded-md px-6 text-center text-sm font-extrabold text-white hover:border-[#ffc107] hover:text-[#ffc107]">
              <Route className="size-4" aria-hidden="true" /> Ver rotas atendidas
            </a>
          </div>
          <div className="mt-9 max-w-[47rem] border-t border-white/15 pt-5">
            <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white/55">Saindo de Petrolina para</span>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Rotas frequentes saindo de Petrolina">
              {["São Paulo", "Brasília", "Recife", "Salvador", "Fortaleza", "João Pessoa"].map((city, index) => (
                <li key={city} className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] ${index < 2 ? "border-[#ffc107]/70 bg-[#ffc107]/12 text-[#ffdd6b]" : "border-white/18 text-white/75"}`}>{city}</li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.12} className="hidden lg:block">
          <figure className="hero-proof relative ml-auto w-full max-w-[22rem]">
            <div className="relative aspect-[9/14] overflow-hidden rounded-[1.1rem] border border-white/16 bg-[#0a1230] shadow-[0_40px_90px_rgba(0,0,0,.45)]">
              <LoopVideo src={heroVideo.src} poster={heroVideo.poster} label="Vídeo real: equipe uniformizada da ASI embalando móvel para mudança de Petrolina a Belo Horizonte" className="h-full w-full object-cover" />
              <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-[#07142f]/80 px-3 py-1.5 font-mono text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white backdrop-blur"><span className="live-dot" aria-hidden="true" />Equipe ASI · vídeo real</span>
            </div>
            <blockquote className="hero-quote absolute -bottom-8 -left-16 max-w-[17rem] rounded-[0.9rem] border border-white/12 bg-white p-4 text-[#0a1230] shadow-[0_24px_60px_rgba(0,0,0,.35)]">
              <span className="text-xs tracking-[0.14em] text-[#e6a800]" aria-label="cinco estrelas">★★★★★</span>
              <p className="mt-2 text-sm font-bold leading-5">“[…] o empacotamento vc faz é melhor que o da magazine Luíza”</p>
              <cite className="mt-2 block text-xs not-italic text-[#5e687b]">{featuredReview.name} · Google · {featuredReview.when}</cite>
            </blockquote>
          </figure>
        </Reveal>
      </div>
      <div className="relative mt-14 px-4 sm:px-6">
        <QuickQuoteForm />
      </div>
    </section>
  );
}

export function HomeTrustStrip() {
  const items = [
    { icon: Route, title: "Nordeste · Brasília · SP", text: "Rotas frequentes saindo de Petrolina" },
    { icon: Truck, title: "Do pequeno à carreta", text: "Porte definido pelo volume" },
    { icon: FileCheck2, title: "Veículo e motorista conferidos", text: "Dados enviados antes da chegada" },
    { icon: Star, title: `${reputation.rating} no Google`, text: `${reputation.totalReviews} avaliações públicas` },
  ] as const;
  return <div className="bg-[#ffc107]"><div className="mx-auto grid w-full max-w-[75rem] divide-y divide-[#0a1230]/15 px-4 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-6 lg:grid-cols-4">{items.map(({ icon: Icon, title, text }) => <div key={title} className="flex items-center gap-4 py-5 sm:px-5"><Icon className="size-6 shrink-0 text-[#0a1230]" aria-hidden="true" /><div><strong className="block text-sm text-[#0a1230]">{title}</strong><small className="text-[#0a1230]/70">{text}</small></div></div>)}</div></div>;
}

export function OperationSection() {
  return (
    <section id="operacao" className="bg-white py-20 sm:py-28" aria-label="Equipe em campo">
      <div className="mx-auto w-full max-w-[75rem] px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <Reveal>
            <SectionLabel>01 — Equipe em campo</SectionLabel>
            <h2 className="type-display mt-5 font-sans text-[#0a1230]">Equipe uniformizada, embalagem de verdade.</h2>
            <p className="mt-6 max-w-[34rem] text-base leading-7 text-[#5e687b]">Registros recentes do Instagram da ASI: louças embaladas uma a uma, baú organizado e entrega acompanhada no destino. É isso que separa uma empresa de mudanças de um frete qualquer.</p>
            <a href="/redes?canal=instagram&origem=home_videos" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#5e687b] underline decoration-[#ffc107] decoration-2 underline-offset-4 hover:text-[#0e2f6d]">Mais vídeos no Instagram @asi_cargas_e_mudancas</a>
            <a href={whatsapp("videos_cta")} target="_blank" rel="noopener noreferrer" className="fluid-action mt-7 inline-flex items-center gap-2 text-sm font-black text-[#0e2f6d]">Quero esse cuidado na minha mudança <ArrowRight className="size-4" aria-hidden="true" /></a>
          </Reveal>
          <div className="video-reel -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4">
            {videoCards.map((video, index) => (
              <Reveal key={video.src} delay={index * 0.06} className="w-[64vw] shrink-0 snap-start sm:w-auto">
                <figure className="fluid-card overflow-hidden rounded-[0.9rem] bg-[#0a1230] text-white">
                  <LoopVideo src={video.src} poster={video.poster} label={`Vídeo real: ${video.title}, ${video.route}`} className="aspect-[9/14] w-full bg-black object-cover" />
                  <figcaption className="px-4 py-3"><span className="flex items-center justify-between gap-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[#ffc107]">{video.route}<Camera className="size-3.5 shrink-0" aria-hidden="true" /></span><span className="mt-1 block text-sm font-black leading-5">{video.title}</span><small className="mt-1 block text-xs text-white/50">Instagram · {video.when}</small></figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="mt-16 grid gap-8 border-t border-[#dfe3eb] pt-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <Reveal>
            <SectionLabel>01B — Proteção vista de perto</SectionLabel>
            <h3 className="type-display-sm mt-4 font-sans text-[#0a1230]">Louça, vidro e caixa: proteção peça a peça.</h3>
            <p className="mt-5 max-w-[30rem] text-base leading-7 text-[#5e687b]">Antes de fechar cada caixa, os itens frágeis recebem plástico bolha e papel. A caixa sai identificada e entra no baú no lugar certo.</p>
          </Reveal>
          <div className="video-reel -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0">
            {packingVideos.map((video, index) => (
              <Reveal key={video.src} delay={index * 0.05} className="w-[46vw] shrink-0 snap-start sm:w-auto">
                <figure className="fluid-card overflow-hidden rounded-[0.9rem] bg-[#0a1230] text-white">
                  <LoopVideo src={video.src} poster={video.poster} label={`Vídeo real de embalagem: ${video.title}`} className="aspect-[3/4] w-full bg-black object-cover" />
                  <figcaption className="px-3 py-2.5 text-xs font-black leading-4">{video.title}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {operationCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.06}>
              <article className="fluid-card group h-full overflow-hidden rounded-[0.9rem] border border-[#dfe3eb] bg-[#f7f8fb]">
                <figure className="relative aspect-[16/10] overflow-hidden bg-[#0a1230]"><Image src={card.image} alt={card.alt} fill sizes="(min-width:1024px) 33vw, 100vw" className="fluid-media object-cover" /></figure>
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
      </div>
    </section>
  );
}

export function ReputationSection() {
  return (
    <section id="avaliacoes" className="bg-[#f4f5f8] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[75rem] px-4 sm:px-6">
        <div className="mb-10 flex flex-col justify-between gap-5 border-b border-[#dfe3eb] pb-8 lg:flex-row lg:items-end">
          <Reveal>
            <SectionLabel>02 — Avaliações recentes</SectionLabel>
            <h2 className="type-display mt-5 max-w-[52rem] font-sans text-[#0a1230]">Quem mudou com a ASI conta como foi.</h2>
          </Reveal>
          <p className="max-w-sm text-sm leading-6 text-[#5e687b]">Avaliações do perfil público do Google, das mais recentes para as mais antigas.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[0.62fr_1.38fr]">
          <aside className="fluid-card flex flex-col rounded-[0.9rem] bg-[#0a1230] p-7 text-white sm:p-9">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Reviews on Google</span>
            <strong className="mt-6 font-sans text-[clamp(4.5rem,7vw,6rem)] font-bold leading-none tracking-[-0.065em] text-[#ffc107]">{reputation.rating}</strong>
            <span className="mt-4 text-xl tracking-[0.2em] text-[#ffc107]" aria-label="cinco estrelas">★★★★★</span>
            <span className="mt-4 text-base font-bold">{reputation.totalReviews} avaliações, todas 5 estrelas</span>
            <a href={reputation.googleProfileUrl} target="_blank" rel="noreferrer" className="fluid-press mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-white px-5 text-sm font-black text-[#0a1230] hover:bg-[#ffc107]">Ver avaliações no Google</a>
          </aside>
          <figure className="featured-quote relative grid overflow-hidden rounded-[0.9rem] border border-[#dfe3eb] bg-white sm:grid-cols-[1.1fr_0.9fr]">
            <div className="relative flex flex-col justify-between p-7 sm:p-9">
              <span className="pointer-events-none absolute right-4 -top-12 font-serif text-[12rem] leading-none text-[#ffc107]/25" aria-hidden="true">“</span>
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#0e2f6d] px-3 py-1 font-mono text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white">{featuredReview.tag}</span>
                <blockquote className="relative mt-6 text-[clamp(1.2rem,1.9vw,1.55rem)] font-bold leading-snug tracking-[-0.02em] text-[#0a1230]">“Minha primeira experiência com frete para outro estado e foi sensacional!!! Sem contar que o empacotamento vc faz é melhor que o da magazine Luíza […]”</blockquote>
              </div>
              <figcaption className="mt-8 flex items-center gap-3 border-t border-[#dfe3eb] pt-5">
                <ReviewAvatar review={featuredReview} size={48} />
                <span><strong className="block text-sm text-[#0a1230]">{featuredReview.name}</strong><small className="text-[#5e687b]">Google · {featuredReview.when} · ★★★★★</small></span>
              </figcaption>
            </div>
            <div className="relative grid min-h-[18rem] grid-cols-2 grid-rows-[1.4fr_1fr] gap-1 bg-[#0a1230] p-1" data-testid="featured-review-photos">
              {featuredReviewPhotos.slice(0, 3).map((photo, index) => (
                <div key={photo} className={`relative overflow-hidden rounded-[0.55rem] ${index === 0 ? "col-span-2" : ""}`}>
                  <Image src={photo} alt={`Foto ${index + 1} publicada por ${featuredReview.name} na avaliação do Google: mudança embalada entregue em São Paulo`} fill sizes="(min-width:1024px) 22vw, 50vw" className="fluid-media object-cover" />
                </div>
              ))}
              <span className="absolute bottom-3 left-3 rounded-full bg-[#07142f]/80 px-3 py-1.5 font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-white backdrop-blur">Fotos do cliente · Google</span>
            </div>
          </figure>
        </div>
        <div className="mt-6">
          <ReviewsCarousel reviews={reviews} />
        </div>
        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-[#dfe3eb] pt-7 sm:flex-row sm:items-center">
          <a href={reputation.googleProfileUrl} target="_blank" rel="noreferrer" className="font-bold text-[#0e2f6d] underline decoration-[#ffc107] decoration-2 underline-offset-4">Ler as {reputation.totalReviews} avaliações no perfil público →</a>
          <a href={whatsapp("reviews_cta")} target="_blank" rel="noopener noreferrer" className="fluid-press inline-flex min-h-12 items-center justify-center rounded-md bg-[#25d366] px-5 text-sm font-black text-[#07142f]">Quero pedir meu orçamento</a>
        </div>
      </div>
    </section>
  );
}

export function RoutesSection() {
  return (
    <section id="rotas" className="routes-section relative isolate overflow-hidden bg-[#07142f] py-20 text-white sm:py-28">
      <div className="mx-auto grid w-full max-w-[75rem] gap-8 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-x-8 lg:gap-y-6">
        <Reveal className="lg:col-start-1 lg:row-start-1">
          <SectionLabel light>03 — Rotas</SectionLabel>
          <h2 className="type-display mt-5 font-sans">De Petrolina para o Nordeste, Brasília e São Paulo.</h2>
          <p className="mt-6 max-w-[34rem] text-base leading-7 text-white/68">Petrolina e Juazeiro são a base. As saídas mais frequentes vão para São Paulo, Brasília e capitais do Nordeste; outras cidades do Brasil entram sob agenda, conforme volume e data.</p>
        </Reveal>
        <Reveal delay={0.08} className="relative lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <RouteMap3D />
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/55">
            <span className="flex items-center gap-2"><i className="block h-1 w-6 rounded bg-[#ffc107]" aria-hidden="true" />Prioritárias</span>
            <span className="flex items-center gap-2"><i className="block h-0.5 w-6 rounded bg-[#8fb4ff]" aria-hidden="true" />Sob agenda</span>
            <span className="flex items-center gap-2"><i className="block size-2 rounded-full bg-[#ffc107]" aria-hidden="true" />Base Petrolina</span>
          </div>
        </Reveal>
        <Reveal className="lg:col-start-1 lg:row-start-2">
          <div className="grid gap-3">
            {routeGroups.map((group) => (
              <article key={group.tag} className={`rounded-[0.8rem] border p-5 ${group.priority ? "border-[#ffc107]/55 bg-[#ffc107]/10" : "border-white/12 bg-white/[.04]"}`}>
                <span className={`font-mono text-[0.7rem] font-bold uppercase tracking-[0.14em] ${group.priority ? "text-[#ffc107]" : "text-white/55"}`}>{group.tag}</span>
                <h3 className="mt-2 text-lg font-black">{group.title}</h3>
                <p className="mt-1 text-sm leading-6 text-white/60">{group.detail}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                  {group.links.map(([label, route]) => <Link key={label} href={quoteRoute(route)} className="fluid-action inline-flex items-center gap-1.5 text-sm font-extrabold text-[#ffdd6b] hover:text-white">Cotar {label} <ArrowRight className="size-3.5" aria-hidden="true" /></Link>)}
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6">
            <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white/55">Entregas recentes no Instagram</span>
            <ul className="mt-3 flex flex-wrap gap-2">
              {recentDeliveries.map(([when, label]) => <li key={label} className="rounded-full border border-white/14 bg-white/[.05] px-3 py-1.5 text-xs font-bold text-white/80"><span className="text-[#ffc107]">{when}</span> · {label}</li>)}
            </ul>
          </div>
          <p className="mt-6 flex items-start gap-3 text-sm leading-6 text-white/60"><Truck className="mt-0.5 size-5 shrink-0 text-[#ffc107]" aria-hidden="true" />Do caminhão pequeno à carreta: o porte é definido pelo tamanho da mudança, não o contrário.</p>
          <a href={whatsapp("rotas_mapa")} target="_blank" rel="noopener noreferrer" className="fluid-press mt-7 inline-flex min-h-13 items-center gap-3 rounded-md bg-[#25d366] px-6 text-sm font-black text-[#07142f] hover:bg-[#47dd7c]"><MessageCircle className="size-4" aria-hidden="true" /> Consultar minha rota no WhatsApp</a>
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
          <SectionLabel>04 — Serviços</SectionLabel>
          <div className="mt-4 flex flex-col justify-between gap-4 border-b border-[#cfd5df] pb-6 lg:flex-row lg:items-end">
            <h2 className="type-display-sm max-w-[50rem] font-sans text-[#0a1230]">Mudança residencial, comercial e para outros estados.</h2>
            <p className="max-w-sm text-sm leading-6 text-[#5e687b]">Escolha o serviço e continue a conversa no WhatsApp.</p>
          </div>
        </Reveal>
        <div className="mt-6 grid border-l border-t border-[#cfd5df] sm:grid-cols-2 lg:grid-cols-3">
          {servicePages.map((service, index) => (
            <Reveal key={service.slug} delay={index * 0.045} className="h-full">
              <article className="fluid-card group flex h-full flex-col border-b border-r border-[#cfd5df] bg-white p-6">
                <span className="font-mono text-xs font-bold text-[#a66e00]">0{index + 1}</span>
                <h3 className="mt-5 text-2xl font-black tracking-[-0.035em] text-[#0a1230]">{service.serviceType}</h3>
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
      </div>
    </section>
  );
}

export function CommercialSection() {
  const segments = [
    { icon: Stethoscope, label: "Clínicas e consultórios" },
    { icon: Store, label: "Lojas" },
    { icon: Briefcase, label: "Escritórios" },
    { icon: Camera, label: "Estúdios" },
    { icon: Dumbbell, label: "Academias" },
  ] as const;

  return (
    <section id="mudanca-comercial" className="bg-[#0b1738] py-20 text-white sm:py-28">
      <div className="mx-auto grid w-full max-w-[75rem] gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <Reveal>
          <SectionLabel light>05 — Mudança comercial</SectionLabel>
          <h2 className="type-display mt-5 font-sans">Sua empresa muda de endereço sem parar o atendimento.</h2>
          <p className="mt-6 max-w-[36rem] text-base leading-7 text-white/66">Clínicas, lojas, escritórios, estúdios e academias têm equipamento sensível e agenda apertada. A ASI combina a janela da mudança, protege cada equipamento e ajusta a operação ao seu negócio.</p>
          <ul className="mt-8 grid grid-cols-2 gap-3">
            {segments.map(({ icon: Icon, label }) => (
              <li key={label} className="flex min-h-14 items-center gap-3 rounded-[0.7rem] border border-white/12 bg-white/[.05] px-3 text-sm font-bold sm:px-4"><Icon className="size-5 shrink-0 text-[#ffc107]" aria-hidden="true" />{label}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={whatsapp("comercial_home", "Mudança comercial")} target="_blank" rel="noopener noreferrer" className="fluid-press inline-flex min-h-13 items-center justify-center gap-3 rounded-md bg-[#25d366] px-6 text-sm font-black text-[#07142f] hover:bg-[#47dd7c]"><MessageCircle className="size-4" aria-hidden="true" /> Cotar mudança comercial</a>
            <Link href="/mudanca-comercial" className="fluid-press glass-control inline-flex min-h-13 items-center justify-center rounded-md px-6 text-sm font-extrabold text-white hover:border-[#ffc107] hover:text-[#ffc107]">Como funciona</Link>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="flex flex-col gap-5">
          <ol className="grid gap-px overflow-hidden rounded-[0.9rem] border border-white/12 bg-white/12">
            {[
              ["Janela combinada", "Data e horário pensados para não parar vendas, consultas ou aulas."],
              ["Equipamento protegido", "Mantas, plástico bolha e caixas identificadas por setor."],
              ["Atendimento sob medida", "Acesso, condomínio comercial e ordem de descarga acertados antes."],
            ].map(([title, text], index) => (
              <li key={title} className="grid grid-cols-[2.5rem_1fr] gap-3 bg-[#0b1738] p-6"><span className="font-mono text-xs font-bold text-[#ffc107]">0{index + 1}</span><div><h3 className="font-black">{title}</h3><p className="mt-1 text-sm leading-6 text-white/62">{text}</p></div></li>
            ))}
          </ol>
          <figure className="rounded-[0.9rem] bg-white p-6 text-[#0a1230]">
            <span className="text-sm tracking-[0.12em] text-[#e6a800]" aria-label="cinco estrelas">★★★★★</span>
            <blockquote className="mt-3 text-base font-bold leading-7">“{commercialReview.text}”</blockquote>
            <figcaption className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#5e687b]">{commercialReview.name} · Google · {commercialReview.when}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

export function FleetSection() {
  const points = [
    { icon: Truck, title: "Caminhões próprios com a marca ASI", text: "Os veículos da ASI levam a identidade da empresa nas mudanças que a própria frota atende." },
    { icon: Route, title: "Parceiros nas cargas compartilhadas", text: "Em rotas compartilhadas, o caminhão pode ser de um parceiro e não ter a identidade visual da ASI." },
    { icon: FileCheck2, title: "Documentos antes da chegada", text: "Você recebe o documento do veículo e a identificação e habilitação do motorista antes do carregamento." },
  ] as const;

  return (
    <section id="frota" className="bg-white py-20 sm:py-28" aria-label="Veículos da operação">
      <div className="mx-auto grid w-full max-w-[75rem] gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch lg:gap-16">
        <Reveal>
          <SectionLabel>06 — Veículos</SectionLabel>
          <h2 className="type-display mt-5 font-sans text-[#0a1230]">O caminhão certo para o tamanho da sua mudança.</h2>
          <p className="mt-6 max-w-[35rem] text-base leading-7 text-[#5e687b]">A ASI trabalha com caminhões do pequeno à carreta. Primeiro entendemos o volume pelas fotos e pela conversa; depois definimos o veículo.</p>
          <div className="mt-7 flex items-end gap-5 border-y border-[#dfe3eb] py-5" aria-label="Portes de caminhão disponíveis">
            {truckSizes.map((size) => (
              <div key={size.label} className="flex flex-col items-center gap-2"><Truck className={`${size.scale} text-[#0e2f6d]`} aria-hidden="true" /><span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#5e687b]">{size.label}</span></div>
            ))}
          </div>
          <ul className="mt-6 grid gap-5">
            {points.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#ffc107]/18"><Icon className="size-5 text-[#a66e00]" aria-hidden="true" /></span><div><h3 className="font-black text-[#0a1230]">{title}</h3><p className="mt-1 text-sm leading-6 text-[#5e687b]">{text}</p></div></li>
            ))}
          </ul>
          <a href={whatsapp("frota_home")} target="_blank" rel="noopener noreferrer" className="fluid-action mt-8 inline-flex items-center gap-2 text-sm font-black text-[#0e2f6d]">Qual caminhão atende minha mudança? <ArrowRight className="size-4" aria-hidden="true" /></a>
        </Reveal>
        <Reveal delay={0.08} className="h-full">
          <div className="fleet-collage relative h-full min-h-[28rem] pb-10 lg:pb-0">
            <figure className="fluid-card group absolute inset-x-0 bottom-10 top-0 overflow-hidden rounded-[1rem] bg-[#0a1230] shadow-[0_28px_90px_rgba(10,18,48,.18)] lg:bottom-0 lg:left-10">
              <Image src="/assets/context-pack-asi/02-porta-frota-asi-optimized.jpg" alt="Porta traseira de caminhão próprio da ASI com identidade Alexandre Soluções Integradas" fill sizes="(min-width:1024px) 50vw, 100vw" className="fluid-media object-cover" />
              <figcaption className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/65 to-transparent px-5 pb-14 pt-5 text-right text-xs font-bold uppercase tracking-[0.12em] text-white/85">Caminhão próprio ASI · Petrolina, PE</figcaption>
            </figure>
            <figure className="absolute bottom-0 left-4 w-[46%] max-w-[15rem] overflow-hidden rounded-[0.9rem] border-4 border-white bg-[#0a1230] shadow-[0_24px_60px_rgba(10,18,48,.32)] lg:-left-2 lg:bottom-10">
              <div className="relative aspect-[3/4]">
                <Image src="/assets/instagram/asi-ig-entrega-sao-paulo-poster.jpg" alt="Caminhão da ASI na entrega de mudança residencial em São Paulo" fill sizes="240px" className="object-cover" />
              </div>
              <figcaption className="bg-white px-3 py-2 text-[0.7rem] font-bold leading-4 text-[#0a1230]">Entrega em São Paulo<br /><span className="font-semibold text-[#5e687b]">Instagram · set 2026</span></figcaption>
            </figure>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function FounderSection() {
  return (
    <section id="sobre" className="bg-[#f4f5f8] py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-[75rem] gap-10 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-16">
        <Reveal>
          <div className="fluid-card group relative mx-auto aspect-[4/5] max-w-[27rem] overflow-hidden rounded-[0.9rem] bg-[#101f47]">
            <Image src="/assets/context-pack-asi/07-sr-alexandre-foto.jpg" alt="Sr. José Alexandre Rodrigues, diretor da ASI" fill sizes="(min-width:1024px) 36vw, 90vw" className="fluid-media object-cover object-top" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07142f] via-[#07142f]/85 to-transparent p-6 pt-24 text-white">
              <strong className="block text-lg">José Alexandre Rodrigues</strong>
              <small className="mt-1 block text-white/60">Diretor · ASI · Petrolina, PE</small>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <SectionLabel>07 — Quem atende</SectionLabel>
          <h2 className="type-display mt-5 max-w-[45rem] font-sans text-[#0a1230]">Atendimento direto com quem assina pelo trabalho.</h2>
          <p className="mt-7 max-w-[44rem] text-base leading-8 text-[#5e687b]">Sou o Sr. Alexandre. Bacharel em Administração, ex-professor do Instituto Federal do Sertão Pernambucano e empreendedor em Petrolina. Fundei a ASI para trazer disciplina de gestor e paciência de educador à operação de mudanças e fretes.</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Bacharel em Administração", "Ex-professor do IF Sertão", "Operação diária no Vale"].map((item) => <li key={item} className="border-l-2 border-[#ffc107] bg-white p-4 text-sm font-bold text-[#27334a]">{item}</li>)}
          </ul>
          <a href={whatsapp("founder")} target="_blank" rel="noopener noreferrer" className="fluid-action fluid-press mt-8 inline-flex min-h-13 items-center gap-3 rounded-md bg-[#25d366] px-6 text-sm font-black text-[#07142f]">Falar diretamente comigo <ArrowRight className="size-4" aria-hidden="true" /></a>
        </Reveal>
      </div>
    </section>
  );
}

export function MethodSection() {
  const steps = [
    ["01", "Você chama no WhatsApp", "Pelo botão do site ou pelo formulário curto. Atendimento direto com o Sr. Alexandre, das 6h às 22h.", "conversa"],
    ["02", "Manda fotos e conta o destino", "Fotos dos cômodos e dos móveis mostram o volume real. Não precisa listar item por item.", "fotos"],
    ["03", "Recebe as opções", "Com ou sem embalagem, carga exclusiva ou compartilhada, com ou sem ajudantes.", "orçamento"],
    ["04", "Agenda e documentos", "Data combinada e, antes da chegada, os dados do veículo e do motorista.", "agenda"],
    ["05", "Entrega acompanhada", "Descarga, conferência das caixas identificadas e montagem quando contratada.", "destino"],
  ] as const;

  return (
    <section id="metodo" className="bg-[#0b1738] py-20 text-white sm:py-28">
      <div className="mx-auto grid w-full max-w-[75rem] gap-12 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
        <Reveal>
          <SectionLabel light>08 — Como funciona</SectionLabel>
          <h2 className="type-display mt-5 font-sans">Da primeira mensagem ao destino.</h2>
          <p className="mt-6 text-base leading-8 text-white/66">O orçamento nasce na conversa. Cada mudança tem um volume, um acesso e uma necessidade de embalagem diferentes, e isso se resolve melhor falando.</p>
          <div className="box-tip mt-8 rounded-[0.8rem] border border-[#ffc107]/35 bg-[#ffc107]/[.07] p-5">
            <strong className="flex items-center gap-2 text-sm text-[#ffc107]"><BadgeCheck className="size-4" aria-hidden="true" />Dica: como identificar as caixas</strong>
            <p className="mt-2 text-sm leading-6 text-white/72">Numere cada caixa com pincel permanente e escreva o cômodo ou o móvel. Assim a descarga vai direto para o lugar certo.</p>
            <ul className="mt-4 grid gap-1.5 font-mono text-xs text-white/85">
              <li>CAIXA 1 · GUARDA-ROUPA</li>
              <li>CAIXA 2 · GUARDA-ROUPA</li>
              <li>CAIXA 3 · COZINHA</li>
            </ul>
          </div>
        </Reveal>
        <ol className="border-t border-white/14">
          {steps.map(([number, title, description, stage]) => (
            <li key={number} className="grid grid-cols-[2rem_1fr_auto] gap-4 border-b border-white/14 py-5 transition-colors duration-300 hover:bg-white/[.035] sm:grid-cols-[3rem_1fr_auto] sm:gap-6 sm:px-4">
              <span className="font-mono text-xs text-[#ffc107]">{number}</span><div><h3 className="font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/64">{description}</p></div><small className="hidden font-mono text-xs uppercase tracking-[0.1em] text-white/45 sm:block">{stage}</small>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contato" className="bg-white py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-[75rem] gap-10 px-4 sm:px-6 lg:grid-cols-[0.76fr_1.24fr] lg:items-start lg:gap-16">
        <Reveal>
          <SectionLabel>09 — Orçamento</SectionLabel>
          <h2 className="type-display mt-5 font-sans text-[#0a1230]">O orçamento começa por uma conversa.</h2>
          <p className="mt-6 text-base leading-7 text-[#5e687b]">Envie a rota pelo formulário curto ou chame direto. No WhatsApp você manda fotos, tira dúvidas e recebe as opções.</p>
          <div className="mt-8 rounded-[0.9rem] bg-[#0a1230] p-6 text-white">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#ffc107]">Direto com o Sr. Alexandre</span>
            <strong className="mt-3 block text-3xl font-black tracking-[-0.03em]">{DISPLAY_PHONE}</strong>
            <span className="mt-1 block text-sm text-white/60">WhatsApp · todos os dias, 06h às 22h</span>
            <a href={whatsapp("footer_direct")} target="_blank" rel="noopener noreferrer" className="fluid-press mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#25d366] px-5 text-sm font-black text-[#07142f] hover:bg-[#47dd7c]"><MessageCircle className="size-4" aria-hidden="true" /> Chamar agora</a>
          </div>
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
  const items = faqItems;

  return (
    <section id="faq" className="bg-[#f4f5f8] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[75rem] px-4 sm:px-6">
        <SectionLabel>10 — Dúvidas frequentes</SectionLabel>
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
