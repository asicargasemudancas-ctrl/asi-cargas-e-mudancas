const phone = "5587981703225";
const utm = "utm_source=site-asi&utm_medium=whatsapp&utm_campaign=lead-organico";
const fallbackMessage = "Ol\u00e1, vim pelo site da ASI - Alexandre Solu\u00e7\u00f5es Integradas.\nQuero falar com o Sr. Alexandre sobre uma mudan\u00e7a.";
const fallbackWhatsApp = `https://wa.me/${phone}?text=${encodeURIComponent(fallbackMessage)}&${utm}`;
const socialBridgePage = "redes.html";

function makeRef() {
  return `ASI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function context() {
  const params = new URLSearchParams(window.location.search);
  const body = document.body?.dataset || {};
  return {
    page: body.page || document.title,
    service: params.get("servico") || body.service || "Mudan\u00e7a",
    route: params.get("rota") || body.route || "",
    url: window.location.href.split("#")[0]
  };
}

function savedRequest() {
  try { return JSON.parse(localStorage.getItem("asi_request") || "{}"); }
  catch { return {}; }
}

function selectedServiceChoice() {
  return document.querySelector("[data-service-choice].is-active")?.dataset.serviceChoice || "";
}

function renderReputation() {
  const rep = window.asiReputation;
  if (!rep) return;
  const values = {
    heroHeadline: () => rep.heroHeadline(),
    badge: () => rep.badge(),
    rating: () => rep.rating,
    totalReviews: () => String(rep.totalReviews),
    perfectBadge: () => rep.perfectBadge()
  };
  document.querySelectorAll("[data-reputation]").forEach((el) => {
    const getter = values[el.dataset.reputation];
    if (!getter) return;
    const value = getter();
    if (el.dataset.reputation === "heroHeadline") {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
    if (!value) el.hidden = true;
  });
  document.querySelectorAll("[data-reputation-link]").forEach((el) => {
    el.href = rep.googleProfileUrl;
  });
}

function readForm(form) {
  const ctx = context();
  const fd = new FormData(form);
  const data = Object.fromEntries(fd.entries());
  data.access = fd.getAll("access").filter(Boolean);
  data.extras = fd.getAll("extras").filter(Boolean);
  data.items = fd.getAll("items").filter(Boolean);
  if (!data.volume && data.items.length) data.volume = `${data.items.length} itens pesados`;
  const formService = form.closest(".quote-section") ? selectedServiceChoice() : "";
  data.service = data.service || formService || ctx.service;
  data.route = data.route || ctx.route;
  data.formSource = form.dataset.src || form.id || "form";
  return data;
}

function line(label, value) {
  return value ? `${label}: ${value}` : "";
}

function isStructuredLeadSource(source) {
  return String(source || "").startsWith("form_");
}

function whatsappIntent(source) {
  const intents = {
    header_home: "Quero falar com o Sr. Alexandre sobre uma mudan\u00e7a.",
    hero_orcamento: "Quero pedir um or\u00e7amento de mudan\u00e7a.",
    hero_fotos: "Quero mandar fotos e detalhes da minha mudan\u00e7a.",
    reviews_cta: "Vi as avalia\u00e7\u00f5es da ASI no site e quero pedir um or\u00e7amento.",
    founder: "Quero falar diretamente com o Sr. Alexandre sobre minha mudan\u00e7a.",
    op_bau: "Quero entender como a ASI organiza e protege os itens no ba\u00fa.",
    op_equipe: "Quero saber sobre equipe, carregamento e cuidados no dia da mudan\u00e7a.",
    op_embalagem: "Quero saber sobre embalagem e prote\u00e7\u00e3o dos meus m\u00f3veis.",
    metodo_rota: "Quero enviar origem, destino e volume para avaliar minha rota.",
    footer: "Quero falar com a ASI sobre uma mudan\u00e7a.",
    footer_direct: "Quero falar diretamente com o Sr. Alexandre.",
    residencial_header: "Quero cotar uma mudan\u00e7a residencial.",
    residencial_hero: "Quero cotar uma mudan\u00e7a residencial.",
    residencial_panel: "Quero mandar fotos e detalhes de uma mudan\u00e7a residencial.",
    residencial_footer: "Quero falar sobre uma mudan\u00e7a residencial.",
    comercial_header: "Quero cotar uma mudan\u00e7a comercial.",
    comercial_hero: "Quero cotar uma mudan\u00e7a comercial.",
    comercial_panel: "Quero mandar fotos e detalhes de uma mudan\u00e7a comercial.",
    comercial_footer: "Quero falar sobre uma mudan\u00e7a comercial.",
    interestadual_header: "Quero consultar uma mudan\u00e7a interestadual.",
    interestadual_hero: "Quero consultar uma mudan\u00e7a interestadual.",
    interestadual_panel: "Quero mandar fotos e detalhes de uma mudan\u00e7a interestadual.",
    interestadual_footer: "Quero falar sobre uma mudan\u00e7a interestadual.",
    fretes_header: "Quero consultar disponibilidade para frete ou carga.",
    fretes_hero: "Quero consultar disponibilidade para frete ou carga.",
    fretes_panel: "Quero mandar fotos e detalhes de um frete ou carga.",
    fretes_footer: "Quero falar sobre frete ou carga.",
    embalagem_header: "Quero pedir embalagem e montagem para minha mudan\u00e7a.",
    embalagem_hero: "Quero pedir embalagem e montagem para minha mudan\u00e7a.",
    embalagem_panel: "Quero mandar fotos dos m\u00f3veis e itens fr\u00e1geis para avaliar embalagem.",
    embalagem_footer: "Quero falar sobre embalagem e montagem.",
    rotas_header: "Quero consultar uma rota com a ASI.",
    rotas_hero: "Quero consultar uma rota com a ASI.",
    rotas_panel: "Quero enviar origem, destino, volume e data para avaliar a rota.",
    rotas_footer: "Quero falar sobre uma rota com a ASI.",
    rota_juazeiro: "Quero cotar a rota Petrolina para Juazeiro.",
    rota_recife: "Quero cotar a rota Petrolina para Recife.",
    rota_salvador: "Quero cotar a rota Petrolina para Salvador.",
    rota_fortaleza: "Quero cotar a rota Petrolina para Fortaleza.",
    rota_vale: "Quero cotar uma rota pelo Vale do S\u00e3o Francisco.",
    rota_outras: "Quero consultar uma rota fora das op\u00e7\u00f5es principais.",
    orcamento_header: "Quero tirar d\u00favidas sobre meu or\u00e7amento.",
    orcamento_footer: "Quero tirar d\u00favidas sobre meu or\u00e7amento.",
    redes_header: "Vim pela ponte de redes sociais e quero falar pelo WhatsApp."
  };
  return intents[source] || "Quero falar com o Sr. Alexandre sobre uma mudan\u00e7a.";
}

function scoreLead(data) {
  let score = 20;
  const itemCount = Array.isArray(data.items) ? data.items.length : 0;
  if (data.origin && data.destination) score += 24;
  if (data.volume || itemCount) score += 18;
  if (itemCount >= 3) score += 6;
  if (data.date || data.urgency) score += 14;
  if (data.phone) score += 14;
  if ((data.access || data.extras || "").length) score += 10;
  return Math.min(score, 100);
}

function leadType(score) {
  if (score >= 80) return "pronto para or\u00e7amento";
  if (score >= 60) return "quase pronto";
  return "faltam dados";
}

function openWhatsApp(source, payload = {}) {
  const prepared = composeWhatsAppUrl(source, payload);
  try {
    localStorage.setItem("asi_request", JSON.stringify({ ...prepared.data, ref: prepared.ref, source }));
  } catch {
    // Se o navegador bloquear storage, o WhatsApp ainda deve abrir normalmente.
  }
  window.open(prepared.url, "_blank", "noopener,noreferrer");
}

function composeWhatsAppUrl(source, payload = {}) {
  const ctx = context();
  const data = { ...ctx, ...payload };
  data.service = payload.service || ctx.service;
  data.route = payload.route || ctx.route;
  const ref = data.ref || makeRef();
  const access = Array.isArray(data.access) ? data.access.join(", ") : data.access;
  const extras = Array.isArray(data.extras) ? data.extras.join(", ") : data.extras;
  const items = Array.isArray(data.items) ? data.items.join(", ") : data.items;
  const score = scoreLead(data);
  const structured = isStructuredLeadSource(source);
  const lines = [
    "Ol\u00e1, vim pelo site da ASI - Alexandre Solu\u00e7\u00f5es Integradas.",
    structured ? "Quero enviar um pedido com rota e volume." : whatsappIntent(source),
    "",
    line("Refer\u00eancia", ref),
    structured ? line("Status do pedido", leadType(score)) : "",
    line("Servi\u00e7o", data.service),
    line("Rota", data.route),
    structured ? line("Origem", data.origin) : "",
    structured ? line("Destino", data.destination) : "",
    structured ? line("Data desejada", data.date) : "",
    structured ? line("Urg\u00eancia", data.urgency) : "",
    structured ? line("Volume", data.volume) : "",
    structured ? line("Itens pesados", items) : "",
    structured ? line("Acesso/observa\u00e7\u00f5es", access) : "",
    structured ? line("Extras", extras) : "",
    structured ? line("Nome", data.name) : "",
    structured ? line("Meu WhatsApp", data.phone) : "",
    "",
    line("Origem do clique", source),
    line("P\u00e1gina", data.url)
  ].filter(Boolean);
  return {
    data,
    ref,
    url: `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}&${utm}`
  };
}

function bindItemsPickers() {
  document.querySelectorAll("[data-items-picker]").forEach((picker) => {
    const toggle = picker.querySelector("[data-items-toggle]");
    const summary = picker.querySelector("[data-items-summary]");
    const hidden = picker.querySelector("[data-items-value]"), checks = [...picker.querySelectorAll('input[name="items"]')];
    const sync = () => {
      const selected = checks.filter((check) => check.checked).map((check) => check.value);
      if (hidden) hidden.value = selected.length ? `${selected.length} itens pesados` : "";
      if (summary) summary.textContent = selected.length ? `${selected.length} itens selecionados` : "Selecionar itens";
      picker.classList.toggle("has-value", selected.length > 0);
      picker.closest("form")?.dispatchEvent(new Event("change", { bubbles: true }));
    };
    toggle?.addEventListener("click", () => {
      const open = !picker.classList.contains("is-open");
      picker.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    checks.forEach((check) => check.addEventListener("change", sync));
    document.addEventListener("click", (event) => {
      if (picker.contains(event.target)) return;
      picker.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    });
    sync();
  });
}

function bindDirectForms() {
  document.querySelectorAll("[data-quote-form]").forEach((form) => {
    const update = () => updateLiveScore(form);
    form.addEventListener("input", update);
    form.addEventListener("change", update);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      openWhatsApp(form.dataset.src || "form_home", readForm(form));
    });
    update();
  });
}

function updateLiveScore(form) {
  const section = form.closest("section");
  const target = section?.querySelector("[data-live-score]");
  if (!target) return;
  const score = scoreLead(readForm(form));
  const type = leadType(score);
  target.textContent = score >= 80 ? "Pedido completo" : score >= 60 ? "Pedido quase pronto" : "Dados iniciais";
  const tag = section.querySelector("[data-live-tag]");
  if (tag) tag.textContent = type;
  const fill = section.querySelector("[data-live-fill]");
  if (fill) fill.style.width = `${score}%`;
  const cta = form.querySelector("[data-live-cta]");
  if (cta) cta.textContent = `\u00b7 ${type}`;
  section.dataset.priority = score >= 80 ? "high" : score >= 60 ? "mid" : "low";
}

function bindSteppedForm() {
  const form = document.getElementById("quoteForm");
  if (!form || !form.querySelector(".qq-step")) return;

  const steps = [...form.querySelectorAll(".qq-step")];
  const dots = [...form.querySelectorAll(".dot")];
  const prev = form.querySelector("[data-step-prev]");
  const next = form.querySelector("[data-step-next]");
  const submit = form.querySelector("[data-step-submit]");
  const label = form.querySelector("[data-step-label]");
  const status = form.querySelector("[data-score-label]");
  const statusText = form.querySelector("[data-score-text]");
  const titles = ["Rota", "Quando", "Volume e acesso", "Contato"];
  let current = 1;

  function validateCurrent() {
    const fields = steps[current - 1].querySelectorAll("input[required], select[required]");
    for (const field of fields) {
      if (!field.value) {
        field.reportValidity();
        field.focus();
        return false;
      }
    }
    return true;
  }

  function show(step) {
    current = Math.max(1, Math.min(steps.length, step));
    form.dataset.step = String(current);
    steps.forEach((item) => item.classList.toggle("is-active", Number(item.dataset.step) === current));
    dots.forEach((dot) => dot.classList.toggle("is-active", Number(dot.dataset.target) <= current));
    if (prev) prev.hidden = current === 1;
    if (next) next.hidden = current === steps.length;
    if (submit) submit.hidden = current !== steps.length;
    if (label) label.textContent = `Etapa ${current} de ${steps.length} \u00b7 ${titles[current - 1] || "Pedido"}`;
    if (status) status.textContent = "Pedido organizado";
    if (statusText) statusText.textContent = "Pronto para enviar as informa\u00e7\u00f5es.";
  }

  next?.addEventListener("click", () => { if (validateCurrent()) show(current + 1); });
  prev?.addEventListener("click", () => show(current - 1));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateCurrent()) return;
    openWhatsApp("form_orcamento", readForm(form));
  });
  show(1);
}

function bindServiceChoices() {
  const buttons = [...document.querySelectorAll("[data-service-choice]")];
  if (!buttons.length) return;
  const active = buttons.find((button) => button.classList.contains("is-active")) || buttons[0];
  document.body.dataset.selectedService = active.dataset.serviceChoice;
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.toggle("is-active", item === button));
      document.body.dataset.selectedService = button.dataset.serviceChoice;
      document.querySelectorAll("[data-quote-form]").forEach(updateLiveScore);
    });
  });
}

function bindWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach((linkEl) => {
    const source = linkEl.dataset.src || "site";
    const current = context();
    const previewData = {
      page: current.page,
      url: current.url,
      service: linkEl.dataset.service || current.service,
      route: linkEl.dataset.route || current.route
    };
    linkEl.href = composeWhatsAppUrl(source, previewData).url || fallbackWhatsApp;
    linkEl.target = "_blank";
    const rel = new Set((linkEl.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
    rel.add("noopener");
    rel.add("noreferrer");
    linkEl.setAttribute("rel", [...rel].join(" "));
    if (!linkEl.getAttribute("aria-label")) {
      const label = linkEl.textContent.trim() || "Falar pelo WhatsApp";
      linkEl.setAttribute("aria-label", `${label} com a ASI pelo WhatsApp`);
    }
    linkEl.addEventListener("click", (event) => {
      event.preventDefault();
      const current = context();
      const data = {
        ...savedRequest(),
        page: current.page,
        url: current.url,
        service: linkEl.dataset.service || current.service,
        route: linkEl.dataset.route || current.route
      };
      openWhatsApp(source, data);
    });
  });
}

function socialChannelFromHref(href, linkEl) {
  const declared = linkEl?.dataset?.social;
  if (declared === "instagram" || declared === "facebook") return declared;
  const value = String(href || "").toLowerCase();
  if (value.includes("canal=instagram")) return "instagram";
  if (value.includes("canal=facebook")) return "facebook";
  if (value.includes("instagram.com") || value.includes("ig.me/")) return "instagram";
  if (value.includes("facebook.com") || value.includes("m.me/")) return "facebook";
  return "";
}

function socialSource(linkEl, ctx) {
  if (linkEl.dataset.src) return linkEl.dataset.src;
  try {
    const explicitSource = new URL(linkEl.getAttribute("href"), window.location.href).searchParams.get("origem");
    if (explicitSource) return explicitSource;
  } catch {
    // Mantem o fallback por contexto quando o href nao puder ser lido como URL.
  }
  if (linkEl.classList.contains("topbar-social")) return `header_${ctx.page || "home"}`;
  if (linkEl.classList.contains("reviews-social")) return "reviews_cta";
  if (linkEl.closest(".footer-col, .footer-links, footer")) return `${ctx.page || "site"}_footer`;
  return `social_${ctx.page || "site"}`;
}

function composeSocialBridgeUrl(channel, source, payload = {}) {
  const ctx = context();
  const data = { ...ctx, ...payload };
  const url = new URL(socialBridgePage, window.location.href);
  url.searchParams.set("canal", channel);
  url.searchParams.set("origem", source);
  url.searchParams.set("pagina", data.page || ctx.page);
  url.searchParams.set("servico", data.service || ctx.service);
  url.searchParams.set("ref", data.ref || makeRef());
  url.searchParams.set("url", data.url || ctx.url);
  if (data.route || ctx.route) url.searchParams.set("rota", data.route || ctx.route);
  return url.toString();
}

function bindSocialLinks() {
  document.querySelectorAll("a[href]").forEach((linkEl) => {
    const originalHref = linkEl.getAttribute("href");
    const channel = socialChannelFromHref(originalHref, linkEl);
    if (!channel) return;

    const updateHref = () => {
      const current = context();
      linkEl.href = composeSocialBridgeUrl(channel, socialSource(linkEl, current), {
        page: current.page,
        url: current.url,
        service: linkEl.dataset.service || current.service,
        route: linkEl.dataset.route || current.route
      });
    };

    updateHref();
    linkEl.target = "_blank";
    const rel = new Set((linkEl.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
    rel.add("noopener");
    rel.add("noreferrer");
    linkEl.setAttribute("rel", [...rel].join(" "));
    if (!linkEl.getAttribute("aria-label")) {
      const label = linkEl.textContent.trim() || (channel === "instagram" ? "Instagram" : "Facebook");
      linkEl.setAttribute("aria-label", `Abrir ${label} da ASI com rastreio do site`);
    }
    linkEl.addEventListener("click", updateHref);
  });
}

function bindTopbarScroll() {
  const topbar = document.querySelector(".topbar");
  const hero = document.querySelector(".hero-bleed");
  if (!topbar || !hero) return;
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => topbar.classList.toggle("is-scrolled", !e.isIntersecting)),
    { rootMargin: "-78px 0px 0px 0px", threshold: 0 }
  );
  observer.observe(hero);
}

function bindHeroParallax() {
  const bg = document.querySelector(".hero-bg");
  if (!bg || window.__gsapHeroParallax || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let ticking = false;
  const update = () => {
    const y = Math.min(window.scrollY, 800);
    bg.style.transform = `translateY(${y * 0.18}px) scale(1.04)`;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}

renderReputation();
bindServiceChoices();
bindItemsPickers();
bindDirectForms();
bindSteppedForm();
bindWhatsAppLinks();
bindSocialLinks();
bindTopbarScroll();
bindHeroParallax();
