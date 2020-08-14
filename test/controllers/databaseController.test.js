'use strict';

const bcrypt = require('bcrypt');

// Mocked database
const database = require('../../src/database');
jest.mock('../../src/database');

// File to be tested
const DatabaseController = require('../../src/controllers/databaseController');

describe('Controllers/Database Controller', () => {
	describe('addUser', () => {
		beforeEach(() => {
			jest.resetModules();
		});

		test.each`
			username     | password
			${'IntTest'} | ${'supertajneheslo'}
		`(
			'[Integration] Save User $username to the Database',
			async ({ username, password }) => {
				let resultUsername;
				let resultPass;

				database.mockImplementation(() => {
					return {
						select: () => {
							return {
								where: () => [],
							};
						},
						insert: (data) => {
							resultUsername = data['username'];
							resultPass = data['password'];

							return {
								returning: () => data['username'],
							};
						},
					};
				});

				const controller = new DatabaseController();

				let result = await controller.addUser(username, password);

				let expectedPass = await new Promise((resolve, reject) => {
					bcrypt.compare(password, resultPass, (err, result) => {
						if (err) {
							reject(err);
						}

						resolve(result);
					});
				});

				expect(resultUsername).toEqual(username);
				expect(expectedPass).toBeTruthy();
				expect(result).toBeTruthy();
			}
		);
	});
});
