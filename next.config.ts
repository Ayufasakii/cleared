import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.rawg.io" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // PSN trophy image CDNs
      { protocol: "https", hostname: "image.api.playstation.com" },
      { protocol: "https", hostname: "trophy.assets.ps4np.com" },
      { protocol: "https", hostname: "*.np.dl.playstation.net" },
      { protocol: "https", hostname: "*.dl.playstation.net" },
    ],
  },
};

export default nextConfig;
