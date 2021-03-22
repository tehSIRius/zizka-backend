import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Question } from './Question';

@Entity()
export class QuestionWrong {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	value: string;

	@ManyToOne(() => Question, (question) => question.wrongAnswers)
	question: Question;
}
