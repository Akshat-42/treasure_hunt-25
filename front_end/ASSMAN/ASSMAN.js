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
    round2: 'georgesears'
};

const messageBoxOverlay = document.querySelector('.message-box-overlay');
const messageBoxText = document.querySelector('.message-box-text');

function showMessageBox(message) {
    messageBoxText.textContent = message;
    messageBoxOverlay.classList.add('visible');
}

window.closeMessageBox = function() {
    messageBoxOverlay.classList.remove('visible');
};

window.checkRound2Password = function(event) {
    event.preventDefault();
    const input = document.getElementById('puzzle-input').value.trim();

    if (input.toLowerCase() === passwords.round2) {
        showMessageBox('Correct! You have solved the puzzle.');
        setTimeout(() => {
            window.location.href = '../DUMBASSES/Dumbass.html';
        }, 1500);
    } else {
        showMessageBox('Incorrect password. Try again!');
    }
};
