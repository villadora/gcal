var readline = require('readline'),
	url = require('url'),
	http = require('http'),
	path = require('path'),
	colors = require('colors'),
	querystring = require('querystring'),
	open = require('open'),
	fs = require('fs'),
	googleapis = require('googleapis').discover('calendar', 'v3'),
	OAuth2Client = googleapis.OAuth2Client;

// Client ID and client secret are available at
// https://code.google.com/apis/console
var REDIRECT_URL = 'http://localhost:10678/',
	TIMEOUT = 5 * 60 * 1000,
	oauth2Client;


module.exports = function(callback) {

	var configPath = path.join(process.env.HOME, '.gcal'),
		client_id, client_secret, access_code;

	if (fs.existsSync(configPath)) {
		try {
			var config = JSON.parse(fs.readFileSync(configPath));
			client_id = config.client_id;
			client_secret = config.client_secret;
			access_code = config.access_code;
		} catch (e) {

		}
	}

	if (!client_id) {
		console.warn('You will use default client id, it may be out of date or expired.'.yellow);
		console.warn('You can go https://code.google.com/apis/console/?noredirect#:access to get your own client id.'.yellow);
		client_id = "826031576233-ugndniv49ps67itvsk6mihjpub59sk7c.apps.googleusercontent.com";
		client_secret = "V_8f_5n-k_2uXV0KhO1GEje7";
	}

	// load google plus v1 API resources and methods
	oauth2Client = oauth2Client ||
		new OAuth2Client(client_id, client_secret, REDIRECT_URL);

	if (access_code) {
		// request access token
		return oauth2Client.getToken(access_code, function(err, tokens) {
			// set tokens to the client
			// TODO: tokens should be set by OAuth2 client.
			oauth2Client.credentials = tokens;
			callback && callback(oauth2Client);
		});
	}


	// Get access code
	// start sever for redirect
	var codeServer = http.createServer(function(req, res) {
		var code = querystring.parse(url.parse(req.url).query).code
		console.log(req.url, code);
		res.writeHead(200, {
			"Content-Type": "text/plain",
			'Connection': 'close'
		});

		res.write("Get Token!");
		res.end();

		process.nextTick(function() {
			codeServer.close();
			var config = {
				client_id: client_id,
				client_secret: client_secret,
				access_code: code
			};

			fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

			// request access token
			oauth2Client.getToken(code, function(err, tokens) {
				// set tokens to the client
				oauth2Client.credentials = tokens;
				callback && callback(null, oauth2Client);
			});
		});
	});

	codeServer.maxConnections = 1;
	codeServer.listen(10678);

	// generate consent page url
	var grantUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: 'https://www.googleapis.com/auth/calendar'
	});

	console.log('Visit the url to get accessToken: ', grantUrl);
	open(grantUrl);
	setTimeout(function() {
		callback && callback("Timeout");
	}, TIMEOUT);

};