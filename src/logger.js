'use strict';

const logger = require('pino')({
	name: 'Žižka Backend',
	level: process.env.LEVEL || 'info',
	prettyPrint: {
		colorize: true,
		translateTime: true,
	},
});

module.exports = logger;
