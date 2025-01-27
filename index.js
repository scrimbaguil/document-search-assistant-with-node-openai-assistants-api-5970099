require("dotenv").config();
const express = require("express");
const openai = require("./config");
const { assistantId } = require("./assistant.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/query", async (req, res) => {
  const userMessage = req.body.message || "Weather in Miami?";

  try {
    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userMessage,
    });

    let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistantId,
    });

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const all = messages.data;
      const assistantMsg = all.filter(m => m.role === "assistant").pop();
      const finalText =
        assistantMsg?.content?.[0]?.text?.value || "[No response]";

      res.json({ response: finalText });
    } else {
      res.send(`Run did not complete: ${run.status}`);
    }
  } catch (error) {
    console.error("Error handling query:", error);
    res.status(500).send("Error while processing your request.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
