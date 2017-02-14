var UI = function () {



  var _selectors = {
    dom_boardHolder: "#board-holder",
    dom_board: "#board",
    dom_message: "#message",
    dom_space: ".space",
    dom_config: "#config",
    dom_game: "#game",
    dom_newGame: "#new-game",
    dom_startGame: "#start-game",
    dom_players: ".player",
    dom_p1score: ".score.p1 p",
    dom_p2score: ".score.p2 p",
    dom_formBoard: "select#boardType",
    dom_randomBoard: ".field.toggleable"
  };

  var _setBoardSize = function (gridLength) {
    var boardHolder = $(_selectors.dom_boardHolder),
      board = $(_selectors.dom_board),
      holder_width = parseInt(boardHolder.css("width")),
      holder_height = parseInt(boardHolder.css("height")),
      board_size;
    if (holder_height <= holder_width) {
      board_size = Math.floor(holder_height / gridLength) * gridLength;
      board.css({"margin-left" : String(((holder_width - board_size) / 2) + "px"), "margin-top" : "0"});
    } else {
      board_size = Math.floor(holder_width / gridLength) * gridLength;
      board.css({"margin-top" : String(((holder_height - board_size) / 2) + "px"), "margin-left" : "0"});
    }
    board.css({"height" : String(board_size + "px"), "width" : String(board_size + "px")});
    return;
  };


  var initialiseBoard = function (gameState) {
    toggleForm();
    var board = $(_selectors.dom_board),
      size = gameState.length,
      x,
      y,
      space;


    for (y = 0; y < size; y++) {
      for (x = 0; x < size; x++) {
        space = gameState[x][y];
        if (space === "E") {
          board.append("<div class='space empty' data-x='" + x + "' data-y='" + y + "'></div>");
        }
        if (space === "D") {
          board.append("<div class='space dead' data-x='" + x + "' data-y='" + y + "'></div>");
        }
        if (space === "1" || space === "2") {
          board.append("<div class='space owned-" + space + "' data-x='" + x + "' data-y='" + y + "'><div class='player' id='p" + space + "'></div></div>");
        }
      }
    }

    _setBoardSize(size);
    $(_selectors.dom_space).css({"height" : String((100 / size) + "%"), "width" : String((100 / size) + "%")});


    $(_selectors.dom_newGame).on("click", function() {
      var sure = confirm("Are you sure you want to start a new game?");
      if(sure) {
        $(window).trigger('ui-restart-game');
      }
    });

  };

  var updateBoard = function (gameState, players, cb) {

    for (x = 0; x < gameState.length; x++) {
      for (y = 0; y < gameState.length; y++) {
        var space = gameState[x][y];
        var spaceEl = $('.space[data-x="' + x + '"][data-y="' + y + '"]');
        if (space === "E") {
          // don't do anything, space can't change to empty ever
        }
        if (space === "D") {
          spaceEl.removeClass('owned-1').removeClass('owned-2').removeClass('empty').addClass('dead');
        }
        if (space === "1") { // || space === "2") {
          spaceEl.removeClass('empty').removeClass('dead').removeClass('owned-2').addClass('owned-1');
        }
        if (space === "2") { // || space === "2") {
          spaceEl.removeClass('empty').removeClass('dead').removeClass('owned-1').addClass('owned-2');
        }
      }
    }

    $(_selectors.dom_players).remove();
    $('.space[data-x="' + players[1].position.x + '"][data-y="' + players[1].position.y + '"]').append("<div class='player' id='p1'></div>");
    $('.space[data-x="' + players[2].position.x + '"][data-y="' + players[2].position.y + '"]').append("<div class='player' id='p2'></div>");

    $(_selectors.dom_p1score).text(players[1].score);
    $(_selectors.dom_p2score).text(players[2].score);
    cb();
  };



  var setMessage = function(msg) {
    var m = msg.replace(/Player 1/g, "Blue").replace(/Player 2/g, "Yellow");
    if(m.indexOf("Game over") !== -1) {
      alert(m);
    }
    $(_selectors.dom_message).text(m);
  }


  var _handleMove = function(e) {
    var coords = {
      x: parseInt($(this).attr('data-x')),
      y: parseInt($(this).attr('data-y'))
    };
    $(window).trigger("ui-move", [coords]);
  }

  var bindBoard = function() {
    $(_selectors.dom_space).on("click", _handleMove);
  }

   var unbindBoard = function() {
    $(_selectors.dom_space).off("click");
  }


  var _handleForm = function(e) {
    var form = $(this).parents("form");
    var settings = {
      boardType: form.find("#boardType").val(),
      boardSize: parseInt(form.find("#size").val()),
      deadSpaces: parseInt(form.find("#dead").val()),
      p1: form.find("#p1").val(),
      p2: form.find("#p2").val()
    };
    $(window).trigger("ui-start-game", [settings]);
  };

  var toggleForm = function() {
    if($(_selectors.dom_config).hasClass("hidden")) {
      $(_selectors.dom_config).removeClass("hidden");
      $(_selectors.dom_game).addClass("hidden");
      $(_selectors.dom_space).off("click");
      $(_selectors.dom_newGame).off("click");
      $(_selectors.dom_board).empty();
    } else {
      $(_selectors.dom_config).addClass("hidden");
      $(_selectors.dom_game).removeClass("hidden");
    }
  };

  // toggle visibility of size & deadSpace fields
  $(_selectors.dom_formBoard).on("change", function() {
    var val = $(_selectors.dom_formBoard).val();
    if(val === "random") {
      $(_selectors.dom_randomBoard).show();
    } else {
      $(_selectors.dom_randomBoard).hide();
    }
  })

  $(_selectors.dom_startGame).on("click", _handleForm);


  $(window).on("resize", function () {
    _setBoardSize(Math.sqrt($(_selectors.dom_space).length));
  });


  return {
    initialiseBoard: initialiseBoard,
    updateBoard: updateBoard,
    bindBoard: bindBoard,
    unbindBoard: unbindBoard,
    setMessage: setMessage,
    toggleForm: toggleForm
  };
}($);

module.exports = UI;

