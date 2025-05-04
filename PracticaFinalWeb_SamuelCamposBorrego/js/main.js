const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Configuración del juego
let lastTime = 0;
let menuActive = true;
let score = 0;
let frameCount = 0;
let lastFpsUpdate = 0;
let fps = 0;

// Sistema de cámara
let cameraOffset = { x: 0, y: 0 };
const cameraSettings = {
    offsetX: 150,
    smoothSpeed: 4
};

// Fondo
let bgOffset = 0;
const bgSpeed = 30;

function gameLoop(timestamp) {
    // Calcular FPS
    frameCount++;
    if (timestamp - lastFpsUpdate >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastFpsUpdate = timestamp;
    }
    
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    // Actualizar elementos del juego
    player.update(deltaTime);
    walls.update(deltaTime);
    walls.checkCollision();
    
    // Actualizar cámara (movimiento suavizado)
    cameraOffset.x += ((player.x - cameraSettings.offsetX) - cameraOffset.x) * 
                     cameraSettings.smoothSpeed * deltaTime;
    
    // Actualizar fondo
    bgOffset = (bgOffset + bgSpeed * deltaTime) % canvas.width;
    
    // Actualizar puntuación
    score = Math.floor(player.x / 100);

    // Dibujar
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(bgOffset);
    
    // Dibujar mundo (con transformación de cámara)
    ctx.save();
    ctx.translate(-Math.floor(cameraOffset.x), 0);
    
    walls.draw();
    player.draw();
    
    ctx.restore();
    
    // Dibujar HUD
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
    // Panel de información
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(canvas.width - 150, 10, 140, 50);
    
    // Texto
    ctx.fillStyle = "white";
    ctx.font = "12px 'Press Start 2P'";
    ctx.textAlign = "right";
    ctx.fillText(`FPS: ${fps}`, canvas.width - 20, 30);
    ctx.fillText(`PTS: ${score}`, canvas.width - 20, 50);
}

function startGame() {
    menuActive = false;
    score = 0;
    player.reset();
    walls.init();
    cameraOffset = { x: 0, y: 0 };
    lastTime = performance.now();
    lastFpsUpdate = performance.now();
    requestAnimationFrame(gameLoop);
}

window.onload = function() {
    document.fonts.ready.then(function() {
        if (menuActive) {
            loopMenu();
        }
    });
};