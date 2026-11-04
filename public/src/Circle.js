export class Circle {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;

        this.xDirection = Math.random() < 0.5 ? -1 : 1;
        this.yDirection = Math.random() < 0.5 ? -1 : 1;

        this.colour = colour;

        this.radius = 12;
        this.targetRadius = 12;
        this.radiusToAdd = 50;
        this.growthSpeed = 20;

        this.moveSpeed = 1;

        this.hasBeenClicked = false;
        this.isExploding = false;
        this.isDestroyed = false;

        this.explosionTimer = 0;
        this.explosionDuration = 3;
    }

    update(deltaTime, canvasWidth, canvasHeight) {
        if (this.isExploding) {
            this.explosionTimer += deltaTime;

            if (this.explosionTimer >= this.explosionDuration) {
                this.isDestroyed = true;
                return true;
            }
        }

        if (!this.isExploding) {
            this.x += this.xDirection * this.moveSpeed;
            this.y += this.yDirection * this.moveSpeed;
        }

        // Horizontal boundaries
        if (this.x + this.radius >= canvasWidth) {
            this.x = canvasWidth - this.radius;
            this.xDirection = -1;
        } else if (this.x - this.radius <= 0) {
            this.x = this.radius;
            this.xDirection = 1;
        }

        // Vertical boundaries
        if (this.y + this.radius >= canvasHeight) {
            this.y = canvasHeight - this.radius;
            this.yDirection = -1;
        } else if (this.y - this.radius <= 0) {
            this.y = this.radius;
            this.yDirection = 1;
        }

        // Grow circle
        if (this.radius < this.targetRadius) {
            this.radius += this.growthSpeed * deltaTime;

            if (this.radius > this.targetRadius) {
                this.radius = this.targetRadius;
            }
        }

        return false;
    }

    isOverlappingWith(otherCircle) {
        const dx = this.x - otherCircle.x;
        const dy = this.y - otherCircle.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < this.radius + otherCircle.radius;
    }

    isClicked(mousePosX, mousePosY) {
        const dx = mousePosX - this.x;
        const dy = mousePosY - this.y;

        return Math.sqrt(dx * dx + dy * dy) <= this.radius;
    }

    explode() {
        if (this.isExploding) return false;

        this.hasBeenClicked = true;
        this.moveSpeed = 0;

        this.targetRadius += this.radiusToAdd;
        this.isExploding = true;
        this.explosionTimer = 0;

        return true;
    }
}