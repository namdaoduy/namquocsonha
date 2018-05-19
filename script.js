
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
	start_button.setAttribute("onclick", "backToMenu()");
	user.updateUser();
	playSound(sound_opening);
	play_mode.set();
	resetGame();
	hideWindows();
	display();
	stage_num_div.classList.remove("hide");
	setTimeout(function() {
		stage_num_div.classList.add("hide");
	}, 1500);
	timeouts.push(setTimeout(function() {
		pacman.start();
		ghost1.start();
		ghost2.start();
	}, 2000));
}

function backToMenu() {
	nam.classList.add('hide');
	main.classList.remove('hide');
	document.getElementById("name-label").classList.remove('hide');
	point_div.classList.add('hide');
	setting_div.classList.add("hide");
	highscore_div.classList.add("hide");
	help_div.classList.add("hide");
	credit_div.classList.add("hide");
	play_mode_div.classList.add("hide");
	clearTime();
	mainGif();
	count_point = 0;
	start_button.setAttribute("onclick", "start()");
}

function resetGame() {
	count_food = 0;
	if (cur_stage == 1) {
		count_point = 0;
	}
	document.querySelector('#stage-num h3').innerHTML = 'STAGE ' + cur_stage;
	maxfood = stage[cur_stage].maxfood;
	super_mode = 0;
	reverse_mode = 0;
	output = '';
	map = stage[cur_stage].getMap();
	clearTime();
	pacman.resetAll();
	ghost1.resetAll();
	ghost2.resetAll();
	_dx = -1;
	_dy = 0;
	pacman.spawn(stage[cur_stage].pos1);
	ghost1.spawn(stage[cur_stage].pos2);
	ghost2.spawn(stage[cur_stage].pos3);
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
	nam.classList.remove('hide');
	main.classList.add('hide');
	document.getElementById("name-label").classList.add('hide');
	point_div.classList.remove('hide');
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
				cur_stage = 1;
				map[_pacman.pos_x][_pacman.pos_y] = '۩';
				if (Math.floor(Math.random() * 25) == 1) {
					nani();
					setTimeout(function() {
						nam.innerHTML = '<h2>EASTER EGG</h2>' +
										'<p><em>\"YOU\'RE ALREADY DEAD INSIDE!\"</em></p>' +
										'<p>---</p>' +
										'<p><strong>' + user.name + '</strong></p>' +
										'   MODE: <strong>' + play_mode.mode + '</strong>';
					}, 6700);
				}
				else {
					playSound(sound_dead);
					blink('red');
					display();
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
				cur_stage++;
				start_button.setAttribute("onclick", "start()");
				playSound(sound_opening);
				clearTime();
				blink('blue');
				setTimeout(function() {
					toggleCredit();
					displayHighScore();
				} , 2000);
				setTimeout(function() {
					nam.innerHTML = '<h2>' + title + '</h2>' +
									'<p>' + play_mode.win + '</p>' +
									'<p>Press START to play <strong>STAGE ' + cur_stage + '</strong></p>\n' +
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

function nani() {
	user.nani();
	for (var i in button)
		button[i].disabled = true;
	nani_div.classList.remove("hide");
	var pac = document.getElementById("nani-pac");
	var gho = document.getElementById("nani-gho");
	var i = 0;
	setTimeout(function() {
		var time = setInterval(function() {
			gho.style.right = 500 - i + 'px';
			i+=70;
			if (i > 350) {
				clearInterval(time);
			}
		}, 20);
		playSound(sound_nani);
	}, 3000);
	
	setTimeout(function() {
		nani_div.innerHTML = '<h3 style="margin-left:0px">"Omae wa mou shindeiru!"</h3>' + nani_div.innerHTML;
	}, 3300);
	setTimeout(function() {
		nani_div.innerHTML += '<h3 style="margin-right:0px">"NÁ NỈ???"</h3>';
	}, 5300);
	setTimeout(function() {
		nani_div.removeChild(document.querySelector('#nani h3'));
		nani_div.removeChild(document.querySelector('#nani h3'));
		nani_div.classList.add("hide");
		for (var i in button)
			button[i].disabled = false;
		blink("red");
		display();
	}, 5700);
}

function bigFruit() {
	var rand = Math.floor((Math.random() * 8) + 1);
	switch (rand) {
		case 1:
		case 2:
			superPacman();
			break;
		case 3:
			boostSpeed(ghost1, 4);
			reStart();
			blink("red");
			break;
		case 4:
			boostSpeed(pacman, 2);
			reStart();
			blink("blue");
			break;
		case 5:
			boostSpeed(pacman, 2);
			boostSpeed(ghost1, 2);
			boostSpeed(ghost2, 2);
			reStart();
			blink("blue");
			break;
		case 6:
			boostSpeed(ghost1, 0.8);
			boostSpeed(ghost2, 0.8);
			reStart();
			blink("blue");
			break;
		case 7:
			boostSpeed(pacman, 0.8);
			reStart();
			blink("red");
			break;
		case 8:
			reverseMode();
			break;
	}
	fruitModeDisplay(rand);
	fruit_div.classList.toggle("hide");
	setTimeout(function() {
		fruit_div.classList.toggle("hide");
	}, 1500);
}

function boostSpeed(target, multi) {
	target.speed = Math.floor(target.speed / multi);
}

function reStart() {
	clearPlayerTime();
	timeouts.push(setTimeout(function() {
		pacman.start();
		ghost1.start();
		ghost2.start();
	}, 1500));
}

function superPacman() {
	clearPlayerTime();
	change("gold");
	pacman.speed = 100;
	ghost1.speed = 700;
	ghost2.speed = 700;
	super_mode = 1;
	timeouts.push(setTimeout(function() {
		pacman.start();
		ghost1.start();
		ghost2.start();
	}, 1500));
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
	change("red");
	clearPlayerTime();
	timeouts.push(setTimeout(function() {
		pacman.start();
		ghost1.start();
		ghost2.start();
	}, 1500));
	setTimeout(function() {
		change("red");
		reverse_mode = 0
	}, 6000);
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
		if (i == 6) {
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
	intervals.push(setInterval(function() {
		if (i%4 == 0) {
			main.innerHTML = '' +
				' █▀█ ███ ▄███▀ █▄ ▄█ █▀█ █▄ █\n' +
				' ███ █▀█ ███▄  █████ ███ ████\n' +
				' █   █▀█ ▀████ █ ▀ █ █ █ █ ▀█\n\n' +
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
				' ███ █▀█ ███▄  █████ ███ ████\n' +
				' █   █▀█ ▀████ █ ▀ █ █ █ █ ▀█\n\n' +
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
				' ███ █▀█ ███▄  █████ ███ ████\n' +
				' █   █▀█ ▀████ █ ▀ █ █ █ █ ▀█\n\n' +
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
				' ███ █▀█ ███▄  █████ ███ ████\n' +
				' █   █▀█ ▀████ █ ▀ █ █ █ █ ▀█\n\n' +
				'     ▒▒▒▒▒     ▄████▄       \n' +
				'    ▒▀ ▒▀ ▒   ███▄█▀        \n' +
				'    ▒▒▒▒▒▒▒  ▐████   █   █   █\n' +
				'    ▒▒▒▒▒▒▒   █████▄        \n' +
				'    ▒ ▒ ▒ ▒    ▀████▀       \n\n' +
				'     Press START to play\n';	
		}
		i++;
	}, 400));
}

function fruitModeDisplay(mode) {
	var name = document.querySelector('#fruit-mode h3');
	var des = document.querySelector('#fruit-mode h4');
	switch (mode) {
		case 1:
		case 2:
			name.innerHTML = '- SUPER MODE -';
			des.innerHTML = 'EAT THE GHOST NOW';
			break;
		case 3:
			name.innerHTML = 'GHOST FASTER';
			des.innerHTML = 'RUN FROM IT';
			break;
		case 4:
			name.innerHTML = 'BOOST';
			des.innerHTML = 'FASTER PACMAN';
			break;
		case 5:
			name.innerHTML = 'FLASHHH';
			des.innerHTML = 'EVERY ONE FAST';
			break;
		case 6:
			name.innerHTML = 'GHOST SLOWER';
			des.innerHTML = 'BLEHHHH~';
			break;
		case 7:
			name.innerHTML = 'PACMAN SLOWER';
			des.innerHTML = 'THIS IS POISON!';
			break;
		case 8:
			name.innerHTML = 'REVERSE MODE';
			des.innerHTML = 'MOVE BACKWARD';
			break;
	}
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


// Else
// ---------------------------------------------------------- //

function loadSound() {
	playSound(sound_opening);
	playSound(sound_dot);
	playSound(sound_fruit);
	playSound(sound_dead);
	playSound(sound_ghost);
	playSound(sound_nani);
	sound_opening.pause();
	sound_opening.currentTime = 0;
	sound_dot.pause();
	sound_dot.currentTime = 0;
	sound_fruit.pause();
	sound_fruit.currentTime = 0;
	sound_dead.pause();
	sound_dead.currentTime = 0;
	sound_ghost.pause();
	sound_ghost.currentTime = 0;
	sound_nani.pause();
	sound_nani.currentTime = 0;
}