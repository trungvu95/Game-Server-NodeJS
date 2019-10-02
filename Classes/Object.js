const Vector2 = require('./Vector2');

module.exports = class Object {
    constructor(id, position, speed) {
        this.id = id;
        this.position = position;
        this.speed = speed;
    }

    update(dt) {
        this.position.x += dt * this.speed * Math.sin(this.position.rotation + Math.PI);
        this.position.y -= dt * this.speed * Math.cos(this.position.rotation + Math.PI);
    }

    distanceTo(object) {
        const dx = this.position.x - object.position.x;
        const dy = this.position.y - object.position.y;
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