require("dotenv").config();
const express = require("express");
const openai = require("./config");
const { assistantId } = require("./assistant.js");
const { getWeatherForecast } = require("./functions");

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

    while (run.status === "requires_action") {
      // Grab tool calls
      const calls = run?.required_action?.submit_tool_outputs?.tool_calls || [];
      if (!calls.length) break; // No tool calls -> break out

      // We'll build tool_outputs with a for..of loop so we can await the function
      const toolOutputs = [];
      for (const call of calls) {
        const fnName = call.function.name;
        let args = {};
        try {
          args = JSON.parse(call.function.arguments || "{}");
        } catch {}

        if (fnName === "getWeatherForecast") {
          const result = await getWeatherForecast(args);
          toolOutputs.push({
            tool_call_id: call.id,
            output: result,
          });
        } else {
          toolOutputs.push({
            tool_call_id: call.id,
            output: "Function not implemented.",
          });
        }
      }

      // 4) Submit those outputs, then poll again
      run = await openai.beta.threads.runs.submitToolOutputsAndPoll(
        thread.id,
        run.id,
        { tool_outputs: toolOutputs }
      );
    }

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
