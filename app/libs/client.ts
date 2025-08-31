import { createClient } from "microcms-js-sdk";

console.log("NEWS DOMAIN:", process.env.MICROCMS_SERVICE_DOMAIN);
console.log("NEWS KEY:", process.env.MICROCMS_API_KEY);
console.log("NOTICE DOMAIN:", process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN2);
console.log("NOTICE KEY:", process.env.NEXT_PUBLIC_MICROCMS_API_KEY2);

// NEWS用クライアント
export const newsClient = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || '',
  apiKey: process.env.MICROCMS_API_KEY || '',
});

// NOTICE用クライアント
export const noticeClient = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN2 || '',
  apiKey: process.env.NEXT_PUBLIC_MICROCMS_API_KEY2 || '',
});
