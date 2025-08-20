// const e = require("express");

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


// Grid of emojis part
const GRID_WIDTH = 50;
const GRID_HEIGHT = 50;


// A list of 5 emojis to create the combination
const EMOJI_LIST = ['🍕', '🚀', '🎉', '🤖', '⭐'];

// --- DOM ELEMENTS ---
const gridElement = document.getElementById('emoji-grid');

gp = new String();
gridElement.textContent = "Loading...";

const emojiCounts = new Map();
EMOJI_LIST.forEach(emoji => emojiCounts.set(emoji, 0));

let gridText = '';
for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
        const randomIndex = Math.floor(Math.random() * EMOJI_LIST.length);
        const selectedEmoji = EMOJI_LIST[randomIndex];
        
        gridText += selectedEmoji;
        
        emojiCounts.set(selectedEmoji, emojiCounts.get(selectedEmoji) + 1);
    }
    gridText += '\n';
}
for (const[k,e] of emojiCounts)
    {
        gp += String(e);
    }
console.log(gp)
gridElement.textContent = gridText;
const messageBoxOverlay = document.querySelector('.message-box-overlay');
const messageBoxText = document.querySelector('.message-box-text');

function showMessageBox(message) {
    messageBoxText.textContent = message;
    messageBoxOverlay.classList.add('visible');
}

window.closeMessageBox = function() {
    messageBoxOverlay.classList.remove('visible');
};

window.memeskirtskirt = function(event) {
    event.preventDefault();
    const input = document.getElementById('puzzle-input').value.trim();

    if (input.toLowerCase() === gp) {
        showMessageBox('Correct! You have solved the puzzle.');
        window.location.href = '../DUMBASSES/Dumbass.html';
    } else {
        showMessageBox('Incorrect password. Try again!');
    }
};

