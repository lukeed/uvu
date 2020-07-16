const { test } = require('uvu');
const assert = require('uvu/assert');
const request = require('supertest');
const App = require('../src');

test('should export Polka instance', () => {
	assert.is(App.constructor.name, 'Polka');
	assert.type(App.handler, 'function');
	assert.is(App.server, undefined);

	assert.type(App.get, 'function');
	assert.type(App.head, 'function');
	assert.type(App.patch, 'function');
	assert.type(App.connect, 'function');
	assert.type(App.delete, 'function');
	assert.type(App.post, 'function');
});

// Option 1: Use `supertest` assertions
test('should receive "OK" for "GET /" route', async () => {
	await request(App.handler)
		.get('/')
		.expect('Content-Type', /text\/plain/)
		.expect(200, 'OK')
});

// Option 2: Save `supertest` request; assert directly
test('should receive "OK" for "GET /" route', async () => {
	let res = await request(App.handler).get('/');
	assert.is(res.header['content-type'], 'text/plain');
	assert.is(res.status, 200);
	assert.is(res.text, 'OK');
});

test.run();
