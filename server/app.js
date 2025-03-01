const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
