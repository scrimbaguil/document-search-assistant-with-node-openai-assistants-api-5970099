// Front-end JavaScript
const messageInput = document.getElementById("chat-message");
const responseDiv = document.querySelector(".messages");
const inputForm = document.querySelector(".input-area");
let threadId = null;

inputForm.addEventListener("submit", sendQuery);

async function sendQuery(event) {
  event.preventDefault();
  const userMessage = messageInput.value.trim();
  responseDiv.innerHTML = "";

  if (!userMessage) {
    responseDiv.innerHTML = "Please enter a message.";
    return;
  }

  try {
    const response = await fetch("/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage, threadId }),
    });

    if (!response.ok) {
      responseDiv.innerHTML = "Error fetching response. Please try again.";
      return;
    }

    const data = await response.json();
    threadId = data.threadId; // Save threadId for future requests

    responseDiv.innerHTML = `<p><strong>Assistant:</strong> ${data.response}</p>`;
  } catch (error) {
    console.error("Error fetching response:", error);
    responseDiv.innerHTML = "Error connecting to the server. Please try again.";
  }

  messageInput.value = "";
}
