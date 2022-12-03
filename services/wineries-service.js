const dbService = require("./db-service")

async function query() {
  const collection = await dbService.getCollection("wine")
  var wines = await collection.find().toArray()
  const winesToReturn = wines.map((wine) => {
    return {
      id: wine._id,
      name: wine.name,
      country: wine.country,
      isVegan: wine.isVegan,
    }
  })
  return winesToReturn
}

async function checkWine(val) {
  try {
    if (!val || val.length === 0) return null
    const allWines = await query()
    const wineName = val.trim().toLowerCase()
    const wineToCheck = allWines.find((wine) => wine.name === wineName)

    return wineToCheck
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  query,
  checkWine,
}


