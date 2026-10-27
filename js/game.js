document.addEventListener("DOMContentLoaded", function(){
    // GAME LOGIC HERE
    "use strict";

    // CANVAS VARIABLES
    let canvas;
    let context;

    // DELTATIME VARIABLES
    let secondsPassed;
    let oldTimeStamp;
    let fps;

    // CIRCLE VARIABLES
    let circles = [];
    let maxCircles = 40;

    // GAME VARIABLES
    let score = 0;
    let hasClickedMouse = false;
    let numActiveExplosions = 0;
    let firstExplosionStarted = false;

    // TEXT VARIABLES
    let displayFPS = false;
    let displayExplosionText = false;
    let displayScoreText = false;
    let displayInstructions = true;
    let displayInstructionsTimer = 1;

    // CLASSES
    class Circle
    {
        constructor(x, y, colour)
        {
            this.x = x;
            this.y = y;
            this.xDirection = Math.random() < 0.5 ? -1 : 1;
            this.yDirection = Math.random() < 0.5 ? -1 : 1;

            this.colour = colour;
            this.opacity = 1;
            this.fadeSpeed = 1;

            this.moveSpeed = 1;

            this.radius = 12;
            this.targetRadius = 12;
            this.radiusToAdd = 50;
            this.growthSpeed = 20;
            this.hasBeenClicked = false;

            this.explosionTimer = 0;
            this.explosionDuration = 3;
            this.isExploding = false;
            this.isDestroyed = false;
        }

        draw(context)
        {
            context.fillStyle = this.colour;
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            context.fill();
        }

        update(deltaTime)
        {
            // Increase explosion timer (if exploding)
            if (this.isExploding){
                this.explosionTimer += deltaTime;

                // Set destroy flag for clean up
                if (this.explosionTimer >= this.explosionDuration){
                    this.isDestroyed = true;
                    checkForGameOver();
                }
            }

            // Update position
            if (!this.isExploding){
                this.x += this.xDirection * this.moveSpeed;
                this.y += this.yDirection * this.moveSpeed;
            }

            // Collide with canvas edges
            if (this.x + this.radius >= canvas.width){
                this.x = canvas.width - this.radius; // Prevent sticking to edge
                this.xDirection = -1;
            }
            else if (this.x - this.radius <= 0){
                this.x = this.radius;
                this.xDirection = 1;
            }

            if (this.y + this.radius >= canvas.height){
                this.y = canvas.height - this.radius;
                this.yDirection = -1;
            }
            else if (this.y - this.radius <= 0){
                this.y = this.radius;
                this.yDirection = 1;
            }

            // Grow to target radius
            if (this.radius < this.targetRadius){
                this.radius += this.growthSpeed * deltaTime;
                // Protect against overgrowth
                if (this.radius > this.targetRadius) {
                    this.radius = this.targetRadius;
                }
            }
        }

        isOverlappingWith(otherCircle){
            const dx = this.x - otherCircle.x;
            const dy = this.y - otherCircle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < this.radius + otherCircle.radius;
        }

        isClicked(mousePosX, mousePosY)
        {
            const dx = mousePosX - this.x;
            const dy = mousePosY - this.y;
            return Math.sqrt(dx * dx + dy * dy) <= this.radius;
        }

        explode()
        {
            if (!this.isExploding){
                if (!firstExplosionStarted){
                    firstExplosionStarted = true;
                }
                this.hasBeenClicked = true;
                score += 1;
                numActiveExplosions += 1;
                this.moveSpeed = 0;
                this.targetRadius += this.radiusToAdd;
                this.isExploding = true;
                this.explosionTimer = 0;
            }
        }
    }

    function init()
    {
        // Get reference to canvas
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");

        // Populate circle array
        for (let i = 0; i < maxCircles; i++){
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;                
            let colour = '#' + Math.floor(Math.random()*16777215).toString(16);
            circles.push(new Circle(x, y, colour));
        }

        // Add click event listener
        canvas.addEventListener("click", function(event){
            if (hasClickedMouse) return; // Allow player to click mouse once

            const rect = canvas.getBoundingClientRect();
            const mousePosX = event.clientX - rect.left;
            const mousePosY = event.clientY - rect.top;

            for (let circle of circles){
                if (circle.isClicked(mousePosX, mousePosY) && !circle.hasBeenClicked){
                    circle.explode();
                    hasClickedMouse = true;
                    break;
                }
            }
        });

        // Start first frame request
        window.requestAnimationFrame(main);
    }

    function main(timeStamp)
    {
        // Fixes issue where oldStamp was not set on first frame, causing deltaTime to be NaN and breaking timers
        if (!oldTimeStamp) oldTimeStamp = timeStamp;

        // Calculate seconds since last frame
        secondsPassed = (timeStamp - oldTimeStamp) / 1000;
        oldTimeStamp = timeStamp;

        // Calculate fps
        fps = Math.round(1 / secondsPassed);

        // Update Logic
        update(secondsPassed)

        // Draw frame
        draw();

        // Keep requesting new frames
        window.requestAnimationFrame(main);
    }

    function update(deltaTime){
        // Call each circle's update function
        for (let i = 0; i < circles.length; i++){
            let circle = circles[i];
            circle.update(deltaTime);

            // Check for collisions
            for (let j = 0; j < circles.length; j++){
                if (i !==j){
                    let other = circles[j];
                    if (circle.isOverlappingWith(other) && other.hasBeenClicked && !circle.hasBeenClicked){
                        circle.explode();
                    }
                }
            }
        }

        // Remove instructions after set time
        displayInstructionsTimer -= deltaTime;
        if (displayInstructionsTimer <= 0){
            displayInstructions = false;
            displayInstructionsTimer = 0;
        }
    }

    function draw()
    {
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background colour
        context.fillStyle = "lightgray";
        context.fillRect(0, 0 , canvas.width, canvas.height);

        // Display fps on screen
        if (displayFPS){
            context.font = "25px Arial";
            context.fillStyle = "black"
            context.fillText("FPS: " + fps, 10, 30);
        }

        // Display number of active explosions
        if (displayExplosionText){
            context.font = "25px Arial";
            context.fillStyle = "black";
            context.fillText("Active Explosions: " + numActiveExplosions, canvas.width - 240, 30);
        }            

        // Draw circles
        for (let circle of circles){
            circle.draw(context);
        }

        // Display score on screen
        if (displayScoreText){
            context.font = "25px Arial";
            context.fillStyle = "black";
            context.fillText("Score: " + score, 10, canvas.height - 30);
        }            

        // Display instructions
        if (displayInstructions){
            context.font = "25px Arial";
            context.fillStyle = "black";
            context.fillText("Click a circle", canvas.width / 2 - 80, canvas.height / 2);
        }
    }

    function checkForGameOver()
    {
        numActiveExplosions--;

        // Remove circles marked as being destroyed
        circles = circles.filter(circle => !circle.isDestroyed)

        if (numActiveExplosions <= 0 && firstExplosionStarted){
            const modal = document.getElementById("gameOverModal");
            const message = document.getElementById("gameOverMessage");
            const scoreDisplay = document.getElementById("finalScore");

            if (circles.length > 0){
                message.textContent = "Game Over!";
            }
            else{
                message.textContent = "You Win!";
            }

            scoreDisplay.textContent = "Your score: " + score;
            modal.style.display = "block";
        }
    }

    // START GAME
    init();
});

