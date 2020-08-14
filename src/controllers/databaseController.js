'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10;

const database = require('../database');
const logger = require('../logger').child({ name: 'Database Controller ' });

class DatabaseController {
	/**
	 * Tries to add a new user to the database. Returns a boolean.
	 * In case of invalid input an exception is thrown.
	 *
	 * @param {String} username - Name of the new user. Username is the primary key.
	 * @param {String} password - Plain text password to be hashed.
	 *
	 * @returns {Boolean} - Was the operation successful?
	 */
	async addUser(username, password) {
		logger.info(`Trying to add new user ${username} to the database.`);

		let possibleDuplicate;

		try {
			possibleDuplicate = await database('users').select('username').where({
				username: username,
			});
		} catch (err) {
			logger.warn(`Could not find ${username} in the database.`);
			logger.warn(err);

			possibleDuplicate = [];
		}

		if (
			typeof username !== 'string' ||
			username.trim() === '' ||
			possibleDuplicate.length > 0
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

		let dbUsername = await database('users')
			.insert({
				username: username,
				password: hashedPass,
			})
			.returning('username');

		logger.info(`User ${username} was added to the database.`);

		return dbUsername === username;
	}

	/**
	 * Tries to add a new language to the database. Returns boolean.
	 * In case of invalid input an exception is thrown.
	 *
	 * @param {String} name - Name of the language
	 *
	 * @returns {Boolean} - Was the operation successful?
	 */
	async addLanguage(name) {
		logger.info(`Trying to add a new language ${name}.`);

		let possibleDuplicate;

		try {
			possibleDuplicate = await database('languages').select('name').where({
				name: name,
			});
		} catch (err) {
			logger.warn(`Could not lookup language ${name} in the database.`);
			logger.warn(err);

			possibleDuplicate = [];
		}

		if (
			typeof name !== 'string' ||
			name.trim() === '' ||
			possibleDuplicate.length > 0
		) {
			logger.warn(
				`Language name ${name} is either not a string or is an empty string.`
			);

			throw 'Language name must be a String and cannot be empty!';
		}

		let newId = await database('languages')
			.insert({
				name: name,
			})
			.returning('id');

		logger.info(`Language ${name} was added to the database.`);

		return newId >= 0;
	}

	/**
	 * Tries to add a new question. Returns a boolean.
	 * In case of invalid input an exception is thrown.
	 *
	 * @param {String} question - Text of the question
	 * @param {String} answer - Correct answer
	 * @param {String} wrong0 - One of the wrong options
	 * @param {String} wrong1 - One of the wrong options
	 * @param {String} wrong2 - One of the wrong options
	 * @param {String} author - Username of the author
	 * @param {Integer} lang - ID of the selected language
	 *
	 * @returns {Boolean} - Was the operation successful?
	 */
	async addQuestion(question, answer, wrong0, wrong1, wrong2, author, lang) {
		logger.info(`Trying to add question ${question} to the database.`);

		let stringsAreValid = [question, answer, wrong0, wrong1, wrong2].every(
			(string) => typeof string === 'string' && string.trim() !== ''
		);

		let possibleDuplicate;

		try {
			possibleDuplicate = await database('questions').select('id').where({
				question: question,
			});
		} catch (err) {
			logger.warn(`Could not find ${question} in the database.`);
			logger.warn(err);

			possibleDuplicate = [];
		}

		if (!stringsAreValid || possibleDuplicate.length > 0) {
			logger.warn(`Question ${question} has one or more invalid arguments.`);

			throw 'One of the arguments is either not a string or is an empty string; or the questions is a duplicate!';
		}

		let newId = await database('questions').insert({
			question: question,
			answer: answer,
			wrong0: wrong0,
			wrong1: wrong1,
			wrong2: wrong2,
			author: author,
			lang: lang,
		});

		return newId >= 0;
	}
}

module.exports = DatabaseController;
