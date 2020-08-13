import {PageStore} from "~src/PageStore";
import {Context, createContext, useContext} from "react";
import {Store, useStore, useStoreGet} from "~utils/Store";

export class App extends Store<IAppStore> {
	protected static _context: Context<App>;
	public static get context() {
		if (!this._context) {
			this._context = createContext({} as App);
		}
		return this._context
	}
	public get pageStore() {
		return this._pageStore;
	}
	constructor(protected _pageStore?: PageStore) {
		super();
	}

	public setPageStore(pageStore: PageStore) {
		this._pageStore = pageStore;
	}
	public showError(e: Error) {
		alert(e.toString());
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