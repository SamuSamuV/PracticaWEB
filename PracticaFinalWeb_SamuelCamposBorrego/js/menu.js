const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let menuActive = true;
let inOptions = false;

const buttons = [
    { text: "JUGAR", x: 220, y: 220, width: 200, height: 40, action: startGame },
    { text: "OPCIONES", x: 220, y: 280, width: 200, height: 40, action: showOptions },
    { text: "SALIR", x: 220, y: 340, width: 200, height: 40, action: exitGame }
];

const backButton = { text: "VOLVER", x: 220, y: 300, width: 200, height: 40, action: backToMenu };

let volume = 0.5;
let isDraggingVolume = false;
const volumeBar = { x: 200, y: 200, width: 240, height: 20 };

// Partículas
let particles = [];

function createParticle() {
    const x = Math.random() * canvas.width;
    const y = canvas.height + 10;
    const speedY = -Math.random() * 1.5 - 0.5;
    const radius = Math.random() * 2 + 1;
    const alpha = 1;
    particles.push({ x, y, speedY, radius, alpha });
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.y += p.speedY;
        p.alpha -= 0.01;
        if (p.alpha <= 0) particles.splice(i, 1);
    }
}

function drawParticles() {
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
    });
}

// Menú principal
function drawMenu() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "black");
    gradient.addColorStop(1, "#9DCDFF");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawParticles();

    ctx.fillStyle = "white";
    ctx.font = "24px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillText("TapP", canvas.width / 2, 100);

    ctx.font = "12px 'Press Start 2P'";
    buttons.forEach(btn => {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);
        ctx.fillRect(btn.x, btn.y, btn.width, btn.height);
        ctx.fillStyle = "black";
        ctx.fillText(btn.text, btn.x + btn.width / 2, btn.y + 26);
    });
}

// Opciones
function drawOptions() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "black");
    gradient.addColorStop(1, "#9DCDFF");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawParticles();

    ctx.fillStyle = "white";
    ctx.font = "16px 'Press Start 2P'";
    ctx.fillText("OPCIONES", canvas.width / 2, 100);

    ctx.font = "12px 'Press Start 2P'";
    ctx.fillText("Volumen", canvas.width / 2, volumeBar.y - 10);

    // Barra de volumen
    ctx.fillStyle = "#444";
    ctx.fillRect(volumeBar.x, volumeBar.y, volumeBar.width, volumeBar.height);
    ctx.fillStyle = "#0f0";
    ctx.fillRect(volumeBar.x, volumeBar.y, volume * volumeBar.width, volumeBar.height);
    ctx.strokeStyle = "black";
    ctx.strokeRect(volumeBar.x, volumeBar.y, volumeBar.width, volumeBar.height);

    // Botón volver
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.strokeRect(backButton.x, backButton.y, backButton.width, backButton.height);
    ctx.fillRect(backButton.x, backButton.y, backButton.width, backButton.height);
    ctx.fillStyle = "black";
    ctx.fillText(backButton.text, backButton.x + backButton.width / 2, backButton.y + 26);
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (Math.random() < 0.5) createParticle();
    updateParticles();
    if (menuActive && !inOptions) drawMenu();
    else if (inOptions) drawOptions();
    requestAnimationFrame(loop);
}

document.fonts.ready.then(() => {
    loop();
});

function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) * (canvas.width / rect.width),
        y: (evt.clientY - rect.top) * (canvas.height / rect.height)
    };
}

canvas.addEventListener("mousedown", function (evt) {
    const pos = getMousePos(evt);

    if (inOptions) {
        if (
            pos.x >= volumeBar.x &&
            pos.x <= volumeBar.x + volumeBar.width &&
            pos.y >= volumeBar.y &&
            pos.y <= volumeBar.y + volumeBar.height
        ) {
            isDraggingVolume = true;
            updateVolumeFromMouse(pos.x);
        } else if (
            pos.x >= backButton.x &&
            pos.x <= backButton.x + backButton.width &&
            pos.y >= backButton.y &&
            pos.y <= backButton.y + backButton.height
        ) {
            backToMenu();
        }
    } else if (menuActive) {
        buttons.forEach(btn => {
            if (
                pos.x >= btn.x &&
                pos.x <= btn.x + btn.width &&
                pos.y >= btn.y &&
                pos.y <= btn.y + btn.height
            ) {
                btn.action();
            }
        });
    }
});

canvas.addEventListener("mousemove", function (evt) {
    if (isDraggingVolume) {
        const pos = getMousePos(evt);
        updateVolumeFromMouse(pos.x);
    }
});

canvas.addEventListener("mouseup", function () {
    isDraggingVolume = false;
});

function updateVolumeFromMouse(mouseX) {
    const relativeX = mouseX - volumeBar.x;
    volume = Math.min(1, Math.max(0, relativeX / volumeBar.width));
    console.log("Volumen:", volume.toFixed(2));
    // Aquí podrías ajustar el volumen de un audio real: audio.volume = volume;
}

// Acciones de los botones
function startGame() {
    menuActive = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "16px 'Press Start 2P'";
    ctx.fillText("¡Juego Iniciado!", canvas.width / 2, canvas.height / 2);
}

function showOptions() {
    inOptions = true;
}

function backToMenu() {
    inOptions = false;
}

function exitGame() {
    alert("Gracias por jugar. Cierra la ventana para salir.");
}
