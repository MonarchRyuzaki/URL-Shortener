import { writeFileSync } from 'fs';
import { customAlphabet } from 'nanoid';
import axios from 'axios';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 7);
// const URL = 'http://localhost:3000/api/v1/shorten';
const URL = 'https://url-shortener-pbhq.onrender.com/api/v1/shorten';

const shortUrls = [];

(async () => {
  for (let i = 1; i <= 100; i++) {
    const key = `https://example.com/base/${i}`;
    try {
      const response = await axios.post(URL, { originalUrl: key });
      if (response.data && response.data.shortUrl) {
        shortUrls.push(response.data.shortUrl);
        console.log(`Saved: ${response.data.shortUrl}`);
      }
    } catch (error) {
      console.error(`Failed for ${key}:`, error.message);
    }
  }

  writeFileSync('shortUrls.txt', shortUrls.join('\n'));
  console.log('Saved all short URLs to shortUrls.txt');
})();
