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
        return this.position.distanceTo(object.position);
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