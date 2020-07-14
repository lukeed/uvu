exports.capitalize = function (str) {
	return str[0].toUpperCase() + str.substring(1);
}

exports.dashify = function (str) {
	return str.replace(/([a-zA-Z])(?=[A-Z\d])/g, '$1-').toLowerCase();
}
