import Context from '../ctx';

/**
 * Any
 */
export default class AnyContext<T = any, Maybe extends null | undefined | T = T> extends Context<T | Maybe> {
	public getType(): string {
		return super.getType('any');
	}

	//#region ✨ Some magicks ✨
	public makeOptional(): AnyContext<T, undefined> {
		return new AnyContext(true, false);
	}

	public makeNullable(): AnyContext<T, null> {
		return new AnyContext(false, true);
	}

	public makeOptionalNullable(): AnyContext<T, undefined | null> {
		return new AnyContext(true, true);
	}
	//#endregion
}
