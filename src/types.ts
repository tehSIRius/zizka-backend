export interface User {
	readonly username: string;
	password: string;
}

export interface Game {
	readonly id: number;
	started_at: string;
	ended_at: string;
	winner: number;
}

export interface UserInGame {
	readonly id: number;
	game: number;
	user: string;
}

export interface Language {
	readonly id: number;
	name: string;
}

export interface Question {
	readonly id: number;
	question: string;
	answer: string;
	wrong: Array<string>;
	lang: number;
	author: string;
}

export interface QuestionInGame {
	readonly id: number;
	game: number;
	question: number;
}

export interface Approximation {
	readonly id: number;
	question: string;
	answer: number;
	lang: number;
	author: string;
}

export interface ApproximationInGame {
	readonly id: number;
	game: number;
	approximation: number;
}
