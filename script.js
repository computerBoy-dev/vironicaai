
document.addEventListener("DOMContentLoaded", function () {
    updateMemoryUsage();
});

function updateMemoryUsage() {
    let usedMemory = Math.floor(Math.random() * 100); // Simulating memory usage
    document.getElementById("progress-bar").style.width = usedMemory + "%";
    document.getElementById("progress-text").innerText = usedMemory + "%";
}

// Function to clear memory
function clearMemory() {
    document.getElementById("progress-bar").style.width = "0%";
    document.getElementById("progress-text").innerText = "0%";
}


document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("chat-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    let message = document.getElementById("chat-input").value.trim();
    if (message !== "") {
        addMessage(message, "outgoing");
        document.getElementById("chat-input").value = "";
        
        // Auto-reply for testing
        setTimeout(() => {
            addMessage("This is an auto-reply!", "incoming");
        }, 1000);
    }
}

function addMessage(text, type) {
    let chatContainer = document.getElementById("chat-container");

    // Create message div
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", type);

    // Create content div
    let messageContent = document.createElement("div");
    messageContent.classList.add("message-content");

    // Add text & timestamp
    messageContent.innerHTML = `<p>${text}</p><span class="timestamp">${getCurrentTime()}</span>`;

    messageDiv.appendChild(messageContent);
    chatContainer.appendChild(messageDiv);

    // Auto-scroll to latest message
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Function to get current time
function getCurrentTime() {
    let now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
