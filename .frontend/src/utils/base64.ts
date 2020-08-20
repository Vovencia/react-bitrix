export const base64 = {
	decode(data: string): string {
		try {
			return atob(data);
		} catch (e) {
			try {
				let buff = Buffer.from(data, 'base64');
				return buff.toString('utf-8');
			} catch (e) {

			}
		}
		return '';
	},
	encode(data: string): string {
		try {
			return btoa(data);
		} catch (e) {
			try {
				let buff = Buffer.from(data);
				return buff.toString('base64');
			} catch (e) {

			}
		}
		return '';
	}
}