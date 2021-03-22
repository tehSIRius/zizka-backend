import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	ManyToMany,
	OneToMany,
} from 'typeorm';

import { Game } from './Game';
import { User } from './User';
import { Question } from './Question';
import { Tip } from './Tip';

@Entity()
export class GameRound {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	start: Date;

	@ManyToOne(() => Game, (game) => game.rounds)
	game: Game;

	@ManyToMany(() => User, (user) => user.rounds)
	players: User[];

	@OneToMany(() => Question, (question) => question.rounds)
	question?: Question;

	@OneToMany(() => Tip, (tip) => tip.rounds)
	tip?: Tip;
}
