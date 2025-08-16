const backend_port="https://treasurehunt-25.onrender.com"

document.getElementById("sendRequest").addEventListener("click", sendHomepageRequest);
async function sendHomepageRequest() {
    try {
        const response = await fetch(backend_port+"/", {
            method: "GET",
            credentials: "include" // in case backend sends cookies
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.text();
        console.log("Backend Response:", data);
        alert("Server says: " + data);
    } catch (err) {
        console.error("Error fetching data:", err);
        alert("Failed to fetch data from backend. Check console for details.");
    }
}

// --- Game State & Passwords ---
let currentTeamId = null;
const passwords = {
    login: 'pinwheel',
    round2: 'pinwheel-solution'
};

// --- UI Functions ---
function showPage(pageId) {
    const pages = ['username-page', 'password-page', 'round-2-page', 'round-3-page'];
    pages.forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';
}

function showMessageBox(message) {
    document.getElementById('message-box-text').textContent = message;
    document.getElementById('message-box-overlay').classList.add('visible');
}

window.closeMessageBox = function() {
    document.getElementById('message-box-overlay').classList.remove('visible');
};

// --- Game Logic ---
function handleUsernameSubmit(event) {
    event.preventDefault();
    const teamId = document.getElementById('teamId').value.trim();
    if (teamId) {
        currentTeamId = teamId; // Store the team ID for later use
        showMessageBox('Team ID saved. Proceed to the next step!');
        setTimeout(() => showPage('password-page'), 1500);
    } else {
        showMessageBox('Please enter your Team ID.');
    }
}

function handlePasswordSubmit(event) {
    event.preventDefault();
    const passwordInput = document.getElementById('password').value.trim();

    if (passwordInput.toLowerCase() === passwords.login) {
        showMessageBox('Login successful! Welcome, ' + currentTeamId + '.');
        setTimeout(() => showPage('round-2-page'), 1500);
    } else {
        showMessageBox('Incorrect password. Try again!');
    }
}

function checkRound2Password(event) {
    event.preventDefault();
    const input = document.getElementById('puzzle-input').value.trim().toLowerCase();
    
    if (input === passwords.round2) {
        showMessageBox('Correct! You have solved the puzzle.');
        // Here you would add logic to show the next round
        setTimeout(() => showPage('round-3-page'), 1500);
    } else {
        showMessageBox('Incorrect password. Try again!');
    }
}

// Add event listeners to forms
window.onload = function() {
    showPage('username-page');
    document.getElementById('username-page').querySelector('form').onsubmit = handleUsernameSubmit;
    document.getElementById('password-page').querySelector('form').onsubmit = handlePasswordSubmit;
    document.getElementById('round-2-page').querySelector('form').onsubmit = checkRound2Password;
};
