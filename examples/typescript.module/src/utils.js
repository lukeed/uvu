/**
 * @param {string} str
 */
export function capitalize(str) {
	return str[0].toUpperCase() + str.substring(1);
}

/**
 * @param {string} str
 */
export function dashify(str) {
	return str.replace(/([a-zA-Z])(?=[A-Z\d])/g, '$1-').toLowerCase();
}
