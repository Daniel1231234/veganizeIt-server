var config
// keys.js - figure out what set of credentials to return
if (process.env.NODE_ENV === "production") {
  // we are in production - return the prod set of keys
  config = require("./prod")
} else {
  console.log(process.env)
  // we are in development - return the dev keys!!!
  // config = require('./dev')
  config = require("./dev")
}

// process.env.NODE_ENV

module.exports = config
