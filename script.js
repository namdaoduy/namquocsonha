
// Get elements
// ---------------------------------------------------------- //
var nam = document.getElementById("play");
var main = document.getElementById("main");
var point = document.getElementById("point");
var point_div = document.getElementById("point-div");
var display_div = document.getElementById("display");
var setting_div = document.getElementById("setting");
var play_mode_div = document.getElementById("play-mode");
var mode_name = document.getElementById("mode");
var help_div = document.getElementById("help");
var highscore_div = document.getElementById("highscore");
var high_score_body = document.getElementById("high-score-body");
var credit_div = document.getElementById("credit");
var super_div = document.getElementById("super-mode");
var reverse_div = document.getElementById("reverse-mode");
var name_input = document.getElementById("name-input");



// Define variables
// ---------------------------------------------------------- //
var maxfood = 151;
var count_food;
var count_point;
var x_point = 1;

var map;
var mapH = 15;
var mapW = 20;
var brick = "╬╩╦╣╠╝╚╗╔║═";
var output;

var intervals = [];
var timeouts = [];

var _dx;
var _dy;
var p_default_spd;
var g_default_spd;

var detect_range = 8;
var super_mode = 0;
var reverse_mode = 0;

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

var highscore = {};


// Define objects and prototypes
// ---------------------------------------------------------- //
var dot = { icon: dot_icon }
var fruit = { icon: fruit_icon }
var pacman;
var ghost1;
var ghost2;


// User prototype-------------------------- //
function User() {
	this.name,
	this.score,
	this.mode,
	this.time,
	this.updateUser = function() {
		this.time = Date.now();
		var _this = this;
		database.ref('allusername').update({['/' + _this.name] : _this.time});
	},
	this.writeHighscore = function() {
		this.score = count_point;
		this.mode = play_mode.mode;
		this.time = Date.now();
		var _this = this;
		database.ref('highscore/' + _this.score).child(_this.time)
			.set({name: _this.name, mode: _this.mode, score: _this.score});
		database.ref('user/' + _this.name).child(_this.time)
			.set({score: _this.score, mode: _this.mode});
	},
	this.updateWin = function() {
		this.score = count_point;
		this.mode = play_mode.mode;
		this.time = Date.now();
		var _this = this;
		database.ref('user/' + _this.name).child(_this.time)
			.set({score: _this.score, mode: _this.mode});
	}
}

var user = new User();


// Pacman prototype-------------------------- //
function Pacman() {
	this.pos_x, 
	this.pos_y,
	this.dx,
	this.dy,
	this.time,
	this.speed,
	this.icon = pacman_icon,
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
		intervals.push(this.time);
	},
	this.loop = function() {
		this.changeDir();
		if (brick.indexOf(map[this.pos_x + this.dx][this.pos_y + this.dy]) < 0){
			this.move();
		}
		check();
	},
	this.changeDir = function() {
		if (brick.indexOf(map[this.pos_x + _dx][this.pos_y + _dy]) < 0) {
	    	this.dx = _dx;
	    	this.dy = _dy;
	    }
	}
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
				count_point += 10 * x_point;
				playSound(sound_dot);
				break;
			case fruit.icon:
				count_food++;
				count_point += 100 * x_point;
				playSound(sound_fruit);
				bigFruit();
				break;
			case ghost_icon:
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
				count_point += 500 * x_point;
				playSound(sound_ghost);
				timeouts.push(setTimeout(function() {
					target.revive(1,1);
				}, 10000));
		}
	},
	this.resetAll = function() {
		this.speed = p_default_spd;
	}	
}


// Ghost prototype-------------------------- //
function Ghost() {
	this.pos_x, 
	this.pos_y,
	this.dx,
	this.dy,
	this.foot,
	this.icon = ghost_icon,
	this.time,
	this.speed,
	this.dead = 0,
	this.record,
	this.visited_map,
	this.result_map,
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
			intervals.push(this.time);	
		}
	},
	this.loop = function() {
		this.detect();
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
	},
	this.move = function() {
		map[this.pos_x][this.pos_y] = this.foot;
		this.pos_x += this.dx;
		this.pos_y += this.dy;
		this.foot = map[this.pos_x][this.pos_y];
		map[this.pos_x][this.pos_y] = this.icon;
		display();
	},
	this.revive = function(x, y) {
		this.dead = 0;
		this.foot = ' ';
		map[x][y] = this.icon;
		var _this = this;
		timeouts.push(setTimeout(function(){
			_this.pos_x = x;
			_this.pos_y = y;
			_this.start();
		}, 1000));
	},
	this.resetSpeed = function() {
		this.speed = g_default_spd;
	},
	this.resetAll = function() {
		this.resetSpeed();
		this.dead = 0;
	},
	this.countVisited = function() {
		var count = 0;
		for (var i = 0; i < mapH; i++) {
			for (var j = 0; j < mapW; j++) {
				if (this.visited_map[i][j] == 1) {
					count++;
				}
			}
		}
		return count;
	},
	this.trace = function(target, x, y) {
		if (target.pos_x == x && target.pos_y == y) {
			this.visited_map[x][y] = 1;
			var count = this.countVisited();
			if (count <= this.record) {
				for (var i = 0; i < mapH; i++) {
					for (var j = 0; j < mapW; j++) {
						this.result_map[i][j] = this.visited_map[i][j];
					}
				}
				this.record = count;
			}
			this.visited_map[x][y] = 0;
		}
		else if (this.visited_map[x][y] == 1) {
			return;
		}
		else if (x >= mapH-1 || x <= 0 || y >= mapW-1 || y <= 0) {
			return;
		}
		else if (brick.indexOf(map[x][y]) >= 0) {
			return;
		}
		else if (this.countVisited() > this.record) {
			return;
		}
		else {
			this.visited_map[x][y] = 1;
			this.trace(target, x-1, y+0);
			this.trace(target, x+0, y-1);
			this.trace(target, x+0, y+1);
			this.trace(target, x+1, y+0);
			this.visited_map[x][y] = 0;
		}
	},
	this.detect = function() {
		this.record = detect_range;
		for (var i = 0; i < mapH; i++) {
			for (var j = 0; j < mapW; j++) {
				this.result_map[i][j] = 0;
				this.visited_map[i][j] = 0;
			}
		}

		this.trace(pacman, this.pos_x, this.pos_y);
		if (this.result_map[this.pos_x+1][this.pos_y+0] == 1){
			this.dx = 1;
			this.dy = 0;
		}
		else if (this.result_map[this.pos_x-1][this.pos_y+0] == 1){
			this.dx = -1;
			this.dy = 0;
		}
		else if (this.result_map[this.pos_x+0][this.pos_y+1] == 1){
			this.dx = 0;
			this.dy = 1;
		}
		else if (this.result_map[this.pos_x+0][this.pos_y-1] == 1){
			this.dx = 0;
			this.dy = -1;
		}
	},
	this.initMap = function() {
		this.visited_map = [];
		for (var i = 0; i < mapH; i++) {
			this.visited_map[i] = [];
			for (var j = 0; j < mapW; j++) {
				this.visited_map[i][j] = 0;
			}
		}
		this.result_map = [];
		for (var i = 0; i < mapH; i++) {
			this.result_map[i] = [];
			for (var j = 0; j < mapW; j++) {
				this.result_map[i][j] = 0;
			}
		}
	}
}


pacman = new Pacman();
ghost1 = new Ghost();
ghost2 = new Ghost();


// Mode prototype-------------------------- //
function Mode() {
	this.mode,
	this.next,
	this.prev,
	this.p_default_spd,
	this.g_default_spd,
	this.detect_range,
	this.x_point,
	this.des,
	this.win,
	this.loss,
	this.construct = function(_mode, _next, _prev, _p, _g, _d, _x, _des, _win, _loss) {
		this.mode = _mode;
		this.next = _next;
		this.prev = _prev;
		this.p = _p,
		this.g = _g,
		this.d = _d,
		this.x = _x,
		this.des = _des;
		this.win = _win;
		this.loss = _loss;
	},
	this.set = function() {
		p_default_spd = this.p;
		g_default_spd = this.g;
		detect_range = this.d;
		x_point = this.x;
	}
}

var EEZZEE = new Mode();
var HARDCORE = new Mode();
var WATAFUK = new Mode();

EEZZEE.construct('EEZZEE', HARDCORE, WATAFUK, 200, 220, 5, 1,
	'Easy peasy lemon squeezy!',
	'Beat <strong>EEZZEE</strong> mode? Try <strong>HARDCORE</strong> or <strong>WATAFUK</strong> mode for higher score!',
	'Come on! This is the EASIEST MODE!');
HARDCORE.construct('HARDCORE', WATAFUK, EEZZEE, 200, 200, 8, 2,
	'You tried so hard, and got so farrr...',
	'You have SKILLS! Wanna be in <strong>HIGH SCORE BOARD</strong>?. Don\'t worry, we have <strong>WATAFUK</strong> mode for ya!',
	'Don\'t be upset. Try <strong>WATAFUK</strong> mode in <strong>SETTING</strong> and come back here. You will feel better!');
WATAFUK.construct('WATAFUK', EEZZEE, HARDCORE, 160, 80, 10, 3,
	'\"I dunno WATAFUK I am duinnn now!\"',
	'WHAT??? You\'ve beat WATAFUK MODE??? Capture screen and send us for reward!',
	'Try again boiii! Beat this mode for a REAL REWARD!');//

var play_mode = HARDCORE;


// Call functions
// ---------------------------------------------------------- //
mainGif();


// Define functions and events
// ---------------------------------------------------------- //

function start() {
	user.name = (name_input.value).toUpperCase();
	if (!user.name) {
		alert("I know u have a NAME! \nOr friends call you \"BOIII\"???");
		name_input.value = "BOIII";
		return;
	}
	user.updateUser();

	playSound(sound_opening);

	play_mode.set();

	resetGame();

	hideWindows();

	display();

	pacman.start();
	ghost1.start();
	ghost2.start();
}

function resetGame() {
	count_food = 0;
	count_point = 0;
	super_mode = 0;
	reverse_mode = 0;
	output = '';
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
	clearTime();
	pacman.resetAll();
	ghost1.resetAll();
	ghost2.resetAll();
	_dx = -1;
	_dy = 0;
	pacman.spawn(1,1,0,-1);
	ghost1.spawn(13,1,-1,0);
	ghost2.spawn(13,18,0,-1);
	ghost1.initMap();
	ghost2.initMap();
}

function clearTime() {
	intervals.forEach(clearInterval);
	timeouts.forEach(clearTimeout);
	intervals = [];
	timeouts = [];
}

function clearPlayerTime() {
	clearInterval(pacman.time);
	clearInterval(ghost1.time);
	clearInterval(ghost2.time);
}

function hideWindows() {
	nam.classList.toggle('hide');
	main.classList.toggle('hide');
	document.getElementById("name-label").classList.toggle('hide');
	point_div.classList.toggle('hide');
	setting_div.classList.add("hide");
	highscore_div.classList.add("hide");
	help_div.classList.add("hide");
	credit_div.classList.add("hide");
	play_mode_div.classList.add("hide");
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
					nam.innerHTML = '<h2>GAME OVER</h2>' +
									'<p>' + play_mode.loss + '</p>' +
									'<p>---</p>' +
									'<p><strong>' + user.name + '</strong></p>' +
									'   MODE: <strong>' + play_mode.mode + '</strong>';
				}, 1000);
			}
		}
	}
	function checkWin() {
			if (count_food == maxfood) {
				var title = 'YOU WIN';
				if (count_point >= 7000) {
					user.writeHighscore();
					title = 'NEW HIGH SCORE';
				}
				else {
					user.updateWin();
				}
				playSound(sound_opening);
				clearTime();
				blink('blue');
				setTimeout(function() {
					toggleCredit();
					displayHighScore();
				} , 2000);
				setTimeout(function() {
					nam.innerHTML = '<h2>' + title + '</h2>' +
									'<p>' + play_mode.win + '</p>\n' +
									'<p><strong>' + user.name + '</strong></p>' +
									'   MODE: <strong>' + play_mode.mode + '</strong>';
			}, 1000);
		}
	}

	checkGhosts(ghost1, ghost2);
	checkPacman(pacman, ghost1);
	checkPacman(pacman, ghost2);
	checkWin();
}

function bigFruit() {
	var rand = Math.floor((Math.random() * 6) + 1);
	switch (rand) {
		case 1:
		case 2:
			superPacman();
			break;
		case 3:
			boostSpeed(ghost1, 4);
			blink("red");
			break;
		case 4:
			boostSpeed(pacman, 1.8);
			blink("blue");
			break;
		case 5:
			boostSpeed(pacman, 2);
			boostSpeed(ghost1, 2);
			boostSpeed(ghost2, 2);
			blink("blue");
			break;
		case 6:
			boostSpeed(ghost1, 0.8);
			boostSpeed(ghost2, 0.8);
			blink("blue");
			break;
		case 7:
			boostSpeed(pacman, 0.5);
			blink("red");
			break;
		case 8:
			reverseMode();
			break;
	}
}

function boostSpeed(target, multi) {
	target.speed = Math.floor(target.speed / multi);
	clearInterval(target.time);
	target.start();
}

function superPacman() {
	clearPlayerTime();
	change("gold");
	pacman.speed = 100;
	ghost1.speed = 700;
	ghost2.speed = 700;
	super_mode = 1;
	super_div.classList.toggle("hide");
	timeouts.push(setTimeout(function() {
		pacman.start();
		ghost1.start();
		ghost2.start();
	}, 1500));
	setTimeout(function() {
		super_div.classList.toggle("hide");
	}, 1500);
	setTimeout(function() {
		change("gold");
	}, 5000);
	timeouts.push(setTimeout(function() {
		clearPlayerTime();
		super_mode = 0;
		pacman.resetAll();
		ghost1.resetSpeed();
		ghost2.resetSpeed();
		pacman.start();
		ghost1.start();
		ghost2.start();
	}, 6000));
}

function reverseMode() {
	reverse_mode = 1;
	reverse_div.classList.toggle("hide");
	change("red");
	setTimeout(function() {
		reverse_div.classList.toggle("hide");
	}, 1500);
	setTimeout(function() {
		change("red");
		reverse_mode = 0
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
	var time = setInterval(changeClass, 200);
	function changeClass() {
		display_div.classList.toggle(color);
		j++;
		if (j == 5) {
			clearInterval(time);
		}
	}
}

function mainGif() {
	var i = 0;
	var time = setInterval(function() {
		if (i%4 == 0) {
			main.innerHTML = '' +
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
			main.innerHTML = '' +
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
			main.innerHTML = '' +
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
			main.innerHTML = '' +
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
	highscore_div.classList.add("hide");
	help_div.classList.add("hide");
	credit_div.classList.add("hide");
	play_mode_div.classList.add("hide");
	playSound(sound_dot);
}

function togglePlayMode() {
	play_mode_div.classList.toggle("hide");
	playSound(sound_dot);
}

function toggleHelp() {
	help_div.classList.toggle("hide");
	playSound(sound_dot);
}

function toggleHighScore() {
	highscore_div.classList.toggle("hide");
	playSound(sound_dot);
}

function displayHighScore() {
	highscore_div.classList.remove("hide");
	playSound(sound_dot);

	var table = '';

	getHighScore().then(function() {
		for (var score in highscore) {
			for (var time in highscore[score]) {
				var _name = highscore[score][time].name;
				var _mode = highscore[score][time].mode;
				var _score = highscore[score][time].score;
				table = '<tr><td>' + _name + '</td><td>' + _mode + '</td><td>' + _score + '</td></tr>' + table;
			}
		}
		high_score_body.innerHTML = table;
	});
}

function toggleCredit() {
	credit_div.classList.toggle("hide");
	playSound(sound_dot);
}

function soundSetting(flag) {
	if (flag.checked == true)
		sound_mode = 'ON';
	else
		sound_mode = 'OFF';
	playSound(sound_dot);
}

function changeMode(change) {
	if (change == 'prev') {
		play_mode = play_mode.prev;
	}
	else {
		play_mode = play_mode.next;
	}
	var des =  document.getElementById("mode-des");
	des.innerHTML = play_mode.des;
	mode_name.innerHTML = play_mode.mode;
	playSound(sound_dot);
}

// Controls
// ---------------------------------------------------------- //

document.addEventListener("keydown", (event) => {
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
   		case 13:
   			start();
			return;
    }
    if (reverse_mode == 1) {
    	_dx = -_dx;
    	_dy = -_dy;
    }
});

function tap(key) {
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
    if (reverse_mode == 1) {
    	_dx = -_dx;
    	_dy = -_dy;
    }
}

function changeDir() {
	if (brick.indexOf(map[pacman.pos_x + _dx][pacman.pos_y + _dy]) < 0) {
    	pacman.dx = _dx;
    	pacman.dy = _dy;
    }
}



