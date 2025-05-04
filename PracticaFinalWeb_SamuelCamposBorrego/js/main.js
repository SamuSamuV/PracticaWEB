const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Variables del juego
let lastTime = 0;
let menuActive = true;
let cameraOffset = { x: 0, y: 0 };
let fps = 0;
let lastFpsUpdate = 0;
let frameCount = 0;
let score = 0;
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

    // Actualizar
    player.update(deltaTime);
    cameraOffset.x = player.x - 100;
    score = Math.floor(player.x / 100);
    bgOffset = (bgOffset + bgSpeed * deltaTime) % canvas.width;

    // Dibujar
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fondo infinito con patrones
    drawBackground(bgOffset);
    
    // Aplicar cámara
    ctx.save();
    ctx.translate(-cameraOffset.x, 0);
    
    // Líneas de referencia
    ctx.fillStyle = "#4a4a8a";
    ctx.fillRect(0, 0, cameraOffset.x + canvas.width * 2, 5); // Techo
    ctx.fillRect(0, canvas.height - 5, cameraOffset.x + canvas.width * 2, 5); // Suelo
    
    // Jugador
    player.draw();
    
    ctx.restore();
    
    // HUD (esquina superior derecha)
    drawHUD();
    
    requestAnimationFrame(gameLoop);
}

function drawBackground(offset) {
    // Patrón de fondo infinito
    const bgPattern1 = "#1a1a2e";
    const bgPattern2 = "#252547";
    const segmentWidth = 80;
    
    for (let x = -offset; x < canvas.width; x += segmentWidth * 2) {
        ctx.fillStyle = bgPattern1;
        ctx.fillRect(x, 0, segmentWidth, canvas.height);
        ctx.fillStyle = bgPattern2;
        ctx.fillRect(x + segmentWidth, 0, segmentWidth, canvas.height);
    }
}

function drawHUD() {
    // Fondo semitransparente para el HUD
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(canvas.width - 150, 10, 140, 45);
    
    // Texto del HUD
    ctx.fillStyle = "white";
    ctx.font = "12px 'Press Start 2P'";
    ctx.textAlign = "right";
    
    // FPS
    ctx.fillText(`FPS: ${fps}`, canvas.width - 20, 30);
    
    // Puntuación
    ctx.fillText(`PTS: ${score}`, canvas.width - 20, 50);
}


function startGame() {
    menuActive = false;
    score = 0;
    player.reset();
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