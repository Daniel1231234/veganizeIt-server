const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const wineService = require("./services/wineries-service.js");

app.use(express.static("public"));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "public")));
} else {
  const corsOptions = {
    origin: [
      "http://localhost:5173",
      "http://localhost:3030",
      "http://127.0.0.1:5174",
      "https://veganizeit.onrender.com",
      "http://127.0.0.1:4173",
    ],
    credentials: true,
  };
  app.use(cors(corsOptions));
}

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.post("/api/wine/:name", async (req, res) => {
  const { name } = req.params;
  const { filterBy } = req.body;
  const data = {
    value: name,
    filterBy,
  };

  const wines = await wineService.query(data);
  res.send(wines);
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
