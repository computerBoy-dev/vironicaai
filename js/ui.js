// ✅ Navbar Toggle Function (with Click Outside to Close)
const showMenu = (headerToggle, navbarId) => {
    const toggleBtn = document.getElementById(headerToggle),
          nav = document.getElementById(navbarId);

    // Validate that elements exist
    if (toggleBtn && nav) {
        toggleBtn.addEventListener("click", () => {
            // Toggle the 'show-menu' class on navbar
            nav.classList.toggle("show-menu");

            // Toggle icon (menu ↔ cross)
            toggleBtn.classList.toggle("bx-x");
        });

        // ✅ Close sidebar when clicking anywhere on the body
        document.addEventListener("click", (event) => {
            if (!nav.contains(event.target) && !toggleBtn.contains(event.target)) {
                nav.classList.remove("show-menu");  // Hide navbar
                toggleBtn.classList.remove("bx-x"); // Reset toggle icon
            }
        });
    }
};

// Call the function to enable navbar toggle
showMenu("header-toggle", "navbar");

// ✅ Change Active Link in Navbar
const linkColor = document.querySelectorAll('.nav__link');

function colorLink() {
    // Remove 'active' class from all links
    linkColor.forEach(l => l.classList.remove('active'));

    // Add 'active' class to the clicked link
    this.classList.add('active');
}

// Add event listener to each navbar link
linkColor.forEach(l => l.addEventListener('click', colorLink));


// ✅ Page Loader Animation
window.onload = function () {
    setTimeout(function () {
        // Fade out loader
        document.querySelector('.loader-container').style.opacity = '0';

        setTimeout(function () {
            // Hide loader completely after fade out
            document.querySelector('.loader-container').style.display = 'none';
        }, 1000);
    }, 2000); // Loader stays visible for 2 seconds before fading out
};


// ✅ Text/Mic Toggle Button
document.getElementById("toggle-mode").addEventListener("click", function () {
    let soundIcon = this.querySelector(".fa-volume-high");
    let textIcon = this.querySelector(".bx-text");

    // Toggle active/inactive states
    soundIcon.classList.toggle("active");
    soundIcon.classList.toggle("inactive");
    textIcon.classList.toggle("active");
    textIcon.classList.toggle("inactive");
});


// ✅ Emoji Toggle (Mood Selection)
// const emojis = document.querySelectorAll(".emoji-icon");

// // 🎯 By default "Caring Emoji" active रहेगा (4th emoji, index = 3)
// emojis[3].classList.add("active"); // ✅ Caring emoji selected

// // Function to handle active emoji selection
// emojis.forEach((emoji) => {
//     emoji.addEventListener("click", function () {
//         // Remove 'active' class from all emojis
//         emojis.forEach(e => e.classList.remove("active"));

//         // Add 'active' class to the clicked emoji
//         this.classList.add("active");
//     });
// });
