import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { findFolderAndUpdate, responseStatusDetails } from "./utils.js";

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const folderSchema = new mongoose.Schema({
  u: { type: String, required: true },
  fc: Number,
  cc: Number,
  f: [],
});

const addUser = async (userId, res) => {
  const addUserId = new folderModel({ u: userId, fc: 0, cc: 0, f: [] });
  const { u: addedUserId } = await addUserId.save();

  if (!addedUserId) {
    return responseStatusDetails(res).internalServerError();
  }

  return responseStatusDetails(res).success();
};

const addFolders = async (dataBaseResponse, folderDetails, folderCount) => {
  const { name: folderName, parentFolders = [] } = folderDetails;

  if (!parentFolders.length && !folderCount) {
    const lengthOfFolder = dataBaseResponse.f.push({
      n: folderName,
      i: folderCount + 1,
      f: [],
      ch: [],
    });
    if (lengthOfFolder) {
      dataBaseResponse.fc = folderCount + 1;
      return true;
    }
    return;
  } else {
    return findFolderAndUpdate(
      parentFolders,
      folderName,
      folderCount,
      dataBaseResponse
    );
  }
};

app.get("/", (req, res) => {
  res.send("hello");
});

// Add folders
const folderModel = mongoose.model("tree_structures", folderSchema);
app.post("/cfe/add-folder", async (req, res) => {
  const { userId, folder = [] } = req.body;

  if (!userId) {
    return responseStatusDetails(res).badRequestError();
  }

  const dataBaseResponse = await folderModel.find({ u: userId });

  if (!dataBaseResponse?.length) {
    return addUser(userId, res);
  } else if (dataBaseResponse[0]?.u === userId && folder[0].name) {
    const { fc: folderCount } = dataBaseResponse[0];
    const status = await addFolders(
      dataBaseResponse[0],
      folder[0],
      folderCount,
      res
    );
    if (!status) return responseStatusDetails(res).internalServerError();
    dataBaseResponse[0].save();
    return responseStatusDetails(res).success();
  }
  return responseStatusDetails(res).badRequestError();
});

//Add chats
app.post("/cfe/add-chat", async (req, res) => {
  const { userId, chats = [], parentFolders = [] } = req.body;
  if (!userId || !chats.length)
    return responseStatusDetails(res).badRequestError();

  const dataBaseResponse = await folderModel.find({ u: userId });
  if (!dataBaseResponse) return responseStatusDetails(res).notFound();

  if (chats.length) {
    const { cc: chatCount } = dataBaseResponse[0];
    const status = await findFolderAndUpdate(
      parentFolders,
      null,
      null,
      dataBaseResponse[0],
      true,
      chatCount,
      chats
    );
    if (!status) return responseStatusDetails(res).internalServerError();
    await dataBaseResponse[0].save();
    return responseStatusDetails(res).success();
  }
});

app.post("/cfe/folder-list", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return responseStatusDetails(res).badRequestError();

  const dataBaseResponse = await folderModel.find({ u: userId });

  if (!dataBaseResponse.length) return responseStatusDetails(res).notFound();

  const responseBody = dataBaseResponse[0].f;

  responseStatusDetails(res).success(responseBody);
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
