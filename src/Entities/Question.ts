import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
} from 'typeorm';

import { User } from './User';
import { GameRound } from './GameRound';
import { QuestionWrong } from './QuestionWrong';

@Entity()
export class Question {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	question: string;

	@Column()
	answer: string;

	@OneToMany(() => QuestionWrong, (wrong) => wrong.question)
	wrongAnswers: QuestionWrong[];

	@ManyToOne(() => User, (user) => user.questions)
	author: User;

	@OneToMany(() => GameRound, (round) => round.question)
	rounds: GameRound[];
}
