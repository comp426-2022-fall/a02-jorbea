#!/usr/bin/env node

// Parse Arguments
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

// Echo JSON
if (args.j) {
	console.log(args);
	process.exit(0);
}


// Timezone
import moment from 'moment-timezone';
let timezone = null;
if (args.z) {
	timezone = args.z;
} else {
	timezone = moment.tz.guess();
}
console.log(timezone);

// Latitude & Longitude
let latitude = null;
let longitude = null;
if (args['n']) {
	latitude = args['n'];
	console.log('-n ' + latitude);
} else if (args['s']) {
	latitude = args['s'] * (-1);
	console.log('-s ' + latitude);
}
if (args['e']) {
	longitude = args['e'] * (-1);
	console.log('-e ' + longitude);
} else if (args['w']) {
	longitude = args['w'];
	console.log('-w ' + longitude);
}

// Fetch
import fetch from 'node-fetch';
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=precipitation_hours&timezone=America%2FNew_York');
const data = await response.json();
console.log(data);

// Response
let days = null;
if (args.d) {
	days = args.d;
} else {
	days = data['daily']['precipitation_hours'];
}
console.log(days);
if (days == 0) {
  console.log("You might need your galoshes today.");
} else if (days > 1) {
  console.log("You might need your galoshes in " + days + " days.");
} else {
  console.log("You might need your galoshes tomorrow.");
}
