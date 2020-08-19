import {FaviconLoader} from "~utils/FaviconLoader";
import {EventEmitter} from "~utils/EventEmitter";

export class PageLoading extends EventEmitter<'change' | 'shown' | 'hidden'> {
	protected static _instance: PageLoading;
	public static get instance(): PageLoading {
		if (!this._instance) {
			this._instance = new PageLoading;
		}
		return this._instance;
	}

	protected _faviconLoader = new FaviconLoader;
	protected _pageLoadingNames: string[] = [];
	protected _tabLoadingNames: string[] = [];
	protected _pageLoading = false;
	protected _tabLoading = false;

	public get pageLoading() {
		return this._pageLoading;
	}
	public get tabLoading() {
		return this._tabLoading;
	}

	public constructor() {
		super();
		if (!PageLoading._instance) {
			PageLoading._instance = this;
		}
		return PageLoading._instance;
	}

	public showLoading(name: string, type: IPageLoadingType = 'both') {
		name = name.trim();
		if (type === 'both' || type === 'page') {
			this.showPageLoading(name);
		}
		if (type === 'both' || type === 'tab') {
			this.showTabLoading(name);
		}
	}
	public hideLoading(name: string, type: IPageLoadingType = 'both') {
		name = name.trim();
		if (type === 'both' || type === 'page') {
			this.hidePageLoading(name);
		}
		if (type === 'both' || type === 'tab') {
			this.hideTabLoading(name);
		}
	}

	public showPageLoading(name: string) {
		name = name.trim();
		this._pageLoadingNames.push(name);
		if (!!this._pageLoadingNames.length === this._pageLoading) return;
		this._pageLoading = true;
	}
	public hidePageLoading(name: string) {
		name = name.trim();
		const index = this._pageLoadingNames.indexOf(name);
		if (index === -1) return;
		this._pageLoadingNames.splice(index, 1);
		if (!!this._pageLoadingNames.length === this._pageLoading) return;
		this._pageLoading = false;
	}

	public showTabLoading(name: string) {
		name = name.trim();
		this._tabLoadingNames.push(name);
		if (!!this._tabLoadingNames.length === this._tabLoading) return;
		this._faviconLoader.animate();
		this._tabLoading = true;
	}
	public hideTabLoading(name: string) {
		name = name.trim();
		const index = this._tabLoadingNames.indexOf(name);
		if (index === -1) return;
		this._tabLoadingNames.splice(index, 1);
		if (!!this._tabLoadingNames.length === this._tabLoading) return;
		this._faviconLoader.restore();
		this._tabLoading = false;
	}
}

export type IPageLoadingType = 'both' | 'tab' | 'page';