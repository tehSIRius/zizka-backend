import pino from 'pino';

export default pino({
	name: 'Zizka Backend',
	level: process.env.LOG_LEVEL ?? 'info',
	prettyPrint: {
		colorize: true,
		translateTime: true,
	},
});
