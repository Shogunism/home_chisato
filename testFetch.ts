export async function testFetch() {
  const response = await fetch(`https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/blogs`, {
    headers: {
      'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY || '',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log(data);
}
