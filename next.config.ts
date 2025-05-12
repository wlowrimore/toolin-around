// import type { NextConfig } from "next";
// import path from "path";

// const nextConfig: NextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "lh3.googleusercontent.com",
//         pathname: "/a/**",
//       },
//       {
//         protocol: "https",
//         hostname: "cdn.sanity.io",
//       },
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//       },
//     ],
//   },
//   webpack: (config: any) => {
//     config.resolve.alias = {
//       ...config.resolve.alias,
//       "@": path.resolve("auth.ts"),
//     };
//     return config;
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  webpack: (config: any) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src/auth.ts"),
      // Fix for lucide-react ESM/CJS issue
      "lucide-react": path.resolve(
        __dirname,
        "node_modules/lucide-react/dist/esm/lucide-react.js"
      ),
    };
    return config;
  },
};

export default nextConfig;
