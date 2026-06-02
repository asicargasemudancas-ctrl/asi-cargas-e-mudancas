(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealSelector = [
    ".review-board",
    ".score-widget",
    ".rev-card",
    ".pillar-strip > div",
    ".founder-card",
    ".founder-copy",
    ".highlight-grid > li",
    ".op-card",
    ".method-copy",
    ".method-steps > li",
    ".route-map",
    ".dest-card",
    ".quote-grid > *",
    ".faq-list details",
    ".footer-grid > *",
    ".footer-map",
    ".trust-item"
  ].join(",");

  document.documentElement.classList.add("motion-ready");

  function reveal() {
    const items = [...document.querySelectorAll(revealSelector)];
    items.forEach((item, index) => {
      item.classList.add("reveal-target");
      item.style.setProperty("--reveal-index", String(index % 8));
    });
    if (reduced) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: .12 });
    items.forEach((item) => observer.observe(item));
  }

  function bindFieldState() {
    const fields = [...document.querySelectorAll(".hs-field, .quote-section form label")];
    const update = (field) => {
      const input = field.querySelector("input, select, textarea");
      if (!input) return;
      field.classList.toggle("has-value", Boolean(input.value));
    };
    fields.forEach((field) => {
      const input = field.querySelector("input, select, textarea");
      if (!input) return;
      input.addEventListener("input", () => update(field));
      input.addEventListener("change", () => update(field));
      update(field);
    });
  }

  function bindMethodFocus() {
    const steps = [...document.querySelectorAll(".method-steps li")];
    if (!steps.length) return;
    if (reduced) {
      steps[0].classList.add("is-current");
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        steps.forEach((step) => step.classList.toggle("is-current", step === entry.target));
      });
    }, { rootMargin: "-42% 0px -42% 0px", threshold: .2 });
    steps.forEach((step) => observer.observe(step));
  }

  function bindScorePulse() {
    const score = document.querySelector("[data-live-score]");
    const box = document.querySelector(".lead-routing");
    if (!score || !box || reduced) return;
    const observer = new MutationObserver(() => {
      box.classList.remove("score-bumped");
      void box.offsetWidth;
      box.classList.add("score-bumped");
    });
    observer.observe(score, { childList: true, characterData: true, subtree: true });
  }

  reveal();
  bindFieldState();
  bindMethodFocus();
  bindScorePulse();
})();
