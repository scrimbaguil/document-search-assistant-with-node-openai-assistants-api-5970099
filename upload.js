// Script to upload and manage documents
const openai = require("./config");
const fs = require("fs");
const path = require("path");

const vectorStoreID = "y";

async function uploadFile(fileName) {
  try {
    const file = await openai.files.create({
      purpose: "assistants",
      file: fs.createReadStream(path.join(__dirname, "documents", fileName)),
    });

    console.log(`File ${fileName} uploaded with ID: ${file.id}`);
    return file.id;
  } catch (error) {
    console.error("Error uploading file: ", error.message);
    throw error;
  }
}

async function attachToVectorStore(vectorStoreID, fileID) {
  try {
    await openai.beta.vectorStores.fileBatches.create(vectorStoreID, {
      file_ids: [fileID],
    });

    console.log(`File attached to Vector Store ${vectorStoreID}`);
  } catch (error) {
    console.error("Error attaching file to Vector Store:", error.message);
    throw error;
  }
}

async function main(fileName) {
  try {
    const fileID = await uploadFile(fileName);
    await attachToVectorStore(vectorStoreID, fileID);
  } catch (error) {
    console.error("Error during main execution:", error.message);
  }
}

module.exports = { vectorStoreID };

// Run main only if this file is executed directly
if (require.main === module) {
  main("faq.txt");
}
