import {safe} from "~utils/safe";

let listeners: Array<() => void> = [];
let isReady = false;

console.log('ready.ts');

export function ready(listenerOrIsReady: (() => void) | true) {
	if (listenerOrIsReady === true) {
		isReady = true;
		for (const listener of listeners) {
			safe(listener);
		}
		listeners = [];
		return;
	}
	if (typeof listenerOrIsReady === 'function') {
		if (isReady){
			return void safe(listenerOrIsReady);
		}
		listeners.push(listenerOrIsReady);
	}
}

safe(() => {
	(window as any).__ready = ready;
});