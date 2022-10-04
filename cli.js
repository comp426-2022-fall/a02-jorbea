#!/usr/bin/env node

// Dependencies
import minimist from 'minimist';
const args = minimist(process.argv.slice(2));
console.log(args);

// Help Message
if (args.h) {
	console.log(
	`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.
	`);
	process.exit(0);
};

// Timezone
import moment from 'moment-timezone';
const timezone = moment.tz.guess();
console.log(timezone);

// Latitude & Longitude
let latitude = null;
let longitude = null;
if (args['n']) {
	latitude = args['n'];
	console.log('-n ' + latitude);
} else if (args['s']) {
	latitude = args['s'];
	console.log('-s ' + latitude);
}
if (args['e']) {
	longitude = args['e'];
	console.log('-e ' + longitude);
} else if (args['w']) {
	longitude = args['w'];
	console.log('-w ' + longitude);
}

// Fetch
import fetch from 'node-fetch';
// const response = await fetch(
	// 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + 
	// '&daily=precipitation_hours&timezone=America%2FNew_York'
// );
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=precipitation_hours&timezone=America%2FNew_York');
const data = await response.json();
console.log(data);

// Response
const days = args.d; 
if (days == 0) {
  console.log("today.");
} else if (days > 1) {
  console.log("in " + days + " days.");
} else {
  console.log("tomorrow.");
}
