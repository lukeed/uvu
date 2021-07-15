const { suite } = require('uvu');
const assert = require('uvu/assert');
const Client = require('../src/client');
const Utils = require('../src/utils');

const app = suite('app');
const class1 = new Client();
const class2 = new Utils();

app.group('client', {}, client => {
	client.group('authenticate()', {}, auth => {
		auth('accept admin pass, reject other passwords', () => {
			assert.ok(class1.authenticate('admin', 'verystrong'));
			assert.not(class1.authenticate('admin', 'weak'));
		});
		auth('accept normal pass, reject other passwords', () => {
			assert.ok(class1.authenticate('user', 'strong'));
			assert.not(class1.authenticate('user', 'weak'));
		});
		auth('no password for guest', () => {
			assert.ok(class1.authenticate('guest', 'strong'));
			assert.ok(class1.authenticate('guest', ''));
		});
	});
	client.group('isPasswordStrong()', {}, pass => {
		pass('reject short password', () => {
			assert.not(class1.isPasswordStrong('short'));
		});
		pass('reject short password with sufficient non-lowercase alphabetic values', () => {
			assert.not(class1.isPasswordStrong('1234+-AA'));
		});
		pass('reject long password with insufficient non-lowercase alphabetic values', () => {
			assert.not(class1.isPasswordStrong('verystrongpassword'));
		});
		pass('accept long password meeting requirements', () => {
			assert.ok(class1.isPasswordStrong('P@SSw0rD!6978//K'));
		});
	});
});

app.group('utils', {}, utils => {
	utils.group('add()', {}, add => {
		add('two integers', () => {
			assert.equal(class2.add(1, 2), 3);
		});
		add('two integers, one negative', () => {
			assert.equal(class2.add(1, -2), -1);
		});
		add('two floats', () => {
			assert.equal(class2.add(1.25, 1.25), 2.5);
		});
	});
	utils.group('getLength()', {}, length => {
		length('returns string length', () => {
			assert.equal(class2.getLength('12345678'), 8);
		});
		length('returns array length', () => {
			assert.equal(class2.getLength([1, 2, 3, 4]), 4);
		});
		length('returns 0 if input does not have length function', () => {
			assert.equal(class2.getLength({ok: true}), 0);
		});
	});
	utils.group('getAsString()', {}, str => {
		str('return integer as string', () => {
			assert.equal(class2.getAsString(376), '376');
		});
		str('return object as JSON.stringified', () => {
			const obj = {ok: true, count: 3, msg: 'asd'};
			assert.equal(class2.getAsString(obj), JSON.stringify(obj));
		});
	});
});

app.run();
