// next..ts

import { NextConfig } from "next";

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://*.clerk.accounts.dev;
  connect-src 'self' https://*.clerk.accounts.dev https://clerk.vault.app;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://img.clerk.com https://*.clerk.accounts.dev;
  worker-src 'self' blob:;

  frame-src 'self' https://challenges.cloudflare.com https://*.clerk.accounts.dev;
`;

// Now, use .replace to remove all newlines and multiple spaces before injecting:
const nextConfig: NextConfig = {
  // ... other config

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(), // This forces it to a clean single line
          },
        ],
      },
    ];
  },
};

export default nextConfig;
