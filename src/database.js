'use strict';

const knex = require('knex');

let database;

if (process.env.NODE_ENV !== 'prod') {
	database = knex({
		client: 'sqlite3',
		connection: {
			filename: './testDatabase.sqlite',
		},
		useNullAsDefault: true,
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
		useNullAsDefault: true,
	});
}

database.schema.hasTable('users').then((exists) => {
	if (!exists) {
		return database.schema.createTable('users', (t) => {
			t.increments('id').primary();
			t.string('username', 64).unique();
			t.string('password', 64);
		});
	}
});

database.schema.hasTable('questions').then((exists) => {
	if (!exists) {
		return database.schema.createTable('questions', (t) => {
			t.increments('id').primary();
			t.string('question', 256).unique();
			t.string('correct', 256);
			t.string('wrong0');
			t.string('wrong1');
			t.string('wrong2');
		});
	}
});

module.exports = database;
