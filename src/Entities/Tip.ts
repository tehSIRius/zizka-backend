import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
} from 'typeorm';

import { User } from './User';
import { GameRound } from './GameRound';

@Entity()
export class Tip {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	question: string;

	@Column()
	answer: number;

	@ManyToOne(() => User, (user) => user.tips)
	author: User;

	@OneToMany(() => GameRound, (round) => round.tip)
	rounds: GameRound[];
}
