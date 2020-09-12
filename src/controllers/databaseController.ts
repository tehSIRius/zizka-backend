import Bcrypt from 'bcrypt';

import Logger from '../logger';
import Database from '../database';
import { Question } from '../types';

const logger = Logger.child({ name: 'Database Controller' });
const saltRounds = 10;

export default class DatabaseController {
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

		let dbUsername: string;

		try {
			if (username.trim() === '') {
				throw 'Username must not be empty!';
			}

			if (password.trim() === '') {
				throw 'Password must not be empty!';
			}

			let possibleDuplicate: string;

			try {
				possibleDuplicate = await Database('users')
					.select('username')
					.where({ username: username })
					.first();
			} catch (err) {
				logger.error(
					`Could not search for username ${username} in the database.`
				);
				logger.error(err);

				possibleDuplicate = null;
			}

			if (possibleDuplicate !== null) {
				throw 'Username is already taken!';
			}

			const hashedPass = await new Promise((resolve, reject) => {
				Bcrypt.hash(password, saltRounds, (err, hash) => {
					if (err) {
						reject(err);
					}

					resolve(hash);
				});
			});

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
			logger.error(
				`User ${username} could not be added to the database due to an error.`
			);
			logger.error(err);

			dbUsername = null;
		}

		return username === dbUsername;
	}

	/**
	 * Tries to add a new question to the database.
	 *
	 * @param question Text of the question
	 * @param answer Text of the correct answer
	 * @param wrong Three wrong answers
	 * @param lang ID of the language
	 * @param author Username of the author
	 *
	 * @returns Either the question object or null in case of failure
	 */
	async addQuestion(
		question: string,
		answer: string,
		wrong: Array<string>,
		lang: number,
		author: string
	): Promise<Question> {
		let result: Question;

		try {
			if (
				question.trim() === '' ||
				answer.trim() === '' ||
				wrong.some((w) => w.trim() === '')
			) {
				throw 'Question or one of the answers is an empty string. Cannot be added to the database.';
			}

			if (wrong.length < 3) {
				throw 'Not enough wrong answers was submitted. Cannot be added.';
			}

			if (
				(await Database('question')
					.select('*')
					.where({ question: question })
					.first()) !== null
			) {
				throw 'Question is a duplicated and will not be added.';
			}

			await Database('question').insert({
				question: question,
				answer: answer,
				wrong0: wrong[0],
				wrong1: wrong[1],
				wrong2: wrong[2],
				lang: lang,
				author: author,
			});

			const dbResult = await Database('question')
				.select('*')
				.where({ question: question })
				.first();

			result = {
				id: dbResult['id'],
				question: dbResult['question'],
				answer: dbResult['answer'],
				wrong: [dbResult['wrong0'], dbResult['wrong1'], dbResult['wrong2']],
				lang: dbResult['lang'],
				author: dbResult['author'],
			};
		} catch (err) {
			logger.error(`Question ${question} could not be added to the database.`);
			logger.error(err);
			logger.debug({
				question: question,
				answer: answer,
				wrong: wrong,
				lang: lang,
				author: author,
			});

			result = null;
		}

		return result;
	}
}
