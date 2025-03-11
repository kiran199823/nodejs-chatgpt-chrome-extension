const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
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
  const fetchedId = req.body.userId;
  if (!fetchedId) {
    return res.status(400).send({ message: "Bad request" });
  }
  const userModel = new userIdModel({
    userId: fetchedId,
  });
  const { userId } = await userModel.save();

  if (!userId) {
    return res.status(500).send({ message: "Server error" });
  }
  res.status(200).send({ message: "User added" });
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
