#!/usr/bin/env node

// Parse Arguments
import minimist from 'minimist';
const args = minimist(process.argv.slice(2));

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
let timezone = null;
if (args.z) {
	timezone = args.z;
} else {
	timezone = moment.tz.guess();
};

// Latitude & Longitude
let latitude = null;
let longitude = null;
if (args['n']) {
	latitude = args['n'];
} else if (args['s']) {
	latitude = args['s'] * (-1);
};
if (args['e']) {
	longitude = args['e'] * (-1);
} else if (args['w']) {
	longitude = args['w'];
};
if (latitude) {
	latitude = Math.round(latitude*100)/100;
} else {
	latitude = 35;
}
if (longitude) {
	longitude = Math.round(longitude*100)/100;
} else {
	longitude = 79;
}

// Fetch
import fetch from 'node-fetch';
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' 
	+ longitude + '&daily=precipitation_hours&current_weather=true&timezone=' + timezone);
const data = await response.json();

// Echo JSON
if (args.j) {
	const jsonPretty = JSON.stringify(data, null, 2);  
	console.log(jsonPretty);
	process.exit(0);
//	if ((args['n'] || args['s']) && (args['e'] || args['w'])) {
//		console.log(data);
//		process.exit(0);
//	} else {
//		console.log('Please provide a latitude and longitude.')
//	}
};

// Response
if (!args.j) {
	const days = args.d;
	const precip_of_d = data.daily.precipitation_hours[days];
	if (days == 0) {
		if (precip_of_d) {
  			console.log("You might need your galoshes today.");
		} else {
			console.log("You will not need your galoshes.");
		}
	} else if (days > 1) {
		if (precip_of_d) {
  			console.log("You might need your galoshes in " + days + " days.");
		} else {
			console.log("You will not need your galoshes in " + days + " days.");
		}
	} else {
		if (precip_of_d) {
  			console.log("You might need your galoshes tomorrow.");
		} else {
			console.log("You will not need your galoshes tomorrow.");
		}
	};
};
