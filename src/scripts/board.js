var util = require("./util.js");
var Board = function() {

	var is = util.state;

	var boards = {
		'8x8_1' : [
			[is.owned(1), is.empty, is.empty, is.empty, is.empty, is.empty, is.empty, is.dead], 
			[is.dead, is.dead, is.dead, is.dead, is.dead, is.dead, is.dead, is.dead], 
			[is.empty, is.empty, is.empty, is.empty, is.empty, is.empty, is.empty, is.empty], 
			[is.empty, is.empty, is.empty, is.empty, is.empty, is.empty, is.empty, is.dead], 
			[is.dead, is.empty, is.empty, is.empty, is.empty, is.empty, is.empty, is.empty], 
			[is.empty, is.empty, is.empty, is.empty, is.empty, is.empty, is.empty, is.empty], 
			[is.dead, is.dead, is.dead, is.dead, is.dead, is.dead, is.dead, is.dead], 
			[is.dead, is.empty, is.empty, is.empty, is.empty, is.empty, is.empty, is.owned(2)]		
		],
		'8x8_2' : [
			[is.owned(1), is.dead, is.empty, is.empty, is.dead, is.empty, is.empty, is.dead], 
			[is.dead, is.empty, is.dead, is.empty, is.empty, is.dead, is.dead, is.empty], 
			[is.dead, is.empty, is.dead, is.empty, is.empty, is.empty, is.empty, is.dead], 
			[is.empty, is.dead, is.dead, is.empty, is.empty, is.empty, is.empty, is.dead], 
			[is.dead, is.empty, is.empty, is.empty, is.empty, is.dead, is.dead, is.empty], 
			[is.dead, is.empty, is.empty, is.empty, is.empty, is.dead, is.empty, is.dead], 
			[is.empty, is.dead, is.dead, is.empty, is.empty, is.dead, is.empty, is.dead], 
			[is.dead, is.empty, is.empty, is.dead, is.empty, is.empty, is.dead, is.owned(2)]		
		],
		'8x8_3' : [
			[is.owned(1), is.empty, is.dead, is.empty, is.empty, is.dead, is.dead, is.empty], 
			[is.dead, is.empty, is.empty, is.empty, is.dead, is.empty, is.empty, is.dead], 
			[is.empty, is.empty, is.empty, is.empty, is.dead, is.empty, is.empty, is.empty], 
			[is.empty, is.empty, is.empty, is.empty, is.empty, is.empty, is.dead, is.empty], 
			[is.empty, is.dead, is.empty, is.empty, is.empty, is.empty, is.empty, is.empty], 
			[is.empty, is.empty, is.empty, is.dead, is.empty, is.empty, is.empty, is.empty], 
			[is.dead, is.empty, is.empty, is.dead, is.empty, is.empty, is.empty, is.dead], 
			[is.empty, is.dead, is.dead, is.empty, is.empty, is.dead, is.empty, is.owned(2)]		
		]
	}

	var players = {
		'8x8_1' : {
			1: {x: 0, y: 0},
			2: {x: 7, y: 7}
		},
		'8x8_2' : {
			1: {x: 0, y: 0},
			2: {x: 7, y: 7}
		},
		'8x8_3' : {
			1: {x: 0, y: 0},
			2: {x: 7, y: 7}
		}
	}

	var getBoard = function(name) {
		return {board: boards[name], players: players[name]};
	};

	getRandomBoard = function(size, dead) {
		var 	b = [],
			p1pos = {x : 0, y : 0},
			p2pos = {x : size - 1, y : size - 1},
					i = 0;

		for (x = 0; x < size; x++) {
      b.push([]);
      for (y = 0; y < size; y++) {
        b[x][y] = is.empty;
      }
    }

    b[p1pos.x][p1pos.y] = is.owned(1);
    b[p2pos.x][p2pos.y] = is.owned(2);

    while (i < dead) {
      x = Math.floor(Math.random() * size);
      y = Math.floor(Math.random() * size);
      if (!(x === p1pos.x && y === p1pos.y) &&
          !(x === p2pos.x && y === p2pos.y) &&
          !(x === p1pos.x + 2 && y === p1pos.y + 1) &&
          !(x === p1pos.x + 1 && y === p1pos.y + 2) &&
          !(x === p2pos.x - 2 && y === p2pos.y - 1) &&
          !(x === p2pos.x - 1 && y === p2pos.y - 2) &&
          !(b[x][y] === is.dead)
          ) {
        b[x][y] = is.dead;
        i += 1;
      }
    }

    return {board: b, players : {1: p1pos, 2:p2pos}};
	}

	return {
		getBoard: getBoard,
		getRandomBoard: getRandomBoard
	}
}();

module.exports = Board;