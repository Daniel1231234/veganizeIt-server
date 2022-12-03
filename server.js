const express = require("express")
const cors = require("cors")
const path = require("path")
const expressSession = require("express-session")
const nodemailer = require("nodemailer")
const app = express()
require("dotenv").config()

const wineService = require("./services/wineries-service.js")
const ingsService = require("./services/ings-service.js")
// const emailService = require("./services/barcode-service.js")

app.use(express.static("public"))

const session = expressSession({
  secret: "big balagan",
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false},
})

app.use(express.json())
app.use(session)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "public")))
} else {
  const corsOptions = {
    origin: [
      "http://127.0.0.1:5173",
      "http://localhost:3030",
      "http://127.0.0.1:5174",
      "https://veganizeit.onrender.com",
      "http://127.0.0.1:4173",
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

app.get("/", (req, res) => {
  res.send("Welcome")
})

app.get("/api/wine", async (req, res) => {
  const wines = await wineService.query()
  res.send(wines)
})

app.get("/api/wine/:name", async (req, res) => {
  const {name} = req.params
  const wine = await wineService.checkWine(name)
  console.log(wine)
  res.send(wine)
})

app.get("/api/ing", async (req, res) => {
  const ings = await ingsService.query()
  res.send(ings)
})

app.get("/api/ing/:name", async (req, res) => {
  const {name} = req.params
  const ing = await ingsService.checkIng(name)
  console.log(ing)
  res.send(ing)
})

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    pass: process.env.WORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

transporter.verify((err, success) => {
  err
    ? console.log("err => ", err)
    : console.log(`=== Server is ready to take messages: ${success} ===`)
})

app.post("/api/send", (req, res) => {
  let mailOptions = {
    from: `${req.body.email}`,
    to: process.env.EMAIL,
    subject: `Message from: ${req.body.name}`,
    text: `${req.body.message}`,
  }
  console.log(mailOptions)
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.json({
        status: "fail",
      })
    } else {
      console.log("== Message Sent ==")
      res.json({
        status: "success",
      })
    }
  })
})

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("Server is running on port: " + port)
})

