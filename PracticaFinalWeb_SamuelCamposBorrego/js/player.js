const player = {
    x: 100,
    y: canvas.height - 50,
    width: 40,
    height: 40,
    speed: 200,
    isOnTop: false,

    reset: function() {
        this.x = 100;
        this.y = canvas.height - 50;
        this.isOnTop = false;
    },

    update: function(deltaTime) {
        this.x += this.speed * deltaTime;
    },

    draw: function() {
        ctx.fillStyle = "#FF3355";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Ojos
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(this.x + 10, this.y + 10, 8, 8);
        ctx.fillRect(this.x + 22, this.y + 10, 8, 8);
    },

    jump: function() {
        this.isOnTop = !this.isOnTop;
        this.y = this.isOnTop ? 10 : canvas.height - this.height - 10;
    }
};

document.addEventListener("keydown", function(e) {
    if (e.code === "Space" && !menuActive) {
        player.jump();
    }
});