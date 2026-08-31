"use client";

import { useEffect } from "react";

import {
  cleanAnalyticsParams,
  GA_MEASUREMENT_ID,
  META_PIXEL_ID,
  type AnalyticsParams,
} from "@/lib/analytics";

function appendExternalScript(id: string, src: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

export function AnalyticsProvider() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ASI_TEST_MODE === "1" || navigator.webdriver) {
      window.asiAnalytics = {
        measurementId: GA_MEASUREMENT_ID,
        metaPixelId: META_PIXEL_ID,
        track() {},
      };
      return;
    }

    window.dataLayer ??= [];
    window.gtag ??= (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };

    if (!window.fbq) {
      const fbq = ((...args: unknown[]) => {
        if (fbq.callMethod) {
          fbq.callMethod(...args);
        } else {
          fbq.queue?.push(args);
        }
      }) as NonNullable<Window["fbq"]>;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = "2.0";
      fbq.queue = [];
      window.fbq = fbq;
      window._fbq ??= fbq;
    }

    appendExternalScript(
      "asi-ga4",
      `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
    );
    appendExternalScript(
      "asi-meta-pixel",
      "https://connect.facebook.net/en_US/fbevents.js",
    );

    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: true,
      transport_type: "beacon",
    });
    window.fbq("init", META_PIXEL_ID);
    window.fbq("track", "PageView");

    window.asiAnalytics = {
      measurementId: GA_MEASUREMENT_ID,
      metaPixelId: META_PIXEL_ID,
      track(eventName: string, params: AnalyticsParams = {}) {
        if (!eventName) return;
        const cleaned = cleanAnalyticsParams(params);
        window.gtag?.("event", eventName, cleaned);
        if (eventName === "generate_lead") {
          window.fbq?.("track", "Lead", cleaned);
        } else {
          window.fbq?.("trackCustom", eventName, cleaned);
        }
      },
    };
  }, []);

  return null;
}
