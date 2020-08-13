export function cancelablePromise<TResult, TError>(
	fn: ((resolve: (value: TResult) => void, reject: (error: TError) => void) => void) | Promise<TResult>
): ICancelablePromise<TResult> {
	let cancel = false;
	const promise = new Promise<TResult>((res, rej) => {
		if (fn instanceof Promise) {
			fn.then(data => {
				if (cancel) return;
				res(data);
			}).catch(err => {
				if (cancel) return;
				rej(err);
			});
			return;
		}
		fn(data => {
			if (cancel) return;
			res(data);
		}, err => {
			if (cancel) return;
			rej(err);
		});
	});
	(promise as Promise<TResult> & {
		cancel: () => void;
	}).cancel = () => {
		cancel = true;
	};
	return promise as Promise<TResult> & {
		cancel: () => void;
	};
}

export interface ICancelablePromise<TResult> extends Promise<TResult> {
	cancel: () => void;
}