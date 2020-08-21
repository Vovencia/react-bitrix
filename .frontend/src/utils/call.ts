export function call<TArgs extends [], TResult>(handler: (...args: TArgs) => TResult, ...args: TArgs): TResult {
	return handler(...args);
}