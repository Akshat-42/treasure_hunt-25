const express = require("express");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server is Live i guess`);
});
