// Variables del menú
let particles = [];
let volume = 0.5;
let isDraggingVolume = false;
const volumeBar = { 
    x: canvas.width/2 - 120, 
    y: 200, 
    width: 240, 
    height: 20 
};
let inOptions = false;

// Botones del menú
const buttons = [
    { 
        text: "JUGAR", 
        x: canvas.width/2 - 100, 
        y: 220, 
        width: 200, 
        height: 40, 
        action: startGame 
    },
    { 
        text: "OPCIONES", 
        x: canvas.width/2 - 100, 
        y: 280, 
        width: 200, 
        height: 40, 
        action: showOptions 
    },
    { 
        text: "SALIR", 
        x: canvas.width/2 - 100, 
        y: 340, 
        width: 200, 
        height: 40, 
        action: exitGame 
    }
];

// Sistema de partículas
function createParticle() {
    particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        speedY: -Math.random() * 1.5 - 0.5,
        radius: Math.random() * 2 + 1,
        alpha: 1,
        color: `hsl(${Math.random() * 60 + 180}, 100%, 50%)`
    });
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].y += particles[i].speedY;
        particles[i].alpha -= 0.01;
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    particles.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

// Dibujar menú
function drawMenu() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#001a33");
    gradient.addColorStop(1, "#003366");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawParticles();

    if (inOptions) {
        drawOptionsMenu();
    } else {
        drawMainMenu();
    }
}

function drawMainMenu() {
    ctx.fillStyle = "#4AF";
    ctx.font = '36px "Press Start 2P"';
    ctx.textAlign = "center";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 10;
    ctx.fillText("TapP", canvas.width/2, 100);
    ctx.shadowBlur = 0;

    ctx.font = '14px "Press Start 2P"';
    buttons.forEach(btn => {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fillRect(btn.x, btn.y, btn.width, btn.height);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.fillText(btn.text, btn.x + btn.width/2, btn.y + 25);
    });
}

function drawOptionsMenu() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FFF";
    ctx.font = '24px "Press Start 2P"';
    ctx.textAlign = "center";
    ctx.fillText("OPCIONES", canvas.width/2, 80);

    ctx.font = '14px "Press Start 2P"';
    ctx.textAlign = "left";
    ctx.fillText("VOLUMEN:", volumeBar.x, volumeBar.y - 15);

    ctx.fillStyle = "#444";
    ctx.fillRect(volumeBar.x, volumeBar.y, volumeBar.width, volumeBar.height);
    ctx.fillStyle = "#4AF";
    ctx.fillRect(volumeBar.x, volumeBar.y, volumeBar.width * volume, volumeBar.height);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.strokeRect(volumeBar.x, volumeBar.y, volumeBar.width, volumeBar.height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(canvas.width/2 - 100, 300, 200, 40);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(canvas.width/2 - 100, 300, 200, 40);
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText("VOLVER", canvas.width/2, 325);
}

function loopMenu() {
    if (!menuActive) return;

    if (Math.random() < 0.3) createParticle();
    updateParticles();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMenu();

    requestAnimationFrame(loopMenu);
}

// Control de volumen
function updateVolume(mouseX) {
    volume = Math.max(0, Math.min(1, (mouseX - volumeBar.x) / volumeBar.width));
    if (backgroundMusic) backgroundMusic.volume = volume;
    if (teleportSound) teleportSound.volume = volume;
}

canvas.addEventListener("mousedown", function(evt) {
    const rect = canvas.getBoundingClientRect();
    const pos = {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };

    if (inOptions) {
        if (pos.x >= volumeBar.x && pos.x <= volumeBar.x + volumeBar.width &&
            pos.y >= volumeBar.y && pos.y <= volumeBar.y + volumeBar.height) {
            isDraggingVolume = true;
            updateVolume(pos.x);
        }
        
        if (pos.x >= canvas.width/2 - 100 && pos.x <= canvas.width/2 + 100 &&
            pos.y >= 300 && pos.y <= 340) {
            inOptions = false;
        }
    } else {
        buttons.forEach(btn => {
            if (pos.x >= btn.x && pos.x <= btn.x + btn.width &&
                pos.y >= btn.y && pos.y <= btn.y + btn.height) {
                btn.action();
            }
        });
    }
});

canvas.addEventListener("mousemove", function(evt) {
    if (isDraggingVolume) {
        const rect = canvas.getBoundingClientRect();
        updateVolume(evt.clientX - rect.left);
    }
});

canvas.addEventListener("mouseup", function() {
    isDraggingVolume = false;
});

function showOptions() {
    inOptions = true;
}

function exitGame() {
    if (confirm("¿Estás seguro de que quieres salir del juego?")) {
        window.close();
    }
}