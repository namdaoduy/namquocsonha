// Firebase
// ---------------------------------------------------------- //

function getHighScore() {
	return database.ref('highscore').orderByKey().once('value').then(function(snapshot) {
		highscore = snapshot.val();
	}, function(error) {
		alert(error);
	});
}
