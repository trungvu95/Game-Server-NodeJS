module.exports = class Vector2 {
    constructor(x = 0, y = 0, rotation = 0) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
    }

    Magnitude() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    Normalized() {
        var mag = this.Magnitude();
        return new Vector2(this.x / mag, this.y / nag);
    }

    Distance(OtherVect = Vector2) {
        var direction = new Vector2();
        direction.x = OtherVect.x - this.x;
        direction.y = OtherVect.y - this.y;
        return direction.Magnitude();
    }
}