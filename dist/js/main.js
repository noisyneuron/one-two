!function e(o,a,t){function s(r,i){if(!a[r]){if(!o[r]){var d="function"==typeof require&&require;if(!i&&d)return d(r,!0);if(n)return n(r,!0);throw new Error("Cannot find module '"+r+"'")}var p=a[r]={exports:{}};o[r][0].call(p.exports,function(e){var a=o[r][1][e];return s(a?a:e)},p,p.exports,e,o,a,t)}return a[r].exports}for(var n="function"==typeof require&&require,r=0;r<t.length;r++)s(t[r]);return s}({1:[function(e,o){var a=function(){var e={type:"mostOpenPath"},o={empty:"E",dead:"D",owned:function(e){if(1!==e&&2!==e)throw String("State cannot be "+e+".");return String(e)}},a=function(e,a,t){var s,n=[],r=1===a?t.p1.position:t.p2.position,i=1===a?t.p2.position:t.p1.position,d=[{x:r.x-2,y:r.y-1},{x:r.x-2,y:r.y+1},{x:r.x-1,y:r.y-2},{x:r.x-1,y:r.y+2},{x:r.x+2,y:r.y-1},{x:r.x+2,y:r.y+1},{x:r.x+1,y:r.y-2},{x:r.x+1,y:r.y+2}];for(s=0;s<d.length;s++)move=d[s],move.x>=0&&move.x<e.length&&move.y>=0&&move.y<e.length&&(1===Math.abs(r.x-move.x)&&2===Math.abs(r.y-move.y)||2===Math.abs(r.x-move.x)&&1===Math.abs(r.y-move.y))&&e[move.x][move.y]!==o.dead&&(move.x!==i.x||move.y!==i.y)&&n.push(move);return n},t=function(e,o,t){var s=a(e,o,t),n=Math.floor(Math.random()*s.length);return s[n]},s=function(e,t,s){var n,r=0,i=0,d=a(e,t,s),p=d.filter(function(a,t){return e[d[t].x][d[t].y]!==o.owned(2)});for(console.log(p),0===p.length&&(p=d),n=0;n<p.length;n++){var y=p[n],m=function(){var e={};return e=1===t?{p1:{position:{x:y.x,y:y.y},score:s.p1.score},p2:s.p2}:{p1:s.p1,p2:{position:{x:y.x,y:y.y},score:s.p2.score}}},c=a(e,t,m());c.length>r&&(r=c.length,i=n)}return console.log("BOT: "+p[i]),p[i]},n=function(o){if("random"!==o&&"mostOpenPath"!==o)throw String("Bot cannot be of type: "+o);return e.type=o,!1},r=function(o,a,n){var r;switch(console.log(e.type),e.type){case"random":r=t(o,a,n);break;case"mostOpenPath":r=s(o,a,n);break;default:r=void 0}return r};return{setType:n,getMove:r}};o.exports=a},{}],2:[function(e){var o,a,t,s=e("./onetwo.js"),n=e("./bot.js"),r=e("./ui.js"),i=!0,d=!0,p=function(e){var n=1===e?a.getMove(o,e,s.getPlayers()):t.getMove(o,e,s.getPlayers());state=s.move(n),players=s.getPlayers(),r.updateBoard(state,players),r.setMessage(s.getMessage()),s.gameIsOver()?(r.setMessage(s.getMessage()),r.endGame()):setTimeout(function(){p(1===e?2:1)},500)},y=function(){if(i&&d&&$(window).on("ui-move",function(e,o){var a=s.move(o),t=s.getPlayers();r.updateBoard(a,t),r.setMessage(s.getMessage()),s.gameIsOver()&&(r.setMessage(s.getMessage()),r.endGame())}),i&&!d&&(t=n(),$(window).on("ui-move",function(e,a){var n=s.move(a),i=s.getPlayers();if(r.updateBoard(n,i),r.setMessage(s.getMessage()),s.gameIsOver())r.setMessage(s.getMessage()),r.endGame();else{var d=t.getMove(o,2,s.getPlayers());setTimeout(function(){n=s.move(d),i=s.getPlayers(),r.updateBoard(n,i),r.setMessage(s.getMessage()),s.gameIsOver()&&(r.setMessage(s.getMessage()),r.endGame())},200)}})),!i&&d){a=n();var e=a.getMove(o,1,s.getPlayers());state=s.move(e),players=s.getPlayers(),r.updateBoard(state,players),r.setMessage(s.getMessage()),$(window).on("ui-move",function(e,t){var n=s.move(t),i=s.getPlayers();if(r.updateBoard(n,i),r.setMessage(s.getMessage()),s.gameIsOver())r.setMessage(s.getMessage()),r.endGame();else{var d=a.getMove(o,1,s.getPlayers());setTimeout(function(){n=s.move(d),i=s.getPlayers(),r.updateBoard(n,i),r.setMessage(s.getMessage()),s.gameIsOver()&&(r.setMessage(s.getMessage()),r.endGame())},200)}})}i||d||(a=n(),t=n(),p())};$(window).on("ui-start-game",function(e,a){$(window).off("ui-move"),o=s.newGame({boardSize:a.boardSize,deadSpaces:a.deadSpaces}),i="human"===a.p1,d="human"===a.p2,r.initialiseBoard(o),r.setMessage(s.getMessage()),y()})},{"./bot.js":1,"./onetwo.js":3,"./ui.js":4}],3:[function(e,o){var a=function(){var e,o,a=[],t={position:{x:null,y:null},score:0},s={position:{x:null,y:null},score:0},n={boardSize:6,deadSpaces:6},r={empty:"E",dead:"D",owned:function(e){if(1!==e&&2!==e)throw String("State cannot be "+e+".");return String(e)}},i=function(e){var o;if(1!==e&&2!==e)throw String("Player cannot be "+e+".");return o=1===e?t:s},d=function(e){var o;if(1!==e&&2!==e)throw String("Player cannot be "+e+".");return o=1===e?s:t},p=function(e){return e.x>=0&&e.x<n.boardSize&&e.y>=0&&e.y<n.boardSize},m=function(e,o){var t=i(e),s=d(e);return p(o)&&(1===Math.abs(t.position.x-o.x)&&2===Math.abs(t.position.y-o.y)||2===Math.abs(t.position.x-o.x)&&1===Math.abs(t.position.y-o.y))&&a[o.x][o.y]!==r.dead&&!(o.x===s.position.x&&o.y===s.position.y)},c=function(){return e=1===e?2:1,!1},g=function(e){var o,t,s=[],n=i(e).position,p=[{x:n.x-2,y:n.y-1},{x:n.x-2,y:n.y+1},{x:n.x-1,y:n.y-2},{x:n.x-1,y:n.y+2},{x:n.x+2,y:n.y-1},{x:n.x+2,y:n.y+1},{x:n.x+1,y:n.y-2},{x:n.x+1,y:n.y+2}];for(o=d(e).position,t=0;t<p.length;t++){var y=p[t];y.x>=0&&y.x<a.length&&y.y>=0&&y.y<a.length&&(1===Math.abs(n.x-y.x)&&2===Math.abs(n.y-y.y)||2===Math.abs(n.x-y.x)&&1===Math.abs(n.y-y.y))&&a[y.x][y.y]!==r.dead&&s.push(y)}return s},l=function(i){var d,p,y,m=0;for(d in i)i.hasOwnProperty(d)&&(n[d]=i[d]);for(a=[],p=0;p<n.boardSize;p++)for(a.push([]),y=0;y<n.boardSize;y++)a[p][y]=r.empty;for(t={position:{x:0,y:0},score:1},s={position:{x:n.boardSize-1,y:n.boardSize-1},score:1},a[t.position.x][t.position.y]=r.owned(1),a[s.position.x][s.position.y]=r.owned(2);m<n.deadSpaces;)p=Math.floor(Math.random()*n.boardSize),y=Math.floor(Math.random()*n.boardSize),p===t.position.x&&y===t.position.y||p===s.position.x&&y===s.position.y||p===t.position.x+2&&y===t.position.y+1||p===t.position.x+1&&y===t.position.y+2||p===s.position.x-2&&y===s.position.y-1||p===s.position.x-1&&y===s.position.y-2||a[p][y]===r.dead||(a[p][y]=r.dead,m+=1);return e=1,o="New game started. Player 1's turn.",a.slice(0)},u=function(t){var s;if(m(e,t)){switch(s=a[t.x][t.y]){case r.empty:a[t.x][t.y]=r.owned(e),i(e).score+=1;break;case r.owned(e):break;default:a[t.x][t.y]=r.dead,d(e).score-=1}i(e).position.x=parseInt(t.x),i(e).position.y=parseInt(t.y),c(),o="Player "+e+"'s turn."}else o="Invalid move. Player "+e+"'s turn.";return a},f=function(){return{p1:t,p2:s}},v=function(){return o},h=function(){var e=!0,i=!1,d=!1,p=!1;for(x=0;x<n.boardSize;x++)for(y=0;y<n.boardSize;y++)if(a[x][y]===r.empty){e=!1;break}return i=0===g(1).length,d=0===g(2).length,i&&(o="Game over. Player 1 is trapped. "),d&&(o="Game over. Player 2 is trapped. "),e&&(o="Game over. Board is full. "),p=i||d||e,p&&(t.score>s.score&&(o+="Player 1 wins."),s.score>t.score&&(o+="Player 2 wins."),t.score===s.score&&(o+="Game ends in a draw.")),p};return{newGame:l,move:u,getPlayers:f,getMessage:v,gameIsOver:h}}();o.exports=a},{}],4:[function(e,o){var a=function(){var e={dom_boardHolder:"#board-holder",dom_board:"#board",dom_message:"#message",dom_space:".space",dom_config:"#config",dom_game:"#game",dom_newGame:"#new-game",dom_startGame:"#start-game",dom_players:".player",dom_p1score:".score.p1 p",dom_p2score:".score.p2 p"},o=function(){var e=$(this).parents("form"),o={boardSize:parseInt(e.find("#size").val()),deadSpaces:parseInt(e.find("#dead").val()),p1:e.find("#p1").val(),p2:e.find("#p2").val()};$(window).trigger("ui-start-game",[o])},a=function(){var e={x:$(this).attr("data-x"),y:$(this).attr("data-y")};$(window).trigger("ui-move",[e])},t=function(o){var a,t=$(e.dom_boardHolder),s=$(e.dom_board),n=parseInt(t.css("width")),r=parseInt(t.css("height"));n>=r?(a=Math.floor(r/o)*o,s.css({"margin-left":String((n-a)/2+"px"),"margin-top":"0"})):(a=Math.floor(n/o)*o,s.css({"margin-top":String((r-a)/2+"px"),"margin-left":"0"})),s.css({height:String(a+"px"),width:String(a+"px")})},s=function(){if($(e.dom_config).hasClass("hidden")){var o=confirm("Are you sure you want to start a new game?");o&&($(e.dom_config).removeClass("hidden"),$(e.dom_game).addClass("hidden"),$(e.dom_space).off("click"),$(e.dom_newGame).off("click"),$(e.dom_board).empty())}else $(e.dom_config).addClass("hidden"),$(e.dom_game).removeClass("hidden")},n=function(o){s();var n,r,i,d=$(e.dom_board),p=o.length;for(r=0;p>r;r++)for(n=0;p>n;n++)i=o[n][r],"E"===i&&d.append("<div class='space empty' data-x='"+n+"' data-y='"+r+"'></div>"),"D"===i&&d.append("<div class='space dead' data-x='"+n+"' data-y='"+r+"'></div>"),("1"===i||"2"===i)&&d.append("<div class='space owned-"+i+"' data-x='"+n+"' data-y='"+r+"'><div class='player' id='p"+i+"'></div></div>");t(p),$(e.dom_space).css({height:String(100/p+"%"),width:String(100/p+"%")}),$(e.dom_space).on("click",a),$(e.dom_newGame).on("click",s)},r=function(o,a){for(x=0;x<o.length;x++)for(y=0;y<o.length;y++){var t=o[x][y],s=$('.space[data-x="'+x+'"][data-y="'+y+'"]');"D"===t&&s.removeClass("owned-1").removeClass("owned-2").removeClass("empty").addClass("dead"),"1"===t&&s.removeClass("empty").removeClass("dead").removeClass("owned-2").addClass("owned-1"),"2"===t&&s.removeClass("empty").removeClass("dead").removeClass("owned-1").addClass("owned-2")}$(e.dom_players).remove(),$('.space[data-x="'+a.p1.position.x+'"][data-y="'+a.p1.position.y+'"]').append("<div class='player' id='p1'></div>"),$('.space[data-x="'+a.p2.position.x+'"][data-y="'+a.p2.position.y+'"]').append("<div class='player' id='p2'></div>"),$(e.dom_p1score).text(a.p1.score),$(e.dom_p2score).text(a.p2.score)},i=function(o){var a=o.replace(/Player 1/g,"Blue").replace(/Player 2/g,"Yellow");-1!==a.indexOf("Game over")&&alert(a),$(e.dom_message).text(a)},d=function(){$(e.dom_space).off("click")};return $(e.dom_startGame).on("click",o),$(window).on("resize",function(){t(Math.sqrt($(e.dom_space).length))}),{initialiseBoard:n,updateBoard:r,setMessage:i,endGame:d}}();o.exports=a},{}]},{},[2]);