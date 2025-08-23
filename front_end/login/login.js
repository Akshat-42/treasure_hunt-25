const backend_port="https://treasure-hunt-25.onrender.com"

document.getElementById("sendRequest").addEventListener("click", sendHomepageRequest);
document.getElementById("usernameSubmit").addEventListener("click", handleUsernameSubmit);
const usernamePage = document.getElementById('username-page');
const passwordPage = document.getElementById('password-page');
let currentTeamId = null;

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
      console.log("Response from backend:", response);
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Response from backend:", data.message);
  } catch (error) {
    console.error("Error calling /test:", error);
  }
}

async function handleUsernameSubmit(event) {
  event.preventDefault();

  const teamId = document.getElementById("teamId").value.trim().toLowerCase();

  if (!teamId) {
    console.log("Please enter your Team ID.");
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
      console.log("Team ID saved. Proceeding...");
      showPopup("Team ID saved. Proceeding to password page.", true);
      showPage("password-page");

    } else {
      console.log("Invalid Team ID. Try again.");
    }
  } catch (error) {
    console.error("Error contacting backend:", error);
  }
}

async function handlePasswordSubmit(event) {
  event.preventDefault();
  
  const passwordInput = document.getElementById('password').value.trim();
  const username = document.getElementById('teamId')?.value.trim() || window.currentTeamId; 
  // teamId from input OR a stored variable
  
  if (!username || !passwordInput) {
    console.log("Username or password missing");
        return;
    }
    
    try {
        const response = await fetch(backend_port+"/verifyPassword", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include", // include cookies
            body: JSON.stringify({ username, password: passwordInput }),
          });
          
          const data = await response.json();
          console.log("Response from backend:", data);
          
          if (response.ok) {
            showPopup("Correct password", true);
            console.log("Password verified. Redirecting...");
            await (window.location.href = "../round2/round2.html");
          } else {
            showPopup("Incorrect password. Try again!", false);
            console.log(data.message || "Incorrect password. Try again!");
          }
        } catch (error) {
          console.error("Error contacting backend:", error);
        }
      };

window.onload = function() {
  showPage('username-page');
  // Add event listeners for the forms once the page is loaded
  document.getElementById('username-page').querySelector('form').onsubmit = handleUsernameSubmit;
  document.getElementById('password-page').querySelector('form').onsubmit = handlePasswordSubmit;
};
      
function showPopup(message, success = false) {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.style.background = success ? "green" : "red";
  popup.style.display = "block";

  setTimeout(() => {
  popup.style.display = "none";
  }, 2000); // auto hide after 2 sec
}
function showPage(pageId) {
  const usernamePage = document.getElementById('username-page');
  const passwordPage = document.getElementById('password-page');

  usernamePage.style.display = 'none';
  passwordPage.style.display = 'none';
  document.getElementById(pageId).style.display = 'block';
}