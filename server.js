const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()
const http = require("http").createServer(app)
const wineService = require("./services/wineries-service.js")
const ingsService = require("./services/ings-service.js")

app.use(express.static("public"))
app.use(express.json())

if (process.env.NODE_ENV === "production") {

  app.use(express.static(path.resolve(__dirname, "public")))
} else {
  const corsOptions = {
    origin: [
      "http://127.0.0.1:5173",
      "http://localhost:3030",
      "http://localhost:3000",
      "http://127.0.0.1:5174/",
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}


app.get('/api/', (req, res) => {
  res.send("Welcome")
})


app.get('/api/wine', async (req, res) => {
  const wines = await wineService.query()
  res.send(wines)
})

app.get('/api/wine/:name', async (req, res) => {
  const { name } = req.params
  const wine = await wineService.checkWine(name)
  console.log(wine)
  res.send(wine)
})

app.get('/api/ing',async  (req, res) => {
  const ings = await ingsService.query()
  res.send(ings)
})

app.get("/api/ing/:name", async (req, res) => {
  const {name} = req.params
  const wine = await ingsService.checkIng(name)
  console.log(wine)
  res.send(wine)
})



app.get("/**", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

const port = process.env.PORT || 3030
http.listen(port, () => {
  console.log("Server is running on port: " + port)
})
