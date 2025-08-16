const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//CORS for local frontend
app.use(cors({
  origin: [`${process.env.FRONTEND_URL}`], // frontend URL
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

//team credentials (object: username → password)
const teams = {
  team1: "p1",
  team2: "p2",
  team3: "p3",
  team4: "p4",
  team5: "p5",
  team6: "p6",
  team7: "p7"
};

//helper function
function verify(username, password) {
  return teams[username] && teams[username] === password;
}

// --- ROUTES ---

// Test route
app.get("/test", (req, res) => {
  res.send("Hello from backend!");
  console.log("test api response received");
});

// Username Cookie send Route
app.post("/usernamePage", (req, res) => {
  const { username } = req.body;

  if (!teams[username]) {
    return res.status(400).json({ message: "Invalid team username" });
  }

  // set cookie
  const options = {
            httpOnly: true,
            secure: true
        }
    return res
    .status(200)
    .cookie(`${username}_token`, teams[username], options)
    .json({message:"token sent via cookie"})

});

// Password Validation Route
app.post("/verifyPassword", (req, res) => {
  const { username, password } = req.body;

  if (!teams[username]) {
    return res.status(404).json({ message: "Team not found" });
  }

  if (verify(username, password)) {
    res.json({ message: "Password is valid!" });
  } else {
    res.status(401).json({ message: "Invalid password" });
  }
});

// start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
