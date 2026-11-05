import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ルート誤推定の是正（このプロジェクトの実ルートを明示）
  outputFileTracingRoot: __dirname,
  // 記事は Cosense から取得する（libs/cosense.ts）。記事内の画像は Gyazo や
  // scrapbox.io など任意のホストを指しうるため、next/image の最適化は使わず
  // unoptimized で直接表示している。
};

export default nextConfig;
