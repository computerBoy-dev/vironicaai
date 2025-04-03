import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// ✅ Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBrKVwRCYfQ5w9J3kvV1mVjJgvdmRZ_vMQ",
    authDomain: "vironicaai.firebaseapp.com",
    projectId: "vironicaai",
    storageBucket: "vironicaai.firebasestorage.app",
    messagingSenderId: "960472999069",
    appId: "1:960472999069:web:c0de5791143aa6a54be074"
};

// ✅ Firebase Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Signup Function
function signUp() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Please enter email and password!");
        return;
    }

    // ✅ Show Blur Background & Popup
    document.getElementById("blur-container").style.display = "block";
    document.getElementById("success-message").style.display = "flex";
    document.getElementById("success-message").style.flexDirection = "column";
    document.getElementById("success-message").style.alignItems = "center";
    document.getElementById("success-message").style.justifyContent = "center";
    
    // ✅ Set "Creating Account..." Message
    document.getElementById("status-text").textContent = "Creating Account...";
    document.getElementById("loading").style.display = "block";
    document.getElementById("success-icon").style.display = "none";
    document.getElementById("error-icon").style.display = "none";
    document.getElementById("warning-icon").style.display = "none"; // ❌ Warning icon bhi hide hoga

    // ✅ Firebase Create User
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // ✅ Success: Show Checkmark & Success Message
            document.getElementById("loading").style.display = "none";
            document.getElementById("success-icon").style.display = "block";
            document.getElementById("status-text").textContent = "Account Created! Redirecting...";

            // ✅ Redirect to Chat Page
            setTimeout(() => {
                document.getElementById("blur-container").style.display = "none"; // ✅ Blur Remove
                window.location.href = "chat.html";
            }, 2000);
        })
        .catch((error) => {
            // ❌ Error Handling
            document.getElementById("loading").style.display = "none";
            document.getElementById("success-icon").style.display = "none";
            document.getElementById("error-icon").style.display = "none";
            document.getElementById("warning-icon").style.display = "none"; // ❌ Hide all icons

            if (error.code === "auth/email-already-in-use") {
                // ❌ Duplicate Account Warning
                document.getElementById("warning-icon").style.display = "block";
                document.getElementById("status-text").textContent = "Account already exists!";
            } else {
                // ❌ General Error
                document.getElementById("error-icon").style.display = "block";
                document.getElementById("status-text").textContent = "Opps!  Try Again.";
            }

            // ❌ Hide Blur & Popup After 2s
            setTimeout(() => {
                document.getElementById("blur-container").style.display = "none"; // ✅ Blur Remove
                document.getElementById("success-message").style.display = "none";
            }, 2000);
        });
}

// ✅ Event Listener for Signup Button
document.getElementById("signup-btn").addEventListener("click", signUp);
