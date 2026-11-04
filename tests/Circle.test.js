import { describe, it, expect } from "vitest";
import { Circle } from "../src/Circle.js";

describe("Circle", () => {

    it("should initialise with the correct properties", () => {
        const circle = new Circle(100, 100, "red");

        expect(circle.x).toBe(100);
        expect(circle.y).toBe(100);
        expect(circle.radius).toBe(12);
        expect(circle.colour).toBe("red");
        expect(circle.isExploding).toBe(false);
    });

    it("should detect overlapping circles", () => {
        const circle1 = new Circle(100, 100, "red");
        const circle2 = new Circle(110, 100, "blue");

        expect(circle1.isOverlappingWith(circle2)).toBe(true);
    });

    it("should detect when a circle is clicked", () => {
        const circle = new Circle(100, 100, "red");

        expect(circle.isClicked(100, 100)).toBe(true);
        expect(circle.isClicked(200, 200)).toBe(false);
    });

    it("should explode when explode is called", () => {
        const circle = new Circle(100, 100, "red");

        circle.explode();

        expect(circle.isExploding).toBe(true);
        expect(circle.hasBeenClicked).toBe(true);
        expect(circle.moveSpeed).toBe(0);
        expect(circle.targetRadius).toBe(62);
    });

    it("should not explode twice", () => {
        const circle = new Circle(100, 100, "red");

        circle.explode();
        const result = circle.explode();

        expect(result).toBe(false);
    });

});