"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Send, X } from "lucide-react";

import { leadAnalyticsParams, trackEvent } from "@/lib/analytics";
import {
  buildHomeQuoteMessage,
  buildQuickQuoteMessage,
  buildWhatsAppUrl,
  createLeadReference,
  type QuotePayload,
} from "@/lib/whatsapp";

const heavyItems = [
  ["Geladeira", "Geladeira"],
  ["Fogao", "Fogão"],
  ["Maquina de lavar", "Máquina de lavar"],
  ["Sofa", "Sofá"],
  ["Guarda-roupa", "Guarda-roupa"],
  ["Cama box", "Cama box"],
  ["Colchao casal", "Colchão casal"],
  ["Mesa de jantar", "Mesa"],
  ["Rack/estante", "Rack"],
  ["TV grande", "TV grande"],
] as const;

const extras = [
  ["embalagem", "Embalagem"],
  ["montagem", "Montagem"],
  ["itens frageis", "Frágeis"],
] as const;

function checkedValues(form: FormData, name: string) {
  return form.getAll(name).map(String);
}

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
  const [selected, setSelected] = useState<string[]>([]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    openLead("form_hero", {
      page: "home",
      origin: String(form.get("origin") ?? ""),
      destination: String(form.get("destination") ?? ""),
      volume: selected.join(", "),
      items: selected,
      url: window.location.href,
    }, false);
  }

  return (
    <form onSubmit={submit} className="glass-panel relative z-10 mx-auto grid w-full max-w-[75rem] gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-[0.7fr_1fr_1fr_1.25fr_auto] xl:items-end" aria-label="Pedido rápido de mudança">
      <div className="hidden xl:block">
        <strong className="block text-sm font-black uppercase tracking-[0.12em] text-white">Pedido rápido</strong>
        <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-white/48">sem cadastro</span>
      </div>
      <label className="text-xs font-bold uppercase tracking-[0.12em] text-white/55">Origem
        <input name="origin" required placeholder="Cidade de origem" className="mt-2 min-h-12 w-full rounded-md border border-white/16 bg-white/7 px-3 text-sm font-medium normal-case tracking-normal text-white placeholder:text-white/35" />
      </label>
      <label className="text-xs font-bold uppercase tracking-[0.12em] text-white/55">Destino
        <input name="destination" required placeholder="Cidade ou estado" className="mt-2 min-h-12 w-full rounded-md border border-white/16 bg-white/7 px-3 text-sm font-medium normal-case tracking-normal text-white placeholder:text-white/35" />
      </label>
      <HeavyItemsSelector selected={selected} onChange={setSelected} />
      <button type="submit" className="fluid-press flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#25d366] px-5 text-sm font-black text-[#06122c] transition hover:bg-[#47dd7c]">
        Enviar rota <Send className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
}

function HeavyItemsSelector({
  selected,
  onChange,
}: Readonly<{
  selected: string[];
  onChange: (items: string[]) => void;
}>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const shouldReduceMotion = useReducedMotion();
  const selectedLabels = heavyItems
    .filter(([value]) => selected.includes(value))
    .map(([, label]) => label);
  const triggerLabel = selectedLabels.length === 0
    ? "Selecionar itens"
    : selectedLabels.length <= 2
      ? selectedLabels.join(", ")
      : `${selectedLabels[0]} +${selectedLabels.length - 1}`;

  useEffect(() => {
    if (!open) return;

    function closeOnOutsidePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative text-xs font-bold uppercase tracking-[0.12em] text-white/55">
      <span>Itens pesados</span>
      <button
        ref={triggerRef}
        type="button"
        data-testid="heavy-items-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="fluid-press mt-2 flex min-h-12 w-full items-center justify-between gap-3 rounded-md border border-white/16 bg-white/7 px-3 text-left text-sm font-medium normal-case tracking-normal text-white transition hover:border-white/30 hover:bg-white/10"
      >
        <span className="truncate">{triggerLabel}</span>
        <ChevronDown className={`size-4 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            data-testid="heavy-items-menu"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.985 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-50 mt-2 grid max-h-64 grid-cols-2 gap-2 overflow-auto rounded-md border border-white/16 bg-[#0c1938]/98 p-3 normal-case tracking-normal shadow-2xl shadow-black/35 xl:absolute xl:inset-x-0 xl:bottom-full xl:top-auto xl:mb-2 xl:mt-0"
          >
            <div className="col-span-2 flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-semibold text-white/58">Marque o que vai no caminhão</span>
              {selected.length > 0 && (
                <button type="button" onClick={() => onChange([])} className="inline-flex min-h-8 items-center gap-1 text-xs font-semibold text-[#ffcf33] hover:text-white">
                  <X className="size-3.5" aria-hidden="true" /> Limpar
                </button>
              )}
            </div>
            {heavyItems.map(([value, label]) => (
              <label key={value} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md bg-white/5 px-3 text-xs text-white/82 transition hover:bg-white/10">
                <input
                  type="checkbox"
                  value={value}
                  checked={selected.includes(value)}
                  onChange={(event) => onChange(event.target.checked
                    ? [...selected, value]
                    : selected.filter((item) => item !== value))}
                />
                {label}
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
      urgency: String(form.get("urgency") ?? ""),
      volume: String(form.get("volume") ?? ""),
      access: String(form.get("access") ?? ""),
      items: checkedValues(form, "items"),
      extras: checkedValues(form, "extras"),
      phone: String(form.get("phone") ?? ""),
      url: window.location.href,
    };
    openLead("form_contato", payload, true);
  }

  const fieldClass = "mt-2 min-h-12 w-full rounded-md border border-[#d7dce6] bg-white px-3 text-base font-medium text-[#0b1536] shadow-sm transition focus:border-[#0e2f6d]";

  return (
    <form onSubmit={submit} data-testid="home-quote-form" className="grid gap-5 rounded-[1rem] border border-[#dfe3eb] bg-white p-5 shadow-[0_24px_80px_rgba(10,18,48,.12)] sm:grid-cols-2 sm:p-8" aria-labelledby="quote-form-title">
      <div className="sm:col-span-2">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a66e00]">Orçamento direto</span>
        <h3 id="quote-form-title" className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#0a1230]">Dados da mudança</h3>
      </div>
      <input type="hidden" name="service" value="Mudança residencial" />
      <label className="form-field text-sm font-extrabold text-[#0a1230]">Origem<input name="origin" placeholder="Bairro ou cidade de saída" required className={fieldClass} /></label>
      <label className="form-field text-sm font-extrabold text-[#0a1230]">Destino<input name="destination" placeholder="Bairro ou cidade de chegada" required className={fieldClass} /></label>
      <label className="form-field text-sm font-extrabold text-[#0a1230]">Data<input type="date" name="date" className={fieldClass} /></label>
      <label className="form-field text-sm font-extrabold text-[#0a1230]">Urgência<select name="urgency" className={fieldClass}><option value="">Selecione</option><option>Hoje ou amanhã</option><option>Esta semana</option><option>Data marcada</option><option>Ainda pesquisando</option></select></label>
      <label className="form-field text-sm font-extrabold text-[#0a1230]">Volume<select name="volume" required className={fieldClass}><option value="">Selecione</option><option>1 a 2 cômodos</option><option>Casa inteira</option><option>Comercial ou carga</option><option>Só itens grandes</option></select></label>
      <label className="form-field text-sm font-extrabold text-[#0a1230]">Acesso<select name="access" className={fieldClass}><option value="">Selecione</option><option>Casa térrea</option><option>Prédio com elevador</option><option>Escada</option><option>Rua estreita ou difícil acesso</option></select></label>
      <fieldset className="sm:col-span-2">
        <legend className="mb-3 text-sm font-extrabold text-[#0a1230]">Itens pesados mais comuns</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {heavyItems.map(([value, label]) => <CheckOption key={value} name="items" value={value} label={label} />)}
        </div>
      </fieldset>
      <fieldset className="sm:col-span-2">
        <legend className="mb-3 text-sm font-extrabold text-[#0a1230]">Extras</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {extras.map(([value, label]) => <CheckOption key={value} name="extras" value={value} label={label} />)}
        </div>
      </fieldset>
      <label className="form-field text-sm font-extrabold text-[#0a1230] sm:col-span-2">WhatsApp<input name="phone" inputMode="tel" placeholder="(87) 9..." required className={fieldClass} /></label>
      <p className="text-sm leading-6 text-[#5e687b] sm:col-span-2">O WhatsApp abre com rota, volume, urgência e observações. Nenhum dado é enviado antes de você confirmar.</p>
      <button type="submit" className="flex min-h-14 items-center justify-center gap-3 rounded-md bg-[#25d366] px-6 text-base font-black text-[#07142f] transition hover:-translate-y-0.5 hover:bg-[#47dd7c] sm:col-span-2">
        Pedir orçamento pelo WhatsApp <ArrowRight className="size-5" aria-hidden="true" />
      </button>
    </form>
  );
}

function CheckOption({ name, value, label }: Readonly<{ name: string; value: string; label: string }>) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center gap-2 rounded-md border border-[#dfe3eb] bg-[#f7f8fb] px-3 text-sm font-semibold text-[#27334a] transition hover:border-[#0e2f6d]">
      <input type="checkbox" name={name} value={value} className="size-4 accent-[#0e2f6d]" />
      <span>{label}</span>
    </label>
  );
}
