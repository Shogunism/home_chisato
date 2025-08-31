import { createClient } from "microcms-js-sdk";

// NEWS用クライアント
export const newsClient = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || '',
  apiKey: process.env.MICROCMS_API_KEY || '',
});

// NOTICE用クライアント
export const noticeClient = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN2 || '', // 修正: notices 用のドメイン
  apiKey: process.env.NEXT_PUBLIC_MICROCMS_API_KEY2 || '', // 修正: notices 用の API キー
});
