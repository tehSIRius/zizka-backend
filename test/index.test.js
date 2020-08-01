'use strict';

const request = require('supertest');

const app = require('../src/index');

describe('Index', () => {
	let server;

	beforeEach(() => {
		server = app.listen(3000);
	});

	afterEach(() => {
		server.close();
	});

	test('[Sanity] Server Starts and Responds Correctly', async () => {
		const result = await request(server).get('/');

		expect(result.statusCode).toEqual(200);
		expect(result.body).toEqual({ value: 'Hello There!' });
	});

	test('[Sanity] Server Returns 404 on an Incorrect URL', async () => {
		const result = await request(server).get('/completelywrongurl');

		expect(result.statusCode).toEqual(404);
	});
});
