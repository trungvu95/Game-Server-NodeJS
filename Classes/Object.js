const Vector2 = require('./Vector2');

module.exports = class Object {
    constructor(id, position, speed) {
        this.id = id;
        this.position = position;
        this.speed = speed;
    }

    update(dt) {
        this.x += dt * this.speed * Math.sin(this.position.rotation);
        this.y -= dt * this.speed * Math.cos(this.position.rotation);
    }

    distanceTo(object) {
        const dx = this.position.x - object.position.x;
        const dy = this.position.x - object.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    setRotation(rot) {
        this.position.rotation = rot;
    }

    serializeForUpdate() {
        return {
            id: this.id,
            position: this.position,
        }
    }
}