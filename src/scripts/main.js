
var onetwo = require("./onetwo.js");
var bot = require("./bot.js");
var ui = require("./ui.js");



var game, p1IsHuman = true, p2IsHuman = true, bot1, bot2;




var computerPlay = function(player) {
	var botMove = player === 1 ? bot1.getMove(game, player, onetwo.getPlayers()) : bot2.getMove(game, player, onetwo.getPlayers());
	state = onetwo.move(botMove);
	players = onetwo.getPlayers();
	ui.updateBoard(state, players);
	ui.setMessage(onetwo.getMessage());
	if(onetwo.gameIsOver()) {
		ui.setMessage(onetwo.getMessage());
		ui.endGame();
	} else {
		setTimeout(function(){
			if(player === 1) {
				computerPlay(2);
			} else {
				computerPlay(1);
			}
		}, 500);
	}
}

var configureTurns = function() {

	if(p1IsHuman && p2IsHuman) {
		$(window).on("ui-move", function(e, data) {
			var state = onetwo.move(data);
			var players = onetwo.getPlayers();
			ui.updateBoard(state, players);
			ui.setMessage(onetwo.getMessage());
			if(onetwo.gameIsOver()) {
				ui.setMessage(onetwo.getMessage());
				ui.endGame();
			} 
		});
	}

	
	if(p1IsHuman && !p2IsHuman) {
		bot2 = bot(); 
		$(window).on("ui-move", function(e, data) {
			var state = onetwo.move(data);
			var players = onetwo.getPlayers();
			ui.updateBoard(state, players);
			ui.setMessage(onetwo.getMessage());
			if(onetwo.gameIsOver()) {
				ui.setMessage(onetwo.getMessage());
				ui.endGame();
			} else {
				var botMove = bot2.getMove(game, 2, onetwo.getPlayers());
				setTimeout(function(){
					state = onetwo.move(botMove);
					players = onetwo.getPlayers();
					ui.updateBoard(state, players);
					ui.setMessage(onetwo.getMessage());
					if(onetwo.gameIsOver()) {
						ui.setMessage(onetwo.getMessage());
						ui.endGame();
					}
				}, 200);
			}
		});
	}

	if(!p1IsHuman && p2IsHuman) {
		bot1 = bot();
		var botMove = bot1.getMove(game, 1, onetwo.getPlayers());
		state = onetwo.move(botMove);
		players = onetwo.getPlayers();
		ui.updateBoard(state, players);
		ui.setMessage(onetwo.getMessage());

		$(window).on("ui-move", function(e, data) {
			var state = onetwo.move(data);
			var players = onetwo.getPlayers();
			ui.updateBoard(state, players);
			ui.setMessage(onetwo.getMessage());
			if(onetwo.gameIsOver()) {
				ui.setMessage(onetwo.getMessage());
				ui.endGame();
			} else {
				var botMove = bot1.getMove(game, 1, onetwo.getPlayers());
				setTimeout(function(){
					state = onetwo.move(botMove);
					players = onetwo.getPlayers();
					ui.updateBoard(state, players);
					ui.setMessage(onetwo.getMessage());
					if(onetwo.gameIsOver()) {
						ui.setMessage(onetwo.getMessage());
						ui.endGame();
					}
				}, 200);
			}
		});
	}

	if(!p1IsHuman && !p2IsHuman) {
		bot1 = bot(); bot2 = bot();
		computerPlay();
	}
}

$(window).on("ui-start-game", function(e, data) {
	$(window).off('ui-move');
	game = onetwo.newGame({boardSize: data.boardSize, deadSpaces: data.deadSpaces});
	p1IsHuman = data.p1 === "human";
	p2IsHuman = data.p2 === "human";
	ui.initialiseBoard(game);
	ui.setMessage(onetwo.getMessage());
	configureTurns();
});


// GAME END SHOULD BE CHECKED AT begining of turn
// need some way to end game when both players stuck in loop
// and figure out trapped boolean when other player is in way
// 
// so at beginning check if i am blocked 
// 
// NEXT :
// fix gameIsOver timing
// and figure out deadlock situation -- for bot and for gameEnd
// 
// deadlock - keep log/track of game
// 
// 
// 




