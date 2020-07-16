const { test } = require('uvu');
const request = require('supertest');
const assert = require('uvu/assert');
const App = require('../src');

/**
 * NOTE: File uses `supertest` w/ `uvu/assert` together
 * @see tests/pets.js for `supertest` usage only
 */

test('GET /users', async () => {
	let res = await request(App.handler).get('/users');
	assert.is(res.text, 'GET /users :: /');
	assert.is(res.status, 200);
});

test('GET /users/:id', async () => {
	let res1 = await request(App.handler).get('/users/123');
	assert.is(res1.text, `GET /users/:id :: /123`);
	assert.is(res1.status, 200);

	let res2 = await request(App.handler).get('/users/dog');
	assert.is(res2.text, `GET /users/:id :: /dog`);
	assert.is(res2.status, 200);
});

test('PUT /users/:id', async () => {
	let res1 = await request(App.handler).put('/users/123');
	assert.is(res1.text, `PUT /users/:id :: /123`);
	assert.is(res1.status, 201);

	let res2 = await request(App.handler).put('/users/dog');
	assert.is(res2.text, `PUT /users/:id :: /dog`);
	assert.is(res2.status, 201);
});

test.run();
