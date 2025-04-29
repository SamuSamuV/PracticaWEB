const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let menuActive = true;

const buttons = [
    { text: "JUGAR", x: 220, y: 220, width: 200, height: 40, action: startGame },
    { text: "OPCIONES", x: 220, y: 280, width: 200, height: 40, action: showOptions },
    { text: "SALIR", x: 220, y: 340, width: 200, height: 40, action: exitGame }
];

// Partículas
let particles = [];

function createParticle() {
    const x = Math.random() * canvas.width;
    const y = canvas.height + 10; // empieza justo debajo del canvas
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

        if (p.alpha <= 0) {
            particles.splice(i, 1);
        }
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

// Dibujo de menú
function drawMenu() {
    // Fondo degradado
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "black");
    gradient.addColorStop(1, "#9DCDFF");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Partículas
    drawParticles();

    // Título
    ctx.fillStyle = "white";
    ctx.font = "24px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillText("TapP", canvas.width / 2, 100);

    // Botones
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

function loop() {
    if (menuActive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (Math.random() < 0.5) createParticle(); // controla la cantidad
        updateParticles();
        drawMenu();
    }
    requestAnimationFrame(loop);
}

document.fonts.ready.then(() => {
    loop();
});

function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

canvas.addEventListener("click", function (evt) {
    if (!menuActive) return;
    const pos = getMousePos(evt);
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
});

function startGame() {
    menuActive = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "16px 'Press Start 2P'";
    ctx.fillText("¡Juego Iniciado!", canvas.width / 2, canvas.height / 2);
}

function showOptions() {
    alert("Opciones no disponibles todavía.");
}

function exitGame() {
    alert("Gracias por jugar. Cierra la ventana para salir.");
}
