(function initAsiAnalytics() {
  const measurementId = "G-53P1X5ZJPM";
  const metaPixelId = "1043569011331282";
  const script = document.createElement("script");
  const metaScript = document.createElement("script");

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  if (!window.fbq) {
    window._fbq = window._fbq || null;
    window.fbq = function fbq() {
      window.fbq.callMethod
        ? window.fbq.callMethod.apply(window.fbq, arguments)
        : window.fbq.queue.push(arguments);
    };
    window.fbq.push = window.fbq;
    window.fbq.loaded = true;
    window.fbq.version = "2.0";
    window.fbq.queue = [];
  }

  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  metaScript.async = true;
  metaScript.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(metaScript);

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: true,
    transport_type: "beacon"
  });
  window.fbq("init", metaPixelId);
  window.fbq("track", "PageView");

  function cleanParams(params) {
    return Object.fromEntries(
      Object.entries(params || {}).filter(([, value]) => {
        if (value === undefined || value === null) return false;
        if (Array.isArray(value)) return value.length > 0;
        return String(value).trim() !== "";
      })
    );
  }

  window.asiAnalytics = {
    measurementId,
    metaPixelId,
    track(eventName, params) {
      if (!eventName) return;
      const cleanedParams = cleanParams(params);
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, cleanedParams);
      }
      if (typeof window.fbq !== "function") return;
      if (eventName === "generate_lead") {
        window.fbq("track", "Lead", cleanedParams);
        return;
      }
      window.fbq("trackCustom", eventName, cleanedParams);
    }
  };
})();
