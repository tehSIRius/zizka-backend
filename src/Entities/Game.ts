import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToMany,
	OneToMany,
} from 'typeorm';

import { User } from './User';
import { GameRound } from './GameRound';

@Entity()
export class Game {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	start: Date;

	@Column()
	end: Date;

	@ManyToMany(() => User, (user) => user.games)
	players: User[];

	@OneToMany(() => GameRound, (round) => round.game)
	rounds: GameRound[];
}
