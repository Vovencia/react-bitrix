import * as webpack from "webpack";
import config from '../config.json';

import {resolve} from "./resolve";

const ENV = (process.env.ENV || 'browser') as IEnv;
const MODE = (process.env.MODE || 'development') as IMode;
const TEMPLATE_PATH = (process.env.TEMPLATE_PATH || config.templatePath || 'local/templates/react-bitrix') as IMode;
const WATCH = !!process.env.WATCH;

export class Workspace {
	public get watch() {
		return this._watch;
	}
	public get mode() {
		return this._mode;
	}
	public get env() {
		return this._env;
	}
	public get templatePath() {
		return this._templatePath;
	}
	public get root(): string {
		return resolve(__dirname, '..', '..');
	}
	public get entry(): string {
		return this.resolveFrontend('src', this.isServer ? 'server.tsx' : 'browser.tsx');
	}
	public get output(): string {
		return this.isServer ? this.resolveFrontend('dist') : this.resolve(this.templatePath, 'public');
	}
	public get isDev(): boolean {
		return this.mode === 'development';
	}
	public get isProd(): boolean {
		return this.mode === 'production';
	}
	public get isBrowser(): boolean {
		return this.env === 'browser';
	}
	public get isServer(): boolean {
		return this.env === 'server';
	}
	public get devtool(): webpack.Configuration['devtool'] {
		return this.isBrowser && this.isProd ? undefined : undefined;
	}
	constructor(
		protected _env = ENV,
		protected _mode = MODE,
		protected _templatePath = TEMPLATE_PATH,
		protected _watch = WATCH,
	) {}

	public is(type: IEnv | IMode): boolean | null {
		switch (type) {
			case "browser": return this.isBrowser;
			case "development": return this.isDev;
			case "production": return this.isProd;
			case "server": return this.isServer;
		}
		return null;
	}
	public resolve(...paths: string[]): string {
		return resolve(this.root, ...paths);
	}
	public resolveFrontend(...paths: string[]): string {
		return resolve(this.root, '.frontend', ...paths);
	}
}

export type IEnv = 'browser' | 'server';
export type IMode = 'development' | 'production';