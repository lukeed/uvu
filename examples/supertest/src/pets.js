const polka = require('polka');

module.exports = (
	polka()
		.get('/', (req, res) => {
			res.end(`GET /pets :: ${req.url}`);
		})
		.get('/:id', (req, res) => {
			res.end(`GET /pets/:id :: ${req.url}`);
		})
		.put('/:id', (req, res) => {
			res.statusCode = 201; // why not?
			res.end(`PUT /pets/:id :: ${req.url}`);
		})
);
