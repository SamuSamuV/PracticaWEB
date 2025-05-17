const walls = {
    list: [],
    width: 60,
    spacing: 300,
    speed: 180,
    nextWallX: 0,
    lastPosition: 'bottom',

    init: function() {
        this.list = [];
        this.nextWallX = canvas.width;
        this.lastPosition = 'bottom';
    },

    update: function(deltaTime) {
        // Mover paredes
        this.list.forEach(wall => {
            wall.x -= this.speed * deltaTime;
        });

        // Eliminar fuera de pantalla
        this.list = this.list.filter(wall => wall.x + this.width > -this.width);

        // Dificultad progresiva
        const difficulty = Math.min(1, player.currentSpeed / player.baseSpeed);
        this.spacing = 300 - (difficulty * 100);

        // Generar nuevas
        if (this.nextWallX - player.x < canvas.width * 1.5) {
            this.generateWall();
        }
    },

    generateWall: function() {
        const position = Math.random() > 0.7 ? 
                       (this.lastPosition === 'top' ? 'bottom' : 'top') : 
                       this.lastPosition;
        this.lastPosition = position;

        const minHeight = canvas.height * 0.3;
        const maxHeight = canvas.height * 0.7;
        const wallHeight = Math.random() * (maxHeight - minHeight) + minHeight;

        this.list.push({
            x: this.nextWallX,
            y: position === 'top' ? 0 : canvas.height - wallHeight,
            height: wallHeight,
            position: position
        });

        this.nextWallX += this.width + this.spacing;
    },

    draw: function() {
        ctx.fillStyle = "#4AF";
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 2;
        
        this.list.forEach(wall => {
            ctx.fillRect(wall.x, wall.y, this.width, wall.height);
            ctx.strokeRect(wall.x, wall.y, this.width, wall.height);
            
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
    isGamePaused = true;

    setTimeout(() => {
        alert(`¡Game Over! Puntuación: ${score}`);
        isGamePaused = false;
        menuActive = true; // Volver al menú
        loopMenu(); // Mostrar el menú principal
    }, 300);
}