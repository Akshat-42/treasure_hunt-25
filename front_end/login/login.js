const backend_port="https://treasure-hunt-25.onrender.com"

document.getElementById("sendRequest").addEventListener("click", sendHomepageRequest);
document.getElementById("usernameSubmit").addEventListener("click", handleUsernameSubmit);

async function sendHomepageRequest() {
  try {
    const response = await fetch(backend_port+"/test", {
      method: "GET",
      credentials: "include", // <-- IMPORTANT if using cookies
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
      console.log("Response from backend:", response);
    }

    const data = await response.json();
    console.log("Response from backend:", data.message);
  } catch (error) {
    console.error("Error calling /test:", error);
  }
}


async function handleUsernameSubmit(event) {
  event.preventDefault();

  const teamId = document.getElementById("teamId").value.trim();

  if (!teamId) {
    showMessageBox("Please enter your Team ID.");
    return;
  }

  try {
    const response = await fetch(backend_port+"/usernamePage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: teamId }),
      credentials: "include"
    });

    const data = await response.json();
    console.log("Response from backend:", data);

    if (response.ok) {
      showMessageBox("Team ID saved. Proceeding...");
      setTimeout(() => showPage("password-page"), 1500);
    } else {
      showMessageBox("Invalid Team ID. Try again.");
    }
  } catch (error) {
    console.error("Error contacting backend:", error);
    showMessageBox("Could not reach server. Try later.");
  }
}
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
