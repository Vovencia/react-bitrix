export class EventEmitter<TEvents extends string = string> {
	protected _listeners: Listener[] = [];

	public on(eventName: IListener<TEvents>['eventName'], callback: IListener<TEvents>['callback'], isOne: IListener<TEvents>['isOne'] = false): Listener {
		const listener = new Listener(eventName, callback, isOne);
		listener.addParent(this as any);
		listener.on();
		return listener;
	}
	public off(eventName: IListener<TEvents>['eventName'], callback?: IListener<TEvents>['callback']): void {
		const listeners = this.findListeners(eventName, callback);
		for (const listener of listeners) {
			this.removeListener(listener);
		}
	}
	public emit(eventName: IListener<TEvents>['eventName'], ...args: any[]) {
		const listeners = [...this._listeners];
		for (const listener of listeners) {
			if (listener.eventName !== eventName) continue;
			try {
				listener.callback(...args);
			} catch (e) {
				console.error(e);
			}
			if (listener.isOne) {
				listener.off();
			}
		}
	}

	public findListeners(eventName: IListener<TEvents>['eventName'], callback?: IListener<TEvents>['callback']): Listener[] {
		return this._listeners.filter(_listener => {
			const isSameEventName = _listener.eventName === eventName;
			const isSameCallback = !callback || _listener.callback === callback;
			return isSameCallback && isSameEventName;
		});
	}
	public existsListener(listener: Listener): boolean {
		return !!this._listeners.find(_listener => _listener === listener);
	}
	public addListener(listener: Listener): void {
		if (this.existsListener(listener)) {
			return;
		}
		this._listeners.push(listener);
	}
	public removeListener(listener: Listener): void {
		this._listeners = this._listeners.filter(_listener => _listener !== listener);
	}
}

export class Listener {
	protected _parents: EventEmitter[] = [];
	public get parents() {
		return this._parents;
	}
	public get eventName() {
		return this._eventName;
	}
	public get callback() {
		return this._callback;
	}
	public get isOne() {
		return this._isOne;
	}
	public get isListen(): boolean {
		return !!this.parents.find(_parent => _parent.existsListener(this));
	}
	constructor(
		protected _eventName: IListener<any>['eventName'],
		protected _callback: IListener<any>['callback'],
		protected _isOne: IListener<any>['isOne'],
	) {}

	public addParent(parent: EventEmitter) {
		this._parents.push(parent);
	}
	public removeParent(parent: EventEmitter) {
		parent.removeListener(this);
		this._parents = this._parents.filter(_parent => _parent !== parent);
	}
	public on(parent?: EventEmitter) {
		if (parent) {
			return void parent.addListener(this);
		}
		for (const parent of this.parents) {
			parent.addListener(this);
		}
	}
	public off(parent?: EventEmitter) {
		if (parent) {
			return void parent.removeListener(this);
		}
		for (const parent of this.parents) {
			parent.removeListener(this);
		}
	}
	public remove(parent?: EventEmitter) {
		this.off(parent);
	}
}

export interface IListener<TEvents> {
	eventName: TEvents;
	callback: IListenerCallback;
	isOne?: boolean;
}
export type IListenerCallback = (...args: any[]) => void;