import {Context, createContext, useContext} from "react";
import {Store, useStoreGet} from "~utils/Store";
import {IHydrateData, IHydrateDataComponent} from "~interfaces/hydrateData";
import {INavList} from "~components/Nav/Nav";


export class PageStore extends Store<IPageStore> {
	protected static _context: Context<PageStore>;
	public static get context() {
		if (!PageStore._context) {
			PageStore._context = createContext({} as PageStore);
		}
		return PageStore._context;
	}
	public hydrateData(hydrateData: IHydrateData) {
		this.setStore({
			...hydrateData,
			
		});
	}
}

export interface IAppState {
	"loading"?: boolean;
}
export interface IPageStore {
	"app:state"?: IAppState;
	"url"?: string;
	"page:title"?: string;
	"page:meta"?: Array<{name: string; value: string}>;
	"page:content"?: IHydrateDataComponent[];
	"nav:main"?: INavList;
	"error"?: {
		message?: string;
		code?: number | string;
	};
}

export function useGetPageStore() {
	return useContext(PageStore.context);
}

export function usePageStoreGet<TName extends keyof IPageStore>(name: TName): IPageStore[TName] | undefined {
	const store = useGetPageStore();
	return useStoreGet(store, name);
}