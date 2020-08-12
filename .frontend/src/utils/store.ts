import {EventEmitter} from "./EventEmitter";
import {useEffect, useState} from "react";

class Store extends EventEmitter<'change' | 'update' | 'set' | string> {
	protected _store: {[key: string]: any} = {};

	public get store() {
		return this._store;
	}
	public setStore(store: {[key: string]: any}) {
		this._store = {...store};
		this.emit('change');
	}
	public updateStore(store: {[key: string]: any}) {
		this.setStore({
			...this.store,
			...store,
		});
	}
	public set(name: string, value: any) {
		name = name.toLowerCase();
		this.updateStore({
			[name]: value,
		});
		this.emit(`change:${name}`, value);
	}
	public update(name: string, value: {[key: string]: any}) {
		name = name.toLowerCase();
		let lastValue: any = this.get(name);
		if (!lastValue || typeof lastValue !== 'object') {
			lastValue = {};
		}
		this.set(name, {
			...lastValue,
			...value,
		});
	}
	public get<Type>(name: string): Type | undefined {
		name = name.toLowerCase();
		return this.store[name];
	}
}

export function useStore<TType = {[key: string]: any}>(name: string = ''): TType | undefined {
	const [listener] = useState(() => store.on(name ? `change:${name}` : 'change', () => {
		_setStore(store.get<TType>(name));
	}));
	const [_store, _setStore] = useState(() => {
		return store.get<TType>(name);
	});

	useEffect(() => {
		listener.on();
		return () => {
			listener.off();
		}
	});

	return _store;
}

export const store = new Store;
console.log('store', store);