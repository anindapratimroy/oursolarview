const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('file://' + process.cwd() + '/trajectory/index.html', { waitUntil: 'networkidle0' });
  
  // Try changing a slider to see what crashes
  await page.evaluate(() => {
    document.getElementById('eccentricity').value = 0.5;
    document.getElementById('eccentricity').dispatchEvent(new Event('input'));
  });

  await browser.close();
})();
