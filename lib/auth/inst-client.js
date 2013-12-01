module.exports.install = function() {
	var configPath = path.join(process.env.HOME, '.gcal.json'),
		client_id, client_secret;

	if (!client_id) {
		console.warn('You will use default client id, it may be out of date or expired.'.yellow);
		console.warn('You can go https://code.google.com/apis/console/?noredirect#:access to get your own client id.'.yellow);
		client_id = "826031576233-ugndniv49ps67itvsk6mihjpub59sk7c.apps.googleusercontent.com";
		client_secret = "V_8f_5n-k_2uXV0KhO1GEje7";
	}


}