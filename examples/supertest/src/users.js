const polka = require('polka');

module.exports = (
	polka()
		.get('/', (req, res) => {
			res.end(`GET /users :: ${req.url}`);
		})
		.get('/:id', (req, res) => {
			res.end(`GET /users/:id :: ${req.url}`);
		})
		.put('/:id', (req, res) => {
			res.statusCode = 201; // why not?
			res.end(`PUT /users/:id :: ${req.url}`);
		})
);
