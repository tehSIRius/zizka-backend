'use strict';

// Variables
const port = 3000;
const environment = process.env.NODE_ENV;

// Express and middleware
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

// Creates the Express app
const app = express();

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

// Sets index route
app.get('/', (req, res) =>
	res.json({
		value: 'Hello There!',
	})
);

// Server is only started if it is not in a test environment
if (environment === 'test') {
	module.exports = app;
} else {
	app.listen(port, () =>
		console.log(`Example app listening at http://localhost:${port}`)
	);
}
