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

// Test route
app.get("/app-test", (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("API key is missing or not set in the environment.");
    }
    res.send("OpenAI API key is loaded. Ready to connect!");
  } catch (error) {
    console.error("Configuration error:", error.message);
    res.status(500).send("OpenAI API key is not configured properly.");
  }
});

// Test /query route
app.post("/query", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  res.json({
    response: `You said: "${message}"`,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
