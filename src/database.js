const knex = require('knex');

let database;

if (process.env.NODE_ENV !== 'production') {
	database = knex({
		client: 'sqlite3',
		connection: {
			filename: './testDatabase.sqlite',
		},
	});
} else {
	database = knex({
		client: 'pg',
		connection: {
			host: process.env.PG_HOST,
			user: process.env.PG_USER,
			password: process.env.PG_PASSWORD,
			database: process.env.PG_DB,
			charset: 'utf8',
		},
	});
}

module.exports = database;
