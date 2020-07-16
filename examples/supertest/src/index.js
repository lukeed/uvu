const polka = require('polka');
const Users = require('./users');
const Pets = require('./pets');

module.exports = (
	polka()
		.use('/pets', Pets)
		.use('/users', Users)
		.get('/', (req, res) => {
			res.setHeader('Content-Type', 'text/plain');
			res.end('OK');
		})
);
