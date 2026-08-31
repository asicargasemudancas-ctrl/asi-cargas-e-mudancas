"use client";

import { motion, useReducedMotion } from "framer-motion";

import { useHydrated } from "@/hooks/use-hydrated";

export function Reveal({
  children,
  className,
  delay = 0,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}>) {
  const hydrated = useHydrated();
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = hydrated && shouldReduceMotion;

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.68, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
