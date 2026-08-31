import { leadType, scoreLead, type QuotePayload } from "./whatsapp.ts";

export const GA_MEASUREMENT_ID = "G-53P1X5ZJPM";
export const META_PIXEL_ID = "1043569011331282";

export type AnalyticsValue = string | number | boolean | readonly unknown[] | null | undefined;
export type AnalyticsParams = Readonly<Record<string, AnalyticsValue>>;

export function cleanAnalyticsParams(params: AnalyticsParams): Record<string, Exclude<AnalyticsValue, null | undefined>> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      if (value === undefined || value === null) return false;
      if (Array.isArray(value)) return value.length > 0;
      return String(value).trim() !== "";
    }),
  ) as Record<string, Exclude<AnalyticsValue, null | undefined>>;
}

export function isStructuredLeadSource(source: string): boolean {
  return source.startsWith("form_");
}

export function leadAnalyticsParams(
  source: string,
  data: QuotePayload & Readonly<Record<string, unknown>>,
) {
  const score = scoreLead(data);
  const itemCount = data.items?.length ?? 0;
  const hasExtras = Array.isArray(data.extras)
    ? data.extras.length > 0
    : Boolean(data.extras);

  return {
    source,
    page: data.page,
    service: data.service,
    route: data.route,
    structured_lead: isStructuredLeadSource(source) ? "yes" : "no",
    lead_score: score,
    lead_type: leadType(score),
    has_origin: data.origin ? "yes" : "no",
    has_destination: data.destination ? "yes" : "no",
    has_date: data.date ? "yes" : "no",
    has_phone: data.phone ? "yes" : "no",
    has_volume: data.volume ? "yes" : "no",
    has_extras: hasExtras ? "yes" : "no",
    item_count: itemCount,
    urgency: data.urgency ?? "",
  } as const;
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined" || !eventName) return;
  window.asiAnalytics?.track(eventName, params);
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
    };
    _fbq?: Window["fbq"] | null;
    asiAnalytics?: {
      measurementId: string;
      metaPixelId: string;
      track: (eventName: string, params?: AnalyticsParams) => void;
    };
  }
}
