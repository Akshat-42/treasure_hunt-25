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

// --- DOM Elements ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const velocitySlider = document.getElementById('velocity');
const angleSlider = document.getElementById('angle');
const velocityInput = document.getElementById('velocityInput');
const angleInput = document.getElementById('angleInput');
const velocityValueSpan = document.getElementById('velocityValue');
const angleValueSpan = document.getElementById('angleValue');
const launchButton = document.getElementById('launchButton');
const statusText = document.getElementById('statusText');
const popup = document.getElementById('popup');

// --- Game Configuration ---
const GRAVITY = 9.8; // m/s^2
const PIXELS_PER_METER = 5; // Scale for drawing
const BALL_RADIUS = 8; // in pixels
const TARGET_WIDTH = 24;
const TARGET_HEIGHT = 20; // in pixels (height of the ground)
const COOLDOWN_BASE = 7000; // 7 second base cooldown
const COOLDOWN_FACTOR = 2.5; // Exponential factor

// --- Game State ---
let ball, target, launchData;
let isAnimating = false;
let animationFrameId;
let tryCount = 0;
let cooldownTimer;

// --- Utility Functions ---
const toRadians = (deg) => deg * (Math.PI / 180);

// --- Game Objects ---
class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
    }
}

class Target {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// --- Core Game Logic ---
function setupCanvas() {
    const container = document.querySelector('.canvas-container');
    const width = container.clientWidth;
    const height = width * (9 / 16);
    canvas.width = width;
    canvas.height = height;
}

function initializeGame() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (cooldownTimer) clearInterval(cooldownTimer);
    isAnimating = false;
    
    const startX = 30;
    const startY = canvas.height - 30;
    ball = new Ball(startX, startY, BALL_RADIUS, '#ef4444');

    const targetX = Math.random() * (canvas.width / 2) + (canvas.width / 2 - 50);
    const targetY = canvas.height - TARGET_HEIGHT;
    target = new Target(targetX, targetY, TARGET_WIDTH, TARGET_HEIGHT, '#9333ea');

    tryCount = 0;
    launchButton.disabled = false;
    statusText.textContent = '';

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00b894';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    
    target.draw();
    ball.draw();
    
    if (ball && target) {
        const distanceInPixels = target.x + (TARGET_WIDTH / 2) - ball.startX;
        const distanceInMeters = (distanceInPixels / PIXELS_PER_METER).toFixed(1);
        ctx.fillStyle = '#ed1b76';
        ctx.font = 'bold 16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`Distance: ${distanceInMeters} m`, canvas.width / 2, canvas.height - 300);
    }
}

function launch() {
    if (isAnimating) return;

    isAnimating = true;
    launchButton.disabled = true;
    statusText.textContent = ''; // Clear previous status
    ball.reset();

    const velocity = parseFloat(velocitySlider.value);
    const angle = parseFloat(angleSlider.value);
    launchData = {
        v: velocity,
        theta: toRadians(angle),
        startTime: 0,
    };

    animate(0);
}

function animate(timestamp) {
    if (!launchData.startTime) {
        launchData.startTime = timestamp;
    }
    
    const elapsedTime = (timestamp - launchData.startTime) / 1000;

    const dx = launchData.v * Math.cos(launchData.theta) * elapsedTime;
    const dy = launchData.v * Math.sin(launchData.theta) * elapsedTime - 0.5 * GRAVITY * elapsedTime * elapsedTime;

    ball.x = ball.startX + dx * PIXELS_PER_METER;
    ball.y = ball.startY - dy * PIXELS_PER_METER;

    draw();

    if (ball.y > canvas.height - 20 - BALL_RADIUS || ball.x > canvas.width) {
        isAnimating = false;
        
        const isHit = ball.x > target.x && ball.x < target.x + target.width;

        if (isHit) {
            showEndMessage('HIT!', '#22c55e');
            tryCount = 0;
            console.log("The ball has been hit");
            setTimeout(() => {
                popup.textContent = 'Code: TBD'; // TODO Decide this code
                popup.style.display = 'flex';
                popup.style.color = 'var(--color-dark)';
                popup.style.backgroundColor = 'var(--color-player-green)';
            }, 1000); // This is the 1-second delay before it shows up
            setTimeout(() => {window.location.href = "../clock/clock.html";}, 20000);
        } else {
            showEndMessage('MISS!', '#ef4444');
            startCooldown();
            setTimeout(() => {
                ball.reset();
                draw();
            }, 1500);
        }
        return;
    }

    animationFrameId = requestAnimationFrame(animate);
}

function showEndMessage(text, color) {
    statusText.textContent = text;
    statusText.style.color = color;
}

function startCooldown() {
    tryCount++;
    const cooldownTime = Math.floor(COOLDOWN_BASE * Math.pow(COOLDOWN_FACTOR, tryCount - 1));
    let timeLeft = cooldownTime / 1000;

    launchButton.disabled = true;

    cooldownTimer = setInterval(() => {
        timeLeft -= 0.1;
        if (timeLeft <= 0) {
            clearInterval(cooldownTimer);
            launchButton.disabled = false;
            statusText.textContent = ''; // Clear countdown text
        } else {
            statusText.textContent = `Wait ${timeLeft.toFixed(1)}s`;
            statusText.style.color = '#475569'; // Neutral color for timer
        }
    }, 100);
}

// --- Event Listeners ---
function syncVelocity(value) {
    const clampedValue = Math.max(10, Math.min(100, value));
    velocityValueSpan.textContent = clampedValue;
    velocitySlider.value = clampedValue;
    velocityInput.value = clampedValue;
}

function syncAngle(value) {
    const clampedValue = Math.max(1, Math.min(89, value));
    angleValueSpan.textContent = clampedValue;
    angleSlider.value = clampedValue;
    angleInput.value = clampedValue;
}

velocitySlider.addEventListener('input', (e) => syncVelocity(e.target.value));
angleSlider.addEventListener('input', (e) => syncAngle(e.target.value));
velocityInput.addEventListener('change', (e) => syncVelocity(e.target.value));
angleInput.addEventListener('change', (e) => syncAngle(e.target.value));

launchButton.addEventListener('click', launch);

window.addEventListener('load', () => {
    setupCanvas();
    initializeGame();
});

window.addEventListener('resize', () => {
    setupCanvas();
    initializeGame();
});
