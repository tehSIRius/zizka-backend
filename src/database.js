'use strict';

const knex = require('knex');
const logger = require('./logger').child({ name: 'Database' });

let database;

if (process.env.NODE_ENV !== 'prod') {
	database = knex({
		client: 'sqlite3',
		connection: {
			filename: './testDatabase.sqlite',
		},
		useNullAsDefault: true,
	});

	logger.info('Starting a local database.');
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

	logger.info('Starting Heroku Postgres database.');
}

database.schema.hasTable('users').then((exists) => {
	if (!exists) {
		logger.info('Creating table `users`.');

		return database.schema.createTable('users', (t) => {
			t.string('username', 64).primary();
			t.string('password', 64).notNull();
		});
	} else {
		logger.debug('Table `users` already exists. Skipping creation.');
	}
});

database.schema.hasTable('languages').then((exists) => {
	if (!exists) {
		logger.info('Creating table `languages`.');

		return database.schema.createTable('languages', (t) => {
			t.increments('id').primary();
			t.string('name').unique().notNull();
		});
	} else {
		logger.debug('Table `languages` already exists. Skipping creation.');
	}
});

database.schema.hasTable('questions').then((exists) => {
	if (!exists) {
		logger.info('Creating table `questions`.');

		return database.schema.createTable('questions', (t) => {
			t.increments('id').primary();
			t.string('question', 256).unique().notNull();
			t.string('answer', 256).notNull();
			t.string('wrong0').notNull();
			t.string('wrong1').notNull();
			t.string('wrong2').notNull();
			t.integer('lang').references('id').inTable('languages').notNull();
			t.string('author').references('username').inTable('users').notNull();
		});
	} else {
		logger.debug('Table `questions` already exists. Skipping creation.');
	}
});

database.schema.hasTable('approximations').then((exists) => {
	if (!exists) {
		logger.info('Creating table `approximations`.');

		return database.schema.createTable('approximations', (t) => {
			t.increments('id').primary();
			t.string('question', 256).unique().notNull();
			t.float('answer').notNull();
			t.integer('lang').references('id').inTable('languages').notNull();
			t.string('author').references('username').inTable('users').notNull();
		});
	} else {
		logger.debug('Table `approximations` already exists. Skipping creation.');
	}
});

logger.info('Database has been initialized.');

module.exports = database;
