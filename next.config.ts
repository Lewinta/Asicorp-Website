import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fija la raíz al proyecto: hay otros lockfiles en directorios superiores.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
