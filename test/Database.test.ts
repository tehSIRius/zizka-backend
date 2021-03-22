import { createConnection, ConnectionOptions, Connection } from 'typeorm';
import {
	Game,
	GameRound,
	Question,
	QuestionWrong,
	Tip,
	User,
} from '../src/Entities';

const testOptions: ConnectionOptions = {
	type: 'sqlite',
	database: ':memory:',
	dropSchema: true,
	entities: [Game, GameRound, Question, QuestionWrong, Tip, User],
	synchronize: true,
	logging: false,
};

describe('Database', () => {
	describe('[Integration] Database Setup', () => {
		let connection: Connection;

		beforeEach(async () => {
			connection = await createConnection(testOptions);
		});

		test('All Entities Should Be Created Properly', async () => {
			const entityManager = connection.manager;

			const result = await entityManager.query(
				`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`
			);

			expect(result).toEqual([
				{ name: 'user' },
				{ name: 'game' },
				{ name: 'question_wrong' },
				{ name: 'question' },
				{ name: 'game_round' },
				{ name: 'tip' },
			]);
		});
	});
});
