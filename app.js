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

app.get("/", (req, res) => {
  res.send("hello");
});

const ItemSchema = new mongoose.Schema({
  name: String,
  email: String,
  pasword: String,
});

const ItemModel = mongoose.model("items", ItemSchema);

app.get("/add-item", async (req, res) => {
  const item = new ItemModel({
    name: "Item 1",
    email: "email2",
    pasword: "password",
  });
  await item.save();
  res.send("Item added");
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
