// Script to create the assistant
const openai = require("./config");
const assistantId = "";
const { vectorStoreID } = require("./upload");
const threadId = "";

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
// updateAssistant();

async function createThread() {
  const thread = await openai.beta.threads.create();
  console.log("Thread created with the ID: ", thread.id);
}
// createThread();

async function addMessage(threadId) {
  const message = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: "How can I apply for a job at XYZ Robotics?",
  });
  console.log("User message added: ", message.id);
}

async function runAssistant(assistantID, threadId) {
  const run = await openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: assistantID,
    // overwrite the assistant instructions if needed
    instructions:
      "Respond as a helpful assistant. Address the user as Guil. When responding to questions, search the vector store first for relevant answers. If no match is found, provide a polite response indicating the information is unavailable.",
  });

  if (run.status === "completed") {
    return run.thread_id;
  } else {
    throw new Error(`Run failed with status: ${run.status}`);
  }
}

async function getAssistantResponse(threadId) {
  const messages = await openai.beta.threads.messages.list(threadId);

  // Display messages
  for (const message of messages.data.reverse()) {
    console.log(`${message.role} > ${message.content[0].text.value}`);
  }
}

// addMessage(threadId);
// runAssistant(assistantId, threadId).then(updatedThreadId =>
//   getAssistantResponse(updatedThreadId).catch(error =>
//     console.error(`Error: ${error.message}`)
//   )
// );

module.exports = {
  assistantId,
};
