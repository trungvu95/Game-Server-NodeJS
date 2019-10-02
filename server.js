const io = require('socket.io')(process.env.PORT || 5000);
const Constants = require('./Parameter/Constants');
const Game = require('./Classes/Game');
const Room = require('./Classes/Room');
const Chat = require('./Classes/Chat');

const Table = require('cli-table3');
const colors = require('colors');

const game = new Game();
const chat = new Chat();

var connectionCount = 0;

function handleChat(message) {
    chat.handleChat(this, message);
}

function joinGame(message) {
    game.addPlayer(this, message);
}

function handleInput(input) {
    game.handleInput(this, input);
}

function onDisconnect() {
    connectionCount--;
    game.disconnectPlayer(this);
}

io.on('connection', function (socket) {
    //console.log(("New Player Connected!"));
    connectionCount++;

    socket.on(Constants.MSG_TYPES.CHAT, handleChat);

    socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
    socket.on(Constants.MSG_TYPES.INPUT, handleInput);
    socket.on('disconnect', onDisconnect);
});

setInterval(function () {
    console.clear();
    console.log("Started listening on port 5000\n");
    console.log(`Current connections: ${connectionCount}\n`)
    console.log('Player List!');
    var userListTable = new Table({
        head: ['ID', 'Type', 'HP'],
        colWidths: [60, 30, 30],
        chars: {
            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
            , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
            , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
            , 'right': '║', 'right-mid': '╢', 'middle': '│'
        },
        style: {
            head: ['cyan'],
            border: []
        }

    });
    userListTable.push(...game.getUserList());
    console.log(userListTable.toString());
}, 1000)