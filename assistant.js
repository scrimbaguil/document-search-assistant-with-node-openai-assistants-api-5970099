const openai = require("./config");
const assistantId = "";

// create assistant
async function createAssistant() {
  try {
    const response = await openai.beta.assistants.create({
      name: "Weather Search",
      model: "gpt-4o",
    });
    console.log("Assistant created with ID: ", response.id);
  } catch (error) {
    console.error("Error creating assistant:", error.message);
  }
}
//createAssistant();

module.exports = {
  assistantId,
};
