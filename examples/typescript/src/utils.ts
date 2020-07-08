export function capitalize(str: string): string {
	return str[0].toUpperCase() + str.substring(1);
}

export function dashify(str: string): string {
	return str.replace(/([a-zA-Z])(?=[A-Z\d])/g, '$1-').toLowerCase();
}
