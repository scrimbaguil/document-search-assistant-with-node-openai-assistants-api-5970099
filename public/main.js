const messageInput = document.getElementById("chat-message");
const responseDiv = document.querySelector(".messages");
const inputForm = document.querySelector(".input-area");

inputForm.addEventListener("submit", sendQuery);

async function sendQuery(event) {
  event.preventDefault();
  const userMessage = messageInput.value.trim();
  responseDiv.textContent = "Assistant is thinking...\n";

  try {
    const response = await fetch("/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      responseDiv.textContent = "Error fetching response. Please try again.";
      return;
    }

    // Read the streamed response
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    responseDiv.textContent = "";

    // Continuously read data from the response body in small chunks using the reader
    while (true) {
      const { done, value } = await reader.read();
      if (done) break; // end of stream

      // Decode the chunk and append it to the DOM
      const chunk = decoder.decode(value, { stream: true });
      responseDiv.textContent += chunk;
    }
  } catch (error) {
    console.error("Error fetching response:", error);
    responseDiv.textContent =
      "Error connecting to the server. Please try again.";
  }

  messageInput.value = "";
}
