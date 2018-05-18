
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
var button = document.getElementsByTagName("button");
var nani_div = document.getElementById("nani");


// Define variables
// ---------------------------------------------------------- //
var maxfood = 150;
var count_food;
var count_point = 0;
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

var cur_stage = 2;

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
var sound_nani = new Audio("sound/sound_nani.mp3");


// Define objects and prototypes
// ---------------------------------------------------------- //
var highscore = {};
var dot = { icon: dot_icon }
var fruit = { icon: fruit_icon }
var pacman;
var ghost1;
var ghost2;


// User prototype--------------------------
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
	this.nani = function() {
		this.time = Date.now();
		var _this = this;
		database.ref('nani').child(_this.time)
			.set({name: _this.name});
	}
}

var user = new User();


// Pacman + Ghost prototype----------------
function Pacman() {
	this.pos_x, 
	this.pos_y,
	this.dx,
	this.dy,
	this.time,
	this.speed,
	this.icon = pacman_icon,
	this.spawn = function(pos) {
		this.pos_x = pos.x;
		this.pos_y = pos.y;
		this.dx = pos.dx;
		this.dy = pos.dy;
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
	this.spawn = function(pos) {
		this.pos_x = pos.x;
		this.pos_y = pos.y;
		this.dx = pos.dx;
		this.dy = pos.dy;
		this.foot = dot_icon;
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


// Mode prototype--------------------------
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


// Stage prototype--------------------------
function Stage() {
	this.maxfood,
	this.lock,
	this.map,
	this.pos1,
	this.pos2,
	this.pos3,
	this.construct = function(_maxfood, _lock, _map, _pos1, _pos2, _pos3) {
		this.maxfood = _maxfood;
		this.lock = _lock;
		this.map = _map;
		this.pos1 = _pos1;
		this.pos2 = _pos2;
		this.pos3 = _pos3;
	},
	this.getMap = function() {
		var _this = this;
		var _map = new Array();
		for (var row in _this.map) {
			_map.push(_this.map[row].slice(0));
		}
		return _map;
	}
}

var stage = new Array();

stage[1] = new Stage();
stage[1].construct(150, 0, 
	[
		['╔','═','═','═','═','═','═','═','═','═','═','═','═','═','═','═','═','═','═','╗'],
		['║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','║'],
		['║','◦','═','═','═','═','═','╗','◦','║','◦','╔','═','◦','◦','◦','◦','║','◦','║'],
		['║','◦','◦','◦','◦','◦','Ѽ','║','◦','║','◦','║','◦','◦','═','═','═','╝','◦','║'],
		['║','◦','◦','◦','◦','◦','◦','║','◦','║','◦','║','◦','◦','◦','◦','◦','◦','◦','║'],
		['╠','═','═','═','═','═','═','╝','◦','║','◦','║','◦','◦','═','═','═','═','◦','║'],
		['║','◦','◦','◦','◦','◦','◦','◦','◦','║','◦','║','◦','◦','◦','◦','◦','◦','◦','║'],
		['║','◦','═','═','═','═','═','═','═','╝','◦','║','◦','═','═','═','═','═','═','╣'],
		['║','◦','◦','◦','◦','◦','◦','◦','◦','◦','Ѽ','◦','◦','◦','◦','◦','◦','◦','◦','║'],
		['║','◦','═','═','═','═','═','═','═','═','◦','═','═','◦','╔','═','═','═','═','╣'],
		['║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','║','◦','◦','◦','◦','║'],
		['║','◦','╔','═','═','═','═','═','═','═','◦','═','═','◦','║','Ѽ','◦','◦','◦','║'],
		['║','◦','║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','╚','═','═','═','◦','║'],
		['║','◦','◦','◦','◦','◦','◦','║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','║'],
		['╚','═','═','═','═','═','═','╩','═','═','═','═','═','═','═','═','═','═','═','╝']	
	],
	{x: 1, y: 1, dx: 0, dy: -1},
	{x: 13, y: 1, dx: -1, dy: 0},
	{x: 13, y: 18, dx: 0, dy: -1});

stage[2] = new Stage();
stage[2].construct(157, 0, 
	[
		['╔','═','═','═','═','═','═','═','╦','═','═','╦','═','═','═','═','═','═','═','╗'],
		['║','◦','◦','◦','Ѽ','◦','◦','◦','║','◦','◦','║','◦','◦','◦','Ѽ','◦','◦','◦','║'],
		['║','◦','═','═','═','═','═','◦','║','◦','◦','║','◦','═','═','═','═','═','◦','║'],
		['║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','║'],
		['║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','║'],
		['║','◦','═','═','═','═','╗','◦','═','═','═','═','◦','╔','═','═','═','═','◦','║'],
		['║','◦','Ѽ','◦','◦','◦','║','◦','◦','◦','Ѽ','◦','◦','║','◦','◦','◦','◦','◦','║'],
		['╠','═','═','═','◦','◦','║','◦','═','═','═','═','◦','║','◦','◦','═','═','═','╣'],
		['║','◦','◦','◦','◦','◦','║','◦','◦','◦','◦','◦','◦','║','◦','◦','◦','◦','◦','║'],
		['║','◦','═','═','═','═','╝','◦','╔','═','═','╗','◦','╚','═','═','═','═','◦','║'],
		['║','◦','◦','◦','◦','◦','◦','◦','║','◦','◦','║','◦','◦','◦','◦','◦','◦','◦','║'],
		['║','◦','◦','◦','◦','◦','◦','◦','║','◦','◦','║','◦','◦','◦','◦','◦','◦','◦','║'],
		['║','◦','═','═','═','═','═','═','╝','◦','◦','╚','═','═','═','═','═','═','◦','║'],
		['║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','║'],
		['╚','═','═','═','═','═','═','═','═','═','═','═','═','═','═','═','═','═','═','╝']	
	],
	{x: 10, y: 9, dx: 0, dy: -1},
	{x: 1, y: 9, dx: -1, dy: 0},
	{x: 1, y: 10, dx: -1, dy: 0});