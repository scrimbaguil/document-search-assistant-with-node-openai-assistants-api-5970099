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
  try {
    const userMessage = req.body.message;
    // Write Challenge Code here
  } catch (error) {
    console.error("Error handling query:", error);
    res.status(500).json({ error: "Error while processing your request." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
