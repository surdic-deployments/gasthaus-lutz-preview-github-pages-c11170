import type { NextConfig } from "next";

// Set by the GitHub Pages preview workflow (e.g. "/repo-name/"); Next needs it without the trailing slash.
const basePath = process.env.PAGES_BASE_PATH?.replace(/\/+$/, "") || undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
