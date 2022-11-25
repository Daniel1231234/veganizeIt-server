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

// function _makeId(length = 5) {
//   var text = ""
//   var possible =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

//   for (var i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length))
//   }

//   return text
// }

// function _saveWinesToFile(wines) {
//   return new Promise((resolve, reject) => {
//     const content = JSON.stringify(wines, null, 2)
//     fs.writeFile("./data/wineries.json", content, (err) => {
//       if (err) {
//         console.error(err)
//         return reject(err)
//       }
//       resolve()
//     })
//   })
// }

// function query1() {
//   try {
//     if (!totalWineries || totalWineries.length === 0) {
//       const enWineries = ENwinesDB.map((i) => {
//         return {
//           name: i.winery.toLowerCase(),
//           country: i.country?.toLowerCase(),
//           isVegan: true,
//           id: _makeId(),
//         }
//       })
//       const heWineries = ILwinesDB.map((wine) => {
//         return {
//           name: wine,
//           country: "israel",
//           isVegan: true,
//           id: _makeId(),
//         }
//       })
//       const allWines = enWineries.concat(heWineries)
//       _saveWinesToFile(allWines)
//       return Promise.resolve(allWines)
//     } else {
//       return Promise.resolve(totalWineries)
//     }
//   } catch (err) {
//     console.log(err)
//   }
// }
