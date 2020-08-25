import {EventEmitter} from "~utils/EventEmitter";
import {cancelablePromise, ICancelablePromise} from "~utils/CancelablePromise";
import {resultError} from "~utils/resultError";
import {App} from "~src/App";
import {IHydrateData} from "~interfaces/hydrateData";
import {Context, createContext, useContext} from "react";
import {safe} from "~utils/safe";
import {CancelError} from "~utils/Errors";

export class Router extends EventEmitter {
	protected static _context: Context<Router>;
	public static get context() {
		if (!this._context) {
			this._context = createContext({} as Router);
		}
		return this._context
	}

	protected _activePageLoading: ICancelablePromise<any> | null = null;
	protected _changingUrl = false;

	public get app() {
		return this._app;
	}
	public get pageStore() {
		return this.app?.pageStore;
	}

	public get currentUrl() {
		return this.pageStore?.get('url') || '/'
	}

	constructor(protected _app?: App) {
		super();
		safe(() => {
			window.onpopstate = (_: PopStateEvent) => {
				if (this._changingUrl) return;
				this.go(location.href, false).then(() => {});
			};
		});
	}

	public isSameOrigin(url: string) {
		let isSame = true;
		if (/^https?:\/\//.test(url)) {
			isSame = url.indexOf(location.origin) === 0;
		}
		return isSame;
	}
	public async go(url: string, push = true) {
		let isSame = this.isSameOrigin(url);
		if (!isSame) {
			location.href = url;
			return;
		}

		this.cancelLoadPageData();

		if (push) {
			this._changingUrl = true;
			history.pushState(null, '', url);
			this._changingUrl = false;
		}
		this.emit('change:url', url);

		this.app?.loading('router', true);
		this._activePageLoading = this.loadPageData(url);
		const [data, err] = await resultError(this._activePageLoading);
		this.app?.loading('router', false);
		if (err) {
			if (err instanceof CancelError) {
				return;
			}
			this.app?.showError(err);
		}
		if (data) {
			this.app?.hydrateData(data);
		}
	}
	public cancelLoadPageData() {
		if (!this._activePageLoading) return;
		this._activePageLoading.cancel();
		this._activePageLoading = null;
	}
	public loadPageData(url: string) {
		return cancelablePromise<IHydrateData, Error>(async (resolve, reject) => {
			fetch(url, {
				headers: {
					'Content-Type': 'application/json',
					'Content-Result': 'json',
				}
			})
				.then(response => response.json())
				.then(resolve)
				.catch(reject);
		}, (res, rej) => {
			rej(new CancelError());
		});
	}
}

export function useRouter() {
	return useContext(Router.context);
}
