import Express from 'express';
import Compression from 'compression';
import Cors from 'cors';
import Helmet from 'helmet';
import BodyParser from 'body-parser';
import ExpressPinoLogger from 'express-pino-logger';

import { Logger } from './logger';

const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV;

const logger = Logger.child({ name: 'Index' });
const expressPino = ExpressPinoLogger({
	logger: logger,
	useLevel: 'debug',
});

const app = Express();

// Sets up middleware
app.use(Cors());
app.use(Helmet());
app.use(Compression());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());
app.use(expressPino);

// Placeholder index response
app.get('/', (req, res) => {
	res.json({
		value: 'Hello There!',
	});
});

if (environment === 'test') {
	module.exports = app;
} else {
	app.listen(port, () =>
		logger.info(`Zizka Backend is running on http://localhost:${port}`)
	);
}
