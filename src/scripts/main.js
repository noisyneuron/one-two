

var util = require("./util.js");
var boardGenerator = require("./board.js");
var game = require("./gamelogic.js");
var Player = require("./player.js");
var Bot = require("./bot.js");
var ui = require("./ui.js");

var players = {1: null, 2: null}, board, currentTurn;


var fsm = StateMachine.create({
  initial: 'form',
  events: [
    { name: 'startGame',  from: 'form',  to: 'p1Turn' },
    { name: 'invalidMove', from: 'p1Turn', to: 'p1Turn'},
    { name: 'invalidMove', from: 'p2Turn', to: 'p2Turn'},
    { name: 'validMove',  from: 'p1Turn', to: 'p2Turn'},
    { name: 'validMove',  from: 'p2Turn', to: 'p1Turn'},
    { name: 'gameOver',  from: ['p1Turn', 'p2Turn'], to: 'gameEnded'},
    { name: 'configForm', from: ['p1Turn', 'p2Turn', 'gameEnded'], to: 'form'}
]});



$(window).on("ui-start-game", function(e, data) {
	fsm.startGame(data);
});

$(window).on("ui-restart-game", function(e, data) {
	fsm.configForm();
});

$(window).on('ui-move', function(e, move) {
	if(fsm.is('p1Turn') || fsm.is('p2Turn')) {
		if(game.isValidMove(board, players, currentTurn, move)) {
			fsm.validMove(move);
		} else {
			fsm.invalidMove();
		}
	}
})

var enteringTurn = function() {
	var ended = game.isOver(board, players, currentTurn);
	if(ended) { 
		fsm.gameOver(ended); 
	} else {
		ui.setMessage(util.messages.turn(currentTurn));
		if(players[currentTurn].type === "human") {
			ui.bindBoard(); //add click event listener
		} else { //p1 is computer
			fsm.validMove(players[currentTurn].bot.getMove(board, players, currentTurn));
		}
	}
};

fsm.onleaveform = function(event, from, to, data) {
	var boardData;

	// BOARD SHOULD RECEIVE PLAYER INITIAL POSITION or be returning it.. 
	if(data.boardType === "random") {
		boardData = boardGenerator.getRandomBoard(data.boardSize, data.deadSpaces);
	} else {
		boardData = boardGenerator.getBoard(data.boardType);
	}

	board = boardData.board;

	console.log('onleaveform');
	if(data.p1 === "human") {
		players[1] = new Player();
		players[1].create("human", 1, null, boardData.players[1].x, boardData.players[1].y);
	} else {
		players[1] = new Player();
		players[1].create("computer", 1, new Bot(), boardData.players[1].x, boardData.players[1].y);
	}
	
	if(data.p2 === "human") {
		players[2] = new Player();
		players[2].create("human", 2, null, boardData.players[2].x, boardData.players[2].y);
	} else {
		players[2] = new Player();
		players[2].create("computer", 2, new Bot(), boardData.players[2].x, boardData.players[2].y);
	}

	ui.initialiseBoard(board);
}

fsm.onp1Turn = function(event, from, to, data) {
	console.log('onp1Turn');
	currentTurn = 1;
	enteringTurn();
}

fsm.onp2Turn = function(event, from, to, data) {
	console.log('onp2turn');
	currentTurn = 2;
	enteringTurn();
}

fsm.oninvalidMove = function(event, from, to, data) {
	console.log('oninvalidmove');
	ui.setMessage(util.messages.invalidMove(currentTurn));
}

fsm.onbeforevalidMove = function(event, from, to, data){
	console.log('onbeforevalidmove');
	ui.unbindBoard();
	var newGameState = game.move(board, players, currentTurn, data);
	board = newGameState.board;
	players = newGameState.players;
}

fsm.onleavep1Turn = function() {
	console.log('onleavep1turn');
	//check game over at start of turn - modify gamelogic
	ui.updateBoard(board, players, function(){
		fsm.transition();
	});
	return StateMachine.ASYNC;
}

fsm.onleavep2Turn = function() {
	console.log('onleavep2turn');
	//check game over at start of turn - modify gamelogic
	ui.updateBoard(board, players, function(){
		fsm.transition();
	});
	return StateMachine.ASYNC;
}

fsm.ongameOver = function(event, from, to, data) {
	console.log('ongameover');
	players = data.players;
	ui.updateBoard(board, players, function(){});
	ui.setMessage(String(data.reason + data.winner));
}

fsm.onconfigForm = function(event, from, to, data) {
	console.log('onconfigform');
	ui.toggleForm();
}
