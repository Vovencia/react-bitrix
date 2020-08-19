import moment from 'moment';
import {Workspace} from "../../utils/workspace";
import {safe} from "~utils/safe";
import {noop} from "~utils/noop";

let consoleLog = noop;
let consoleWarn = noop;
let consoleError = noop;

safe(() => {
	if ((globalThis as any).__consoleLog) {
		consoleLog = (globalThis as any).__consoleLog;
	} else {
		consoleLog = console.log;
	}
	if ((globalThis as any).__consoleWarn) {
		consoleWarn = (globalThis as any).__consoleWarn;
	} else {
		consoleWarn = console.warn || console.log;
	}
	if ((globalThis as any).__consoleError) {
		consoleError = (globalThis as any).__consoleError;
	} else {
		consoleError = console.error;
	}
});

class Logging {
	protected _workspace = new Workspace;
	protected _isLogEnabled = !this._workspace.isProd;
	protected _isErrorEnabled = true;

	public get time() {
		return moment().format('HH:mm:ss');
	}
	public log = (...args: any[]) => {
		if (!this._isLogEnabled) return;
		safe(() => consoleLog.call(console,'[Log]', `[${this.time}]`, ...args));
	}
	public warn = (...args: any[]) => {
		if (!this._isErrorEnabled) return;
		safe(() => consoleWarn.call(console,'[Warn]', `[${this.time}]`, ...args));
	}
	public error = (...args: any[]) => {
		if (!this._isErrorEnabled) return;
		safe(() => consoleError.call(console,'[Error]', `[${this.time}]`, ...args));
	}
}

export const logging = new Logging();

safe(() => {
	safe(() => {
		if (!(globalThis as any).__consoleLog) {
			(globalThis as any).__consoleLog = console.log;
		}
		if (!(globalThis as any).__consoleWarn) {
			(globalThis as any).__consoleWarn = console.warn;
		}
		if (!(globalThis as any).__consoleError) {
			(globalThis as any).__consoleError = console.error;
		}
	});
	try {
		if ((globalThis as any).__loggingChanged) return;
	} catch (e) {}
	console.log = logging.log;
	console.warn = logging.warn;
	console.error = logging.error;
	try {
		(globalThis as any).__loggingChanged = true;
	} catch (e) {}
});