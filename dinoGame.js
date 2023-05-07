document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    
    function setCanvasSize() {
        canvas.width = window.innerWidth * .9;
        canvas.height = window.innerHeight * .9;
    }


    class Dino {
        constructor() {
            this.height = canvas.height/2.5;
            this.width = this.height/279 * 118;
            this.x = 50;
            this.y = canvas.height - this.height;
            this.jumpHeight = canvas.height/20;
            this.gravity = 1.5;
            this.velocity = 0;
            this.image = new Image();
            this.image.src = 'pau.png';
    
        }

        draw() {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }    

        jump() {
            if (this.y === canvas.height - this.height) {
                this.velocity = -this.jumpHeight;
            }
        }

        update() {
            this.y += this.velocity;
            this.velocity += this.gravity;
            this.y = Math.min(this.y, canvas.height - this.height);
        }

    }

    class Obstacle {
        static baseSpeed = 8;

        constructor() {
            this.width = canvas.height/15;
            this.height = this.width;
            this.x = canvas.width;

            // Randomize the y position
            const minY = canvas.height - this.height - dino.height;
            const maxY = canvas.height - this.height;
            this.y = Math.random() < 0.5 ? minY : maxY;

            this.speed = Obstacle.baseSpeed;
            this.image = new Image();
            if (this.y == minY){
                this.image.src = 'murcielago.png';
            }
            else{
                this.image.src = 'erizo.png';
            }
            
        }

        update() {
            this.x -= this.speed;
        }

        draw() {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }    
    }

    let dino;
    let obstacles;
    let frame;
    let score;
    let initialObstacle = true;
    let randomDistance;

    function resetGame() {
        dino = new Dino();
        obstacles = [];
        frame = 0;
        score = 0;
    }

    function gameOver() {
        if (confirm("Final. Repetim??")) {
            setTimeout(() => {
                resetGame();
                requestAnimationFrame(gameLoop);
            }, 100);
        }
    }

    function getMinDistance() {
        return canvas.width/25 - (Obstacle.baseSpeed - 8) * canvas.width/250;
    }
    
    
    function drawScore() {
        const displayScore = Math.floor(score / 10);
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(`Puntuació: ${displayScore}`, 10, 30);
    }
    
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        dino.update();
        dino.draw();

        let maxDistance = getMinDistance()*2;

        if (initialObstacle) {
            obstacles.push(new Obstacle());
            randomDistance = Math.floor(Math.random() * (maxDistance - getMinDistance() + 1) + getMinDistance());
            initialObstacle = false;
        } else if (frame % randomDistance === 0) {
            obstacles.push(new Obstacle());
            randomDistance = Math.floor(Math.random() * (maxDistance - getMinDistance() + 1) + getMinDistance());
            frame = 0; // Reset the frame count after spawning an obstacle
        }
            
        for (let i = 0; i < obstacles.length; i++) {
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.shift();
                i--; // Decrement the index to account for the removed obstacle
            } else {
                obstacles[i].update();
                obstacles[i].draw();
                
                const padding = 10; // Add a padding value to make collisions stricter
        
                if (dino.x + padding < obstacles[i].x + obstacles[i].width &&
                    dino.x + dino.width - padding > obstacles[i].x &&
                    dino.y + padding < obstacles[i].y + obstacles[i].height &&
                    dino.y + dino.height - padding > obstacles[i].y) {
                    gameOver();
                    return;
                }
            }

        }

        if (score % 200 === 0 && score > 0) { // Check if the score is a multiple of 1000
            Obstacle.baseSpeed += 0.5; // Increase base obstacle speed
        }
    
        score++; // Increment the score
        drawScore(); // Draw the score on the canvas

        frame++;
        requestAnimationFrame(gameLoop);

    }

    canvas.addEventListener("click", () => {
        dino.jump();
    });

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    resetGame();
    gameLoop();
});
