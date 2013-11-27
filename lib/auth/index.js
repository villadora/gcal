var readline = require('readline'),
	url = require('url'),
	http = require('http'),
	path = require('path'),
	fs = require('fs'),
	googleapis = require('googleapis'),
	OAuth2Client = googleapis.OAuth2Client;


var configPath = path.join(process.env.HOME, '.gcal.json'),
	client_id, client_secret;

if (fs.existsSync(configPath)) {
	var config = require(configPath);
	client_id = config.client_id;
	client_secret = config.client_secret;
}

// Client ID and client secret are available at
// https://code.google.com/apis/console
var REDIRECT_URL = 'http://localhost:10678/';

var codeServer = http.createServer(function(req, res) {
	console.log(req.url);
	res.writeHead(200, {
		"Content-Type": "text/plain"
	});
	res.write("Get Token!");
	res.end();
	codeServer.close();
});


codeServer.listen(10678);

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function getAccessToken(oauth2Client, callback) {
	// generate consent page url
	var url = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: 'https://www.googleapis.com/auth/calendar'
	});

	console.log('Visit the url: ', url);
	/**
	rl.question('Enter the code here:', function(code) {

		// request access token
		oauth2Client.getToken(code, function(err, tokens) {
			// set tokens to the client
			// TODO: tokens should be set by OAuth2 client.
			oauth2Client.credentials = tokens;
			callback && callback();
		});
	});
**/
}

function getUserProfile(client, authClient, userId, callback) {
	client
		.plus.people.get({
			userId: userId
		})
		.withAuthClient(authClient)
		.execute(callback);
}

function printUserProfile(err, profile) {
	if (err) {
		console.log('An error occurred');
	} else {
		console.log(profile.displayName, ':', profile.tagline);
	}
}

// load google plus v1 API resources and methods

var oauth2Client =
	new OAuth2Client(client_id, client_secret, REDIRECT_URL);

// retrieve an access token
getAccessToken(oauth2Client, function() {
	// retrieve user profile
	getUserProfile(
		client, oauth2Client, 'me', printUserProfile);
});