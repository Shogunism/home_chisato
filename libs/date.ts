/** ISO 日時を日本時間の "YYYY/MM/DD" にする（サーバーの TZ に左右されない） */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
