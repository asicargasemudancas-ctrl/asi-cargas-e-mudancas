import type { NextConfig } from "next";

import { LEGACY_REDIRECTS } from "./src/lib/routes";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return LEGACY_REDIRECTS.map((redirect) => ({ ...redirect }));
  },
};

export default nextConfig;
