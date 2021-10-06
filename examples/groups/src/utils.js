class Utils {
	add (a, b) {
		return a + b;
	}
	getLength(input) {
		if (input.length) return input.length;
		return 0;
	}
	getAsString(input) {
		if (typeof input == 'object') return JSON.stringify(input);
		return input.toString();
	}
}

module.exports = Utils;
