// Script to create the assistant
const openai = require("./config");
const assistantId = "";
const vectorStoreID = "";

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

async function updateAssistant() {
  try {
    const updatedAssistant = await openai.beta.assistants.update(assistantId, {
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStoreID],
        },
      },
    });
    console.log("Assistant updated", updatedAssistant);
  } catch (error) {
    console.error("Error updating assistant: ", error.message);
  }
}
updateAssistant();
