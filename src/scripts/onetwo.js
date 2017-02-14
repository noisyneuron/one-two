


// emits events:
// ot-message
// ot-move
// ot-gameEnd
// ot-newGame
// ot-turntoggled

var OneTwo = function () {
  var _gameState = [], _currentTurn, _message;
  var _p1 = {
    position: { x: null, y: null},
    score: 0
  };
  var _p2 = {
    position: { x: null, y: null},
    score: 0
  };

  // Game options
  var _config = {
    boardSize: 6,
    deadSpaces: 6
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
  // Utility function for returing pointer to appropriate player based on integer number
  var _player = function (number) {
    var player;
    if (!(number === 1 || number === 2)) {
      throw String("Player cannot be " + number + ".");
    }
    if (number === 1) {
      player = _p1;
    } else {
      player = _p2;
    }
    return player;
  };

  var _otherPlayer = function (number) {
    var player;
    if (!(number === 1 || number === 2)) {
      throw String("Player cannot be " + number + ".");
    }
    if (number === 1) {
      player = _p2;
    } else {
      player = _p1;
    }
    return player;
  };

  var _isInBounds = function (position) {
    return (position.x >= 0 &&
      position.x < _config.boardSize &&
      position.y >= 0 &&
      position.y < _config.boardSize);
  };

  var _isValidMove = function (player, position) {
    var currentPlayer = _player(player), otherPlayer = _otherPlayer(player);
    return (_isInBounds(position) &&
        ((Math.abs(currentPlayer.position.x - position.x) === 1 && Math.abs(currentPlayer.position.y - position.y) === 2) ||
        (Math.abs(currentPlayer.position.x - position.x) === 2 && Math.abs(currentPlayer.position.y - position.y) === 1)) &&
        (_gameState[position.x][position.y] !== _state.dead) &&
        !(position.x === otherPlayer.position.x && position.y === otherPlayer.position.y));
  };

  var _toggleTurn = function () {
    _currentTurn = _currentTurn === 1 ? 2 : 1;
    return false;
  };

  var _availableMoves = function (player) {
    var availableMoves = [], currentPlayerPos = _player(player).position, otherPlayerPos, i;
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
    otherPlayerPos = _otherPlayer(player).position;

    for (i = 0; i < horseMoves.length; i++) {
      var move = horseMoves[i];
      if ((move.x >= 0 && move.x < _gameState.length && move.y >= 0 && move.y < _gameState.length) &&
          ((Math.abs(currentPlayerPos.x - move.x) === 1 && Math.abs(currentPlayerPos.y - move.y) === 2) ||
          (Math.abs(currentPlayerPos.x - move.x) === 2 && Math.abs(currentPlayerPos.y - move.y) === 1)) &&
          (_gameState[move.x][move.y] !== _state.dead)) {
        availableMoves.push(move);
      }
    }
    return availableMoves;
  }

  var _checkCycle = function(player) {
    var isCycle = true, justVisited = [];
    if(_gameState[_player(player).position.x][_player(player).position.y] === _state.owned(player)) {
      
    }
  }

  var newGame = function (options) {
    var i = 0, prop, x, y;
    // Overwrite options if they exist
    for (prop in options) {
      if (options.hasOwnProperty(prop)) {
        _config[prop] = options[prop];
      }
    }
    // Initialize empty board, clear old one if there
    _gameState = [];
    for (x = 0; x < _config.boardSize; x++) {
      _gameState.push([]);
      for (y = 0; y < _config.boardSize; y++) {
        _gameState[x][y] = _state.empty;
      }
    }

    // Set starting player positions and score
    _p1 = { position: {x: 0, y: 0 }, score: 1 };
    _p2 = { position: {x: _config.boardSize - 1, y: _config.boardSize - 1 }, score: 1};

    _gameState[_p1.position.x][_p1.position.y] = _state.owned(1);
    _gameState[_p2.position.x][_p2.position.y] = _state.owned(2);

    // Create dead spaces on board
    while (i < _config.deadSpaces) {
      x = Math.floor(Math.random() * _config.boardSize);
      y = Math.floor(Math.random() * _config.boardSize);
      if (!(x === _p1.position.x && y === _p1.position.y) &&
          !(x === _p2.position.x && y === _p2.position.y) &&
          !(x === _p1.position.x + 2 && y === _p1.position.y + 1) &&
          !(x === _p1.position.x + 1 && y === _p1.position.y + 2) &&
          !(x === _p2.position.x - 2 && y === _p2.position.y - 1) &&
          !(x === _p2.position.x - 1 && y === _p2.position.y - 2) &&
          !(_gameState[x][y] === _state.dead)
          ) {
        _gameState[x][y] = _state.dead;
        i += 1;
      }
    }
    // Set current turn
    _currentTurn = 1;
    _message = "New game started. Player 1's turn."
    return _gameState.slice(0); //clone
  };

  var move = function (position) {
    var boardSpace;

    if (_isValidMove(_currentTurn, position)) {
      boardSpace = _gameState[position.x][position.y];
      switch (boardSpace) {
      case _state.empty:
        _gameState[position.x][position.y] = _state.owned(_currentTurn);
        _player(_currentTurn).score += 1
        break;
      case _state.owned(_currentTurn):
        break;
      default: //state owned by other player
        _gameState[position.x][position.y] = _state.dead;
        _otherPlayer(_currentTurn).score -= 1
      }
      _player(_currentTurn).position.x = parseInt(position.x);
      _player(_currentTurn).position.y = parseInt(position.y);
      _toggleTurn();
      _message = "Player " + _currentTurn + "'s turn.";
    } else {
      _message = "Invalid move. Player " + _currentTurn + "'s turn.";
    }
    return _gameState;
  };

  var getPlayers = function () {
    return { p1: _p1, p2: _p2 };
  };

  var getMessage = function() {
    return _message;
  }

  var gameIsOver = function() {
    var full = true, p1_trapped = false, p2_trapped = false, over = false;
    for (x = 0; x < _config.boardSize; x++) {
      for (y = 0; y < _config.boardSize; y++) {
        if(_gameState[x][y] === _state.empty) {
          full = false;
          break;
        }
      }
    }

    p1_trapped = _availableMoves(1).length === 0;
    p2_trapped = _availableMoves(2).length === 0;
    
    if(p1_trapped) {
      _message = "Game over. Player 1 is trapped. ";  
    }
    if(p2_trapped) {
      _message = "Game over. Player 2 is trapped. ";  
    }
    if(full) {
      _message = "Game over. Board is full. ";  
    }

    over = p1_trapped || p2_trapped || full;

    if(over) {
      if(_p1.score > _p2.score) _message += "Player 1 wins.";
      if(_p2.score > _p1.score) _message += "Player 2 wins.";
      if(_p1.score === _p2.score) _message += "Game ends in a draw.";
    }

    return over;

  }

  return {
    newGame : newGame,
    move: move,
    getPlayers: getPlayers,
    getMessage: getMessage,
    gameIsOver: gameIsOver
  };

}();

module.exports = OneTwo;
