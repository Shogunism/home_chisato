import { testFetch } from './testFetch';

testFetch()
  .then(() => console.log('Fetch successful'))
  .catch((error) => console.error('Fetch failed:', error));
