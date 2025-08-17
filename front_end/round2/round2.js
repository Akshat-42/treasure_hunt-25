const backend_port="https://treasure-hunt-25.onrender.com"

document.getElementById("sendRequest").addEventListener("click", sendHomepageRequest);
document.getElementById("round2-submit").addEventListener("click", checkRound2Password);
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
    // round2: 'georgesears',  TODO REMOVE THIS LINE
    assman: 'bigboss'
};

async function checkRound2Password(event) {
    event.preventDefault();
    const input = document.getElementById('puzzle-input').value.trim();
    if (input.toLowerCase() == passwords.assman) {
        console.log('Correct! You have solved the puzzle.');
        window.location.href = '../ASSMAN/ASSMAN.html';
    } else {
        console.log('Incorrect password. Try again!');
    }
    const response = await fetch(backend_port+"/round2Password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: input })
    });
    if (response.ok) {
        console.log("Frontend Response:", response);
        const data = await response.json();

        console.log('Correct! You have solved the puzzle.');
        window.location.href = '../round3/round3.html';

    }
    
}