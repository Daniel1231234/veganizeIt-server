const dbService = require("./db-service");
const { scrape } = require("./puppeteer.js");

async function query(data) {
  const { value, filterBy } = data;
  const collection = await dbService.getCollection("wine");

  const wines = await collection.find().toArray();

  const wineToReturn = wines.filter((wine) => {
    if (filterBy === "country") return wine.country === value;
    if (filterBy === "name") return wine.name === value.toLowerCase().trim();
  });
  console.log(wineToReturn);
  return wineToReturn;
}

async function scrapeFrom(val) {
  const winesFromSearch = await scrape(val);
  return winesFromSearch;
}


module.exports = {
  query,
};
