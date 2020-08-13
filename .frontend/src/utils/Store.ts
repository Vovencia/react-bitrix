import {EventEmitter} from "~utils/EventEmitter";
import {NonStrict} from "~interfaces/NonStrict";
import {useEffect, useState} from "react";

export class Store<
	TStore extends {[key: string]: any} = {[key: string]: any},
	TEvents extends string = string
> extends EventEmitter<TEvents | 'change' | 'update' | 'set' | string> {
	constructor(protected _store: TStore = {} as TStore) {
		super();
	}

	public get store() {
		return this._store;
	}
	public setStore(store: TStore) {
		const _oldStore = this._store;
		this._store = {...store};
		this.emit('change');
		for (const key in this.store) {
			if (!Object.prototype.hasOwnProperty.call(this.store, key)) continue;
			if (_oldStore[key] === this.store[key]) continue;
			this.emit(`change:${key}`, this.store[key]);
		}
	}
	public updateStore(store: NonStrict<TStore>) {
		this.setStore({
			...this.store,
			...store,
		});
	}
	public set<TKey extends keyof TStore>(name: TKey, value: TStore[TKey]) {
		this.setStore({
			...this.store,
			[name]: value,
		});
	}
	public get<TKey extends keyof TStore>(name: TKey): TStore[TKey] | undefined {
		if (typeof name !== 'string') name = '' as TKey;
		return this.store[name];
	}
}

export function useStore<TStore extends Store>(store: TStore): TStore {
	const [listener] = useState(() => store.on('change', () => {
		setValue(Symbol('store'));
	}));
	const [, setValue] = useState(() => {
		return Symbol('store');
	});

	useEffect(() => {
		listener.on();
		return () => {
			listener.off();
		}
	});
	return store;
}

export function useStoreGet<TName extends keyof Store['_store'] = string>(store: Store, name: TName): Store['_store'][TName] | undefined {
	const [listener] = useState(() => store.on(`change:${name}`, () => {
		setValue(store.get<TName>(name));
	}));
	const [value, setValue] = useState(() => {
		return store.get<TName>(name);
	});

	useEffect(() => {
		listener.on();
		return () => {
			listener.off();
		}
	});

	return value;
}