const logger = require('pino')({
	name: 'Žižka Backend',
	level: process.env.PINO_LEVEL || 'info',
	prettyPrint: {
		colorize: true,
		translateTime: true,
	},
});

module.exports = logger;
