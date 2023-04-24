const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Navigate to the website
  await page.goto('https://fedstat.ru/indicator/57796');

  // Wait for the page to load
  await page.waitForSelector('#data-table');

  // Get the table headers
  const headers = await page.$$eval('#data-table thead th', ths => ths.map(th => th.innerText.trim()));

  // Get the table rows
  const rows = await page.$$eval('#data-table tbody tr', trs => trs.map(tr => Array.from(tr.children).map(td => td.innerText.trim())));

  // Combine headers and rows into an array of objects
  const data = rows.map(row => {
    const obj = {};
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = row[i];
    }
    return obj;
  });

  // Save the data to a CSV file
  const csv = headers.join(',') + '\n' + data.map(obj => Object.values(obj).join(',')).join('\n');
  fs.writeFileSync('housing_prices.csv', csv, 'utf8');

  await browser.close();
})();