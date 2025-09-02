// next.config.js
const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // ルート誤推定の是正（このプロジェクトの実ルートを明示）
    outputFileTracingRoot: __dirname,
  },
  images: {
    domains: ['images.microcms-assets.io'], // ← 必要な外部ドメイン
  },
  env: {
    MICROCMS_SERVICE_DOMAIN: process.env.MICROCMS_SERVICE_DOMAIN,
    MICROCMS_API_KEY: process.env.MICROCMS_API_KEY,
    // NOTICE 用の公開環境変数も明示してビルド時に確実に渡す
    NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN2: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN2,
    NEXT_PUBLIC_MICROCMS_API_KEY2: process.env.NEXT_PUBLIC_MICROCMS_API_KEY2,
  },
};

module.exports = nextConfig;