const Vector2 = require('./Vector2');
const Object = require('./Object');
const Bullet = require('./Bullet');
const Constants = require('../Parameter/Constants');

module.exports = class Player extends Object {
    constructor(id, type, position = new Vector2()) {
        super(id, position, Constants.PLAYER_SPEED);
        this.type = type;
        this.hp = Constants.PLAYER_MAP_HP;
        this.fireCoolDown = 0;
        this.isFiring = false;
        this.isMoving = false;
        this.lastPosition = new Vector2();
    }

    update(dt) {
        if (this.isMoving) {
            this.setMove(false);
            this.move();
        }

        this.position.x = Math.max(-Constants.MAP_WIDTH / 2, Math.min(Constants.MAP_WIDTH / 2, this.position.x));
        this.position.y = Math.max(-Constants.MAP_HEIGHT / 2, Math.min(Constants.MAP_HEIGHT / 2, this.position.y));

        if (this.isFiring) {
            console.log('FIRE');
            this.setFire(false);
            return this.fire();
        }

        return null;
    }

    setFire(fire) {
        this.isFiring = fire;
    }

    fire() {
        return new Bullet(this.id, this.position);
    }

    setMove(move, input) {
        if (move) {
            this.lastPosition = new Vector2(input.x, input.y, input.rotation);
        }
        this.isMoving = move;
    }

    move() {
        this.position = this.lastPosition;
    }

    hasMoved() {
        return this.isMoving;
    }

    takeBulletDamage() {
        this.hp -= Constants.BULLET_DAMAGE;
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            type: this.type,
            hp: this.hp,
        }
    }
}