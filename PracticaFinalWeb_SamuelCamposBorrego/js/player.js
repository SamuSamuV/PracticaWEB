const player = {
    x: 100,
    y: canvas.height - 70, // Posición inicial abajo
    width: 40,
    height: 40,
    speed: 180,
    isOnTop: false,
    isAlive: true,

    reset: function() {
        this.x = 100;
        this.y = canvas.height - 70;
        this.isOnTop = false;
        this.isAlive = true;
    },

    update: function(deltaTime) {
        if (!this.isAlive) return;
        this.x += this.speed * deltaTime;
    },

    draw: function() {
        if (!this.isAlive) return;
        
        // Cuerpo del jugador
        ctx.fillStyle = "#FF3355";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Ojos (orientación diferente según posición)
        ctx.fillStyle = "#FFFFFF";
        const eyeY = this.isOnTop ? this.y + 25 : this.y + 10;
        ctx.fillRect(this.x + 10, eyeY, 8, 8);
        ctx.fillRect(this.x + 22, eyeY, 8, 8);
    },

    jump: function() {
        if (!this.isAlive) return;
        
        this.isOnTop = !this.isOnTop;
        // Posiciones ajustadas para esquivar paredes
        this.y = this.isOnTop ? 30 : canvas.height - this.height - 30;
        
        // Pequeño efecto visual
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(this.x - 5, this.isOnTop ? this.y + this.height : this.y - 5, 
                    this.width + 10, 5);
    },

    getBounds: function() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    },

    die: function() {
        this.isAlive = false;
        // Efecto visual de explosión
        ctx.fillStyle = "rgba(255, 50, 50, 0.7)";
        ctx.fillRect(this.x - 15, this.y - 15, this.width + 30, this.height + 30);
    }
};

// Controles
document.addEventListener("keydown", function(e) {
    if (e.code === "Space" && !menuActive) {
        player.jump();
    }
});