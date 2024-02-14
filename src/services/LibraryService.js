import { defaultApi, formFileApi } from "../utils/api";

const getBooks = async () => {
  return await defaultApi.get(
    `https://localhost:7123/api/controller/GetAllAsync`
  );
};

const createBook = async (form) => {
  return await formFileApi.post(
    `https://localhost:7123/api/controller/AddBookAsync`, form
  );
};

const giveBook = async (form) => {
  return await defaultApi.post(
    `https://localhost:7123/api/controller/GiveBookAsync`, form
  );
};

const LibraryService = {
    getBooks,
    createBook,
    giveBook
}

export default LibraryService