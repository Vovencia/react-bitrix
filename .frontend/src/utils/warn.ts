export function warn(message: string) {
	try {
		console.warn(message);
	} catch (e) {
		setTimeout(function() {
			throw new Error(message);
		}, 0);
	}
}