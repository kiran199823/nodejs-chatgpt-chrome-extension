export const getStructuredChatDetails = (chatCount, chatsDetails) => {
  let chatStructure = [];
  let chatId = chatCount;
  if (chatsDetails?.length) {
    chatsDetails?.map((chat) => {
      chatId = chatId + 1;
      chatStructure.push({
        ci: chatId,
        t: chat.t,
        u: chat.u,
      });
    });
  }

  const lastChatId = chatId;
  return { chatStructure, lastChatId };
};

export async function findFolderAndUpdate(
  parentFolders,
  folderName,
  folderCount = 0,
  dataBaseResponse,
  isAddChat = false,
  chatCount = 0,
  chatsDetail = []
) {
  let dataBase = dataBaseResponse;
  parentFolders.map(
    (parentId) =>
      (dataBase = dataBase?.f?.find((folder) => folder?.i === parentId))
  );

  if (dataBase?.f && !isAddChat) {
    const folderId = folderCount + 1;
    const lengthOfFolder = dataBase.f.push({
      n: folderName,
      i: folderId,
      f: [],
      ch: [],
    });
    if (lengthOfFolder) {
      dataBaseResponse.fc = folderCount + 1;
      dataBaseResponse.markModified("f");
      return true;
    }
  } else if (dataBase?.f && isAddChat) {
    const { chatStructure, lastChatId } = getStructuredChatDetails(
      chatCount,
      chatsDetail
    );
    // let chatId = chatCount + 1;
    // if (chatsDetail.length) {
    //   chatsDetail?.map((chat) => {
    //     dataBase.ch.push({
    //       ci: chatId,
    //       t: chat.t,
    //       u: chat.u,
    //     });
    //     chatId = chatId + 1;
    //   });
    //   dataBaseResponse.cc = chatId;
    // }
    dataBase.ch = chatStructure;
    dataBaseResponse.cc = lastChatId;
    dataBaseResponse.markModified("f");
    return true;
  }

  return false;
}

export async function findToDeleteOrRename(
  dataBase,
  parentFolders = [],
  folderId,
  actionName,
  replaceName = "",
  chatId = null
) {
  let folderPath = dataBase;
  if (parentFolders?.length > 0) {
    parentFolders?.map((parentId) => {
      folderPath = folderPath?.f?.find((folder) => folder?.i === parentId);
    });
  }
  const folderIndex = folderPath?.f?.findIndex(
    (folder) => folder?.i === folderId
  );
  if (folderIndex !== -1) {
    if (actionName === "deleteFolder") {
      folderPath?.f?.splice(folderIndex, 1);
      dataBase.markModified("f");

      return true;
    } else if (actionName === "removeChat") {
      const chatIndex = folderPath?.f?.[folderIndex]?.ch?.find(
        (chat) => chat?.ci === chatId
      );
      folderPath?.f?.[folderIndex]?.ch?.splice(chatIndex, 1);
      dataBase.markModified("f");

      return true;
    } else if (actionName === "renameFolder") {
      const folderToModify = folderPath?.f?.[folderIndex];
      folderToModify.n = replaceName !== "" ? replaceName : folderToModify?.n;
      folderPath?.f?.splice(folderIndex, 1, folderToModify);
      dataBase.markModified("f");

      return true;
    }
  }
  return false;
}

export function responseStatusDetails(res) {
  return {
    success: (responseBody = "") =>
      res.status(200).send({ message: "Success", responseBody }),
    internalServerError: () =>
      res.status(500).send({ message: "Internal server error" }),
    badRequestError: () => res.status(400).send({ message: "Bad request" }),
    notFound: () => res.status(404).send({ message: "Not found" }),
  };
}
