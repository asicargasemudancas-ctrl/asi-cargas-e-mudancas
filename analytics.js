(function initAsiAnalytics() {
  const measurementId = "G-53P1X5ZJPM";
  const script = document.createElement("script");

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: true,
    transport_type: "beacon"
  });

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
    track(eventName, params) {
      if (!eventName || typeof window.gtag !== "function") return;
      window.gtag("event", eventName, cleanParams(params));
    }
  };
})();
