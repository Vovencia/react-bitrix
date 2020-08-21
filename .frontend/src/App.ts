import {PageStore} from "~src/PageStore";
import {Context, createContext, useContext} from "react";
import {Store, useStore, useStoreGet} from "~utils/Store";
import {PageLoading} from "~utils/PageLoading";
import {IHydrateData} from "~interfaces/hydrateData";
import {Router} from "~utils/Router";

export class App extends Store<IAppStore> {
	protected static _context: Context<App>;
	protected _pageStore: PageStore;
	protected _pageLoading = new PageLoading();
	protected _router = new Router(this);

	public get router() {
		return this._router;
	}

	public static get context() {
		if (!this._context) {
			this._context = createContext({} as App);
		}
		return this._context
	}
	public get pageStore() {
		return this._pageStore;
	}
	constructor(protected _hydrateData?: IHydrateData) {
		super();
		this._pageStore = new PageStore(_hydrateData);
	}

	public setPageStore(pageStore: PageStore) {
		this._pageStore = pageStore;
	}
	public showError(e: Error) {
		alert(e.toString());
	}
	public loading(name: string, isLoading: boolean, type: 'both' | 'tab' | 'page' = 'both') {
		if (isLoading) {
			this._pageLoading.showLoading(name, type);
		} else {
			this._pageLoading.hideLoading(name, type);
		}
		if (this.get('loadingPage') !== this._pageLoading.pageLoading) {
			this.set('loadingPage', this._pageLoading.pageLoading);
		}
	}
	public hydrateData(data: IHydrateData) {
		return this.pageStore?.hydrateData(data);
	}
}

export function useGetApp(): App {
	return useContext(App.context);
}
export function useApp(): App {
	const app = useGetApp();
	return useStore(app);
}
export function useAppGet<TName extends keyof IAppStore>(name: TName): IAppStore[TName] | undefined {
	const app = useGetApp();
	return useStoreGet(app, name);
}

export interface IAppStore {
	loadingPage?: boolean;
}