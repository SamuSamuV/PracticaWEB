const walls = {
    list: [],
    width: 60,
    spacing: 300, // Espacio entre paredes
    speed: 180,
    nextWallX: 0,
    lastPosition: 'bottom', // 'top' o 'bottom'

    init: function() {
        this.list = [];
        this.nextWallX = canvas.width;
        this.lastPosition = 'bottom'; // Empieza con pared abajo
    },

    update: function(deltaTime) {
        // Mover paredes
        this.list.forEach(wall => {
            wall.x -= this.speed * deltaTime;
        });

        // Eliminar paredes fuera de pantalla
        this.list = this.list.filter(wall => wall.x + this.width > -this.width);

        // Generar nuevas paredes
        if (this.nextWallX - player.x < canvas.width * 1.5) {
            this.generateWall();
        }
    },

    generateWall: function() {
        // Alternar posición (arriba/abajo)
        const position = this.lastPosition === 'top' ? 'bottom' : 'top';
        this.lastPosition = position;

        const wallHeight = canvas.height / 2; // Media pantalla de altura

        this.list.push({
            x: this.nextWallX,
            y: position === 'top' ? 0 : canvas.height - wallHeight,
            height: wallHeight,
            position: position
        });

        this.nextWallX += this.width + this.spacing;
    },

    draw: function() {
        ctx.fillStyle = "#4AF"; // Azul
        ctx.strokeStyle = "#FFF"; // Borde blanco
        ctx.lineWidth = 2;
        
        this.list.forEach(wall => {
            ctx.fillRect(wall.x, wall.y, this.width, wall.height);
            ctx.strokeRect(wall.x, wall.y, this.width, wall.height);
            
            // Dibujar patrón en la pared
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            for (let y = wall.y + 10; y < wall.y + wall.height; y += 20) {
                ctx.fillRect(wall.x + 5, y, this.width - 10, 10);
            }
            ctx.fillStyle = "#4AF";
        });
    },

    checkCollision: function() {
        if (!player.isAlive) return;

        const playerBounds = player.getBounds();
        
        for (let wall of this.list) {
            if (playerBounds.x < wall.x + this.width &&
                playerBounds.x + playerBounds.width > wall.x &&
                playerBounds.y < wall.y + wall.height &&
                playerBounds.y + playerBounds.height > wall.y) {
                gameOver();
                return;
            }
        }
    }
};

function gameOver() {
    player.die();
    setTimeout(() => {
        alert(`¡Has chocado! Puntuación: ${score}`);
        startGame();
    }, 300);
}