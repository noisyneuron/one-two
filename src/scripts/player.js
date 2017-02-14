var Player = function() {

	var position = {x: null, y: null},
				 score = 1,
					type = "",
				turnId = 0,
					 bot = null;


	var create = function(type, turnId, bot, xc, yc) {
		this.type = type;
		this.turnId = turnId;
		this.bot = bot;
		this.position = {x: xc, y: yc};
	}

	return {
		position: position,
		type: type,
		turnId: turnId,
		bot: bot,
		create: create,
		score: score
	}

};

module.exports = Player;