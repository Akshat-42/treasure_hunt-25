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

const passwords = {
    login: 'pinwheel'
};

const messageBoxOverlay = document.getElementById('message-box-overlay');
const messageBoxText = document.getElementById('message-box-text');
const usernamePage = document.getElementById('username-page');
const passwordPage = document.getElementById('password-page');
let currentTeamId = null;

function showMessageBox(message) {
    messageBoxText.textContent = message;
    messageBoxOverlay.classList.add('visible');
}

window.closeMessageBox = function() {
    messageBoxOverlay.classList.remove('visible');
};

function showPage(pageId) {
    usernamePage.style.display = 'none';
    passwordPage.style.display = 'none';
    document.getElementById(pageId).style.display = 'block';
}

window.handleUsernameSubmit = function(event) {
    event.preventDefault();
    const teamId = document.getElementById('teamId').value.trim();
    teamId_global = teamId;
    if (teamId) {
        currentTeamId = teamId;
        showMessageBox('Team ID saved. Proceed to the next step!');
        setTimeout(() => showPage('password-page'), 1500);
    } else {
        showMessageBox('Please enter your Team ID.');
    }
};

window.handlePasswordSubmit = function(event) {
    event.preventDefault();
    const passwordInput = document.getElementById('password').value.trim();

    if (passwordInput.toLowerCase() === passwords.login) {
        showMessageBox('Login successful! Welcome, ' + currentTeamId + '.');
        setTimeout(() => {
            // Redirect to the next round page
            window.location.href = '../round2/round2.html';
        }, 1500);
    } else {
        showMessageBox('Incorrect password. Try again!');
    }
};

window.onload = function() {
    showPage('username-page');
    // Add event listeners for the forms once the page is loaded
    document.getElementById('username-page').querySelector('form').onsubmit = handleUsernameSubmit;
    document.getElementById('password-page').querySelector('form').onsubmit = handlePasswordSubmit;
};
