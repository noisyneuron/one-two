var util = require("./util.js");
var game = require("./gamelogic.js");

var Bot = function () {
  var _config = {
    type: "minimax"
  };

  // Hash for referencing various states for board spaces
  var _state = {
    empty: "E",
    dead: "D",
    owned: function (player) {
      if (!(player === 1 || player === 2)) {
        throw String("State cannot be " + player + ".");
      }
      return String(player);
    }
  };

  var _getAvailableMoves = function (board, player, players) {
    // console.log(player);
    // console.log(players);
    // hardcoded computer to always be player 2 for now, change later
    var availableMoves = [], 
      currentPlayerPos = player === 1 ? players["1"].position : players["2"].position, 
        otherPlayerPos = player === 1 ? players["2"].position : players["1"].position, 
        i;

    var horseMoves = [
      { x: currentPlayerPos.x - 2, y: currentPlayerPos.y - 1 },
      { x: currentPlayerPos.x - 2, y: currentPlayerPos.y + 1 },
      { x: currentPlayerPos.x - 1, y: currentPlayerPos.y - 2 },
      { x: currentPlayerPos.x - 1, y: currentPlayerPos.y + 2 },
      { x: currentPlayerPos.x + 2, y: currentPlayerPos.y - 1 },
      { x: currentPlayerPos.x + 2, y: currentPlayerPos.y + 1 },
      { x: currentPlayerPos.x + 1, y: currentPlayerPos.y - 2 },
      { x: currentPlayerPos.x + 1, y: currentPlayerPos.y + 2 }
    ];

    for (i = 0; i < horseMoves.length; i++) {
      move = horseMoves[i];
      if ((move.x >= 0 && move.x < board.length && move.y >= 0 && move.y < board.length) &&
          ((Math.abs(currentPlayerPos.x - move.x) === 1 && Math.abs(currentPlayerPos.y - move.y) === 2) ||
          (Math.abs(currentPlayerPos.x - move.x) === 2 && Math.abs(currentPlayerPos.y - move.y) === 1)) &&
          (board[move.x][move.y] !== _state.dead) &&
          !(move.x === otherPlayerPos.x && move.y === otherPlayerPos.y)) {
        availableMoves.push(move);
      }
    }
    return availableMoves;
  };

  
  var _random = function (board, player, players) {
    var availableMoves = _getAvailableMoves(board, player, players);
    var random = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[random];
  };

  var _mostOpenPath = function (board, player, players) {
    var maxPossibilites = 0, bestIndex = 0, i, j;
    var availableMoves = _getAvailableMoves(board, player, players);
    var unVisited = availableMoves.filter(function(el, index){
      return board[availableMoves[index].x][availableMoves[index].y] !== _state.owned(2)
    });
    // console.log(unVisited);
    if(unVisited.length === 0) unVisited = availableMoves;
    

    for(i = 0; i < unVisited.length; i++) {
      var move = unVisited[i];
      var tempPlayers = function(){
        var hash = {};
        if(player === 1) {
          hash = {
            p1 : {
              position: {x: move.x, y: move.y},
              score: players.p1.score
            },
            p2: players.p2
          };
        } else {
          hash = {
            p1: players.p1,
            p2 : {
              position: {x: move.x, y: move.y},
              score: players.p2.score
            }
          };
        }
        return hash;
      }
      var temp = _getAvailableMoves(board, player, tempPlayers()); //filter out current move
      if(temp.length > maxPossibilites) {
        maxPossibilites = temp.length;
        bestIndex = i;
      }
    }
    // console.log("BOT: " + unVisited[bestIndex]);
    return unVisited[bestIndex];
  }


  var _evaluateMoveSimple = function(board, player, move) {
    var space = board[move.x][move.y], weight;
    if( (space === _state.empty) ||
        (space === _state.owned(1) && player === 2) ||
        (space === _state.owned(2) && player === 1) )
    {
      weight = 1;
    } else {
      weight = 0;
    }
    return weight;
  }

  // evaluate different from currentPlayer's perspective
  var _evaluateDifference = function(currentPlayer, players) {
    var otherPlayer = currentPlayer === 1 ? 2 : 1;
    return players[currentPlayer].score - players[otherPlayer].score;
  }

  // state is too distributed currently - players holding their own score instead of 
  // it being carried in main game state
  // need to have access to gamelogic here to make 'move'
  // move already coded to deep copy so safe to make hypothetical moves and get
  // board and players updates 
  var _minimax = function (board, currentPlayer, players, depth, isMax) { // need maximisingPlayer in params too 
    
    var moves = game.availableMoves(board, players, currentPlayer);

    if(depth === 0 || moves.length == 0) {
      return  {
        score: _evaluateDifference(currentPlayer, players),
        move: {}
      }
    }
    
    
    
    if(isMax) {
      var toReturn = {score: -9999, move: {}};
      for(var i=0; i<moves.length; i++) {
        var newstate = game.move(board, players, currentPlayer, moves[i]);
        // console.log(" NEW STATE ");
        // console.log(newstate);
        var evaled = _minimax(newstate.board, util.otherTurn(currentPlayer), newstate.players,  depth-1, false);
        if(evaled.score > toReturn.score) {
          toReturn.score = evaled.score;
          toReturn.move = moves[i];
        }        
      }
      return toReturn;
    } else {
      var toReturn = {score: 9999, move: {}};
      for(var i=0; i<moves.length; i++) {
        var newstate = game.move(board, players, currentPlayer, moves[i]);
        var evaled = _minimax(newstate.board, util.otherTurn(currentPlayer), newstate.players,  depth-1, true);
        if(evaled.score < toReturn.score) {
          toReturn.score = evaled.score;
          toReturn.move = moves[i];
        }        
      }
      return toReturn;
    }
  }


  var setType = function (type) {
    if (type !== "random" && type !== "mostOpenPath" ) {
      throw String("Bot cannot be of type: " + type);
    }
    _config.type = type;
    return false;
  };



  var getMove = function (board, player, players) {

    // BOT WILL NEED TO KNOW PLAYER POSITIONS AS WELL.. REFACTOR THIS SOMEHOW?
    var move;
    console.log(_config.type);
    switch (_config.type) {
    case "random" :
      move = _random(board, player, players);
      break;
    case "mostOpenPath" :
      move = _mostOpenPath(board, player, players);
      break;
    case "minimax" :
      var m = _minimax(board, 2, players, 6, true);
      // console.log(m.move);
      move = m.move;
      break;
    default:
      move = undefined;
    }
    return move;
  };

  return {
    setType: setType,
    getMove: getMove
  };

};

module.exports = Bot;



/*

move can give me +1, 0 or make opponent -1

or looking at the difference, either i get +1 or 0

then opponent either makes diff 0, ... or...




each move either brings increases or decreases the difference / lead
players want to maximise their lead

if i try +1 to my lead
and p2 tries +1 to his lead 
then lead is back at 0


so go down the tree and evaluate, adding my move-score, and subtracting other players move score


evaluate(move)
  if availableMovesFromHere = 0
    return 0
  else
    ..



getMoveScore(move) ->




 */






