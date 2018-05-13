var nam = document.getElementById("play");
var main = document.getElementById("main");
var point = document.getElementById("point");
var point_div = document.getElementById("point-div");
var display_div = document.getElementById("display");

var maxpoint = 5;
var count;
var map;
var mapH = 15;
var mapW = 20;
var brick = "╬╩╦╣╠╝╚╗╔║═";
var output;
var pacman_speed = 300;
var ghost_speed = 200;
var time1;
var time2;

function Pacman() {
	this.pos_x, 
	this.pos_y,
	this.dx,
	this.dy,
	
	this.move = function() {
		map[this.pos_x][this.pos_y] = ' ';
		this.pos_x += this.dx;
		this.pos_y += this.dy;
		if (map[this.pos_x][this.pos_y] == '◦') {
			count++;
		}
		map[this.pos_x][this.pos_y] = '☺';
		display();
	},
	
	this.spawn = function(_pos_x, _pos_y, _dx, _dy) {
		this.pos_x = _pos_x;
		this.pos_y = _pos_y;
		this.dx = _dx;
		this.dy = _dy;
		map[this.pos_x][this.pos_y] = '☺';
	}
}

function Ghost() {
	this.pos_x, 
	this.pos_y,
	this.dx,
	this.dy,
	this.foot,

	this.move = function() {
		map[this.pos_x][this.pos_y] = this.foot;
		this.pos_x += this.dx;
		this.pos_y += this.dy;
		this.foot = map[this.pos_x][this.pos_y];
		map[this.pos_x][this.pos_y] = '☻';
		display();
	},
	
	this.spawn = function(_pos_x, _pos_y, _dx, _dy) {
		this.pos_x = _pos_x;
		this.pos_y = _pos_y;
		this.dx = _dx;
		this.dy = _dy;
		this.foot = '◦';
		map[this.pos_x][this.pos_y] = '☻';
	}
}


var pacman = new Pacman();
var ghost = new Ghost();

function resetGame() {
	count = 0;
	map = [
		['╔','═','═','═','═','═','═','═','═','═','═','═','═','═','═','═','═','═','═','╗'],
		['║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','║'],
		['║','◦','═','═','═','═','═','╗','◦','║','◦','╔','═','◦','◦','◦','◦','║','◦','║'],
		['║','◦','◦','◦','◦','◦','◦','║','◦','║','◦','║','◦','◦','═','═','═','╝','◦','║'],
		['║','◦','◦','◦','◦','◦','◦','║','◦','║','◦','║','◦','◦','◦','◦','◦','◦','◦','║'],
		['╠','═','═','═','═','═','═','╝','◦','║','◦','║','◦','◦','═','═','═','═','◦','║'],
		['║','◦','◦','◦','◦','◦','◦','◦','◦','║','◦','║','◦','◦','◦','◦','◦','◦','◦','║'],
		['║','◦','═','═','═','═','═','═','═','╝','◦','╚','═','◦','◦','═','═','═','═','╣'],
		['║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','║'],
		['║','◦','═','═','═','═','═','═','═','═','◦','═','═','◦','╔','═','═','═','═','╣'],
		['║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','║','◦','◦','◦','◦','║'],
		['║','◦','╔','═','═','═','═','═','═','═','◦','═','═','◦','║','◦','◦','◦','◦','║'],
		['║','◦','║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','╚','═','═','═','◦','║'],
		['║','◦','◦','◦','◦','◦','◦','║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','║'],
		['╚','═','═','═','═','═','═','╩','═','═','═','═','═','═','═','═','═','═','═','╝']	
	];
	output = '';
	clearInterval(time1);
	clearInterval(time2);
}

function start() {
	resetGame();
	pacman.spawn(1,1,0,-1);
	ghost.spawn(13,1,-1,0);
	nam.classList.toggle('hide');
	main.classList.toggle('hide');
	point_div.classList.toggle('hide');
	display();

	// pacman move
	time1 =  setInterval(loopPacman, pacman_speed);
	function loopPacman() {
		if (brick.indexOf(map[pacman.pos_x + pacman.dx][pacman.pos_y + pacman.dy]) < 0){
			pacman.move();
		}
		check();
	}

	// ghost move
	time2 = setInterval(loopGhost, ghost_speed);
	function loopGhost() {
		if (brick.indexOf(map[ghost.pos_x + ghost.dx][ghost.pos_y + ghost.dy]) < 0){
			ghost.move();
		}
		else {
			newdir = Math.floor((Math.random() * 4) + 1);
			switch (newdir) {
		    	case 1:
		    		ghost.dx = 0;
		    		ghost.dy = 1;
		    		break;
		    	case 2:
		    		ghost.dx = 0;
		    		ghost.dy = -1;
		    		break;
		    	case 3:
		    		ghost.dx = -1;
		    		ghost.dy = 0;
		    		break;
		    	case 4:
		    		ghost.dx = 1;
		    		ghost.dy = 0;
		    		break;
    		}
    		loopGhost();
		}
		check();
	}

	function check() {
		if (pacman.pos_x == ghost.pos_x && pacman.pos_y == ghost.pos_y) {
			clearInterval(time1);
			clearInterval(time2);
			map[pacman.pos_x][pacman.pos_y] = '۩';
			display();
			blink();
			setTimeout(function() {
				nam.innerHTML = '\n\n\n\n\n      <strong>GAME OVER</strong>\n\n' +
								'     Press START\n\n\n';
			}, 1000);
		}
		if (count == maxpoint) {
			clearInterval(time1);
			clearInterval(time2);
			blink();
			setTimeout(function() {
				var text = 	"YOU WIN! IMPOSSIBLE!!! \n" 	+
							"---------------------- \n" 	+
							"A web game by NAMDAODUY and SPQUYT, pure javascript \n" +
							"Check my github for my lastest project: \n" +
							"namdaoduy: https://github.com/namdaoduy \n" +
							"SpQuyt: https://github.com/SpQuyt \n" +
							"---------------------- \n" +
							"Press START to play again";
				alert(text);

			}, 1000);
			setTimeout(function() {
				nam.innerHTML = '\n\n\n\n\n       <strong>YOU WIN</strong>\n\n' +
								'     Press START\n\n\n';
			}, 1000);
		}
	}
}

function blink() {
	var i = 0;
	var time = setInterval(changeClass, 100, 5);
	function changeClass() {
		display_div.classList.toggle('color');
		i++;
		if (i == 8) {
			clearInterval(time);
		}
	}
}



function display() {
	output = '';
	for (var i = 0; i < mapH; i++) {
		for (var j = 0; j < mapW; j++) {
			output += map[i][j];
		}
		output += '<br>';
	}	
	nam.innerHTML = output;
	point.innerHTML = count;
}

document.addEventListener("keydown", (event) => {
	var _dx;
	var _dy;
    switch (event.keyCode) {
      case 39:
    	_dx = 0;
    	_dy = 1;
    	break;
      case 37:
    	_dx = 0;
    	_dy = -1;
    	break;
      case 38:
    	_dx = -1;
    	_dy = 0;
    	break;
      case 40:
    	_dx = 1;
   		_dy = 0;
   		break;
    }

    if (brick.indexOf(map[pacman.pos_x + _dx][pacman.pos_y + _dy]) < 0) {
    	pacman.dx = _dx;
    	pacman.dy = _dy;
    }

});

function tap(key) {
	var _dx;
	var _dy;
    switch (key) {
      case 'right':
    	_dx = 0;
    	_dy = 1;
    	break;
      case 'left':
    	_dx = 0;
    	_dy = -1;
    	break;
      case 'up':
    	_dx = -1;
    	_dy = 0;
    	break;
      case 'down':
    	_dx = 1;
   		_dy = 0;
   		break;
    }

    if (brick.indexOf(map[pacman.pos_x + _dx][pacman.pos_y + _dy]) < 0) {
    	pacman.dx = _dx;
    	pacman.dy = _dy;
    }
}

function help() {
	var howto = " HOW TO PLAY: \n" +
				" * Desktop: use ARROW KEY on the key board to move \n" +
				" * Mobile:  use BUTTON on screen to move \n\n" +
				" RULE: \n" +
				" * Eat all foods to win \n" +
				" * Avoid Ghosts \n";
	alert(howto);
}
