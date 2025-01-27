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
  // Set headers to enable streaming responses
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  try {
    // Create a run with streaming enabled
    const stream = await openai.beta.threads.createAndRun({
      assistant_id: assistantId,
      thread: {
        messages: [{ role: "user", content: userMessage }],
      },
      stream: true, // Enable streaming
    });

    // Read the streaming events in a loop
    for await (const event of stream) {
      const content = event?.data?.delta?.content;
      if (!content) continue;

      // For each piece, write out the text to the response
      for (const chunk of content) {
        const text = chunk?.text?.value;
        if (text) {
          res.write(text);
        }
      }
    }
    // End the response
    res.end();
  } catch (error) {
    console.error("Error handling query:", error);
    res.status(500).json({ error: "Error while processing your request." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
