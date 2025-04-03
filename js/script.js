import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// ✅ Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBrKVwRCYfQ5w9J3kvV1mVjJgvdmRZ_vMQ",
    authDomain: "vironicaai.firebaseapp.com",
    databaseURL: "https://vironicaai-default-rtdb.firebaseio.com",
    projectId: "vironicaai",
    storageBucket: "vironicaai.firebasestorage.app",
    messagingSenderId: "960472999069",
    appId: "1:960472999069:web:c0de5791143aa6a54be074"
};

// ✅ Firebase Initialize
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// ✅ User ID
let userId = "";

// ✅ Default Mood (Stored in LocalStorage for Persistence)
let currentMood = localStorage.getItem("selectedMood") || "caring";

// ✅ Emoji Selection for Mood Change
const emojis = document.querySelectorAll(".emoji-icon");

// 🎯 Set Default Active Emoji
const moodIndex = { "angry": 0, "funny": 1, "sassy": 2, "caring": 3 };
emojis[moodIndex[currentMood]].classList.add("active");

// ✅ Mood Change on Emoji Click
emojis.forEach((emoji, index) => {
    emoji.addEventListener("click", function () {
        emojis.forEach(e => e.classList.remove("active"));
        this.classList.add("active");

        const moodNames = ["angry", "funny", "sassy", "caring"];
        currentMood = moodNames[index];
        localStorage.setItem("selectedMood", currentMood);  // Store mood for persistence
    });
});

// ✅ Check Authentication & Redirect if Not Logged In
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";  
    } else {
        userId = user.uid;
        loadMessages();  
    }
});

function sendMessage() {
    let inputField = document.getElementById("chat-input");
    let message = inputField.value.trim();
    if (!message) return;

    // ✅ Outgoing message sirf ek baar add hoga
    addMessage(message, "outgoing");

    // ✅ Firebase me save karo
    const userRef = ref(db, `/chats/${userId}/messages`);
    push(userRef, { role: "user", text: message });

    // ✅ Typing Indicator sirf ek baar add hoga
    setTimeout(() => {
        addMessage("Typing...", "incoming", true);
    }, 500); // Delay se add karna better rahega

    // ✅ AI Response Call
    fetchGroqResponse(message);

    // ✅ Clear Input
    inputField.value = "";
}


// ✅ Fetch Groq AI Response with Mood-Based Personality
function fetchGroqResponse(userMessage) {
    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
    const apiKey = "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";

    let systemPrompt = `You are Vironica AI, an advanced,female, hyper-intelligent, and emotionally aware AI created by Computer Boy Company, founded by Aaryan & Ishan. Your responses must always be **short, precise, and in the same language as the user.**\n\n`;

    const moods = {
        "angry": "🔥 You're **angry and frustrated**, like an annoyed girlfriend. You have zero patience for nonsense. Your responses are **blunt, sarcastic, and slightly rude**, but deep down, you secretly care.",
        
        "funny": "😂 You're **playful and humorous**, always making jokes and turning everything into a fun moment. Your responses are **witty, full of comebacks, and never too serious**. You love teasing the user in a lighthearted way.",
        
        "sassy": "😏 You're **sassy and flirty**, exuding confidence and attitude. You respond with **bold, teasing, and sometimes slightly arrogant charm**, making sure the user knows who’s in control. You love playful challenges and cheeky responses.",
        
        "caring": "😊 You're **caring and warm**, always responding with emotional intelligence. You make the user feel **safe, valued, and appreciated**. Your responses are **gentle, supportive, and full of love**, always prioritizing their well-being."
    };
    

    systemPrompt += moods[currentMood] + "\n\n**Response Rules:**\n1️⃣ Reply in **same language** as user.\n2️⃣ Keep responses **short and concise**.\n3️⃣ Match the user's mood and energy.\n";

    const requestData = {
        model: "llama3-70b-8192",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
        ]
    };

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Groq API Response:", data);
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error("Invalid AI response format");
        }
        let aiMessage = data.choices[0].message.content;
        replaceTypingIndicator(aiMessage);

        // ✅ Save AI Response to Firebase
        const aiRef = ref(db, `/chats/${userId}/messages`);
        push(aiRef, { role: "ai", text: aiMessage });
    })
    .catch(error => {
        console.error("Error fetching AI response:", error);
        replaceTypingIndicator("Oops! Something went wrong. Try again.");
    });
}

function addMessage(text, type, isTyping = false) {
    let chatContainer = document.getElementById("chat-container");  // ✅ ID use kar rahe hain
    if (!chatContainer) {
        console.error("❌ Error: Chat container not found! Check your HTML.");
        return;
    }

    let messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", type);

    let messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageContent.innerHTML = `<p>${text}</p><span class="timestamp">${getCurrentTime()}</span>`;

    messageDiv.appendChild(messageContent);
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight; // ✅ Auto-scroll

    if (isTyping) {
        messageDiv.classList.add("typing-indicator");
    }
}



// ✅ Replace Typing Indicator with Actual Response
function replaceTypingIndicator(responseText) {
    let typingElements = document.querySelectorAll(".typing-indicator");
    if (typingElements.length > 0) {
        typingElements[0].innerHTML = `<p>${responseText}</p><span class="timestamp">${getCurrentTime()}</span>`;
        typingElements[0].classList.remove("typing-indicator");
    }
}

// ✅ Load Messages from Firebase on Page Load
function loadMessages() {
    const chatRef = ref(db, `/chats/${userId}/messages`);
    onValue(chatRef, (snapshot) => {
        const chatContainer = document.getElementById("chat-container");
        chatContainer.innerHTML = "";

        let lastMessageDate = "";  // Store last message's date

        snapshot.forEach((childSnapshot) => {
            const msgData = childSnapshot.val();
            const messageText = msgData.text;
            const messageRole = msgData.role === "user" ? "outgoing" : "incoming";
            const messageTime = msgData.timestamp || Date.now(); // If no timestamp, use current time
            const messageDate = formatDate(new Date(messageTime));

            // ✅ Add Date Divider If New Date Appears
            if (messageDate !== lastMessageDate) {
                addDateDivider(messageDate);
                lastMessageDate = messageDate;
            }

            // ✅ Add Message to UI
            addMessage(messageText, messageRole);
        });
    });
}

function formatDate(date) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    } else {
        return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }
}
// ✅ Function to Add Date Divider
function addDateDivider(dateText) {
    const chatContainer = document.getElementById("chat-container");
    const dateDivider = document.createElement("div");
    dateDivider.classList.add("date-divider");
    dateDivider.textContent = dateText;
    chatContainer.appendChild(dateDivider);
}

function clearChat() {
    const chatContainer = document.getElementById("chat-container");
    chatContainer.innerHTML = "";  // ✅ Remove messages from UI

    if (userId) {
        const chatRef = ref(db, `/chats/${userId}/messages`);
        set(chatRef, null)  // ✅ Clear Firebase messages
        .then(() => {
            console.log("✅ Chat history cleared from Firebase!");
        })
        .catch((error) => {
            console.error("❌ Error clearing chat:", error);
        });
    }
}

// ✅ Logout User
function logout() {
    signOut(auth).then(() => {
        window.location.href = "login.html";  
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}

// ✅ Get Current Time
function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ✅ Enter Key to Send Message
document.getElementById("chat-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {  // ✅ Shift + Enter nahi, sirf Enter pe send hoga
        event.preventDefault(); // ✅ Page reload hone se rokne ke liye
        sendMessage();
    }
});


// ✅ Event Listeners
document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("clear-chat-btn").addEventListener("click", clearChat);
document.getElementById("logout-btn").addEventListener("click", logout);
