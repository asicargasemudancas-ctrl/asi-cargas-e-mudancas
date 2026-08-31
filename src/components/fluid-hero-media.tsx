"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

import { useHydrated } from "@/hooks/use-hydrated";

export function FluidHeroMedia() {
  const hydrated = useHydrated();
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 650], [0, 52]);
  const scale = useTransform(scrollY, [0, 650], [1.015, 1.075]);

  return (
    <motion.div
      data-testid="hero-parallax"
      className="absolute inset-0 -z-20"
      style={hydrated && !shouldReduceMotion ? { y, scale } : undefined}
    >
      <Image
        src="/assets/asi-hero-conversion-truck-1600x900.webp"
        alt="Caminhão ASI em operação de mudança residencial com caixas organizadas"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[65%_center]"
      />
    </motion.div>
  );
}
