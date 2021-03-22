import { Entity, Column, PrimaryColumn, OneToMany, ManyToMany } from 'typeorm';

import { Tip } from './Tip';
import { Question } from './Question';
import { Game } from './Game';
import { GameRound } from './GameRound';

@Entity()
export class User {
	@PrimaryColumn()
	name: string;

	@Column()
	password: string;

	@OneToMany(() => Question, (question) => question.author)
	questions: Question[];

	@OneToMany(() => Tip, (tip) => tip.author)
	tips: Tip[];

	@ManyToMany(() => Game, (game) => game.players)
	games: Game[];

	@ManyToMany(() => GameRound, (round) => round.players)
	rounds: GameRound[];
}
