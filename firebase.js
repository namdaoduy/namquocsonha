// Firebase
// ---------------------------------------------------------- //

function getHighScore() {
	return database.ref('highscore').orderByKey().once('value').then(function(snapshot) {
		highscore = snapshot.val();
	}, function(error) {
		alert(error);
	});
}

function customMessage() {
	return database.ref('custommess/' + user.name).once('value').then(function(snapshot) {
		custommess = snapshot.val();
	}, function(error) {
		alert(error);
	});
}