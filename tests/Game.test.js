
import { describe, it, expect } from "vitest";
import { Game } from "../src/Game.js";
import { Circle } from "../src/Circle.js";


describe("Game", () => {

    // Helper function to create a game with predefined circles
    function createGame(circles = []) {
        return new Game(750, 400, 0, circles);
    }


    it("should initialise with the correct number of circles", () => {
        const game = new Game(750, 400, 10);

        expect(game.circles.length).toBe(10);
    });


    it("should initialise the score to zero", () => {
        const game = createGame();

        expect(game.score).toBe(0);
    });


    it("should initialise with predefined circles", () => {
        const circle1 = new Circle(100, 100, "red");
        const circle2 = new Circle(200, 200, "blue");

        const game = createGame([circle1, circle2]);

        expect(game.circles.length).toBe(2);
        expect(game.circles[0]).toBe(circle1);
        expect(game.circles[1]).toBe(circle2);
    });


    it("should increase the score when a circle is clicked", () => {
        const circle = new Circle(100, 100, "red");
        const game = createGame([circle]);

        game.click(100, 100);

        //expect(game.score).toBe(1);
        expect(game.score).toBe(5);
        expect(circle.isExploding).toBe(true);
        expect(game.numActiveExplosions).toBe(1);
    });


    it("should only allow one initial click", () => {
        const circle1 = new Circle(100, 100, "red");
        const circle2 = new Circle(300, 300, "blue");

        const game = createGame([circle1, circle2]);

        game.click(100, 100);
        game.click(300, 300);

        expect(game.score).toBe(1);
        expect(circle1.isExploding).toBe(true);
        expect(circle2.isExploding).toBe(false);
    });


    it("should not increase the score when clicking empty space", () => {
        const circle = new Circle(100, 100, "red");
        const game = createGame([circle]);

        game.click(300, 300);

        expect(game.score).toBe(0);
        expect(circle.isExploding).toBe(false);
    });


    it("should trigger a chain reaction when circles overlap", () => {
        const circle1 = new Circle(100, 100, "red");
        const circle2 = new Circle(110, 100, "blue");

        const game = createGame([circle1, circle2]);

        // Start the first explosion
        game.click(100, 100);

        // Update game to detect the overlapping circle
        game.update(0);

        expect(circle1.isExploding).toBe(true);
        expect(circle2.isExploding).toBe(true);

        expect(game.score).toBe(2);
        expect(game.numActiveExplosions).toBe(2);
    });


    it("should remove destroyed circles", () => {
        const circle = new Circle(100, 100, "red");
        const game = createGame([circle]);

        game.click(100, 100);

        // Advance time beyond explosion duration
        game.update(3);

        expect(game.circles.length).toBe(0);
        expect(circle.isDestroyed).toBe(true);
    });


    it("should declare a win when all circles are destroyed", () => {
        const circle = new Circle(100, 100, "red");
        const game = createGame([circle]);

        game.click(100, 100);

        game.update(3);

        expect(game.isGameOver).toBe(true);
        expect(game.gameResult).toBe("win");
    });


    it("should declare a loss when circles remain", () => {
        const circle1 = new Circle(100, 100, "red");
        const circle2 = new Circle(300, 300, "blue");

        const game = createGame([circle1, circle2]);

        game.click(100, 100);

        game.update(3);

        expect(game.isGameOver).toBe(true);
        expect(game.gameResult).toBe("loss");
        expect(game.circles.length).toBe(1);
    });


    it("should not update the game after game over", () => {
        const circle = new Circle(100, 100, "red");
        const game = createGame([circle]);

        game.click(100, 100);
        game.update(3);

        const previousScore = game.score;

        game.update(1);

        expect(game.score).toBe(previousScore);
        expect(game.isGameOver).toBe(true);
    });

});
