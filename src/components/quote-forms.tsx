"use client";

import { FormEvent } from "react";
import { ArrowRight, Camera, MessageCircle } from "lucide-react";

import { leadAnalyticsParams, trackEvent } from "@/lib/analytics";
import {
  buildHomeQuoteMessage,
  buildQuickQuoteMessage,
  buildWhatsAppUrl,
  createLeadReference,
  type QuotePayload,
} from "@/lib/whatsapp";

const serviceOptions = [
  "Mudança residencial",
  "Mudança comercial",
  "Mudança interestadual",
  "Frete ou carga",
  "Embalagem e montagem",
] as const;

function openLead(source: string, payload: QuotePayload, structured: boolean) {
  const reference = createLeadReference();
  const message = structured
    ? buildHomeQuoteMessage(payload, reference)
    : buildQuickQuoteMessage(source, payload, reference);
  trackEvent("generate_lead", leadAnalyticsParams(source, payload));
  try {
    localStorage.setItem("asi:last-lead-reference", reference);
  } catch {
    // A navegação para o WhatsApp continua mesmo sem armazenamento local.
  }
  window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
}

export function QuickQuoteForm() {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const origin = String(form.get("origin") ?? "").trim();
    const destination = String(form.get("destination") ?? "").trim();
    openLead("form_hero", {
      page: "home",
      origin,
      destination,
      route: `${origin} para ${destination}`,
      url: window.location.href,
    }, false);
  }

  const fieldClass = "mt-2 min-h-12 w-full rounded-md border border-white/16 bg-white/7 px-3 text-sm font-medium normal-case tracking-normal text-white placeholder:text-white/35 focus:border-[#ffc107]";

  return (
    <form onSubmit={submit} className="glass-panel relative z-10 mx-auto grid w-full max-w-[75rem] gap-3 rounded-[0.9rem] p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[0.9fr_1fr_1fr_auto] lg:items-end" aria-label="Pedido rápido de mudança">
      <div className="sm:col-span-2 lg:col-span-1">
        <strong className="block text-sm font-black uppercase tracking-[0.12em] text-white">Para onde vai a mudança?</strong>
        <span className="mt-1 flex items-center gap-2 text-xs font-semibold text-white/55"><Camera className="size-3.5 text-[#ffcf33]" aria-hidden="true" />Fotos e detalhes você manda na conversa</span>
      </div>
      <label className="text-xs font-bold uppercase tracking-[0.12em] text-white/55">Origem
        <input name="origin" required placeholder="Cidade de saída" autoComplete="address-level2" className={fieldClass} />
      </label>
      <label className="text-xs font-bold uppercase tracking-[0.12em] text-white/55">Destino
        <input name="destination" required placeholder="Cidade ou estado" className={fieldClass} />
      </label>
      <button type="submit" className="fluid-press flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#25d366] px-5 text-sm font-black text-[#06122c] transition hover:bg-[#47dd7c] sm:col-span-2 lg:col-span-1">
        Continuar no WhatsApp <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
}

export function HomeQuoteForm() {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload: QuotePayload = {
      page: "home",
      service: String(form.get("service") ?? "Mudança residencial"),
      origin: String(form.get("origin") ?? ""),
      destination: String(form.get("destination") ?? ""),
      date: String(form.get("date") ?? ""),
      name: String(form.get("name") ?? ""),
      url: window.location.href,
    };
    openLead("form_contato", payload, true);
  }

  const fieldClass = "mt-2 min-h-12 w-full rounded-md border border-[#d7dce6] bg-white px-3 text-base font-medium text-[#0b1536] shadow-sm transition focus:border-[#0e2f6d]";

  return (
    <form onSubmit={submit} data-testid="home-quote-form" className="grid gap-5 rounded-[1rem] border border-[#dfe3eb] bg-white p-5 shadow-[0_24px_80px_rgba(10,18,48,.12)] sm:grid-cols-2 sm:p-8" aria-labelledby="quote-form-title">
      <div className="sm:col-span-2">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a66e00]">Orçamento pelo WhatsApp</span>
        <h3 id="quote-form-title" className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#0a1230]">Comece pela rota</h3>
        <p className="mt-2 text-sm leading-6 text-[#5e687b]">Quatro dados para abrir a conversa. O resto o Sr. Alexandre combina com você.</p>
      </div>
      <label className="form-field text-sm font-extrabold text-[#0a1230] sm:col-span-2">Tipo de serviço<select name="service" required defaultValue="Mudança residencial" className={fieldClass}>{serviceOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
      <label className="form-field text-sm font-extrabold text-[#0a1230]">Origem<input name="origin" placeholder="Cidade de saída" required className={fieldClass} /></label>
      <label className="form-field text-sm font-extrabold text-[#0a1230]">Destino<input name="destination" placeholder="Cidade de chegada" required className={fieldClass} /></label>
      <label className="form-field text-sm font-extrabold text-[#0a1230]">Data aproximada <span className="font-semibold text-[#6c7484]">(opcional)</span><input name="date" placeholder="Ex.: fim de novembro" className={fieldClass} /></label>
      <label className="form-field text-sm font-extrabold text-[#0a1230]">Seu nome <span className="font-semibold text-[#6c7484]">(opcional)</span><input name="name" autoComplete="given-name" placeholder="Como prefere ser chamado" className={fieldClass} /></label>
      <div className="flex gap-3 rounded-md border border-[#25d366]/30 bg-[#25d366]/8 p-4 text-sm leading-6 text-[#27334a] sm:col-span-2">
        <MessageCircle className="mt-0.5 size-5 shrink-0 text-[#128c4a]" aria-hidden="true" />
        <p>Na conversa você manda <strong>fotos dos móveis e das caixas</strong> e pode pedir opções: com ou sem embalagem, carga exclusiva ou compartilhada. Nada é enviado antes de você confirmar no WhatsApp.</p>
      </div>
      <button type="submit" className="fluid-press flex min-h-14 items-center justify-center gap-3 rounded-md bg-[#25d366] px-6 text-base font-black text-[#07142f] transition hover:bg-[#47dd7c] sm:col-span-2">
        Abrir conversa no WhatsApp <ArrowRight className="size-5" aria-hidden="true" />
      </button>
    </form>
  );
}
