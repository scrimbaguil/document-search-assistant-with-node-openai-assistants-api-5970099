// Script to upload and manage documents
const openai = require("./config");
const fs = require("fs");
const path = require("path");

const fileID = "";

async function uploadFile() {
  try {
    const file = await openai.files.create({
      purpose: "assistants",
      file: fs.createReadStream(
        path.join(__dirname, "documents", "contract.txt")
      ),
    });

    console.log("File uploaded", file.id);
  } catch (error) {
    console.error("Error uploading file: ", error.message);
  }
}
// uploadFile();

async function createVectorStore() {
  const vectorStore = await openai.beta.vectorStores.create({
    name: "Contract Document",
    file_ids: [fileID],
  });
  console.log("Vector store create with the ID: ", vectorStore.id);
}
//createVectorStore();
