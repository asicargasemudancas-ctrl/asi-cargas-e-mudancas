"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { buildSocialBridgeState } from "@/lib/social-bridge";
import { trackEvent } from "@/lib/analytics";

async function copyToClipboard(
  message: string,
  textarea: HTMLTextAreaElement | null,
): Promise<"success" | "manual"> {
  try {
    await navigator.clipboard.writeText(message);
    return "success";
  } catch {
    textarea?.focus();
    textarea?.select();
    return "manual";
  }
}

export function SocialBridgePage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Preparando sua mensagem");
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const state = useMemo(
    () => buildSocialBridgeState(new URLSearchParams(searchParams.toString()), {
      referrer: typeof document === "undefined" ? "" : document.referrer,
    }),
    [searchParams],
  );

  const eventParams = useMemo(() => ({
    channel: state.channel,
    source: state.source,
    page: state.page,
    service: state.service,
    route: state.route,
    lead_ref_present: state.reference ? "yes" : "no",
  }), [state]);

  async function copyMessage() {
    const copyStatus = await copyToClipboard(state.message, messageRef.current);
    if (copyStatus === "success") {
      setStatus("Mensagem copiada");
      trackEvent("social_message_copy", { ...eventParams, copy_status: "success" });
    } else {
      setStatus("Copie a mensagem selecionada");
      trackEvent("social_message_copy", { ...eventParams, copy_status: "manual" });
    }
  }

  useEffect(() => {
    trackEvent("social_bridge_view", eventParams);
    void copyToClipboard(state.message, messageRef.current).then((copyStatus) => {
      setStatus(copyStatus === "success" ? "Mensagem copiada" : "Copie a mensagem selecionada");
      trackEvent("social_message_copy", { ...eventParams, copy_status: copyStatus });
    });

    if (!state.autoRedirect) return;
    const timer = window.setTimeout(() => {
      setStatus(`Redirecionando para ${state.channelName}`);
      trackEvent("social_auto_redirect", eventParams);
      window.location.assign(state.destination);
    }, 1700);

    return () => window.clearTimeout(timer);
  }, [eventParams, state]);

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_20%_10%,rgba(255,193,7,.16),transparent_22rem),linear-gradient(145deg,#0a1230,#050b1d)] px-4 py-12 text-white">
      <section className="glass-panel w-full max-w-2xl rounded-[0.9rem] p-5 sm:p-9" aria-labelledby="socialBridgeTitle">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#ffc107]">Ponte social ASI</span>
        <h1 id="socialBridgeTitle" className="type-display mt-4 font-sans">Abrindo {state.channelName}.</h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-white/60">
          A mensagem abaixo mantém a origem do atendimento. Copie e envie quando a rede abrir.
        </p>
        <label htmlFor="social-message" className="mt-7 block text-sm font-black text-white/82">Mensagem preparada</label>
        <textarea
          id="social-message"
          ref={messageRef}
          value={state.message}
          readOnly
          rows={11}
          className="mt-2 w-full resize-none rounded-md border border-white/16 bg-black/20 p-4 font-mono text-xs leading-6 text-white/70 outline-none focus:border-[#ffc107]"
        />
        <p role="status" aria-live="polite" className="mt-3 text-sm font-bold text-[#ffcf33]">{status}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <button type="button" onClick={() => void copyMessage()} className="min-h-12 rounded-md border border-white/18 bg-white/6 px-4 text-sm font-black text-white hover:border-[#ffc107]">
            Copiar mensagem
          </button>
          <a
            href={state.destination}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("social_outbound_click", eventParams)}
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#ffc107] px-4 text-center text-sm font-black text-[#0a1230]"
          >
            Abrir {state.channelName}
          </a>
          <Link href="/#contato" className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#25d366] px-4 text-center text-sm font-black text-[#07142f]">Voltar ao site</Link>
        </div>
        <dl className="mt-7 grid gap-3 border-t border-white/12 pt-6 text-xs sm:grid-cols-3">
          <div><dt className="font-mono uppercase tracking-[0.12em] text-white/38">Canal</dt><dd className="mt-1 font-bold text-white/72">{state.channel}</dd></div>
          <div><dt className="font-mono uppercase tracking-[0.12em] text-white/38">Origem</dt><dd className="mt-1 font-bold text-white/72">{state.source}</dd></div>
          <div><dt className="font-mono uppercase tracking-[0.12em] text-white/38">Referência</dt><dd className="mt-1 break-all font-bold text-white/72">{state.reference || "não informada"}</dd></div>
        </dl>
      </section>
    </main>
  );
}
