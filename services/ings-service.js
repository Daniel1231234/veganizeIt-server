const nonVegan = require("../data/nonVegan.json") 
const vegan = require("../data/canBeVegan.json")
const totalIngs = require("../data/ings.json")
const fs = require("fs")
module.exports = {
  query,
  checkIng,
}

 function query() {
     try {
         if (!totalIngs || totalIngs.length === 0) {
             const nonVeg = _setInitialDataNonVegan()
             const veg = _setInitialDataVegan()
             const total = veg.concat(nonVeg)
             console.log(total);
           _saveIngsToFile(total)
            return Promise.resolve(total)
         } else {
             return Promise.resolve(totalIngs)
        }
    }
    catch (err) {
        console.log(err)
    }
}

async function checkIng(name) {
    const ings = await query()
    const ingToCheck = name.trim().toLowerCase()
    const res = ings.filter((ing) => ing.name === ingToCheck)
    return res
}

function _setInitialDataNonVegan() {
  let nonVeganIngrs = []
  for (let key in nonVegan) {
    let item = {
      name: nonVegan[key],
      isVegan: false,
      id: _makeId(),
    }
    nonVeganIngrs.push(item)
  }
  return nonVeganIngrs
}

function _setInitialDataVegan() {
  let veganIngrs = []
  for (let key in vegan) {
    let item = {
      name: vegan[key],
      isVegan: true,
      id: _makeId(),
    }
    veganIngrs.push(item)
  }
  return veganIngrs
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


function _saveIngsToFile(ings) {
  return new Promise((resolve, reject) => {
    const content = JSON.stringify(ings, null, 2)
    fs.writeFile("./data/ings.json", content, (err) => {
      if (err) {
        console.error(err)
        return reject(err)
      }
      resolve()
    })
  })
}