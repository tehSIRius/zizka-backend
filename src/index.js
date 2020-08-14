'use strict';

// Variables
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV;

// Express and middleware
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

// Creates the Express app
const app = express();

// Sets up logging
const logger = require('./logger').child({ name: 'Index' });
const expressPino = require('express-pino-logger')({
	logger: logger,
	useLevel: 'debug',
});

// Assigns middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(bodyParser.json());
app.use(expressPino);

// Sets index route
app.get('/', (req, res) => {
	res.json({
		value: 'Hello There!',
	});
});

// Server is only started if it is not in a test environment
// Otherwise it is exported to be tested
if (environment === 'test') {
	module.exports = app;
} else {
	app.listen(port, () =>
		logger.info(`Žižka Backend is running on http://localhost:${port}`)
	);
}
