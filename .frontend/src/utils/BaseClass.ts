import {EventEmitter} from "~utils/EventEmitter";
import {NonStrict} from "~interfaces/NonStrict";

export class BaseClass<TOptions extends {[key: string]: any} = {}, TEvents extends string = TBaseClassEvents> extends EventEmitter<TEvents> {
	protected defaultOptions: TOptions = {} as TOptions;
	protected _options: TOptions = {} as TOptions;
	public get options(): TOptions {
		return this._options;
	}
	constructor(options: TOptions = {} as TOptions) {
		super();
		this.setOptions(options);
	}

	public setOptions(options: TOptions) {
		const prevOptions = this.options;
		this._options = {
			...this.defaultOptions,
			...options,
		};
		this.emit('changed:options' as TEvents, [prevOptions]);
	}
	public updateOptions(options: NonStrict<TOptions>) {
		this.setOptions({
			...this.options,
			...options,
		});
	}
	public setOption<TName extends keyof TOptions>(name: TName, value: TOptions[TName]) {
		this.updateOptions({
			[name]: value,
		} as any);
	}
	public getOption<TName extends keyof TOptions>(name: TName): TOptions[TName] {
		return this.options[name];
	}
}

export type TBaseClassEvents = 'changed:options' | string;