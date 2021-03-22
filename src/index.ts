import express from 'express';
import { ConnectionOptions, createConnection } from 'typeorm';
import path from 'path';

import {
	Game,
	GameRound,
	Question,
	QuestionWrong,
	Tip,
	User,
} from './Entities';
import Logger from './Utils/Logger';
import { TypeORMLogger } from './Utils/TypeORMLogger';

const PORT = process.env.PORT ?? 3000;

const logger = Logger.child({ name: 'Index' });
const options: ConnectionOptions = {
	type: 'sqlite',
	database: path.join(__dirname, 'database.sqlite'),
	entities: [Game, GameRound, Question, QuestionWrong, Tip, User],
	logger: new TypeORMLogger(),
	logging: true,
	synchronize: true,
};

async function main() {
	const connection = await createConnection(options);
	const userRepository = connection.getRepository(User);

	const app = express();
	app.use(express.json());

	app.get('/users', async (_req, res) => {
		const users = await userRepository.find();

		res.json(users);
	});

	app.listen(PORT, () =>
		logger.info(`Server is listening on http://localhost:${PORT}`)
	);
}

main().catch((err) => logger.error(err));
