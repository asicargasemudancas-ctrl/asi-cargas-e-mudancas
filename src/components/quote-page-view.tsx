import Image from "next/image";
import { Suspense } from "react";
import { BadgeCheck, Clock3, MessageCircle, Route } from "lucide-react";

import { FullQuoteForm } from "@/components/full-quote-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function QuotePageView() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#07142f] pt-28 text-white">
        <section className="relative isolate overflow-hidden pb-20 pt-10 sm:pb-28">
          <Image src="/assets/context-pack-asi/01-hero-caminhao-real-premium-optimized.jpg" alt="Caminhão ASI pronto para uma rota de mudança" fill priority sizes="100vw" className="-z-20 object-cover opacity-25" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(255,193,7,.16),transparent_24rem),linear-gradient(180deg,rgba(7,20,47,.78),#07142f_68%)]" />
          <div className="mx-auto w-full max-w-[75rem] px-4 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-14">
              <div className="lg:sticky lg:top-28">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#ffc107]">Pedido organizado · sem cadastro</span>
                <h1 className="type-hero mt-5 font-sans">Orçamento de mudança, sem conversa perdida.</h1>
                <p className="mt-7 max-w-xl text-base leading-8 text-white/64">Rota, data, volume e acesso entram em ordem. No final, você revisa e abre a mensagem pronta no WhatsApp do Sr. Alexandre.</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {[{ icon: Route, text: "Rota antes do valor" }, { icon: BadgeCheck, text: "Você confirma o envio" }, { icon: Clock3, text: "Atendimento 06h–22h" }, { icon: MessageCircle, text: "WhatsApp com contexto" }].map(({ icon: Icon, text }) => <div key={text} className="flex min-h-14 items-center gap-3 rounded-md border border-white/12 bg-white/5 px-4 text-sm font-bold text-white/72"><Icon className="size-5 text-[#ffc107]" aria-hidden="true" />{text}</div>)}
                </div>
              </div>
              <Suspense fallback={<div className="min-h-[40rem] animate-pulse rounded-[0.9rem] border border-white/12 bg-white/5" aria-label="Carregando formulário" />}>
                <FullQuoteForm />
              </Suspense>
            </div>
          </div>
        </section>
        <section className="border-t border-white/10 bg-[#050d23] py-16">
          <div className="mx-auto grid w-full max-w-[75rem] gap-8 px-4 sm:px-6 lg:grid-cols-3">
            <figure className="relative aspect-[16/11] overflow-hidden rounded-[0.8rem]"><Image src="/assets/context-pack-asi/05-embalagem-protecao-close-optimized.jpg" alt="Item protegido para transporte em mudança" fill sizes="33vw" className="object-cover" /></figure>
            <figure className="relative aspect-[16/11] overflow-hidden rounded-[0.8rem]"><Image src="/assets/context-pack-asi/04-equipe-mudanca-residencial-optimized.jpg" alt="Equipe da ASI durante uma mudança" fill sizes="33vw" className="object-cover" /></figure>
            <div className="flex flex-col justify-center"><span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#ffc107]">O que muda no valor</span><h2 className="type-display-sm mt-4 font-sans">O pedido certo evita surpresa no dia.</h2><p className="mt-5 text-sm leading-7 text-white/60">A ASI avalia rota, volume, acesso, ajudantes e extras antes de responder.</p></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
