'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10;

const database = require('../database');
const logger = require('../logger').child({ name: 'Database Controller ' });

class DatabaseController {
	/**
	 * Tries to add a new user to the database. In case of invalid input an exception is raised.
	 *
	 * @param {String} username - Name of the new user. Username is the primary key.
	 * @param {String} password - Plain text password to be hashed.
	 */
	async addUser(username, password) {
		logger.info(`Trying to add new user ${username} to the database.`);

		if (
			typeof username !== 'string' ||
			username.trim() === '' ||
			(await this.isUsernameDuplicate(username))
		) {
			logger.warn('Could not add user due to username being invalid.');

			throw 'Username is empty, not a string or duplicate.';
		}

		if (typeof password !== 'string' || password.trim() === '') {
			logger.warn('Could not add user due to password being invalid.');

			throw 'Password must be a non-empty string.';
		}

		let hashedPass = await new Promise((resolve, reject) => {
			bcrypt.hash(password, saltRounds, (err, hash) => {
				if (err) {
					reject(err);
				}

				resolve(hash);
			});
		});

		database('users').insert({
			username: username,
			password: hashedPass,
		});
	}

	/**
	 * Determines if a username is already in the database
	 *
	 * @param {String} username - Username to be checked
	 *
	 * @returns
	 * Boolean - Is this username duplicate?
	 */
	async isUsernameDuplicate(username) {
		let result = await database('users').select('username').where({
			username: username,
		});

		logger.debug(`Username ${username} is duplicate: ${result.length > 0}`);

		return result.length > 0;
	}
}

module.exports = DatabaseController;
