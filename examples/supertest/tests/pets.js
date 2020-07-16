const { test } = require('uvu');
const request = require('supertest');
const App = require('../src');

/**
 * NOTE: File uses `supertest` only
 * @see tests/users.js for `uvu/assert` combo.
 */

test('GET /pets', async () => {
	await request(App.handler)
		.get('/pets')
		.expect(200, 'GET /pets :: /')
});

test('GET /pets/:id', async () => {
	await request(App.handler)
		.get('/pets/123')
		.expect(200, `GET /pets/:id :: /123`)

	await request(App.handler)
		.get('/pets/dog')
		.expect(200, `GET /pets/:id :: /dog`)
});

test('PUT /pets/:id', async () => {
	await request(App.handler)
		.put('/pets/123')
		.expect(201, `PUT /pets/:id :: /123`)

	await request(App.handler)
		.put('/pets/dog')
		.expect(201, `PUT /pets/:id :: /dog`)
});

test.run();
