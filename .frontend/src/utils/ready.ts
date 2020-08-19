import {safe} from "~utils/safe";

let listeners: Array<() => void> = [];
let isReady = false;

export function ready(fnOrTrue: (() => void) | true) {
	if (fnOrTrue === true) {
		isReady = true;
		for (const listener of listeners) {
			safe(listener);
		}
		listeners = [];
		return;
	}
	if (typeof fnOrTrue === 'function') {
		if (isReady) {
			return void safe(fnOrTrue);
		}
		listeners.push(fnOrTrue);
	}
}

safe(() => {
	(window as any).__ready = ready;
});