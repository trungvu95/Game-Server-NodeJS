const Constants = require('../Parameter/Constants');
const Player = require('./Player');
const applyCollisions = require('./Collisions');

module.exports = class Game {
    constructor() {
        this.sockets = {};
        this.players = {};
        this.disconnect = [];
        this.destroyed = [];
        this.bullets = [];
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
        setInterval(this.update.bind(this), 1000 / 120);
    }

    addPlayer(socket, message) {
        if (!this.sockets[socket.id]) {
            this.sockets[socket.id] = socket;

            // const x = Constants.MAP_WIDTH;
            // const y = Constants.MAP_HEIGHT;

            this.players[socket.id] = new Player(socket.id, message.type);
            //console.log(`New Player [${socket.id}] Registered`)
        }
    }

    disconnectPlayer(socket) {
        this.disconnect.push(socket.id);
        this.removePlayer(socket);
    }

    removePlayer(socket) {
        delete this.sockets[socket.id];
        delete this.players[socket.id];
    }

    handleInput(socket, input) {
        if (this.players[socket.id]) {
            if (input.fire)
                this.players[socket.id].setFire(true);
            if (input.move && !this.players[socket.id].hasMoved())
                this.players[socket.id].setMove(true, input.move);
        }
    }

    removeBullet(dt) {
        const bulletsToRemove = [];
        this.bullets.forEach(bullet => {
            if (bullet.update(dt)) {
                bulletsToRemove.push(bullet);
                this.destroyed.push(bullet.id);
            }
        });
        this.bullets = this.bullets.filter(
            bullet => !bulletsToRemove.includes(bullet),
        );
    }

    spawnBullet(dt) {
        Object.keys(this.sockets).forEach(playerID => {
            const player = this.players[playerID];
            const newBullet = player.update(dt);
            if (newBullet) {
                this.bullets.push(newBullet);
            }
        })
    }

    collision() {
        const destroyedBullets = applyCollisions(
            Object.values(this.players),
            this.bullets,
        );
        destroyedBullets.forEach(b => {
            if (this.players[b.parentID]) {
                this.players[b.parentID].onDealtDamage();
            }
            this.destroyed.push(b.id);
        });
        this.bullets = this.bullets.filter(
            bullet => !destroyedBullets.includes(bullet),
        );
    }

    checkDeadPlayers() {
        Object.keys(this.sockets).forEach(playerID => {
            const socket = this.sockets[playerID];
            const player = this.players[playerID];
            if (player.hp <= 0) {
                socket.emit(Constants.MSG_TYPES.GAME_OVER)
                this.destroyed.unshift(socket.id);
                this.removePlayer(socket);
            }
        })
    }

    sendUpdates() {
        if (this.shouldSendUpdate) {
            Object.keys(this.sockets).forEach(playerID => {
                const socket = this.sockets[playerID];
                const player = this.players[playerID];
                socket.emit(
                    Constants.MSG_TYPES.GAME_UPDATE,
                    this.createUpdate(player),
                );
            });
            this.reInitRemoved();
            this.shouldSendUpdate = false;
        } else {
            this.shouldSendUpdate = true;
        }
    }

    reInitRemoved() {
        this.disconnect = [];
        this.destroyed = [];
    }

    createUpdate(player) {
        const nearbyPlayers = Object.values(this.players).filter(
            p => p !== player,
        );
        const nearbyBullets = this.bullets;
        if (this.destroyed.length > 0) console.log(this.destroyed);
        return {
            t: Date.now(),
            me: player.serializeForUpdate(),
            others: nearbyPlayers.map(p => p.serializeForUpdate()),
            bullets: nearbyBullets.map(b => b.serializeForUpdate()),
            destroyed: this.destroyed,
            disconnected: this.disconnect,
        };
    }

    update() {
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;

        this.removeBullet(dt);
        this.spawnBullet(dt);

        this.collision();
        this.checkDeadPlayers();

        this.sendUpdates();
    }

    getUserList() {
        var playerList = [];
        Object.keys(this.players).forEach(playerID => {
            playerList.push([playerID, this.players[playerID].type, this.players[playerID].hp]);
        })
        return playerList.length > 0 ? playerList : [['', '', '']];
    }

    getUser(playerID) {
        return this.players[playerID];
    }
}