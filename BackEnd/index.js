const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// CORS for local frontend
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    credentials: true
}));

// Homepage route
app.get("/", (req, res) => {
  console.log("Server is up i guess")
    res.send("Welcome to the Treasure Hunt API!");
});

// Test API route
app.get("/test", (req, res) => {
    res.send("Hello from backend!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
