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
    round2: 'georgesears',
    assman: 'bigboss'
};

window.checkRound2Password = function(event) {
    event.preventDefault();
    const input = document.getElementById('puzzle-input').value.trim();

    if (input.toLowerCase() === passwords.round2) {
        console.log('Correct! You have solved the puzzle.');
        setTimeout(() => {
            window.location.href = '../round3/round3.html';
<<<<<<< HEAD
        }, 1500);  
    }
    else if(input.toLowerCase() === passwords.assman) {
        showMessageBox('Correct! You have solved the puzzle.');
        setTimeout(() => {
            window.location.href = '../ASSMAN/ASSMAN.html';
        }, 1500); 
    }
    else {
        showMessageBox('Incorrect password. Try again!');
=======
        }, 1500);
    } else {
        console.log('Incorrect password. Try again!');
>>>>>>> 059dc88cb76bc7a41a0419628c15b90a83a36092
    }
};
