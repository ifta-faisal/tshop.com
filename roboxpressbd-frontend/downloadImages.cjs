const https = require('https');
const fs = require('fs');

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

const run = async () => {
  console.log('Downloading Visa...');
  await download('https://logodownload.org/wp-content/uploads/2014/04/visa-logo-1.png', './public/payment-visa.png');
  
  console.log('Downloading Rocket...');
  // trying another reliable source for rocket or just fallback to wikimedia DBBL logo
  await download('https://w7.pngwing.com/pngs/343/16/png-transparent-rocket-dbbl-dutch-bangla-bank-flat-icon.png', './public/payment-rocket.png');
  
  console.log('Done');
};

run().catch(console.error);
