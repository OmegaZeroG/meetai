import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Stream Video's client/call setup isn't idempotent, so React's dev-only
  // double-invoke of effects (Strict Mode) breaks call.join() the second
  // time a component mounts. Disable Strict Mode to match production
  // behavior during development.
  reactStrictMode: false,
};

export default nextConfig;
