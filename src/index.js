'use strict';

// Variables used for setup
const port = 3000;

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
app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () =>
	console.log(`Example app listening at http://localhost:${port}`)
);
