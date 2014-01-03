/*
 * Common javascript code for all the English Idioms game layouts
 * author: eugene
 */
LEARZ_CONFIG = {
    clientId : "fbf4aRfDx88dnvIdwwavX3C5EVH06c"
};

idiomsGame = {
    serverSocket : null,
    onServerSocketConnect : function() {
        alert("Connected to server socket!");
    },
    onServerSocketMessage : function(msg) {
        alert(msg.toString());
    },
    onKeyDown : function(e) {
        if (e.keyCode == 37) { //left
           this.serverSocket.emit('left arrow key');
           return false;
        }
        if (e.keyCode == 38) { //up
           this.serverSocket.emit('up arrow key');
           return false;
        }
        if (e.keyCode == 39) { //right
           this.serverSocket.emit('right arrow key');
           return false;
        }
        if (e.keyCode == 40) { //down
           this.serverSocket.emit('down arrow key');
           return false;
        }
    }
};

$(function() {
    LEARZ.init(LEARZ_CONFIG);
    gameInit();

    $(document).keydown(function(e) { idiomsGame.onKeyDown(e); });
});

GAMES_SERVER_PROTOCOL = "http://"
GAMES_SERVER_HOST = "learzing.com"
GAME_SERVER_PORT = 8081;
function gameInit() {
    idiomsGame.serverSocket = io.connect(
        GAMES_SERVER_PROTOCOL + GAMES_SERVER_HOST + ":" + GAME_SERVER_PORT);

    idiomsGame.serverSocket.on('connect', function() {
        idiomsGame.onServerSocketConnect();
    });

    idiomsGame.serverSocket.on('message', function(msg) {
        idiomsGame.onServerSocketMessage(msg);
    });

    idiomsGame.serverSocket.on('up', function() {
        moveSquare(0, -10);
    });

    idiomsGame.serverSocket.on('down', function() {
        moveSquare(0, 10);
    });

    idiomsGame.serverSocket.on('left', function() {
        moveSquare(-10, 0);
    });

    idiomsGame.serverSocket.on('right', function() {
        moveSquare(10, 0);
    });
}

function moveSquare(x, y) {
    var square = $("#square");
    var offset = square.offset();
    offset.left += x;
    offset.top += y;
    square.offset(offset);
}