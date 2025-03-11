const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const userIdSchema = new mongoose.Schema({
  userId: String,
});

app.get("/", (req, res) => {
  res.send("hello");
});

const userIdModel = mongoose.model("tree_structure", userIdSchema);

app.post("/cfe/ui", async (req, res) => {
  const fetchedId = req.query.userId;
  const userId = new userIdModel({
    userId: fetchedId,
  });
  await userId.save();
  res.send("User added");
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
