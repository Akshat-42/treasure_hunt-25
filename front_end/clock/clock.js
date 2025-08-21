const backend_port="https://treasure-hunt-25.onrender.com"

document.getElementById("sendRequest").addEventListener("click", sendHomepageRequest);

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

// DOM Element References
const dom = {
    main: document.getElementById('container'),
    hourHand: document.getElementById('hour-hand'),
    minuteHand: document.getElementById('minute-hand'),
    submitBtn: document.getElementById('submit-btn'),
    resetBtn: document.getElementById('reset-btn'),
    lights: document.querySelectorAll('#lights-container .indicator-bg'),
    messageBox: document.getElementById('message-box'),
    clock: document.getElementById('clock'),
    clockMarkings: document.getElementById('clock-markings')
};

// Game Constants and State
const CORRECT_TIMES = ['03:45', '09:15', '06:00', '12:30', '07:55'];
let state = {
    lightsOn: 0,
    isLocked: false,
    draggingHand: null,
    hour: 12,
    minute: 0,
    totalMinutes: 12 * 60, // Start at 12:00
    lastAngle: 0
};

/**
 * Draws the markings (ticks) on the clock face.
 */
function drawClockMarkings() {
    for (let i = 1; i <= 12; i++) {
        const angleRad = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const isHourMark = i % 3 === 0;
        const x1 = 110 + (isHourMark ? 90 : 98) * Math.cos(angleRad);
        const y1 = 110 + (isHourMark ? 90 : 98) * Math.sin(angleRad);
        const x2 = 110 + 105 * Math.cos(angleRad);
        const y2 = 110 + 105 * Math.sin(angleRad);
        const marking = document.createElementNS("http://www.w3.org/2000/svg", "line");
        marking.setAttribute('x1', x1);
        marking.setAttribute('y1', y1);
        marking.setAttribute('x2', x2);
        marking.setAttribute('y2', y2);
        marking.setAttribute('stroke', '#00a896');
        marking.setAttribute('stroke-opacity', isHourMark ? 0.8 : 0.4);
        marking.setAttribute('stroke-width', isHourMark ? 3 : 2);
        dom.clockMarkings.appendChild(marking);
    }
}

/**
 * Updates the clock hands' rotation based on the total minutes.
 */
function updateClockFromTotalMinutes() {
    const totalDayMinutes = 12 * 60;
    // Ensure totalMinutes wraps around correctly (0 to 719)
    state.totalMinutes = (state.totalMinutes % totalDayMinutes + totalDayMinutes) % totalDayMinutes;

    const currentHour = Math.floor(state.totalMinutes / 60);
    state.hour = currentHour === 0 ? 12 : currentHour;
    state.minute = Math.floor(state.totalMinutes % 60);

    // Calculate angles for hands
    const hourAngle = (state.totalMinutes * 0.5); // Hour hand moves 0.5 degrees per minute
    const minuteAngle = (state.totalMinutes * 6); // Minute hand moves 6 degrees per minute
    
    dom.hourHand.setAttribute('transform', `rotate(${hourAngle} 110 110)`);
    dom.minuteHand.setAttribute('transform', `rotate(${minuteAngle} 110 110)`);
}

/**
 * Displays a message to the user (e.g., correct, incorrect, reset).
 * @param {string} text - The message to display.
 * @param {boolean} isError - If true, styles the message as an error.
 */
function showMessage(text, isError = false) {
    dom.messageBox.textContent = text;
    dom.messageBox.style.color = isError ? '#ef4444' : '#10b981';
    dom.messageBox.style.opacity = 1;
    dom.messageBox.style.transform = 'translateY(0)';
    setTimeout(() => {
        dom.messageBox.style.opacity = 0;
        dom.messageBox.style.transform = 'translateY(0.5rem)';
    }, 2500);
}

/**
 * Handles the logic when the user clicks the "SUBMIT" button.
 */
function handleSubmission() {
    if (state.isLocked) return;
    const formattedTime = String(state.hour).padStart(2, '0') + ':' + String(state.minute).padStart(2, '0');
    // console.log("Submitted time:", formattedTime);
    const response = fetch(backend_port+"/submit_time", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ time: formattedTime })
    });
    if (formattedTime === CORRECT_TIMES[state.lightsOn]) {
        const indicatorElement = dom.lights[state.lightsOn];
        // Alternate indicator colors
        const colorClass = state.lightsOn % 2 === 0 ? 'indicator-on-teal' : 'indicator-on-pink';
        indicatorElement.classList.add(colorClass);

        state.lightsOn++;
        if (state.lightsOn==5){
            console.log(
                `All lights are on!`
            )
        }
        console.log("Lights On:", state.lightsOn, "Current Time:", formattedTime);
        if (state.lightsOn === CORRECT_TIMES.length) {
            // Player wins
            showMessage("SEQUENCE ACCEPTED", false);
            state.isLocked = true;
            dom.submitBtn.disabled = true;
            dom.main.style.borderColor = '#10b981';
            dom.main.style.boxShadow = '0 0 30px #10b981';
            dom.submitBtn.textContent = 'UNLOCKED';
            dom.submitBtn.style.backgroundColor = '#047857';
            dom.submitBtn.style.color = '#a7f3d0';
        } else {
            // Correct, move to next level
            showMessage("Correct. Next sequence.", false);
        }
    } else {
        // Player loses
        showMessage("Incorrect Sequence. ELIMINATED.", true);
        dom.main.classList.add('eliminated');
        setTimeout(() => dom.main.classList.remove('eliminated'), 500);
        resetGame(true); // Soft reset on failure
    }
}

/**
 * Resets the game to its initial state.
 * @param {boolean} isSoft - If true, it's a reset after a failed attempt (no message).
 */
function resetGame(isSoft = false) {
    state.lightsOn = 0;
    state.isLocked = false;
    dom.lights.forEach(light => {
        light.classList.remove('indicator-on-teal', 'indicator-on-pink');
    });
    state.totalMinutes = 12 * 60; // Reset time to 12:00
    updateClockFromTotalMinutes();
    dom.submitBtn.disabled = false;
    dom.main.style.borderColor = '#00a896';
    dom.main.style.boxShadow = '0 0 25px rgba(0, 168, 150, 0.3)';
    dom.submitBtn.textContent = 'SUBMIT';
    dom.submitBtn.style.backgroundColor = '#ff4d97';
    dom.submitBtn.style.color = '#10161a';
    if (!isSoft) showMessage("System Reset.", false);
}

/**
 * Calculates the angle of the mouse/touch relative to the clock's center.
 * @param {MouseEvent|TouchEvent} e - The event object.
 * @returns {number} The angle in degrees (0-360).
 */
function getAngleFromEvent(e) {
    const rect = dom.clock.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    // Add 90 degrees to make 12 o'clock the top, then normalize
    return (Math.atan2(dy, dx) * (180 / Math.PI) + 90 + 360) % 360;
}

/**
 * Initiates the dragging of a clock hand.
 * @param {MouseEvent|TouchEvent} e - The mousedown/touchstart event.
 */
function handleMouseDown(e) {
    if (state.isLocked) return;
    e.preventDefault();
    const angle = getAngleFromEvent(e);
    
    state.lastAngle = angle;
    
    // Determine which hand is closer to the click/touch
    const hourAngle = (state.totalMinutes * 0.5) % 360;
    const minuteAngle = (state.totalMinutes * 6) % 360;
    const diffHour = Math.min(Math.abs(angle - hourAngle), 360 - Math.abs(angle - hourAngle));
    const diffMinute = Math.min(Math.abs(angle - minuteAngle), 360 - Math.abs(angle - minuteAngle));
    state.draggingHand = diffMinute < diffHour ? 'minute' : 'hour';

    // Add listeners for movement and release
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
}

/**
 * Handles the movement of the clock hand while dragging.
 * @param {MouseEvent|TouchEvent} e - The mousemove/touchmove event.
 */
function handleMouseMove(e) {
    if (!state.draggingHand) return;
    e.preventDefault();
    const angle = getAngleFromEvent(e);
    let deltaAngle = angle - state.lastAngle;

    // Handle angle wrapping (e.g., from 359 to 1 degree)
    if (deltaAngle > 180) deltaAngle -= 360;
    if (deltaAngle < -180) deltaAngle += 360;

    // Convert angle change to minute change
    if (state.draggingHand === 'minute') {
        const deltaMinutes = deltaAngle / 6; // 6 degrees per minute
        state.totalMinutes += deltaMinutes;
    } else if (state.draggingHand === 'hour') {
        const deltaMinutes = deltaAngle / 0.5; // 0.5 degrees per minute
        state.totalMinutes += deltaMinutes;
    }
    
    updateClockFromTotalMinutes();
    state.lastAngle = angle;
}

/**
 * Ends the dragging action and cleans up event listeners.
 */
function handleMouseUp() {
    // Snap to the nearest minute for precision
    state.totalMinutes = Math.round(state.totalMinutes);
    updateClockFromTotalMinutes();
    state.draggingHand = null;

    // Remove listeners
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('touchmove', handleMouseMove);
    window.removeEventListener('touchend', handleMouseUp);
}

// Initial Setup
dom.submitBtn.addEventListener('click', handleSubmission);
dom.resetBtn.addEventListener('click', () => resetGame(false));
dom.clock.addEventListener('mousedown', handleMouseDown);
dom.clock.addEventListener('touchstart', handleMouseDown, { passive: false });

// Run setup functions when the page loads
window.onload = () => {
    drawClockMarkings();
    updateClockFromTotalMinutes();
};
