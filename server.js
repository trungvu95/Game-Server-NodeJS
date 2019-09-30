const io = require('socket.io')(process.env.PORT || 5000);
const Constants = require('./Parameter/Constants');
const Vector2 = require('./Classes/Vector2');
const Player = require('./Classes/Player');
const Bullet = require('./Classes/Bullet');
const Game = require('./Classes/Game');
const Room = require('./Classes/Room');
const players = [];
const sockets = [];
const rooms = [];

console.log("Started listening on port 5000");

var game = new Game();

function joinGame(message) {
    game.addPlayer(this, message);
}

function handleInput(input) {
    game.handleInput(this, input);
}

function onDisconnect() {
    game.removePlayer(this);
}
io.on('connection', function (socket) {
    console.log(("New Player Connected!"));

    socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
    socket.on(Constants.MSG_TYPES.INPUT, handleInput);
    socket.on('disconnect', onDisconnect);
});