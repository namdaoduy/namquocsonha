// Initialize Firebase
var config = {
	apiKey: "AIzaSyAOBFuhqnRmGFJypVORkltN0ZwBmtj9eXY",
	authDomain: "pacman-webgame.firebaseapp.com",
	databaseURL: "https://pacman-webgame.firebaseio.com",
	projectId: "pacman-webgame",
	storageBucket: "pacman-webgame.appspot.com",
	messagingSenderId: "544268261623"
};
firebase.initializeApp(config);

var database = firebase.database();

function User() {
	this.name,
	this.score,
	this.mode,
	this.time,
	this.updateUser = function() {
		var _this = this;
		database.ref('allusername').update({['/' + _this.name] : _this.time});
	},
	this.writeHighscore = function() {
		var _this = this;
		database.ref('highscore/' + _this.score).child(_this.time)
			.set({name: _this.name, mode: _this.mode, score: _this.score});
		database.ref('user/' + _this.name).child(_this.time)
			.set({score: _this.score, mode: _this.mode});
	}
}