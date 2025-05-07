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
        this.x = 100;
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
        frameTimer += deltaTime * 1000; // deltaTime en ms
        if (frameTimer >= FRAME_DURATION) {
            frameTimer = 0;
            currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
        }
    
        const col = currentFrame % SPRITE_COLS;
        const row = Math.floor(currentFrame / SPRITE_COLS);
    
        ctx.save();
    
        if (this.isOnTop) {
            // Voltear horizontalmente (espejo)
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.scale(-1, 1);
            ctx.translate(-this.width / 2, -this.height / 2);
    
            ctx.drawImage(
                playerSprite,
                col * FRAME_WIDTH, row * FRAME_HEIGHT,
                FRAME_WIDTH, FRAME_HEIGHT,
                0, 0,
                this.width, this.height
            );
        } else {
            ctx.drawImage(
                playerSprite,
                col * FRAME_WIDTH, row * FRAME_HEIGHT,
                FRAME_WIDTH, FRAME_HEIGHT,
                this.x, this.y,
                this.width, this.height
            );
        }
    
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
