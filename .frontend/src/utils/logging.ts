import moment from 'moment';
import {Workspace} from "../../utils/workspace";
import {safe} from "~utils/safe";
import {noop} from "~utils/noop";
import {call} from "~utils/call";

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
		this.consoleCall('log', args);
	}
	public warn = (...args: any[]) => {
		this.consoleCall('warn', args);
	}
	public error = (...args: any[]) => {
		this.consoleCall('error', args);
	}
	protected consoleCall(type: 'log' | 'warn' | 'error', args: any[]) {
		if (type === 'log' && !this._isLogEnabled) return;
		if (!this._isErrorEnabled) return;
		const stack = this._workspace.isDev ? this.getStack() : [];
		stack.shift();
		stack.shift();
		const method = call(() => {
			if (type === 'error') return consoleError;
			if (type === 'warn') return consoleWarn;
			return consoleLog;
		});
		let typeName: string | string[] = type.split('');
		typeName[0] = typeName[0].toUpperCase();
		typeName = typeName.join('');
		const typeNameValue = `[${typeName}]`;
		const timeValue = `[${this.time}]`
		const stackValue = stack.length ? `\n${stack.join('\n')}` : undefined;
		safe(() => {
			method.call(
				console,
				typeNameValue,
				timeValue,
				...args,
				stackValue
			);
		});
	}
	public getStack(): string[] {
		try {
			let stack = (new Error().stack || '').split('\n');
			stack.shift();
			stack.shift();
			stack = stack.map(line => line.trim());
			return stack;
		} catch (e) {
			return [];
		}
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