const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");

// Display messages in the chat window
function addMessage(message, sender) {
    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message", sender);

    // Display text safely
    messageDiv.textContent = message;

    chatBox.appendChild(messageDiv);

    // Scroll to the latest message
    chatBox.scrollTop = chatBox.scrollHeight;

    return messageDiv;
}

// Send message to Flask backend
async function sendMessage() {

    const message = userInput.value.trim();

    if (!message) {
        return;
    }

    // Display user message
    addMessage(message, "user-message");

    userInput.value = "";
    sendButton.disabled = true;

    // Display loading message
    const loadingMessage = addMessage(
        "Thinking...",
        "bot-message"
    );

    try {

        const response = await fetch("/chat", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        // Display AI response
        loadingMessage.textContent = data.response;

    } catch (error) {

        loadingMessage.textContent =
            "Error: " + error.message;

    } finally {

        sendButton.disabled = false;
        userInput.focus();

        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Send button click
sendButton.addEventListener("click", sendMessage);

// Send message using Enter key
userInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});