// Script to create the assistant
const openai = require("./config");
const assistantId = "";

// create assistant
async function createAssistant() {
  try {
    const response = await openai.beta.assistants.create({
      name: "Document Search",
      model: "gpt-4o",
      instructions:
        "You are a document search assistant. Answer user queries with relevant information from the documents, or politely explain if none is found.",
    });

    console.log("Assistant created with ID: ", response.id);
  } catch (error) {
    console.error("Error creating assistant:", error.message);
  }
}

// createAssistant();
