import Knex from 'knex';

import { Logger } from './logger';

const logger = Logger.child({ name: 'Database' });
let database: Knex;

if (process.env.NODE_ENV === 'dev') {
	// Creates and connects to a local sqlite file
	database = Knex({
		client: 'sqlite3',
		connection: {
			filename: './testDatabase.sqlite',
		},
		useNullAsDefault: true,
	});

	logger.info('Starting a local SQLite database.');
} else if (process.env.NODE_ENV === 'prod') {
	// Connects to a Heroku PG database
	database = Knex({
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
} else {
	// Creates an in-memory database. Mostly for testing
	database = Knex({
		client: 'sqlite3',
		connection: ':memory:',
		useNullAsDefault: true,
	});
}

const dbCommands: Promise<void>[] = [];

database.schema.hasTable('users').then((exists) => {
	if (!exists) {
		dbCommands.push(
			database.schema.createTable('users', (table) => {
				logger.info('Creating table `users`.');

				table.string('username', 64).primary();
				table.string('password', 64).notNullable();
			})
		);
	} else {
		logger.info('Table `users` already exists. Skipping creation.');
	}
});

database.schema.hasTable('games').then((exists) => {
	if (!exists) {
		dbCommands.push(
			database.schema.createTable('games', (table) => {
				logger.info('Creating table `games`.');

				table.increments('id').primary();
				table.timestamp('started_at').notNullable();
				table.timestamp('ended_at').notNullable();
				table.string('winner').references('username').inTable('users');
			})
		);
	} else {
		logger.info('Table `games` already exists. Skipping creation.');
	}
});

database.schema.hasTable('users_in_games').then((exists) => {
	if (!exists) {
		dbCommands.push(
			database.schema.createTable('users_in_games', (table) => {
				logger.info('Creating table `users_in_games`.');

				table.increments('id').primary();
				table.integer('game').references('id').inTable('games');
				table.string('user').references('username').inTable('users');
			})
		);
	} else {
		logger.info('Table `users_in_games` already exists. Skipping creation.');
	}
});

database.schema.hasTable('languages').then((exists) => {
	if (!exists) {
		dbCommands.push(
			database.schema.createTable('languages', (table) => {
				logger.info('Creating table `languages`.');

				table.increments('id').primary();
				table.string('name').unique().notNullable();
			})
		);
	} else {
		logger.info('Table `languages` already exists. Skipping creation.');
	}
});

database.schema.hasTable('questions').then((exists) => {
	if (!exists) {
		dbCommands.push(
			database.schema.createTable('questions', (table) => {
				logger.info('Creating table `questions`.');

				table.increments('id').primary();
				table.string('question', 256).unique().notNullable();
				table.string('answer', 256).notNullable();
				table.string('wrong0').notNullable();
				table.string('wrong1').notNullable();
				table.string('wrong2').notNullable();
				table.string('wrong3').notNullable();
				table.integer('lang').references('id').inTable('languages');
				table.string('author').references('username').inTable('users');
			})
		);
	} else {
		logger.info('Table `questions` already exists. Skipping creation.');
	}
});

database.schema.hasTable('questions_in_games').then((exists) => {
	if (!exists) {
		dbCommands.push(
			database.schema.createTable('questions_in_games', (table) => {
				logger.info('Creating table `questions_in_games`.');

				table.increments('id').primary();
				table.integer('game').references('id').inTable('games');
				table.integer('question').references('id').inTable('questions');
			})
		);
	} else {
		logger.info(
			'Table `questions_in_games` already exists. Skipping creation.'
		);
	}
});

database.schema.hasTable('approximations').then((exists) => {
	if (!exists) {
		dbCommands.push(
			database.schema.createTable('approximations', (table) => {
				logger.info('Creating table `approximations`.');

				table.increments('id').primary();
				table.string('question', 256).unique().notNullable();
				table.float('answer').notNullable();
				table.integer('lang').references('id').inTable('languages');
				table.string('author').references('username').inTable('users');
			})
		);
	} else {
		logger.info('Table `approximations` already exists. Skipping creation.');
	}
});

database.schema.hasTable('approximations_in_games').then((exists) => {
	if (!exists) {
		dbCommands.push(
			database.schema.createTable('approximations_in_games', (table) => {
				logger.info('Creating table `approximations_in_games`');

				table.increments('id').primary();
				table.integer('game').references('id').inTable('games');
				table
					.integer('approximation')
					.references('id')
					.inTable('approximations');
			})
		);
	} else {
		logger.info(
			'Table `approximations_in_games` already exists. Skipping creation.'
		);
	}
});

// Executes only when tests are not running.
// For testing the databsae is mocked.
if (process.env.NODE_ENV !== 'test') {
	// Creates or updates database tables
	dbCommands.forEach(async (call) => {
		try {
			await call;
		} catch (err) {
			logger.error('Could not complete database command due to an error.');
			logger.error(err);
		}
	});
}

export { database as Database };
