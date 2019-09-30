module.exports = class Vector2 {
    constructor(x = 0, y = 0, rotation = 0) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
    }

    distance(otherVector) {
        const dx = this.x - otherVector.x;
        const dy = this.x - otherVector.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}