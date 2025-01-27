const messageInput = document.getElementById("chat-message");
const responseDiv = document.querySelector(".messages");
const inputForm = document.querySelector(".input-area");

inputForm.addEventListener("submit", sendQuery);

async function sendQuery(event) {
  event.preventDefault();
  const userMessage = messageInput.value.trim();
  responseDiv.innerHTML = "Assistant is thinking...\n";

  try {
    const response = await fetch("/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      responseDiv.innerHTML = "Error fetching response. Please try again.";
      return;
    }

    const data = await response.json();
    const formattedResponse = data.response.replace(/\n/g, "<br>");
    responseDiv.innerHTML = `<p><strong>Assistant:</strong> ${formattedResponse}</p>`;
  } catch (error) {
    console.error("Error fetching response:", error);
    responseDiv.innerHTML = "Error connecting to the server. Please try again.";
  }

  messageInput.value = "";
}
