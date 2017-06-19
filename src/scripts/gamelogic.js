var util = require("./util.js");

var GameLogic = function() {

	// HASHes are represented by their expected keys
	

	// (board[][], {x,y}) -> BOOL
	// checks if move is within board boundries
	var isInBounds = function(board, move) {
		return (move.x >= 0 &&
      move.x < board.length &&
      move.y >= 0 &&
      move.y < board.length);
	};


	var isHorseMoveApart = function(pos1, pos2) {
		return (Math.abs(pos1.x - pos2.x) === 1 && Math.abs(pos1.y - pos2.y) === 2) ||
			(Math.abs(pos1.x - pos2.x) === 2 && Math.abs(pos1.y - pos2.y) === 1); 
	}


	// (board[][], {1,2}, int, {x,y}) -> BOOL
	// checks is move is valid for player at current turn
	var isValidMove = function(board, players, currentTurn, move) {
		var currentPlayer = players[currentTurn].position, otherPlayer = players[util.otherTurn(currentTurn)].position;
		return (isInBounds(board, move) &&
		    ((Math.abs(currentPlayer.x - move.x) === 1 && Math.abs(currentPlayer.y - move.y) === 2) ||
		    (Math.abs(currentPlayer.x - move.x) === 2 && Math.abs(currentPlayer.y - move.y) === 1)) &&
		    (board[move.x][move.y] !== util.state.dead) &&
		    !(move.x === otherPlayer.x && move.y === otherPlayer.y));
	};

	
	// (position) -> [{x,y},...]
	// returns all possible horse moves
	var getHorseMoves = function(position) {
		return [
		  { x: position.x - 2, y: position.y - 1 },
		  { x: position.x - 2, y: position.y + 1 },
		  { x: position.x - 1, y: position.y - 2 },
		  { x: position.x - 1, y: position.y + 2 },
		  { x: position.x + 2, y: position.y - 1 },
		  { x: position.x + 2, y: position.y + 1 },
		  { x: position.x + 1, y: position.y - 2 },
		  { x: position.x + 1, y: position.y + 2 }
		];
	}

	// (board[][], {1,2}, int) -> [{x,y},...]
	// returns all possible valid moves on board
	var availableMoves = function(board, players, currentTurn) {
		// console.log(currentTurn);
		var currentPlayerPos = players[currentTurn].position, 
					otherPlayerPos = players[util.otherTurn(currentTurn)].position, 
					allMoves = [], 
					i;

		var horseMoves = getHorseMoves(currentPlayerPos);

		for (i = 0; i < horseMoves.length; i++) {
		  var move = horseMoves[i];
		  if(isInBounds(board,move)) {
		  	if (isValidMove(board,players,currentTurn,move)) {
		  	  allMoves.push(move);
		  	}
		  }
		  
		}
		return allMoves;
	};


	var movablePlayerInWay = function(board, players, currentTurn) {
		var otherPlayer = players[util.otherTurn(currentTurn)];
		return (board[otherPlayer.position.x][otherPlayer.position.y] !== util.state.dead &&
			availableMoves(board, players, util.otherTurn(currentTurn)).length !== 0 &&
			isHorseMoveApart(otherPlayer.position, players[currentTurn].position));
	}



	// (board[][], {1,2}, int) -> BOOL
	// checks is player matching turnId has no more moves
	var isTrapped = function(board, players, currentTurn, turnId) {
		if(currentTurn === turnId) {
			return availableMoves(board,players,turnId).length === 0;
		} else {
			return (availableMoves(board,players,turnId).length === 0) &&
							(!movablePlayerInWay(board, players, turnId))
		}
	}

	
	// (board[][]) -> BOOL
	// checks is available spaces are unreachable
	// NEEDS WORK - could be two or more connected spaces that are all unreachable
	var _boardInaccesible = function(board) {
		var inaccesible = false;
		for (x = 0; x < board.length; x++) {
		  for (y = 0; y < board.length; y++) {
		    if(board[x][y] === util.state.empty) {
		      var moves = getHorseMoves({x: x, y: y});
		      for(var m = 0; m<moves.length; m++) {
		      	if(isInBounds(board, moves[i]) && board[m.x][m.y] == util.state.empty) {
		      		inaccesible = true;
		      	}
		      }
		      break;
		    }
		  }
		}
		return inaccesible;
	}

	// (board[][]) -> BOOL
	// checks is board is full
	var _boardIsFull = function(board) {
		var full = true;
		for (x = 0; x < board.length; x++) {
		  for (y = 0; y < board.length; y++) {
		    if(board[x][y] === util.state.empty) {
		      full = false;
		      break;
		    }
		  }
		}
		return full;
	}

	var _getWinner = function(players) {
		var diff = players[1].score - players[2].score;
		if(diff === 0) {
			return 3;
		}
		if(diff < 0) {
			return 2;
		}
		if(diff > 0) {
			return 1;
		}
	}


	//  returns hash of reason and players or FALSE if game is not over 
	//  how well will this work for AI?
	var isOver = function(board, players, currentTurn) {
		var currentTrapped, otherTrapped, playersClone = _.cloneDeep(players);
		if(_boardIsFull(board)) {
			return { 
				reason: util.messages.gameover.full, 
				players: players,
				winner: util.messages.winner(_getWinner(players)) 
			};
		} else {
			currentTrapped = isTrapped(board, players, currentTurn, currentTurn);
			otherTrapped = isTrapped(board, players, currentTurn, util.otherTurn(currentTurn));
			if(currentTrapped && otherTrapped) {
				//playersClone[1].score -= 1;
				//playersClone[2].score -= 1;
				//alert(_getWinner(playersClone));
				return { 
					reason: util.messages.gameover.trapped(currentTurn+util.otherTurn(currentTurn)),
					players: playersClone,
					winner: util.messages.winner(_getWinner(playersClone))
				};
			} else {
				if(currentTrapped) {
					//playersClone[currentTurn].score -= 1;
					//alert(_getWinner(playersClone));
					return {
						reason: util.messages.gameover.trapped(currentTurn), 
						players: playersClone,
						winner: util.messages.winner(_getWinner(playersClone))
					}
				} 
				if(otherTrapped) {
					//playersClone[util.otherTurn(currentTurn)].score -= 1;
					//alert(_getWinner(playersClone));
					return {
						reason: util.messages.gameover.trapped(util.otherTurn(currentTurn)), 
						players: playersClone,
						winner: util.messages.winner(_getWinner(playersClone))
					}
				}
			}
			return false;
		}
	};

	//===============================
	//

	// (board[][], {1,2}, int, {x,y}) -> {newBoard, newPlayers}
	// returns new board and player states or FALSE if move is invalid
	var move = function(board, players, currentTurn, move) {
		var newBoard = _.cloneDeep(board),
			newPlayers = _.cloneDeep(players); 

		if(isValidMove(board, players, currentTurn, move)) {
			var spaceState = board[move.x][move.y];
			switch(spaceState) {
				case util.state.empty:
					newBoard[move.x][move.y] = util.state.owned(currentTurn);
					newPlayers[currentTurn].score = newPlayers[currentTurn].score + 1;
					break;
				case util.state.owned(util.otherTurn(currentTurn)):
					newBoard[move.x][move.y] = util.state.dead;
					newPlayers[util.otherTurn(currentTurn)].score -= 1;
					break;
				default:
					//State owned by player
			}
			newPlayers[currentTurn].position = {x: move.x, y: move.y};
			return { board: newBoard, players: newPlayers};
		} else {
			return false;
		}
	};



	return {
		isValidMove: isValidMove,
		availableMoves: availableMoves,
		isOver: isOver,
		move: move
	}

	
}(_);

module.exports = GameLogic;



	/*



	 ordering for checking game end should be
	 move
	 then check if either is trapped
	 -1 for being trapped 
	 and messaging... if -1 for trapped, then gameEnd needs to send updated players back 
	 handle messaging at gamestate? seems logical. 
	 
	
	// NEEDS WORK ===================
	// (board[][], {1,2}, int) -> BOOL
	// checks is player matching turnId is in a unescapable cycle
	
	var isInCycle = function(board, players, turnId) {
		var cycle = true, justVisited = [];
		// if player is standing on his own colour
		if(board[players[turnId].x][players[turnId].y] === util.state.owned(turnId)) {
			justVisited.push(players[turnId].position); //add move to justVisited

			var loop = function(board, players) {
				var avail = availableMoves(board, players, turnId);
				var unstepped = avail.filter(function(el){
					return board[el.x][el.y] !== util.state.owned(turnId);
				});
				var stepped = avail.filter(function(el){
					return board[el.x][el.y] === util.state.owned(turnId);
				});
				var otherPlayerInWay = allPossibleMoves(board, players[turnId])
					.filter(function(el){
						var other = players[otherTurn(turnId)];
						return other.x === el.x && 
							other.y === el.y &&
							board[other.x][other.y] === util.state.owned(otherTurn(turnId));
					})).length !== 0;

				// return false if player is trapped or has fresh moves to make or could wait for opponenet to move
				if(unstepped.length !== 0 || avail.length === 0 || otherPlayerInWay ) 
				{
					return false;
				} 
				else 
				{
					// consider all moves to squares players already owns
					owned.forEach(function(m){

						var newState = move(board, players, turnId, m);
						var newMoves = availableMoves(newState.board, newState.players, turnId).filter(function(el){
								var visited = false;
								justVisited.forEach(function (space) {
									if(space.x === el.x && space.y == el.y){
										visted = true;
										break;
									}
								});
								return !visited;
							});
							
						if(newMoves.length == 0) {
							return true;
						} else {
							if(justVisited.filter(function(el){ return el.x === m.x && el.y === m.y; }).length === 0){
								justVisited.push(m);
							}
							cycle = cycle && loop(newState.board, newState.players);
						}
					})
				}
			}
			return cycle;
		}
	};
	*/