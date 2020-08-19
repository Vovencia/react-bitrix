import {createWorker} from "~utils/createWorker";

export class BackgroundInterval {
	protected _lastId = 0;
	public newId() {
		return ++this._lastId;
	}
	protected _lastRpcId = 0;
	public get newRpcId() {
		return ++this._lastRpcId;
	}

	protected callbacks: {[key: number]: () => void} = {};
	protected worker = createWorker(function(){
		// rAF polyfill without setTimeout, ref: https://gist.github.com/paulirish/1579671
		const vendors: string[] = ['ms', 'moz', 'webkit', 'o'];
		for(let x = 0; x < vendors.length && !self.requestAnimationFrame; ++x) {
			self.requestAnimationFrame = (self as any)[vendors[x]+'RequestAnimationFrame'];
			self.cancelAnimationFrame = (self as any)[vendors[x]+'CancelAnimationFrame']
				|| (self as any)[vendors[x]+'CancelRequestAnimationFrame'];
		}
		const raf: {[key: number]: any} = {};
		self.addEventListener('message', function(response) {
			const data = response.data;
			const id = data.id;
			if (data.type !== 'RPC' || id === null) {
				return;
			}
			let intervalId: number;
			switch(data.method){
				case 'setInterval':
					intervalId = data.params[0];
					const intervalDelay: any = data.params[1];
					if (intervalId && typeof intervalDelay === 'number') {
						if (raf[intervalId]) {
							self.clearInterval(raf[intervalId]);
						}
						raf[intervalId] = self.setInterval(function() {
							(self as any).postMessage({ type: 'interval', id: intervalId });
						}, intervalDelay);
						(self as any).postMessage({ type: 'RPC', id: id, result: intervalId });
					}
					break;
				case 'clearInterval':
					intervalId = data.params[0];
					self.clearInterval(raf[intervalId]);
					delete raf[intervalId];
					break;
			}
		});
	});

	constructor() {
		this.worker.addEventListener('message', (response) => {
			const data = response.data;
			if (data && data.type === 'interval' && this.callbacks[data.id]) {
				this.callbacks[data.id]();
			}
		});
	}

	protected async rpc(method: string, params: any[]) {
		const rpcId = this.newRpcId;
		await new Promise(resolve => {
			const handler = (response: MessageEvent) => {
				const data = response.data;
				if (data && data.type === 'RPC' && data.id === rpcId) {
					resolve(data.result);
					this.worker.removeEventListener('message', handler);
				}
			}
			this.worker.addEventListener('message', handler);
			this.worker.postMessage({ type: 'RPC', method: method, id: rpcId, params: params });
		});
	}

	public set(fn: () => void, delay: number): {id: number, promise: Promise<any>} {
		const intervalId = this.newId();
		this.callbacks[intervalId] = fn;
		const promise = this.rpc('setInterval', [intervalId, delay]);
		return {id: intervalId, promise};
	}
	public async remove(id: number) {
		delete this.callbacks[id];
		await this.rpc('clearInterval', [id]);
	}
}