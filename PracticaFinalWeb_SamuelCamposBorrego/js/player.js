const playerSprite = new Image();
playerSprite.src = "sprites/Character_Anim.png";

const player = {
    x: 100,
    y: canvas.height - 70,
    width: 75,
    height: 75,
    baseSpeed: 180,
    currentSpeed: 180,
    speedIncrement: 5,
    isOnTop: false,
    isAlive: true,

    
    reset: function() {
        this.x = 100; // Posición inicial fija
        this.y = canvas.height - 70;
        this.currentSpeed = this.baseSpeed;
        this.isOnTop = false;
        this.isAlive = true;
    },

    update: function(deltaTime) {
        if (!this.isAlive) return;
        this.currentSpeed += this.speedIncrement * deltaTime;
        this.x += this.currentSpeed * deltaTime;
    },

    draw: function(deltaTime) {
        if (!this.isAlive) return;

        // Animación de frame
        frameTimer += deltaTime * 1000;
        if (frameTimer >= FRAME_DURATION) {
            frameTimer = 0;
            currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
        }

        const col = currentFrame % SPRITE_COLS;
        const row = Math.floor(currentFrame / SPRITE_COLS);

        ctx.save();

        // Centro del sprite
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        // Mover origen al centro
        ctx.translate(centerX, centerY);

        if (this.isOnTop) {
            // Solo giro 180º (volteo vertical)
            ctx.scale(1, -1);
        }

        // Dibujo desde el centro corregido
        ctx.drawImage(
            playerSprite,
            col * FRAME_WIDTH, row * FRAME_HEIGHT,
            FRAME_WIDTH, FRAME_HEIGHT,
            -this.width / 2, -this.height / 2,
            this.width, this.height
        );

        ctx.restore();
    },
        
    jump: function() {
        if (!this.isAlive) return;
        
        this.isOnTop = !this.isOnTop;
        this.y = this.isOnTop ? 0 : canvas.height - this.height - 0;

        
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
        ctx.fillStyle = "rgba(255, 50, 50, 0.7)";
        ctx.fillRect(this.x - 15, this.y - 15, this.width + 30, this.height + 30);
    }
};

document.addEventListener("keydown", function(e) {
    if (e.code === "Space" && !menuActive) {
        player.jump();
    }
});

const SPRITE_COLS = 5;
const SPRITE_ROWS = 2;
const FRAME_WIDTH = 280;
const FRAME_HEIGHT = 385;
const TOTAL_FRAMES = SPRITE_COLS * SPRITE_ROWS;
let currentFrame = 0;
let frameTimer = 0;
const FRAME_DURATION = 100;
