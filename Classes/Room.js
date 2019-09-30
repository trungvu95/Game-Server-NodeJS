var shortID = require('shortid');

module.exports = class Room {
    constructor() {
        this.name = '';
        this.id = shortID.generate();
    }
}