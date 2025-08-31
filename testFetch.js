const fetch = require('node-fetch');

async function testFetch() {
  const response = await fetch('https://chisato-news.microcms.io/api/v1/blogs', {
    headers: {
      'X-MICROCMS-API-KEY': 'lYhVvGywBHbjJpIbwzn1r3Uz098VzuouLzYV',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log(data);
}

testFetch().catch(console.error);
