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
    round3: 'the-truth-roll-no' // This should be replaced with the actual roll number
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

document.getElementById('show-roll-number-prompt').addEventListener('click', () => {
    document.getElementById('roll-no-prompt-overlay').classList.add('visible');
});

window.closeRollNoPrompt = function() {
    document.getElementById('roll-no-prompt-overlay').classList.remove('visible');
};

window.handleRollNoSubmit = function(event) {
    event.preventDefault();
    const rollNo = document.getElementById('roll-no-input').value.trim();
    
    // Check the submitted roll number against the correct one
    if (rollNo === passwords.round3) {
        showMessageBox('Correct! You have found the person telling the truth. You can now proceed to the next puzzle!');
        closeRollNoPrompt();
    } else {
        showMessageBox('Incorrect roll number.');
    }
};
