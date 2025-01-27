// Import modules
const express = require("express");
const openai = require("./config");

// Initialize app and configuration
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Assistant ID
const { assistantId } = require("./assistant.js");

// User /query route
app.post("/query", async (req, res) => {
  const userMessage = req.body.message;

  let threadId = null;

  try {
    if (!threadId) {
      const threadResponse = await openai.beta.threads.create();
      threadId = threadResponse.id;
    }

    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: userMessage,
    });

    const run = await openai.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistantId,
    });

    if (run.status === "completed") {
      const messagesResponse = await openai.beta.threads.messages.list(
        threadId
      );
      const allMessages = messagesResponse.data;

      const assistantMessage = allMessages
        .filter(m => m.role === "assistant")
        .pop();

      return res.json({ response: assistantMessage.content[0].text.value });
    } else {
      console.log(run.status);
    }
  } catch (error) {
    console.error("Error handling query:", error);
    res.status(500).json({ error: "Error while processing your request." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
