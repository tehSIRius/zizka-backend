import Bcrypt from 'bcrypt';

import { Logger } from '../logger';
import { Database } from '../database';

const logger = Logger.child({ name: 'Database Controller' });
const saltRounds = 10;

export class DatabaseController {
	/**
	 * Tries to add an user to the database.
	 *
	 * @param username - Name of the player
	 * @param password - Password of the user, will be hashed
	 *
	 * @returns Was the operation successful?
	 */
	async addUser(username: string, password: string): Promise<boolean> {
		logger.info(`Trying to add new user ${username} to the database.`);

		let possibleDuplicate: string[] = [];

		try {
			possibleDuplicate = await Database('users')
				.select('username')
				.where({ username: username });
		} catch (err) {
			logger.error(
				`Could not search for username ${username} in the database.`
			);
			logger.error(err);

			possibleDuplicate = [];
		}

		if (username.trim() === '') {
			logger.warn(`Username ${username} is invalid.`);

			throw 'Username must not be empty!';
		}

		if (possibleDuplicate.length > 0) {
			logger.warn(`Username ${username} is already taken!.`);

			throw 'Username is already taken!';
		}

		if (password.trim() === '') {
			logger.warn('Could not add user due to password being empty.');

			throw 'Password must not be empty!';
		}

		const hashedPass = await new Promise((resolve, reject) => {
			Bcrypt.hash(password, saltRounds, (err, hash) => {
				if (err) {
					reject(err);
				}

				resolve(hash);
			});
		});

		let dbUsername: string;

		try {
			await Database('users').insert({
				username: username,
				password: hashedPass,
			});

			dbUsername = await Database('users')
				.select('username')
				.where({ username: username })
				.first();

			logger.info(`User ${username} was added to the database.`);
		} catch (err) {
			logger.info(
				`User ${username} could not be added to the database due to an error.`
			);
			logger.error(err);

			dbUsername = null;
		}

		return username === dbUsername;
	}
}
