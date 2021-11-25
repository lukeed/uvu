const assert = require('assert');
const math = require('../../math');

module.exports = {
  sum: function() {
    assert.equal(typeof math.sum, 'function');
    assert.equal(math.sum(1, 2), 3);
    assert.equal(math.sum(-1, -2), -3);
    assert.equal(math.sum(-1, 1), 0);
  },

  div: function() {
    assert.equal(typeof math.div, 'function');
    assert.equal(math.div(1, 2), 0.5);
    assert.equal(math.div(-1, -2), 0.5);
    assert.equal(math.div(-1, 1), -1);
  },

  mod: function() {
    assert.equal(typeof math.mod, 'function');
    assert.equal(math.mod(1, 2), 1);
    assert.equal(math.mod(-3, -2), -1);
    assert.equal(math.mod(7, 4), 3);
  },
}