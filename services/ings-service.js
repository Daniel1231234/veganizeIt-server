const dbService = require("./db-service")
const ObjectId = require("mongodb").ObjectId

module.exports = {
  query,
  checkIng,
}

async function query() {
  const collection = await dbService.getCollection("ings")
  var ings = await collection.find().toArray()
  const ingsToReturn = ings.map((ing) => {
    return {
      id: ing._id,
      name: ing.name,
      isVegan: ing.isVegan,
    }
  })
  return ingsToReturn
}

async function checkIng(name) {
  const ings = await query()
  const ingToCheck = name.trim().toLowerCase()
  const res = ings.filter((ing) => ing.name === ingToCheck)
  return res
}

async function remove(ingId) {
  try {
    const collection = await dbService.getCollection("ings")
    await collection.deleteOne({_id: ObjectId(ingId)})

    return ingId
  } catch (err) {
    logger.error(`cannot remove ings ${ingId}`, err)
    throw err
  }
}

async function add(ings) {
  try {
    const collection = await dbService.getCollection("ings")
    const addedings = await collection.insertOne(ings)
    const id = addedings.insertedId.toString()
    ings._id = id
    // console.log('line47', ings)
    return ings
  } catch (err) {
    logger.error("cannot insert ings", err)
    throw err
  }
}
async function update(ings) {
  try {
    var id = ObjectId(ings._id)
    delete ings._id
    const collection = await dbService.getCollection("ings")
    await collection.updateOne({_id: id}, {$set: {...ings}})
    return ings
  } catch (err) {
    logger.error(`cannot update ings ${id}`, err)
    throw err
  }
}

// function _setInitialDataNonVegan() {
//   let nonVeganIngrs = []
//   for (let key in nonVegan) {
//     let item = {
//       name: nonVegan[key],
//       isVegan: false,
//       id: _makeId(),
//     }
//     nonVeganIngrs.push(item)
//   }
//   return nonVeganIngrs
// }

// function _setInitialDataVegan() {
//   let veganIngrs = []
//   for (let key in vegan) {
//     let item = {
//       name: vegan[key],
//       isVegan: true,
//       id: _makeId(),
//     }
//     veganIngrs.push(item)
//   }
//   return veganIngrs
// }

// function _makeId(length = 5) {
//   var text = ""
//   var possible =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

//   for (var i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length))
//   }

//   return text
// }

// function _saveIngsToFile(ings) {
//   return new Promise((resolve, reject) => {
//     const content = JSON.stringify(ings, null, 2)
//     fs.writeFile("./data/ings.json", content, (err) => {
//       if (err) {
//         console.error(err)
//         return reject(err)
//       }
//       resolve()
//     })
//   })
// }
