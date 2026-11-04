
import { Game } from "./src/Game.js";

// GAME CONFIGURATION
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const game = new Game(750, 400, 40);

let oldTimeStamp = 0;
let fps = 0;

// RENDERING
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    context.fillStyle = "lightgray";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Circles
    for (const circle of game.circles) {
        context.fillStyle = circle.colour;

        context.beginPath();
        context.arc(
            circle.x,
            circle.y,
            circle.radius,
            0,
            2 * Math.PI
        );
        context.fill();
    }

    // Score
    context.font = "25px Arial";
    context.fillStyle = "black";
    context.fillText(
        "Score: " + game.score,
        10,
        canvas.height - 30
    );

    // FPS
    context.fillText("FPS: " + fps, 10, 30);

    // Game over
    if (game.isGameOver) {
        context.font = "40px Arial";
        context.textAlign = "center";

        context.fillText(
            game.gameResult === "win" ? "You Win!" : "Game Over!",
            canvas.width / 2,
            canvas.height / 2
        );

        context.textAlign = "left";
    }
}

// GAME LOOP
function main(timeStamp) {
    if (!oldTimeStamp) {
        oldTimeStamp = timeStamp;
    }

    const deltaTime = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    fps = Math.round(1 / deltaTime);

    game.update(deltaTime);

    draw();

    requestAnimationFrame(main);
}

// MOUSE INTERACTION
canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    game.click(mouseX, mouseY);
});

// START GAME
requestAnimationFrame(main);
