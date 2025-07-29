import userRoutes from "./Routes/userRoutes"
import cors from "cors"


const express = require('express');
const app = express();
const PORT = process.env.port||3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors({ origin: `http://localhost:${process.env.frontEndPort}`, credentials: true }));

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, Express Backend!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on ${process.env.backend_url}`);
});


app.use("/user",userRoutes.js)