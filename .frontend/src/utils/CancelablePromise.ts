import {noop} from "~utils/noop";
import {safe} from "~utils/safe";

export function cancelablePromise<TResult, TError>(
	fn: ((resolve: (value: TResult) => void, reject: (error: TError) => void) => void) | Promise<TResult>,
	cancelFn: (resolve: (value: TResult) => void, reject: (error: TError) => void) => any = noop,
): ICancelablePromise<TResult> {
	let cancel = false;
	const promise = new Promise<TResult>((res, rej) => {
		if (fn instanceof Promise) {
			fn.then(data => {
				if (cancel) return void safe(() => cancelFn(res, rej));
				res(data);
			}).catch(err => {
				if (cancel) return void safe(() => cancelFn(res, rej));
				rej(err);
			});
			return;
		}
		fn(data => {
			if (cancel) return void safe(() => cancelFn(res, rej));
			res(data);
		}, err => {
			if (cancel) return void safe(() => cancelFn(res, rej));
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