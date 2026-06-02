/* ASI · GSAP layer — soma cinema editorial onde IntersectionObserver não chega.
   Carrega depois de motion.js: timeline do hero, SplitText na italic gold,
   parallax com scrub, linha vertical do método enchendo no scroll. */
(function () {
  if (!window.gsap) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ST = window.ScrollTrigger;
  const SplitText = window.SplitText;
  if (ST) gsap.registerPlugin(ST);
  if (SplitText) gsap.registerPlugin(SplitText);

  // Sinaliza para app.js que o parallax do hero foi assumido pelo GSAP
  window.__gsapHeroParallax = true;

  if (reduced) return;

  // 1. Hero entrance — timeline orquestrada
  const heroInner = document.querySelector(".hero-bleed-inner");
  if (heroInner) {
    const heroTargets = [
      heroInner.querySelector(".hero-kicker"),
      heroInner.querySelector("h1"),
      heroInner.querySelector(".hero-sub"),
      heroInner.querySelector(".hero-actions"),
      heroInner.querySelector(".hero-proof"),
      document.querySelector(".award-badge"),
      document.querySelector(".hero-search")
    ].filter(Boolean);
    if (heroTargets.length) {
      gsap.set(heroTargets, { autoAlpha: 0, y: 22 });
      gsap.to(heroTargets, {
        autoAlpha: 1,
        y: 0,
        duration: 0.95,
        ease: "power3.out",
        stagger: 0.075,
        delay: 0.18
      });
    }
  }

  // 2. Entrada editorial nos trechos gold da headline sem quebrar texto critico.
  const numHeroes = document.querySelectorAll('h1[data-reputation="heroHeadline"] .num-hero');
  if (numHeroes.length) {
    gsap.from(numHeroes, {
      autoAlpha: 0,
      y: 18,
      duration: 0.72,
      ease: "power3.out",
      stagger: 0.08,
      delay: 0.62
    });
  }

  // 3. Hero fica firme — parallax removido a pedido (foto deve ancorar, não derivar)
  //    O guard window.__gsapHeroParallax acima impede o app.js de aplicar parallax legacy.

  // 4. Linha vertical do método — enche conforme o scroll passa pelos passos
  const methodSteps = document.querySelector(".method-steps");
  if (methodSteps && ST) {
    methodSteps.classList.add("has-gsap-line");
    gsap.fromTo(
      methodSteps,
      { "--line-fill": "0%" },
      {
        "--line-fill": "100%",
        ease: "none",
        scrollTrigger: {
          trigger: methodSteps,
          start: "top 78%",
          end: "bottom 55%",
          scrub: 0.6
        }
      }
    );
  }

  // 5. Spread #porta — reveal coordenado quando entra na viewport
  const spread = document.querySelector(".spread");
  if (spread && ST) {
    const aside = spread.querySelector(".spread-copy");
    const fig = spread.querySelector(".spread-photo");
    if (aside && fig) {
      gsap.from([aside, fig], {
        autoAlpha: 0,
        y: 40,
        duration: 1.05,
        ease: "power3.out",
        stagger: 0.18,
        scrollTrigger: { trigger: spread, start: "top 72%", once: true }
      });
    }
  }

  // 6. Refresh do ScrollTrigger após swap do reviews pager (DOM muda altura)
  const refreshLater = () => setTimeout(() => ST && ST.refresh(), 280);
  document.querySelector("[data-rev-prev]")?.addEventListener("click", refreshLater);
  document.querySelector("[data-rev-next]")?.addEventListener("click", refreshLater);

  // 7. Magnetic-lite no CTA principal do hero — reage ao mouse próximo (premium discreto)
  const primaryCta = document.querySelector(".hero-actions .btn-whatsapp");
  if (primaryCta && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    primaryCta.addEventListener("mousemove", (e) => {
      const r = primaryCta.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 6;
      gsap.to(primaryCta, { x, y, duration: 0.4, ease: "power2.out" });
    });
    primaryCta.addEventListener("mouseleave", () => {
      gsap.to(primaryCta, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1, .5)" });
    });
  }
})();
