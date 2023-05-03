const puppeteer = require("puppeteer");

 async function scrape(query) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width: 1280, height: 800 });

  let currPage = 1;
  let url = `https://www.barnivore.com/search?keyword=${query}&page=${currPage}`;
  await page.goto(url);

  await page.waitForSelector(".products");

  let results = await page.$$eval(".Green", (items) =>
    items.map((item) => ({
      name: item.querySelector(".info .name a").textContent.trim(),
      link: item.querySelector(".info .name a").href,
    }))
  );

  let nextButton = await page.$(".pagination .next a");
  while (nextButton) {
    currPage++;
    url = `https://www.barnivore.com/search?keyword=${query}&page=${currPage}`;
    const navigationPromise = page.waitForNavigation();
    await Promise.all([nextButton.click(), navigationPromise]);
    await page.waitForSelector(".products");

    const pageResults = await page.$$eval(".Green", (items) =>
      items.map((item) => ({
        name: item.querySelector(".info .name a").textContent.trim(),
        link: item.querySelector(".info .name a").href,
      }))
    );

    results.push(...pageResults);

    nextButton = await page.$(".pagination .next a");
  }

  await browser.close();
  return results
}

module.exports = {scrape}
