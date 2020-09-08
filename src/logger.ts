import Pino from 'pino';

export const Logger = Pino({
	name: 'Zizka Backend',
	level: process.env.LEVEL || 'info',
	prettyPrint: {
		colorize: true,
		translateTime: true,
	},
});
