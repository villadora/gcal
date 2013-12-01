#!/usr/bin/env node

var colors = require('colors');


var auth = require('../lib/auth')(function(err, client) {
	if (err) return console.error(err.toString().red);
	console.log('done');
});