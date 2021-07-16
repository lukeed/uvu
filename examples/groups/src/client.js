class Client {
	authenticate(username, password) {
		if (username == 'admin' && password == 'verystrong') return true;
		if (username == 'user' && password == 'strong') return true;
		if (username == 'guest') return true;
		return false;
	}
	isPasswordStrong(password) {
		if (password.length < 16) return false;
		let upper = 0, number = 0, special = 0;
		const regexp = /^[A-Za-z0-9]+$/;
		for (const char of password) {
			if (!regexp.test(char)) special++;
			else if (char >= '0' && char <= '9') number++;
			else if (char.toUpperCase() == char) upper++;
		}
		if (upper < 4 || number < 2 || special < 2) return false;
		return true;
	}
}

module.exports = Client;
