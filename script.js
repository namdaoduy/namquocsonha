var nam = document.getElementById("nam");

var count = 1;

var map = [
	['╔','═','═','═','═','═','═','═','═','═','═','═','═','═','╗'],
	['║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','║'],
	['║','◦','═','═','═','═','═','╗','◦','║','◦','╔','═','◦','║'],
	['║','◦','◦','◦','◦','◦','◦','║','◦','║','◦','║','◦','◦','║'],
	['║','◦','◦','◦','◦','◦','◦','║','◦','║','◦','║','◦','◦','║'],
	['╠','═','═','═','═','═','═','╝','◦','║','◦','║','◦','◦','║'],
	['║','◦','◦','◦','◦','◦','◦','◦','◦','║','◦','║','◦','◦','║'],
	['║','◦','═','═','═','═','═','═','═','╝','◦','╚','═','◦','║'],
	['║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','║'],
	['║','◦','═','═','═','═','═','═','═','═','◦','═','═','◦','║'],
	['║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','║'],
	['║','◦','╔','═','═','═','═','═','═','═','◦','═','═','◦','║'],
	['║','◦','║','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','◦','║'],
	['║','◦','◦','◦','◦','◦','◦','║','◦','◦','◦','◦','◦','◦','║'],
	['╚','═','═','═','═','═','═','╩','═','═','═','═','═','═','╝']	
];

map[1][1] = '☺';
map[13][13] = '☻';

var brick = "╬╩╦╣╠╝╚╗╔║═";

var output = '';

var pacman = {
	pos_x: 1, 
	pos_y: 1,
	dx: 1,
	dy: 0,
	move: function() {
		map[this.pos_x][this.pos_y] = ' ';
		this.pos_x += this.dx;
		this.pos_y += this.dy;
		map[this.pos_x][this.pos_y] = '☺';
		display();
	}
};

var ghost = {
	pos_x: 13, 
	pos_y: 13,
	dx: -1,
	dy: 0,
	foot: '◦',
	move: function() {
		map[this.pos_x][this.pos_y] = this.foot;
		this.pos_x += this.dx;
		this.pos_y += this.dy;
		this.foot = map[this.pos_x][this.pos_y];
		map[this.pos_x][this.pos_y] = '☻';
		display();
	}
};

function start() {
	display();

	// pacman move
	var time1 =  setInterval(loopPacman, 300);
	function loopPacman() {
		if (brick.indexOf(map[pacman.pos_x + pacman.dx][pacman.pos_y + pacman.dy]) < 0){
			pacman.move();
		}
	}

	// ghost move
	var time2 = setInterval(loopGhost, 300);
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
		}
	}

	var time3 = setInterval(loopCheck, 1);
	function loopCheck() {
		if (pacman.pos_x == ghost.pos_x && pacman.pos_y == ghost.pos_y) {
			clearInterval(time1);
			clearInterval(time2);
			clearInterval(time3);
			map[pacman.pos_x][pacman.pos_y] = '۩';
			display();
			
		}
	}

}

function display() {
	output = '';
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			output += map[i][j];
		}
		output += '<br>';
	}	
	nam.innerHTML = output;
}

document.addEventListener("keydown", (event) => {
    switch (event.keyCode) {
    	case 39:
    		pacman.dx = 0;
    		pacman.dy = 1;
    		break;
    	case 37:
    		pacman.dx = 0;
    		pacman.dy = -1;
    		break;
    	case 38:
    		pacman.dx = -1;
    		pacman.dy = 0;
    		break;
    	case 40:
    		pacman.dx = 1;
    		pacman.dy = 0;
    		break;
    }
});
