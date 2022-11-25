const nodemailer = require("nodemailer")

module.exports = {
  send,
}

transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`)
})

async function send(cred) {
  return Promise.resolve()
}
