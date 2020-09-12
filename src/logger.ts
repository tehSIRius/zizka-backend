import Pino from 'pino';

export default Pino({
	name: 'Zizka Backend',
	level: process.env.LEVEL || 'info',
	prettyPrint: {
		colorize: true,
		translateTime: true,
	},
});
