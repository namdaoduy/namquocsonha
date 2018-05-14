var nam = document.getElementById("play");
var main = document.getElementById("main");
var point = document.getElementById("point");
var point_div = document.getElementById("point-div");
var display_div = document.getElementById("display");

var maxfood = 154;
var count_food;
var count_point;
var map;
var mapH = 15;
var mapW = 20;
var brick = "╬╩╦╣╠╝╚╗╔║═";
var output;
var super_mode = 0;




function Pacman() {
	this.pos_x, 
	this.pos_y,
	this.dx,
	this.dy,
	this.time,
	this.speed,
	this.resetAll = function() {
		this.speed = 200;
	},
	this.move = function() {
		map[this.pos_x][this.pos_y] = ' ';
		this.pos_x += this.dx;
		this.pos_y += this.dy;
		if (map[this.pos_x][this.pos_y] == '◦') {
			count_food++;
			count_point += 10;
		} else if (map[this.pos_x][this.pos_y] == 'Ѽ') {
			count_food++;
			count_point += 100;
			blink("blue");
			bigFruit();
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
	},
	this.start = function() {
		var _this = this;
		this.time = setInterval(function(){
			_this.loop();
		}, _this.speed);
	},
	this.loop = function() {
		if (brick.indexOf(map[this.pos_x + this.dx][this.pos_y + this.dy]) < 0){
			this.move();
		}
		check();
	}
}




function Ghost() {
	this.pos_x, 
	this.pos_y,
	this.dx,
	this.dy,
	this.foot,
	this.time,
	this.speed,
	this.dead = 0,
	this.resetAll = function() {
		this.resetSpeed();
		this.dead = 0;
	},
	this.resetSpeed = function() {
		this.speed = 200;
	}
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
	},
	this.start = function() {
		if (this.dead == 0) {
			var _this = this;
			this.time = setInterval(function(){
				_this.loop();
			}, _this.speed);	
		}
	},
	this.loop = function() {
		if (brick.indexOf(map[this.pos_x + this.dx][this.pos_y + this.dy]) < 0){
			this.move();
		}
		else {
			var newdir = Math.floor((Math.random() * 4) + 1);
			switch (newdir) {
		    	case 1:
		    		this.dx = 0;
		    		this.dy = 1;
		    		break;
		    	case 2:
		    		this.dx = 0;
		    		this.dy = -1;
		    		break;
		    	case 3:
		    		this.dx = -1;
		    		this.dy = 0;
		    		break;
		    	case 4:
		    		this.dx = 1;
		    		this.dy = 0;
		    		break;
    		}
    		this.loop();
		}
		check();
	}
}


var pacman = new Pacman();
var ghost1 = new Ghost();
var ghost2 = new Ghost();

help();
mainGif();




function start() {
	resetGame();

	pacman.resetAll();
	ghost1.resetAll();
	ghost2.resetAll();

	pacman.spawn(1,1,0,-1);
	ghost1.spawn(13,8,0,1);
	ghost2.spawn(13,18,0,-1);

	nam.classList.toggle('hide');
	main.classList.toggle('hide');
	point_div.classList.toggle('hide');

	display();

	pacman.start();
	ghost1.start();
	ghost2.start();
}

function resetGame() {
	count_food = 0;
	count_point = 0;
	map = [
		['╔','═','═','═','═','═','═','═','═','═','═','═','═','═','═','═','═','═','═','╗'],
		['║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','║'],
		['║','◦','═','═','═','═','═','╗','◦','║','◦','╔','═','◦','◦','◦','◦','║','◦','║'],
		['║','◦','◦','◦','◦','◦','Ѽ','║','◦','║','◦','║','◦','◦','═','═','═','╝','◦','║'],
		['║','◦','◦','◦','◦','◦','◦','║','◦','║','◦','║','◦','◦','◦','◦','◦','◦','◦','║'],
		['╠','═','═','═','═','═','═','╝','◦','║','◦','║','◦','◦','═','═','═','═','◦','║'],
		['║','◦','◦','◦','◦','◦','◦','◦','◦','║','◦','║','◦','◦','◦','◦','◦','◦','◦','║'],
		['║','◦','═','═','═','═','═','═','═','╝','◦','╚','═','◦','◦','═','═','═','═','╣'],
		['║','◦','◦','◦','◦','◦','◦','◦','◦','◦','Ѽ','◦','◦','◦','◦','◦','◦','◦','◦','║'],
		['║','◦','═','═','═','═','═','═','═','═','◦','═','═','◦','╔','═','═','═','═','╣'],
		['║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','║','◦','◦','◦','◦','║'],
		['║','◦','╔','═','═','═','═','═','═','═','◦','═','═','◦','║','Ѽ','◦','◦','◦','║'],
		['║','◦','║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','╚','═','═','═','◦','║'],
		['║','◦','◦','◦','◦','◦','◦','║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','║'],
		['╚','═','═','═','═','═','═','╩','═','═','═','═','═','═','═','═','═','═','═','╝']	
	];
	output = '';
	clearTime();
}

function clearTime() {
	clearInterval(pacman.time);
	clearInterval(ghost1.time);
	clearInterval(ghost2.time);
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
	point.innerHTML = count_point;
}

function check() {
	function checkPos(a, b) {
		if (a.pos_x == b.pos_x && a.pos_y == b.pos_y) {
			return 1;
		} else {
			return 0;
		}
	}
	if (checkPos(ghost1, ghost2)) {
		if (ghost1.foot == '☻') {
			ghost1.foot = ghost2.foot;
		}
		else {
			ghost2.foot = ghost1.foot;
		}
	}
	if (checkPos(pacman, ghost1) || checkPos(pacman, ghost2)) {
		if (super_mode == 1) {
			map[pacman.pos_x][pacman.pos_y] = '☺';
			count_point += 500;
			if (checkPos(pacman, ghost1)) {
				clearInterval(ghost1.time);
				ghost1.dead = 1;
				ghost1.pos_x = NaN;
				ghost1.pos_y = NaN;
			} else {
				clearInterval(ghost2.time);
				ghost2.dead = 1;
				ghost2.pos_x = NaN;
				ghost2.pos_y = NaN;
			}
		}
		else {
			clearTime();
			map[pacman.pos_x][pacman.pos_y] = '۩';
			display();
			blink('red');
			setTimeout(function() {
				nam.innerHTML = '\n\n\n\n\n      <strong>GAME OVER</strong>\n\n' +
								'     Press START\n\n\n';
			}, 1000);
		}
		
	}
	if (count_food == maxfood) {
		clearTime();
		blink('blue');
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


function blink(color) {
	var i = 0;
	var time = setInterval(changeClass, 100);
	function changeClass() {
		display_div.classList.toggle(color);
		i++;
		if (i == 8) {
			clearInterval(time);
		}
	}
}

function change(color) {
	var j = 0;
	var time = setInterval(changeClass, 100);
	function changeClass() {
		display_div.classList.toggle(color);
		j++;
		if (j == 3) {
			clearInterval(time);
		}
	}
}

function mainGif() {
	var i = 0;
	var time = setInterval(function() {
		if (i%4 == 0) {
			main.innerHTML = '\n\n' +
				' █▀█ ███ ▄███▀ █▄ ▄█ █▀█ █▄ █\n' +
				' ███ █▄█ ███▄  █ ▀ █ ███ █ ▀█\n' +
				' █   █ █ ▀████ █   █ █ █ █  █\n\n' +
				'    ▒▒▒▒▒      ▄████▄       \n' +
				'   ▒ ▀▒ ▀▒    ████▀███      \n' +
				'   ▒▒▒▒▒▒▒   ▐████████▌ █   █\n' +
				'   ▒▒▒▒▒▒▒    ████████      \n' +
				'   ▒ ▒ ▒ ▒     ▀████▀       \n\n' +
				'     Press <strong>START</strong> to play\n';	
		}
		else if (i%4 == 1) {
			main.innerHTML = '\n\n' +
				' █▀█ ███ ▄███▀ █▄ ▄█ █▀█ █▄ █\n' +
				' ███ █▄█ ███▄  █ ▀ █ ███ █ ▀█\n' +
				' █   █ █ ▀████ █   █ █ █ █  █\n\n' +
				'     ▒▒▒▒▒     ▄████▄       \n' +
				'    ▒ ▄▒ ▄▒   ████▀███      \n' +
				'    ▒▒▒▒▒▒▒  ▐████████▌█   █\n' +
				'    ▒▒▒▒▒▒▒   ████████      \n' +
				'    ▒ ▒ ▒ ▒    ▀████▀       \n\n' +
				'     Press <strong>START</strong> to play\n';	
		}
		else if (i%4 == 2) {
			main.innerHTML = '\n\n' +
				' █▀█ ███ ▄███▀ █▄ ▄█ █▀█ █▄ █\n' +
				' ███ █▄█ ███▄  █ ▀ █ ███ █ ▀█\n' +
				' █   █ █ ▀████ █   █ █ █ █  █\n\n' +
				'      ▒▒▒▒▒    ▄████▄       \n' +
				'     ▒▄ ▒▄ ▒  ███▄█▀        \n' +
				'     ▒▒▒▒▒▒▒ ▐████    █   █ \n' +
				'     ▒▒▒▒▒▒▒  █████▄        \n' +
				'     ▒ ▒ ▒ ▒   ▀████▀       \n\n' +
				'     Press START to play\n';	
		}
		else {
			main.innerHTML = '\n\n' +
				' █▀█ ███ ▄███▀ █▄ ▄█ █▀█ █▄ █\n' +
				' ███ █▄█ ███▄  █ ▀ █ ███ █ ▀█\n' +
				' █   █ █ ▀████ █   █ █ █ █  █\n\n' +
				'     ▒▒▒▒▒     ▄████▄       \n' +
				'    ▒▀ ▒▀ ▒   ███▄█▀        \n' +
				'    ▒▒▒▒▒▒▒  ▐████   █   █   █\n' +
				'    ▒▒▒▒▒▒▒   █████▄        \n' +
				'    ▒ ▒ ▒ ▒    ▀████▀       \n\n' +
				'     Press START to play\n';	
		}
		i++;
	}, 400);
}


function bigFruit() {
	var rand = Math.floor((Math.random() * 4) + 1);
	switch (rand) {
		case 1:
			boostSpeed(ghost1, 4);
			break;
		case 2:
			boostSpeed(pacman, 2);
			break;
		case 3:
			boostSpeed(pacman, 0.5);
			break;
		case 4:
			superPacman();
			break;
	}
}

function boostSpeed(target, multi) {
	target.speed = Math.floor(target.speed / multi);
	clearInterval(target.time);
	target.start();
}

function superPacman() {
	clearTime();
	change("gold");
	pacman.speed = 150;
	ghost1.speed = 800;
	ghost2.speed = 800;
	super_mode = 1;
	pacman.start();
	ghost1.start();
	ghost2.start();
	setTimeout(function() {
		change("gold");
		clearTime();
		super_mode = 0;
		pacman.resetAll();
		ghost1.resetSpeed();
		ghost2.resetSpeed();
		pacman.start();
		ghost1.start();
		ghost2.start();
	}, 5000);
}