const phone = "5587981703225";
const utm = "utm_source=site-asi&utm_medium=whatsapp&utm_campaign=lead-organico";
const fallbackMessage = "Ol\u00e1, vim pelo site da ASI - Alexandre Solu\u00e7\u00f5es Integradas.\nQuero falar com o Sr. Alexandre sobre uma mudan\u00e7a.";
const fallbackWhatsApp = `https://wa.me/${phone}?text=${encodeURIComponent(fallbackMessage)}&${utm}`;

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
  data.service = data.service || ctx.service;
  data.route = data.route || ctx.route;
  data.formSource = form.dataset.src || form.id || "form";
  return data;
}

function line(label, value) {
  return value ? `${label}: ${value}` : `${label}:`;
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
  const lines = [
    "Ol\u00e1, vim pelo site da ASI - Alexandre Solu\u00e7\u00f5es Integradas.",
    "Quero enviar um pedido com rota e volume.",
    "",
    line("Refer\u00eancia", ref),
    line("Status do pedido", leadType(score)),
    line("Servi\u00e7o", data.service),
    line("Rota", data.route),
    line("Origem", data.origin),
    line("Destino", data.destination),
    line("Data desejada", data.date),
    line("Urg\u00eancia", data.urgency),
    line("Volume", data.volume),
    line("Itens pesados", items),
    line("Acesso/observa\u00e7\u00f5es", access),
    line("Extras", extras),
    line("Nome", data.name),
    line("Meu WhatsApp", data.phone),
    "",
    line("Origem do clique", source),
    line("P\u00e1gina", data.url)
  ];
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
  document.body.dataset.service = active.dataset.serviceChoice;
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.toggle("is-active", item === button));
      document.body.dataset.service = button.dataset.serviceChoice;
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
bindTopbarScroll();
bindHeroParallax();
