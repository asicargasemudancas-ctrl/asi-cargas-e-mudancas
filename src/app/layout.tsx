import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";

import { AnalyticsProvider } from "@/components/analytics-provider";
import { MotionProvider } from "@/components/motion-provider";

import "@/styles/globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-asi-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-asi-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://asicargasemudancas.com.br"),
  title: { default: "ASI Cargas e Mudanças", template: "%s" },
  description:
    "Fretes, cargas e mudanças em Petrolina, Juazeiro e rotas nacionais.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "ASI Cargas e Mudanças",
    description:
      "Mudanças, fretes e cargas com atendimento direto em Petrolina, Juazeiro e rotas sob agenda.",
    images: ["/assets/asi-hero-conversion-truck-1600x900.webp"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${manrope.variable} ${ibmPlexMono.variable}`}>
        <MotionProvider>{children}</MotionProvider>
        <AnalyticsProvider />
      </body>
    </html>
  );
}
