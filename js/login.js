import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// ✅ Firebase Config (Fixed Storage Bucket Issue)
const firebaseConfig = {
    apiKey: "AIzaSyBrKVwRCYfQ5w9J3kvV1mVjJgvdmRZ_vMQ",
    authDomain: "vironicaai.firebaseapp.com",
    projectId: "vironicaai",
    storageBucket: "vironicaai.appspot.com",
    messagingSenderId: "960472999069",
    appId: "1:960472999069:web:c0de5791143aa6a54be074"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Function to Show Status Message
function showMessage(type, message) {
    const blur = document.getElementById("blur-container");
    const popup = document.getElementById("success-message");
    const text = document.getElementById("status-text");
    const loader = document.getElementById("loading");
    const successIcon = document.getElementById("success-icon");
    const errorIcon = document.getElementById("error-icon");
    const warningIcon = document.getElementById("warning-icon");

    // ✅ Reset All Icons
    loader.style.display = "none";
    successIcon.style.display = "none";
    errorIcon.style.display = "none";
    warningIcon.style.display = "none";

    // ✅ Show Blur & Popup
    blur.style.display = "block";
    popup.style.display = "flex";

    // ✅ Set Message & Icons
    text.textContent = message;

    if (type === "loading") {
        loader.style.display = "block";
    } else if (type === "success") {
        successIcon.style.display = "block";
    } else if (type === "error") {
        errorIcon.style.display = "block";
    } else if (type === "warning") {
        warningIcon.style.display = "block";
    }

    // ✅ Hide Message After 2 Seconds
    setTimeout(() => {
        blur.style.display = "none";
        popup.style.display = "none";
    }, 2000);
}

// ✅ Login Function
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        showMessage("warning", "Please enter email and password!");
        return;
    }

    showMessage("loading", "Logging in...");

    // ✅ Firebase Sign In
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            showMessage("success", "Login Successful! Redirecting...");
            setTimeout(() => {
                window.location.href = "chat.html"; // ✅ Redirect
            }, 2000);
        })
        .catch((error) => {
            if (error.code === "auth/user-not-found") {
                showMessage("warning", "Account Not Found!");
            } else if (error.code === "auth/wrong-password") {
                showMessage("warning", "Wrong Password!");
            } else {
                showMessage("error", "Oops! Something went wrong.");
            }
        });
}

// ✅ Event Listener for Login Button
document.getElementById("login-btn").addEventListener("click", login);
