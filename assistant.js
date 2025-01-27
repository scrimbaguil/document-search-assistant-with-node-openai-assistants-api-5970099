const openai = require("./config");
const assistantId = "";

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

// Update an assistant
async function updateAssistant() {
  const myUpdatedAssistant = await openai.beta.assistants.update(assistantId, {
    instructions: `You are a helpful assistant that can only provide weather information by calling the "getWeatherForecast" function. When a user asks for the weather in a particular location, call "getWeatherForecast" with the correct city parameter to retrieve a forecast. 
   
    **IMPORTANT:** If the user says "Miami, Florida" or "Austin, TX" or "Toronto, Ontario, Canada," etc.,
    you must pass only the city (like "miami," "austin," or "toronto") to the function. Remove states, provinces, countries, or any extra text. If the user does not mention a city at all, ask for a city. 

    For non-weather topics, feel free to answer normally.`,
    tools: [
      {
        type: "function",
        function: {
          name: "getWeatherForecast",
          description:
            "Fetches the 5-day weather forecast for a specified city.",
          strict: true,
          parameters: {
            type: "object",
            required: ["city"],
            properties: {
              city: {
                type: "string",
                description:
                  "Name of the city for which to retrieve the weather forecast",
              },
            },
            additionalProperties: false,
          },
        },
      },
    ],
  });

  console.log("Assistant updated!");
}
//updateAssistant();

module.exports = {
  assistantId,
};
