const shortid = require('shortid');
const Vector2 = require('./Vector2');
const Object = require('./Object');
const Constants = require('../Parameter/Constants');

module.exports = class Bullet extends Object {
    constructor(parentID, position) {
        super(shortid(), position, Constants.BULLET_SPEED);
        this.parentID = parentID;
    }

    update(dt) {
        super.update(dt);
        return this.position.x < -Constants.MAP_WIDTH / 2 || this.position.x > Constants.MAP_WIDTH / 2
            || this.position.y < -Constants.MAP_HEIGHT / 2 || this.position.y > Constants.MAP_HEIGHT / 2;
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            parentID: this.parentID,
        }
    }
}