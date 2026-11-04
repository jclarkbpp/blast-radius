import { Circle } from "./Circle.js";

export class Game {
    constructor(width, height, maxCircles = 40, initialCircles = null) {
        this.width = width;
        this.height = height;

        this.maxCircles = maxCircles;

        this.circles = initialCircles ? [...initialCircles] : [];

        this.score = 0;
        this.numActiveExplosions = 0;

        this.firstExplosionStarted = false;
        this.hasClickedMouse = false;

        this.isGameOver = false;
        this.gameResult = null;

        this.init();
    }

    init() {

        // Only generate random circles if none were provided
        if (this.circles.length > 0) {
            return;
        }
        
        for (let i = 0; i < this.maxCircles; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;

            const colour = "#" +
                Math.floor(Math.random() * 16777215).toString(16);

            this.circles.push(new Circle(x, y, colour));
        }
    }

    click(x, y) {
        if (this.hasClickedMouse || this.isGameOver) {
            return;
        }

        for (const circle of this.circles) {
            if (circle.isClicked(x, y) && !circle.hasBeenClicked) {
                if (circle.explode()) {
                    this.score++;
                    this.numActiveExplosions++;
                    this.firstExplosionStarted = true;
                    this.hasClickedMouse = true;
                }

                break;
            }
        }
    }

    update(deltaTime) {
        if (this.isGameOver) return;

        for (const circle of this.circles) {
            const destroyed = circle.update(
                deltaTime,
                this.width,
                this.height
            );

            if (destroyed) {
                this.numActiveExplosions--;
            }
        }

        // Check collisions
        for (const circle of this.circles) {
            if (circle.hasBeenClicked) continue;

            for (const other of this.circles) {
                if (
                    other.hasBeenClicked &&
                    circle.isOverlappingWith(other)
                ) {
                    if (circle.explode()) {
                        this.score++;
                        this.numActiveExplosions++;
                    }
                }
            }
        }

        // Remove destroyed circles
        this.circles = this.circles.filter(
            circle => !circle.isDestroyed
        );

        this.checkForGameOver();
    }

    checkForGameOver() {
        if (
            this.firstExplosionStarted &&
            this.numActiveExplosions <= 0
        ) {
            this.isGameOver = true;

            this.gameResult =
                this.circles.length === 0 ? "win" : "loss";
        }
    }
}