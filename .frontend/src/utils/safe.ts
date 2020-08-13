export function safe<TArgs extends any[], TResult>(fn: (...args: TArgs) => TResult, ...args: TArgs): [TResult, null] | [null, Error] {
	try {
		return [fn(...args), null];
	} catch(e) {
		return [null, e];
	}
}