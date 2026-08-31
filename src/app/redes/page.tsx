import type { Metadata } from "next";
import { Suspense } from "react";

import { SocialBridgePage } from "@/components/social-bridge-page";

export const metadata: Metadata = {
  title: "Abrindo rede social | ASI Cargas e Mudanças",
  description: "Ponte de atendimento social da ASI Cargas e Mudanças.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/redes" },
};

export default function SocialBridgeRoute() {
  return (
    <Suspense fallback={<main><p>Preparando atendimento social…</p></main>}>
      <SocialBridgePage />
    </Suspense>
  );
}
