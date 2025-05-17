const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Configuración del juego
let gameStartTime = 0;
let lastFrameTime = 0;
let menuActive = true;
let score = 0;
let isGamePaused = false;

// Sistema de FPS
let fps = 0;
let fpsSamples = [];
const fpsSampleCount = 5;

// Sistema de cámara
let cameraOffset = { x: 0, y: 0 };
const cameraSettings = {
    offsetX: 150,
    followSharpness: 0.15
};

// Fondo
let bgOffset = 0;
const bgSpeed = 30;

// Audio
const backgroundMusic = new Audio("sounds/music.mp3");
backgroundMusic.volume = 0.4;
backgroundMusic.loop = true;

function gameLoop(timestamp) {
    if (!gameStartTime) {
        gameStartTime = timestamp;
        lastFrameTime = timestamp;
    }
    
    // Control de música
    if (isGamePaused || !player.isAlive) {
        backgroundMusic.pause();
    } else if (backgroundMusic.paused) {
        backgroundMusic.play().catch(e => console.log("Error música:", e));
    }

    // Cálculo de FPS
    const deltaTime = (timestamp - lastFrameTime) / 1000;
    lastFrameTime = timestamp;
    
    if (deltaTime > 0) {
        const currentFps = 1 / deltaTime;
        fpsSamples.push(currentFps);
        
        if (fpsSamples.length > fpsSampleCount) {
            fpsSamples.shift();
        }
        
        fps = Math.round(fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length);
    }

    if (isGamePaused || !player.isAlive) {
        requestAnimationFrame(gameLoop);
        return;
    }

    // Actualizaciones del juego
    player.update(deltaTime);
    walls.speed = player.currentSpeed;
    walls.update(deltaTime);
    walls.checkCollision();
    
    const targetX = player.x - cameraSettings.offsetX;
    cameraOffset.x += (targetX - cameraOffset.x) * cameraSettings.followSharpness;
    
    bgOffset = (bgOffset + bgSpeed * deltaTime) % canvas.width;
    score = Math.floor(player.x / 100);

    // Dibujado
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(bgOffset);
    
    ctx.save();
    ctx.translate(-Math.floor(cameraOffset.x), 0);
    walls.draw();
    player.draw(deltaTime);
    ctx.restore();
    
    drawHUD();
    requestAnimationFrame(gameLoop);
}

function drawBackground(offset) {
    const bgPattern1 = "#0f0f23";
    const bgPattern2 = "#1a1a3a";
    const segmentWidth = 80;
    
    for (let x = -offset; x < canvas.width; x += segmentWidth * 2) {
        ctx.fillStyle = bgPattern1;
        ctx.fillRect(x, 0, segmentWidth, canvas.height);
        ctx.fillStyle = bgPattern2;
        ctx.fillRect(x + segmentWidth, 0, segmentWidth, canvas.height);
    }
}

function drawHUD() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(canvas.width - 150, 10, 140, 50);
    
    ctx.fillStyle = "white";
    ctx.font = "12px 'Press Start 2P'";
    ctx.textAlign = "right";
    ctx.fillText(`FPS: ${fps}`, canvas.width - 20, 30);
    ctx.fillText(`PTS: ${score}`, canvas.width - 20, 50);
}

function startGame() {
    gameStartTime = 0;
    lastFrameTime = 0;
    fpsSamples = [];
    fps = 0;
    
    menuActive = false;
    score = 0;
    player.reset();
    walls.init();
    cameraOffset = { x: player.x - cameraSettings.offsetX, y: 0 };
    isGamePaused = false;
    
    // Iniciar música
    backgroundMusic.currentTime = 0;
    backgroundMusic.play().catch(e => console.log("Error al iniciar música:", e));
    
    requestAnimationFrame(gameLoop);
}

window.onload = function() {
    document.fonts.ready.then(function() {
        if (menuActive) {
            loopMenu();
        }
    });
};