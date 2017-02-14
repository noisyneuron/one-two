var Util = function() {

	var state = {
	  empty: "E",
	  dead: "D",
	  owned: function (player) {
	    if (!(player === 1 || player === 2)) {
	      throw String("State cannot be " + player + ".");
	    }
	    return String(player);
	  }
	};

	var messages = {
		newGame: "New game started. Player 1's turn.",
		invalidMove: function(turn) {
			return "Invalid move. Player " + turn + "'s turn.";
		},
		turn: function(turn) {
			return "Player " + turn + "'s turn.";
		},
		gameover: {
			full: "Game over. Board is full.",
			trapped: function(player){
				var msg = "";
				switch(player) {
					case 1:
						msg = "Game over. Player 1 is trapped.";
						break;
					case 2:
						msg = "Game over. Player 2 is trapped.";
						break;
					case 3:
						msg = "Game over. Both players are trapped.";
				};
				return msg;
			},
			cycle: function(player){
				var msg = "";
				switch(player) {
					case 1:
						msg = "Game over. Player 1 is trapped in a cycle.";
						break;
					case 2:
						msg = "Game over. Player 2 is trapped in a cycle.";
						break;
					case 3:
						msg = "Game over. Both players are trapped in cycles.";
				};
				return msg;
			}
		},
		winner: function(turn){
			if(turn == 1 || turn == 2) {
				return " Player " + turn + " wins."
			} 
			if(turn == 3) {
				return " Game ends in a draw."
			}
			return false;
		}
	}

	// gameover.trapped() and gameover.cycle() take parameter player's turnID 1 2 or 3 ,
	// where 3 means both players


	var otherTurn = function(turnId) {
		if(turnId !== 1 && turnId !== 2) {
			throw String("TurnID cannot be " + turnId + ".");
		} else {
			return turnId === 1 ? 2 : 1;
		}
	}

	return {
		state: state,
		otherTurn: otherTurn,
		messages: messages
	}


}();

module.exports = Util;