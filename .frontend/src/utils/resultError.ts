/**
 * Функция для реализации обработки ошибок как в GoLang:
 * результат выполнения будет первым элементом массива результата, а ошибка вторым
 */
export async function resultError<TResult>(
	handler: IResultErrorArg<TResult>,
	...args: any[]
): Promise<IResultError<TResult>> {
	if (handler instanceof Promise) {
		return new Promise<IResultError<TResult>>(async (res) => {
			try {
				const result = await handler;
				res([result, null]);
			} catch (e) {
				res([null, e]);
			}
		});
	} else {
		return new Promise<IResultError<TResult>>(async (res) => {
			try {
				const result = await handler(...args);
				res([result, null]);
			} catch (e) {
				res([null, e]);
			}
		});
	}
}

export async function resultErrorMultiple<TResult>(
	handlers: Array<IResultErrorArg<TResult>>,
	serial = false,
): Promise<Array<IResultError<TResult>>> {
	const result: any[] = [];
	let left = handlers.length;
	const len = handlers.length;
	if (left === 0) return [];
	return new Promise<Array<IResultError<TResult>>>((res) => {
		for (let i = 0; i < len; i++) {
			resultError(handlers[i]).then((data) => {
				left--;
				result[i] = data;
				if (left === 0) {
					res(result);
				}
			});
		}
	});
}

export type IResultErrorArg<TResult> = Promise<TResult> | ((...args: any[]) => TResult);
export type IResultError<Result> = [Result, null] | [null, Error];