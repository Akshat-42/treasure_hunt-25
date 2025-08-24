const backend_port="https://treasure-hunt-25-6qa0.onrender.com"

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


const messageBoxOverlay = document.querySelector('.message-box-overlay');
const messageBoxText = document.querySelector('.message-box-text');
async function back_to_r2(event)
{
    console.log('Correct! You have solved the puzzle.');
    window.location.href = '../MEPMOPMF/MEPMOPMF.html';
}
function showMessageBox(message) {
    messageBoxText.textContent = message;
    messageBoxOverlay.classList.add('visible');
}

window.closeMessageBox = function() {
    messageBoxOverlay.classList.remove('visible');
};


