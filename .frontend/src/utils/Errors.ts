import { logging } from './logging';

export const NativeError = Error;
export class RBError extends NativeError {
	constructor(public message: string) {
		super(message);
		/**
		 * restore prototype chain
		 * Это нужно для того, чтобы работал "instance instanceof AbrError"
		 * т.к. Error подменяет this на свой
		 */
		const actualProto = new.target.prototype;
		if ((Object as any).setPrototypeOf) {
			(Object as any).setPrototypeOf(this, actualProto);
		} else {
			(this as any).__proto__ = actualProto;
		}
		logging.error(this);
	}
}
export class RuntimeError extends RBError {}
export class ResponseError extends RBError {
	constructor(public message: string, public code = 0, public responseMessage = message) { super(message); }
}
export class ValueValidationError extends RuntimeError {}
export class CancelError extends RBError {
	constructor(public message = 'Действие отменено') {
		super(message);
	}
}
