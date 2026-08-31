import type { NextConfig } from "next";

import {
  CANONICAL_HOST_REDIRECT,
  LEGACY_REDIRECTS,
} from "./src/lib/routes";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      {
        ...CANONICAL_HOST_REDIRECT,
        has: CANONICAL_HOST_REDIRECT.has.map((condition) => ({
          ...condition,
        })),
      },
      ...LEGACY_REDIRECTS.map((redirect) => ({ ...redirect })),
    ];
  },
};

export default nextConfig;
