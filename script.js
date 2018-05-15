
// Get elements
// ---------------------------------------------------------- //
var nam = document.getElementById("play");
var main = document.getElementById("main");
var point = document.getElementById("point");
var point_div = document.getElementById("point-div");
var display_div = document.getElementById("display");
var setting_div = document.getElementById("setting");
var help_div = document.getElementById("help");
var credit_div = document.getElementById("credit");


// Define variables
// ---------------------------------------------------------- //
var maxfood = 151;
var count_food;
var count_point;

var map;
var mapH = 15;
var mapW = 20;
var brick = "╬╩╦╣╠╝╚╗╔║═";
var output;

var super_mode = 0;

var dot_icon = '◦';
var fruit_icon = 'Ѽ';
var ghost_icon = '☻';
var pacman_icon = '☺';

var sound_mode = "ON";
var sound_opening = new Audio("sound/sound_opening.mp3");
var sound_dot = new Audio("sound/sound_dot.mp3");
var sound_fruit = new Audio("sound/sound_fruit.mp3");
var sound_dead = new Audio("sound/sound_dead.mp3");
var sound_ghost = new Audio("sound/sound_ghost.mp3");


// Define objects and prototypes
// ---------------------------------------------------------- //
var dot = { icon: dot_icon }
var fruit = { icon: fruit_icon }

function Pacman() {
	this.pos_x, 
	this.pos_y,
	this.dx,
	this.dy,
	this.time,
	this.speed,
	this.icon = '☺',
	this.resetAll = function() {
		this.speed = 200;
	},
	this.move = function() {
		map[this.pos_x][this.pos_y] = ' ';
		this.pos_x += this.dx;
		this.pos_y += this.dy;
		if (map[this.pos_x][this.pos_y] == dot.icon) {
			this.eat(dot);
		} 
		else if (map[this.pos_x][this.pos_y] == fruit.icon) {
			this.eat(fruit);
		}
		map[this.pos_x][this.pos_y] = this.icon;
		display();
	},
	this.eat = function(target) {
		switch (target.icon) {
			case dot.icon:
				count_food++;
				count_point += 10;
				playSound(sound_dot);
				break;
			case fruit.icon:
				count_food++;
				count_point += 100;
				playSound(sound_fruit);
				blink("blue");
				bigFruit();
				break;
			case '☻':
				if (target.foot == dot.icon) {
					this.eat(dot);
				}
				else if (target.foot == fruit.icon) {
					this.eat(fruit);
				}
				clearInterval(target.time);
				target.dead = 1;
				target.pos_x = NaN;
				target.pos_y = NaN;
				count_point += 500;
				playSound(sound_ghost);
		}
	},
	this.spawn = function(_pos_x, _pos_y, _dx, _dy) {
		this.pos_x = _pos_x;
		this.pos_y = _pos_y;
		this.dx = _dx;
		this.dy = _dy;
		map[this.pos_x][this.pos_y] = this.icon;
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
	this.icon = '☻';
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
		map[this.pos_x][this.pos_y] = this.icon;
		display();
	},
	this.spawn = function(_pos_x, _pos_y, _dx, _dy) {
		this.pos_x = _pos_x;
		this.pos_y = _pos_y;
		this.dx = _dx;
		this.dy = _dy;
		this.foot = '◦';
		map[this.pos_x][this.pos_y] = this.icon;
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


// Call functions
// ---------------------------------------------------------- //
mainGif();


// Define functions and events
// ---------------------------------------------------------- //

function start() {
	playSound(sound_opening);
	resetGame();

	pacman.resetAll();
	ghost1.resetAll();
	ghost2.resetAll();

	pacman.spawn(1,1,0,-1);
	ghost1.spawn(13,1,-1,0);
	ghost2.spawn(13,18,0,-1);

	nam.classList.toggle('hide');
	main.classList.toggle('hide');
	point_div.classList.toggle('hide');
	setting_div.classList.add("hide");

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
		if (a.pos_x == b.pos_x && a.pos_y == b.pos_y)
			return 1;
		else
			return 0;
	}
	function checkGhosts(a, b) {
		if (checkPos(a, b)) {
			if (a.foot == a.icon)
				a.foot = b.foot;
			else
				b.foot = a.foot;
		}
	}
	function checkPacman(_pacman, _ghost) {
		if (checkPos(_pacman, _ghost)) {
			if (super_mode == 1) {
				map[_pacman.pos_x][_pacman.pos_y] = _pacman.icon;
				_pacman.eat(_ghost);
			}
			else {
				clearTime();
				map[_pacman.pos_x][_pacman.pos_y] = '۩';
				playSound(sound_dead);
				display();
				blink('red');
				setTimeout(function() {
					nam.innerHTML = '\n\n\n\n\n      <strong>GAME OVER</strong>\n\n' +
									'     Press <strong>START</strong>\n\n\n';
				}, 1000);
			}
		}
	}
	function checkWin() {
			if (count_food == maxfood) {
				playSound(sound_opening);
				clearTime();
				blink('blue');
				setTimeout(toggleCredit, 1000);
				setTimeout(function() {
					nam.innerHTML = '\n\n\n       <strong>YOU WIN</strong>\n\n' +
									'    Incredible!!! \n' +
									' Calm down, I have a\n' +
									' lot more stages for \n' +
									'      you soon!\n' +
									'   Keep in touch!\n\n' +
									'     Press <strong>START</strong>\n\n';
			}, 1000);
		}
	}

	checkGhosts(ghost1, ghost2);
	checkPacman(pacman, ghost1);
	checkPacman(pacman, ghost2);
	checkWin();
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

function playSound(name) {
	if (sound_mode == 'ON') {
		name.play();
	}
}

// For display
// ---------------------------------------------------------- //

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

// Settings
// ---------------------------------------------------------- //

function setting() {
	setting_div.classList.toggle("hide");
	help_div.classList.add("hide");
	credit_div.classList.add("hide");
}

function toggleHelp() {
	help_div.classList.toggle("hide");
}

function toggleCredit() {
	credit_div.classList.toggle("hide");
}

function soundSetting(flag) {
	if (flag.checked == true)
		sound_mode = 'ON';
	else
		sound_mode = 'OFF';
}

// Controls
// ---------------------------------------------------------- //

document.addEventListener("keydown", (event) => {
	if (event.keyCode == 13) {
		start();
		return;
	}
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





