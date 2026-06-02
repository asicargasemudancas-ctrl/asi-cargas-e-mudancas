/* ASI reviews marquee — esteira infinita right-to-left com as 10 reviews reais.
   Loop sem costura via duplicação do conjunto + GSAP modifiers.
   Pausa em hover (desktop) e quando fora da viewport.
   Graceful: se fetch falha ou GSAP não carrega, os 4 cards estáticos do HTML continuam. */
(function () {
  const list = document.querySelector("[data-reviews-list]");
  const pager = document.querySelector("[data-reviews-pager]");
  if (!list) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stars = "★★★★★";

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[ch]);
  }

  function cardHtml(r, absNo) {
    const no = String(absNo).padStart(2, "0");
    const color = r.color || "r";
    const initials = r.initials || (r.name || "?").charAt(0);
    const tag = r.tag || `${(r.type || "").toUpperCase()} · ASI`;
    return (
      `<article class="rev-card">` +
      `<b class="rev-no">N° ${no}</b>` +
      `<header><span class="avatar" data-c="${color}">${escapeHtml(initials)}</span>` +
      `<div><strong>${escapeHtml(r.name)}</strong><small>${escapeHtml(r.when || "")}</small></div></header>` +
      `<span class="stars" aria-hidden="true">${stars}</span>` +
      `<p>“${escapeHtml(r.text)}”</p>` +
      `<small class="rev-sign">${tag}</small>` +
      `</article>`
    );
  }

  function startMarquee(track) {
    if (!window.gsap) return;
    const ST = window.ScrollTrigger;
    requestAnimationFrame(() => {
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth <= 0) return;
      const PIXELS_PER_SECOND = 48;
      const duration = halfWidth / PIXELS_PER_SECOND;
      const tween = gsap.to(track, {
        x: -halfWidth,
        duration,
        ease: "none",
        repeat: -1,
        modifiers: { x: (x) => `${parseFloat(x) % -halfWidth}px` }
      });
      const container = track.parentElement;
      container.addEventListener("mouseenter", () => tween.timeScale(0.25));
      container.addEventListener("mouseleave", () => tween.timeScale(1));
      if (ST) {
        ST.create({
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          onLeave: () => tween.pause(),
          onLeaveBack: () => tween.pause(),
          onEnter: () => tween.play(),
          onEnterBack: () => tween.play()
        });
      }
      let resizeTimer;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const newHalf = track.scrollWidth / 2;
          if (newHalf > 0) tween.vars.x = -newHalf;
        }, 220);
      });
    });
  }

  fetch("data/reviews.json", { cache: "no-cache" })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((reviews) => {
      if (!Array.isArray(reviews) || reviews.length < 4) return;
      const sequence = reviews.map((r, i) => Object.assign({}, r, { _no: i + 1 }));
      const cards = sequence.map((r) => cardHtml(r, r._no)).join("");
      list.classList.add("is-marquee");
      list.innerHTML = `<div class="review-track" data-reviews-track>${cards}${cards}</div>`;
      if (pager) pager.hidden = true;
      const track = list.querySelector("[data-reviews-track]");
      if (!reduced) startMarquee(track);
    })
    .catch(() => {
      /* silent: 4 cards estáticos permanecem */
    });
})();
