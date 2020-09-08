// Type definitions for zizka-backend
// Project: https://github.com/tehSIRius/zizka-backend
// Definitions by: Patrik Dvořáček <https://github.com/tehSIRius>
// TypeScript Version: 4.0.2

export interface User {
	readonly username: string;
	password: string;
}

export interface Game {
	readonly id: number;
	started_at: string;
	ended_at: string;
	winner: string;
}

export interface UserInGame {
	readonly id: number;
	game: number;
	user: number;
}

export interface Language {
	readonly id: number;
	name: string;
}

export interface Question {
	readonly id: number;
	answer: string;
	wrong0: string;
	wrong1: string;
	wrong2: string;
	wrong3: string;
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
	answer: string;
	lang: number;
	author: string;
}

export interface ApproximationInGame {
	readonly id: number;
	game: number;
	approximation: number;
}
