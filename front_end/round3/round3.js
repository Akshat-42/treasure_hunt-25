const backend_port="https://treasure-hunt-25.onrender.com"

document.getElementById('show-roll-number-prompt').addEventListener('click', () => {
    document.getElementById('roll-no-prompt-overlay').classList.add('visible');
});

window.closeRollNoPrompt = function() {
    document.getElementById('roll-no-prompt-overlay').classList.remove('visible');
};

document.getElementById('roll-no-submit').addEventListener('click', handleRollNoSubmit);

async function handleRollNoSubmit(event) {
    event.preventDefault();
    const rollNo = document.getElementById('roll-no-input').value.trim();
    const response = await fetch(backend_port + "/round3Password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: rollNo })
    });
    if(response.ok) {
        console.log("Frontend Response:", response);
        const data = await response.json();

        if (data.message === "Password is valid!") {
            console.log('Correct! You have found the person telling the truth. You can now proceed to the next puzzle!');
            closeRollNoPrompt();
            window.location.href = '../projectile/projectile.html'; // Redirect to the next puzzle
        } else {
            console.log('Incorrect roll number.');
        }
    }
    
};
