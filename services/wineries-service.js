const ILwinesDB = require('../data/veganWines.json')
const ENwinesDB = require("../data/wine-data-set.json")
const totalWineries = require("../data/wineries.json")
const fs = require("fs")

function query() {
  try {
    if (!totalWineries || totalWineries.length === 0) {
        const enWineries = ENwinesDB.map((i) => {
          return {
            name: i.winery.toLowerCase(),
            country: i.country?.toLowerCase(),
            isVegan: true,
            id: _makeId(),
          }
        })
        const heWineries = ILwinesDB.map((wine) => {
          return {
            name: wine,
            country: "israel",
            isVegan: true,
            id: _makeId(),
          }
        })
        const allWines = enWineries.concat(heWineries)
         _saveWinesToFile(allWines)
        return Promise.resolve(allWines)
    } else {
      return Promise.resolve(totalWineries)
      }    
    } catch (err) {
        console.log(err)
    }
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


function _makeId(length = 5) {
  var text = ""
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}



function _saveWinesToFile(wines) {
  return new Promise((resolve, reject) => {
    const content = JSON.stringify(wines, null, 2)
    fs.writeFile("./data/wineries.json", content, (err) => {
      if (err) {
        console.error(err)
        return reject(err)
      }
      resolve()
    })
  })
}


module.exports = {
  query,
  checkWine,
}
