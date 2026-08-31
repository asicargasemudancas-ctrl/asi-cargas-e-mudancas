"use client";

import { FormEvent, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { trackEvent } from "@/lib/analytics";
import {
  buildFullQuoteMessage,
  buildWhatsAppUrl,
  createLeadReference,
  type FullQuotePayload,
} from "@/lib/whatsapp";

const FORM_VERSION = "asi-orcamento-next-v1-20260830";
const STORAGE_KEY = "asi_quote_leads";
const SHEETS_ENDPOINT = process.env.NEXT_PUBLIC_ASI_SHEETS_ENDPOINT?.trim() ?? "";

const states = [
  ["AC", "Acre"], ["AL", "Alagoas"], ["AP", "Amapá"], ["AM", "Amazonas"], ["BA", "Bahia"],
  ["CE", "Ceará"], ["DF", "Distrito Federal"], ["ES", "Espírito Santo"], ["GO", "Goiás"],
  ["MA", "Maranhão"], ["MT", "Mato Grosso"], ["MS", "Mato Grosso do Sul"], ["MG", "Minas Gerais"],
  ["PA", "Pará"], ["PB", "Paraíba"], ["PR", "Paraná"], ["PE", "Pernambuco"], ["PI", "Piauí"],
  ["RJ", "Rio de Janeiro"], ["RN", "Rio Grande do Norte"], ["RS", "Rio Grande do Sul"],
  ["RO", "Rondônia"], ["RR", "Roraima"], ["SC", "Santa Catarina"], ["SP", "São Paulo"],
  ["SE", "Sergipe"], ["TO", "Tocantins"],
] as const;

const stepTitles = ["Rota", "Data", "Volume", "Acesso", "Contato"] as const;
const serviceMap: Readonly<Record<string, string>> = {
  "Mudança residencial": "mudanca-residencial",
  "Mudança comercial": "mudanca-comercial",
  "Mudança interestadual": "mudanca-interestadual",
  "Fretes e cargas": "frete-carga",
  "Frete ou carga": "frete-carga",
  "Embalagem e montagem": "embalagem-montagem",
};

function value(form: HTMLFormElement, name: string): string {
  return String(new FormData(form).get(name) ?? "").trim();
}

function checkedValues(form: HTMLFormElement, name: string): string[] {
  return new FormData(form).getAll(name).map(String);
}

function selectedLabel(form: HTMLFormElement, name: string): string {
  const select = form.elements.namedItem(name);
  if (select instanceof HTMLSelectElement) return select.selectedOptions[0]?.text.trim() ?? "";
  const checked = form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
  return checked?.closest("label")?.textContent?.trim() ?? "";
}

function formatDate(raw: string): string {
  if (!raw) return "A definir";
  const [year, month, day] = raw.split("-");
  return year && month && day ? `${day}/${month}/${year}` : raw;
}

function payloadFrom(form: HTMLFormElement): FullQuotePayload {
  const datePending = value(form, "date_pending") === "sim";
  return {
    dateRequested: datePending ? "A definir" : formatDate(value(form, "date_option")),
    dateFlexibilityLabel: selectedLabel(form, "date_flexibility"),
    originState: value(form, "origin_state"),
    originCity: value(form, "origin_city"),
    originNeighborhood: value(form, "origin_neighborhood"),
    originAddressRef: value(form, "origin_address_ref"),
    destinationState: value(form, "destination_state"),
    destinationCity: value(form, "destination_city"),
    destinationNeighborhood: value(form, "destination_neighborhood"),
    destinationAddressRef: value(form, "destination_address_ref"),
    volumeSizeLabel: selectedLabel(form, "volume_size"),
    inventoryText: value(form, "inventory_text"),
    largeItems: checkedValues(form, "large_items"),
    boxesCount: value(form, "boxes_count"),
    bagsCount: value(form, "bags_count"),
    helpersOrigin: selectedLabel(form, "helpers_origin"),
    helpersDestination: selectedLabel(form, "helpers_destination"),
    serviceTypeLabel: selectedLabel(form, "service_type"),
    packingNeeded: selectedLabel(form, "packing_needed"),
    disassemblyNeeded: selectedLabel(form, "disassembly_needed"),
    originPropertyType: selectedLabel(form, "origin_property_type"),
    destinationPropertyType: selectedLabel(form, "destination_property_type"),
    originFloor: value(form, "origin_floor"),
    destinationFloor: value(form, "destination_floor"),
    accessNotes: value(form, "access_notes"),
    name: value(form, "name"),
    phone: value(form, "phone"),
  };
}

function persistLead(lead: Readonly<Record<string, unknown>>) {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown[];
    localStorage.setItem(STORAGE_KEY, JSON.stringify([lead, ...current].slice(0, 50)));
  } catch {
    // A abertura do WhatsApp não depende de armazenamento local.
  }
}

function sendToSheet(lead: Readonly<Record<string, unknown>>) {
  if (!SHEETS_ENDPOINT) return;
  const payload = JSON.stringify(lead);
  if (navigator.sendBeacon) {
    navigator.sendBeacon(SHEETS_ENDPOINT, new Blob([payload], { type: "text/plain;charset=utf-8" }));
    return;
  }
  void fetch(SHEETS_ENDPOINT, { method: "POST", mode: "no-cors", keepalive: true, body: payload }).catch(() => undefined);
}

export function FullQuoteForm() {
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [datePending, setDatePending] = useState(false);
  const [preview, setPreview] = useState("O pedido aparece aqui conforme o formulário é preenchido.");
  const serviceDefault = serviceMap[searchParams.get("servico") ?? ""] ?? "";
  const routeDefault = searchParams.get("rota") ?? "";
  const routeParts = routeDefault.split(/\s+para\s+/i);

  function validateCurrent() {
    const fieldset = formRef.current?.querySelector<HTMLFieldSetElement>(`[data-step="${step}"]`);
    if (!fieldset) return false;
    const invalid = [...fieldset.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea")]
      .find((control) => !control.disabled && !control.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      invalid.focus();
      return false;
    }
    return true;
  }

  function updatePreview(form: HTMLFormElement) {
    setPreview(buildFullQuoteMessage(payloadFrom(form)));
  }

  function next() {
    if (!validateCurrent()) return;
    setStep((current) => Math.min(5, current + 1));
  }

  function openCurrent(form: HTMLFormElement, final: boolean) {
    const reference = createLeadReference();
    const payload = payloadFrom(form);
    const message = buildFullQuoteMessage(payload);
    const lead = {
      ...Object.fromEntries(new FormData(form).entries()),
      large_items: checkedValues(form, "large_items"),
      ref: reference,
      created_at: new Date().toISOString(),
      form_version: FORM_VERSION,
      source: "site-asi-orcamento",
      final,
    };
    if (final) {
      persistLead(lead);
      sendToSheet(lead);
      trackEvent("generate_lead", {
        source: "orcamento_submit",
        form_version: FORM_VERSION,
        service_type: value(form, "service_type"),
        has_origin: value(form, "origin_city") && value(form, "origin_state") ? "yes" : "no",
        has_destination: value(form, "destination_city") && value(form, "destination_state") ? "yes" : "no",
        has_volume: value(form, "inventory_text") || checkedValues(form, "large_items").length ? "yes" : "no",
        has_phone: value(form, "phone") ? "yes" : "no",
      });
    } else {
      trackEvent("whatsapp_click", { source: "orcamento_partial", form_version: FORM_VERSION, step });
    }
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateCurrent() || !event.currentTarget.reportValidity()) return;
    openCurrent(event.currentTarget, true);
  }

  const inputClass = "mt-2 min-h-12 w-full rounded-md border border-white/18 bg-white/8 px-3 text-base text-white outline-none placeholder:text-white/32 focus:border-[#ffc107]";
  const labelClass = "text-sm font-bold text-white/78";

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      onInput={(event) => updatePreview(event.currentTarget)}
      data-testid="full-quote-form"
      className="glass-panel overflow-hidden rounded-[0.9rem]"
      aria-label="Formulário de orçamento ASI"
      noValidate
    >
      <input type="hidden" name="ref" value="ASI-2026-0000" readOnly />
      <div className="border-b border-white/12 bg-[#0e2f6d]/70 p-5 sm:p-7">
        <strong className="block text-xl font-black text-white">Monte seu pedido de mudança</strong>
        <span className="mt-2 block text-sm leading-6 text-white/60">Responda o que souber agora. Se faltar algo, a ASI confirma pelo WhatsApp.</span>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Progresso do formulário">
          {stepTitles.map((title, index) => <span key={title} className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-black ${index + 1 <= step ? "border-[#ffc107]/60 bg-[#ffc107]/12 text-white" : "border-white/12 text-white/38"}`}><b className={`grid size-6 place-items-center rounded-full ${index + 1 < step ? "bg-[#ffc107] text-[#0a1230]" : "bg-white/8"}`}>{index + 1 < step ? <Check className="size-3.5" /> : index + 1}</b>{title}</span>)}
        </div>
        <span className="mt-4 block text-sm font-bold text-[#ffcf33]">Etapa {step} de 5 · {stepTitles[step - 1]}</span>
      </div>

      <div className="grid lg:grid-cols-[1.28fr_0.72fr]">
        <div className="p-5 sm:p-7">
          <fieldset data-step="1" hidden={step !== 1}>
            <legend className="text-2xl font-black text-white">De onde sai e para onde vai?</legend>
            <p className="mt-2 text-sm leading-6 text-white/52">Estado e cidade são obrigatórios. Bairro e referência ajudam a avaliar o acesso.</p>
            <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_auto_1fr] xl:items-center">
              <RoutePanel title="Origem da mudança" marker="A">
                <StateSelect id="originState" name="origin_state" label="Estado de saída" className={inputClass} />
                <TextField id="originCity" name="origin_city" label="Cidade de saída" placeholder="Ex.: Petrolina" required className={inputClass} defaultValue={routeParts.length === 2 ? routeParts[0] : ""} />
                <TextField id="originNeighborhood" name="origin_neighborhood" label="Bairro de saída" placeholder="Ex.: Centro" className={inputClass} />
                <TextField id="originAddressRef" name="origin_address_ref" label="Referência" placeholder="Ex.: próximo à avenida" className={inputClass} />
              </RoutePanel>
              <ArrowRight className="mx-auto size-6 rotate-90 text-[#ffc107] xl:rotate-0" aria-hidden="true" />
              <RoutePanel title="Destino da mudança" marker="B" blue>
                <StateSelect id="destinationState" name="destination_state" label="Estado de chegada" className={inputClass} />
                <TextField id="destinationCity" name="destination_city" label="Cidade de chegada" placeholder="Ex.: Fortaleza" required className={inputClass} defaultValue={routeParts.length === 2 ? routeParts[1] : ""} />
                <TextField id="destinationNeighborhood" name="destination_neighborhood" label="Bairro de chegada" placeholder="Ex.: Aldeota" className={inputClass} />
                <TextField id="destinationAddressRef" name="destination_address_ref" label="Referência" placeholder="Ex.: próximo ao shopping" className={inputClass} />
              </RoutePanel>
            </div>
          </fieldset>

          <fieldset data-step="2" hidden={step !== 2}>
            <legend className="text-2xl font-black text-white">Quando precisa?</legend>
            <p className="mt-2 text-sm leading-6 text-white/52">A data pode ser exata ou aproximada. Flexibilidade ajuda a encaixar rota e equipe.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>O que a ASI vai transportar?<select name="service_type" required defaultValue={serviceDefault} className={inputClass}><option value="">Selecione</option><option value="mudanca-residencial">Mudança residencial</option><option value="mudanca-comercial">Mudança comercial</option><option value="mudanca-interestadual">Mudança interestadual</option><option value="frete-carga">Frete ou carga avulsa</option><option value="embalagem-montagem">Embalagem, desmontagem ou montagem</option></select></label>
              <label className={labelClass}>Data desejada<input name="date_option" type="date" required={!datePending} disabled={datePending} className={inputClass} /></label>
              <Choice name="date_pending" value="sim" label="Ainda estou definindo a data" type="checkbox" checked={datePending} onChange={setDatePending} />
              <ChoiceGroup title="Flexibilidade"><Choice name="date_flexibility" value="flexivel" label="Posso ajustar 1-3 dias" defaultChecked /><Choice name="date_flexibility" value="data-fixa" label="Preciso dessa data" /><Choice name="date_flexibility" value="urgente" label="É urgente" /></ChoiceGroup>
              <ChoiceGroup title="Momento do pedido"><Choice name="intent" value="orcamento-agora" label="Quero orçar agora" defaultChecked /><Choice name="intent" value="comparar-opcoes" label="Estou comparando opções" /><Choice name="intent" value="tirar-duvidas" label="Preciso tirar dúvidas primeiro" /></ChoiceGroup>
            </div>
          </fieldset>

          <fieldset data-step="3" hidden={step !== 3}>
            <legend className="text-2xl font-black text-white">Qual o tamanho da mudança?</legend>
            <p className="mt-2 text-sm leading-6 text-white/52">Uma estimativa já ajuda. Descreva os itens principais mesmo sem saber listar tudo.</p>
            <div className="mt-6 grid gap-5">
              <ChoiceGroup title="Tamanho aproximado" columns><Choice name="volume_size" value="poucos-itens" label="Poucos itens" /><Choice name="volume_size" value="um-dois-comodos" label="1-2 cômodos" /><Choice name="volume_size" value="casa-pequena" label="Casa ou apê pequeno" /><Choice name="volume_size" value="casa-inteira" label="Casa inteira" /><Choice name="volume_size" value="comercial" label="Comercial ou escritório" /><Choice name="volume_size" value="nao-sei" label="Ainda não sei" defaultChecked /></ChoiceGroup>
              <label className={labelClass}>O que vai no caminhão?<textarea name="inventory_text" required placeholder="Ex.: geladeira, fogão, máquina de lavar, sofá, cama box, caixas..." className={`${inputClass} min-h-32 py-3`} /></label>
              <ChoiceGroup title="Itens grandes" columns>{[["Geladeira", "Geladeira"], ["Fogao", "Fogão"], ["Maquina de lavar", "Máquina"], ["Sofa", "Sofá"], ["Cama box", "Cama box"], ["Mesa e cadeiras", "Mesa"]].map(([itemValue, label]) => <Choice key={itemValue} name="large_items" value={itemValue} label={label} type="checkbox" />)}</ChoiceGroup>
              <div className="grid gap-4 sm:grid-cols-2"><TextField id="boxesCount" name="boxes_count" label="Quantidade de caixas" type="number" placeholder="Ex.: 6" className={inputClass} /><TextField id="bagsCount" name="bags_count" label="Quantidade de sacos" type="number" placeholder="Ex.: 4" className={inputClass} /></div>
            </div>
          </fieldset>

          <fieldset data-step="4" hidden={step !== 4}>
            <legend className="text-2xl font-black text-white">Como é o acesso?</legend>
            <p className="mt-2 text-sm leading-6 text-white/52">Escada, elevador, rua estreita e horário de condomínio mudam tempo e equipe.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <PropertySelect name="origin_property_type" label="Imóvel na origem" className={inputClass} />
              <PropertySelect name="destination_property_type" label="Imóvel no destino" className={inputClass} />
              <TextField id="originFloor" name="origin_floor" label="Andar na origem" placeholder="Ex.: térreo, 3º andar" className={inputClass} />
              <TextField id="destinationFloor" name="destination_floor" label="Andar no destino" placeholder="Ex.: térreo, 2º andar" className={inputClass} />
              <ServiceSelect name="packing_needed" label="Embalagem" className={inputClass} />
              <ServiceSelect name="disassembly_needed" label="Desmontagem/montagem" className={inputClass} />
              <HelperSelect name="helpers_origin" label="Ajudantes na carga" className={inputClass} />
              <HelperSelect name="helpers_destination" label="Ajudantes na descarga" className={inputClass} />
            </div>
          </fieldset>

          <fieldset data-step="5" hidden={step !== 5}>
            <legend className="text-2xl font-black text-white">Para quem a ASI responde?</legend>
            <p className="mt-2 text-sm leading-6 text-white/52">Você não está fechando nada agora. É só para enviar o pedido organizado.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <TextField id="name" name="name" label="Nome" placeholder="Seu nome" required className={inputClass} />
              <TextField id="phone" name="phone" label="Seu WhatsApp" placeholder="(87) 9 0000-0000" required className={inputClass} />
              <label className={`${labelClass} sm:col-span-2`}>Observações importantes<textarea name="access_notes" placeholder="Portaria, rua estreita, horário permitido, item frágil..." className={`${inputClass} min-h-28 py-3`} /></label>
              <div className="sm:col-span-2"><Choice name="lgpd_consent" value="sim" label="Autorizo o contato da ASI pelo WhatsApp para retorno do orçamento." type="checkbox" required /></div>
            </div>
          </fieldset>
        </div>

        <aside className="border-t border-white/12 bg-white/4 p-5 lg:border-l lg:border-t-0 sm:p-7" aria-live="polite">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#ffc107]">Resumo do pedido</span>
          <strong className="mt-4 block text-lg text-white">Pedido em montagem</strong>
          <p className="mt-2 text-sm leading-6 text-white/50">Complete rota, volume e acesso para facilitar a resposta.</p>
          <div className="mt-6 rounded-md border border-white/10 bg-black/20 p-4"><strong className="text-sm text-white/78">Prévia da mensagem</strong><pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap text-xs leading-5 text-white/50">{preview}</pre></div>
        </aside>
      </div>

      <div className="grid gap-3 border-t border-white/12 bg-white/4 p-5 sm:grid-cols-[auto_1fr_auto] sm:p-7">
        <button type="button" onClick={() => setStep((current) => Math.max(1, current - 1))} hidden={step === 1} aria-label="Voltar" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/18 px-5 text-sm font-black text-white"><ArrowLeft className="size-4" /> Voltar</button>
        <button type="button" onClick={() => formRef.current && openCurrent(formRef.current, false)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#25d366]/45 bg-[#25d366]/8 px-5 text-sm font-black text-[#5de78e] sm:col-start-2">WhatsApp: enviar agora <Send className="size-4" /></button>
        <button type="button" onClick={next} hidden={step === 5} aria-label="Continuar" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#ffc107] px-6 text-sm font-black text-[#0a1230]">Continuar <ArrowRight className="size-4" /></button>
        <button type="submit" hidden={step !== 5} aria-label="Enviar pedido estruturado pelo WhatsApp" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#25d366] px-6 text-sm font-black text-[#07142f]">WhatsApp: enviar orçamento <Send className="size-4" /></button>
      </div>
    </form>
  );
}

function RoutePanel({ children, title, marker, blue = false }: Readonly<{ children: React.ReactNode; title: string; marker: string; blue?: boolean }>) {
  return <section className={`rounded-[0.75rem] border-2 p-4 ${blue ? "border-[#58a6ff]/65 bg-[#58a6ff]/8" : "border-[#ffc107]/60 bg-[#ffc107]/7"}`}><div className="mb-4 flex items-center gap-3"><b className={`grid size-9 place-items-center rounded-full ${blue ? "bg-[#58a6ff] text-[#07142f]" : "bg-[#ffc107] text-[#07142f]"}`}>{marker}</b><h2 className="font-black text-white">{title}</h2></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">{children}</div></section>;
}

function StateSelect({ id, name, label, className }: Readonly<{ id: string; name: string; label: string; className: string }>) {
  return <label htmlFor={id} className="text-sm font-bold text-white/78">{label}<select id={id} name={name} required className={className}><option value="">Estado</option>{states.map(([code, state]) => <option key={code} value={code}>{code} — {state}</option>)}</select></label>;
}

function TextField({ id, name, label, className, type = "text", placeholder, required = false, defaultValue }: Readonly<{ id: string; name: string; label: string; className: string; type?: string; placeholder?: string; required?: boolean; defaultValue?: string }>) {
  return <label htmlFor={id} className="text-sm font-bold text-white/78">{label}<input id={id} name={name} type={type} min={type === "number" ? 0 : undefined} placeholder={placeholder} required={required} defaultValue={defaultValue} className={className} /></label>;
}

function Choice({ name, value, label, type = "radio", defaultChecked, checked, onChange, required }: Readonly<{ name: string; value: string; label: string; type?: "radio" | "checkbox"; defaultChecked?: boolean; checked?: boolean; onChange?: (checked: boolean) => void; required?: boolean }>) {
  return <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-white/12 bg-white/6 px-3 text-sm font-bold text-white/70"><input type={type} name={name} value={value} defaultChecked={checked === undefined ? defaultChecked : undefined} checked={checked} onChange={onChange ? (event) => onChange(event.target.checked) : undefined} required={required} className="size-4 accent-[#ffc107]" />{label}</label>;
}

function ChoiceGroup({ title, children, columns = false }: Readonly<{ title: string; children: React.ReactNode; columns?: boolean }>) {
  return <div className="sm:col-span-2"><span className="text-sm font-bold text-white/78">{title}</span><div className={`mt-2 grid gap-2 ${columns ? "sm:grid-cols-2 lg:grid-cols-3" : ""}`}>{children}</div></div>;
}

const propertyOptions = ["Casa térrea", "Casa com escada", "Prédio com elevador", "Prédio sem elevador", "Condomínio com restrição"] as const;
function PropertySelect({ name, label, className }: Readonly<{ name: string; label: string; className: string }>) { return <label className="text-sm font-bold text-white/78">{label}<select name={name} required className={className}><option value="">Selecione</option>{propertyOptions.map((option) => <option key={option}>{option}</option>)}</select></label>; }
function ServiceSelect({ name, label, className }: Readonly<{ name: string; label: string; className: string }>) { return <label className="text-sm font-bold text-white/78">{label}<select name={name} className={className}><option value="">Selecione</option><option value="sim">Sim</option><option value="nao">Não</option><option value="avaliar">Quero ajuda para avaliar</option></select></label>; }
function HelperSelect({ name, label, className }: Readonly<{ name: string; label: string; className: string }>) { return <label className="text-sm font-bold text-white/78">{label}<select name={name} className={className}><option value="">Selecione</option><option value="0">Não precisa</option><option value="1">1 ajudante</option><option value="2">2 ajudantes</option><option value="3+">3 ou mais</option></select></label>; }
