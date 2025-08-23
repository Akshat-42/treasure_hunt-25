const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "https://treasure-hunt-25-alpha.vercel.app",
  "http://localhost:3000",
  "https://treasure-hunt-25.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(cookieParser());

//team credentials (object: username → password)
const teams = {
  onikuma  : "yeet",
  roc      : "simp",
  wendigo  : "vibe",
  obeah    : "goat",
  strix    : "chad",
  minotaur : "slay",
  manticore: "sike"
};

const round2Password = "georgesears";
const round3Password = "Ilovemyseniors";
const CORRECT_TIMES = ['05:17', '05:13', '02:20', '05:23', '10:30'];

//helper function
function verify(username, password) {
  return teams[username] && teams[username] === password;
}

// --- ROUTES ---
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>U SUCK!!!!!!!</title>
        <style>
          body {
            background-color: black;
            color: limegreen;
            font-family: "Courier New", monospace;
            text-align: center;
            padding: 50px;
          }
          h1 {
            font-size: 40px;
            text-shadow: 0 0 10px limegreen, 0 0 20px limegreen;
          }
          p {
            font-size: 20px;
            margin: 15px 0;
          }
          pre {
            background: rgba(0, 255, 0, 0.1);
            padding: 15px;
            border-radius: 8px;
            display: inline-block;
            text-align: left;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
          }
          .blink {
            animation: blink 1s infinite;
          }
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
          }
        </style>
      </head>
      <body>
        <h1>LOL Nigga thought he Smort</h1>
        <p class="blink">DA FUCK ARE U DOIN HERE EH?</p>
        <p>You really thought the password would just be lying around in the backend?</p>
        <p>Go solve the actual treasure hunt, hacker man.</p>
        <p>scram scadaddle🤡🤡🤡</p>
        <p>HOES MADD</p>
        <pre>
  404: Secrets Not Found
  200: Your curiosity is noted
        </pre>
      </body>
    </html>
  `);
});

// Test route
app.get("/test", (req, res) => {
//   res.send("Hello from backend!");
  console.log("test api response received");
  res.json({ message: "API request has been written successfully!" });
});

// Round 1 Username Cookie send Route
app.post("/usernamePage", (req, res) => {
  const { username } = req.body;
  console.log("Received username:", username);
  if (!teams[username]) {
    return res.status(400).json({ message: "Invalid team username" });
  }

  // set cookie
  const options = {
            httpOnly: true,
            secure: true
        } 
    console.log("cookie has been sent", username, teams[username]);
    return res
    .status(200)
    .cookie(`${username}_token`, teams[username], options)
    .json({message:"token sent via cookie"})

});

// Round 1 Password Validation Route
app.post("/verifyPassword", (req, res) => {
  const { username, password } = req.body;
  console.log("Received username and password:", username, password);
  if (!teams[username]) {
    return res.status(404).json({ message: "Team not found" });
  }

  if (verify(username, password)) {
    res.json({ message: "Password is valid!" });
  } else {
    res.status(401).json({ message: "Invalid password" });
  }
});

// Round 2 Password Validation Route
app.post("/round2Password", (req, res) => {
  const { password } = req.body;
  console.log("Received password for round 2:", password);

  if (password === round2Password) {
    res.json({ message: "Password is valid!" });
  }

});

// Round 3 Password Validation Route
app.post("/round3Password", (req, res) => {
  const { password } = req.body;
  console.log("Password for Round 3:", password);

  if (password === round3Password) {
    res.json({ message: "Password is valid!" });
  } else {
    res.status(401).json({ message: "Invalid password" });
  }

});


app.post("/submit_time", (req, res) => {
  const { time, lightsOn } = req.body;
  console.log("Received time submission:", time, "Current Lights On:", lightsOn);
  if (time === CORRECT_TIMES[lightsOn]) {
    res.json({ message: "Time submitted successfully!" });
  } else {
    res.status(400).json({ message: "Incorrect time submission." });
  } 
});


// start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
