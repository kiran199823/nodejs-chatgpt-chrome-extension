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
    let chatId = chatCount + 1;
    if (chatsDetail.length) {
      chatsDetail?.map((chat) => {
        dataBase.ch.push({
          ci: chatId,
          t: chat.title,
          u: chat.url,
        });
        chatId = chatId + 1;
      });
      dataBaseResponse.cc = chatId;
      dataBaseResponse.markModified("f");
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
