'use strict';

const knex = require('knex');
const logger = require('./logger').child({ name: 'Database' });

let database;

if (process.env.NODE_ENV === 'dev') {
	database = knex({
		client: 'sqlite3',
		connection: {
			filename: './testDatabase.sqlite',
		},
		useNullAsDefault: true,
	});

	logger.info('Starting a local SQLite database.');
} else if (process.env.NODE_ENV === 'prod') {
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
} else if (process.env.NODE_ENV === 'test') {
	database = knex({
		client: 'sqlite',
		connection: ':memory:',
		useNullAsDefault: true,
	});

	logger.info('Starting an in-memory SQLite database.');
}

let tableCalls = [];

tableCalls.push(
	database.schema.hasTable('users').then((exists) => {
		if (!exists) {
			return database.schema.createTable('users', (t) => {
				logger.info('Creating table `users`.');

				t.string('username', 64).primary();
				t.string('password', 64).notNull();
			});
		} else {
			logger.debug('Table `users` already exists. Skipping creation.');

			return null;
		}
	})
);

tableCalls.push(
	database.schema.hasTable('games').then((exists) => {
		if (!exists) {
			return database.schema.createTable('games', (t) => {
				logger.info('Creating table `games`.');

				t.increments('id').primary();
				t.timestamp('started_at').notNull();
				t.timestamp('ended_at').notNull();
				t.string('winner').references('username').inTable('users');
			});
		} else {
			logger.debug('Table `games` already exists. Skipping creation.');

			return null;
		}
	})
);

tableCalls.push(
	database.schema.hasTable('users_in_games').then((exists) => {
		if (!exists) {
			return database.schema.createTable('users_in_games', (t) => {
				logger.info('Creating table `users_in_games`.');

				t.increments('id').primary();
				t.integer('game').references('id').inTable('games');
				t.string('user').references('username').inTable('users');
			});
		} else {
			logger.debug('Table `users_in_games` already exists. Skipping creation.');

			return null;
		}
	})
);

tableCalls.push(
	database.schema.hasTable('languages').then((exists) => {
		if (!exists) {
			return database.schema.createTable('languages', (t) => {
				logger.info('Creating table `languages`.');

				t.increments('id').primary();
				t.string('name').unique().notNull();
			});
		} else {
			logger.debug('Table `languages` already exists. Skipping creation.');

			return null;
		}
	})
);

tableCalls.push(
	database.schema.hasTable('questions').then((exists) => {
		if (!exists) {
			return database.schema.createTable('questions', (t) => {
				logger.info('Creating table `questions`.');

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

			return null;
		}
	})
);

tableCalls.push(
	database.schema.hasTable('questions_in_games').then((exists) => {
		if (!exists) {
			return database.schema.createTable('questions_in_games', (t) => {
				logger.info('Creating table `questions_in_games`.');

				t.increments('id').primary();
				t.integer('game').references('id').inTable('games');
				t.integer('question').references('id').inTable('questions');
			});
		} else {
			logger.debug(
				'Table `questions_in_games` already exists. Skipping creation.'
			);

			return null;
		}
	})
);

tableCalls.push(
	database.schema.hasTable('approximations').then((exists) => {
		if (!exists) {
			return database.schema.createTable('approximations', (t) => {
				logger.info('Creating table `approximations`.');

				t.increments('id').primary();
				t.string('question', 256).unique().notNull();
				t.float('answer').notNull();
				t.integer('lang').references('id').inTable('languages').notNull();
				t.string('author').references('username').inTable('users').notNull();
			});
		} else {
			logger.debug('Table `approximations` already exists. Skipping creation.');

			return null;
		}
	})
);

tableCalls.push(
	database.schema.hasTable('approximations_in_games').then((exists) => {
		if (!exists) {
			return database.schema.createTable('approximations_in_games', (t) => {
				logger.info('Creating table `approximations_in_games`.');

				t.increments('id').primary();
				t.integer('game').references('id').inTable('games');
				t.integer('approximation').references('id').inTable('approximations');
			});
		} else {
			logger.debug(
				'Table `approximations_in_games` already exists. Skipping creation.'
			);

			return null;
		}
	})
);

tableCalls.forEach(async (call) => {
	try {
		await call;
	} catch (err) {
		logger.error('Could not complete table creation due to an error.');
		logger.error(err);
	}
});

logger.info('Database has been initialized.');

module.exports = database;
