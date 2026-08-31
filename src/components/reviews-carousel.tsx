"use client";

import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

import { useHydrated } from "@/hooks/use-hydrated";
import type { Review } from "@/data/reviews";

const PIXELS_PER_SECOND = 48;

export function ReviewsCarousel({ reviews }: Readonly<{ reviews: readonly Review[] }>) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const loopWidthRef = useRef(0);
  const paceRef = useRef(1);
  const visibleRef = useRef(false);
  const x = useMotionValue(0);
  const hydrated = useHydrated();
  const shouldReduceMotion = useReducedMotion();
  const motionEnabled = hydrated && !shouldReduceMotion;

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const measure = () => {
      const firstDuplicate = track.children.item(reviews.length) as HTMLElement | null;
      loopWidthRef.current = firstDuplicate?.offsetLeft ?? 0;
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);
    measure();

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 },
    );
    intersectionObserver.observe(viewport);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [reviews.length]);

  useAnimationFrame((_time, delta) => {
    const loopWidth = loopWidthRef.current;
    if (!motionEnabled || !visibleRef.current || loopWidth <= 0) return;

    let next = x.get() - (PIXELS_PER_SECOND * paceRef.current * delta) / 1000;
    while (next <= -loopWidth) next += loopWidth;
    x.set(next);
  });

  return (
    <div
      ref={viewportRef}
      data-testid="reviews-carousel"
      role="region"
      aria-label="Avaliações de clientes da ASI"
      aria-roledescription="carrossel"
      tabIndex={0}
      onMouseEnter={() => { paceRef.current = 0.2; }}
      onMouseLeave={() => { paceRef.current = 1; }}
      onFocus={() => { paceRef.current = 0; }}
      onBlur={() => { paceRef.current = 1; }}
      className="reviews-carousel min-w-0 overflow-x-auto overscroll-x-contain py-1 focus-visible:outline-offset-2"
    >
      <motion.div
        ref={trackRef}
        data-testid="reviews-carousel-track"
        className="flex w-max gap-4"
        style={motionEnabled ? { x } : undefined}
      >
        {[false, true].flatMap((duplicate) => reviews.map((review, index) => (
          <ReviewCard
            key={`${duplicate ? "duplicate" : "review"}-${review.name}`}
            review={review}
            index={index}
            duplicate={duplicate}
          />
        )))}
      </motion.div>
    </div>
  );
}

function ReviewCard({
  review,
  index,
  duplicate,
}: Readonly<{
  review: Review;
  index: number;
  duplicate: boolean;
}>) {
  return (
    <article
      aria-hidden={duplicate || undefined}
      className="fluid-card flex min-h-72 w-[min(84vw,21.5rem)] shrink-0 snap-start flex-col rounded-[0.8rem] border border-[#dfe3eb] bg-[#f9fafc] p-6"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#0e2f6d] font-black text-white">{review.initials}</span>
        <div className="min-w-0"><strong className="block text-sm text-[#0a1230]">{review.name}</strong><small className="text-[#6c7484]">{review.when}</small></div>
        <b className="ml-auto font-mono text-xs font-medium text-[#7f8899]">Nº {String(index + 1).padStart(2, "0")}</b>
      </div>
      <span className="mt-5 text-sm tracking-[0.12em] text-[#e6a800]" aria-label="cinco estrelas">★★★★★</span>
      <p className="mt-4 line-clamp-5 text-sm leading-6 text-[#3f4a5f]">“{review.text}”</p>
      <small className="mt-auto pt-5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[#6e7788]">{review.tag}</small>
    </article>
  );
}
