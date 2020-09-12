import Bcrypt from 'bcrypt';

import mockDb from 'mock-knex';
import db from '../../src/database';

const tracker = mockDb.getTracker();

import DatabaseController from '../../src/controllers/databaseController';

describe('Controllers: Database Controller', () => {
	beforeAll(() => {
		mockDb.mock(db);
	});

	afterAll(() => {
		mockDb.mock(db);
	});

	describe('[Integration] addUser', () => {
		beforeEach(() => {
			tracker.install();
		});

		afterEach(() => {
			tracker.uninstall();
		});

		test('Adding User Fails on Duplicate Username', async () => {
			tracker.on('query', (q) => {
				q.response('DuplicateUser');
			});

			const controller = new DatabaseController();
			const result = await controller.addUser('DuplicateUser', 'DuplicatePass');

			expect(result).toBeFalsy();
		});

		test('Adding User Fails on Incorrect Input', async () => {
			tracker.on('query', (q) => {
				q.response(null);
			});

			const controller = new DatabaseController();

			const result = await controller.addUser('', '');

			expect(result).toBeFalsy();
		});
	});
});
