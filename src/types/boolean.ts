import Context from '../ctx';

export const isABoolean = x => typeof x == 'boolean';
export const isNotABoolean = x => !isABoolean(x);

/**
 * Boolean
 */
export default class BooleanContext<Maybe = boolean> extends Context<boolean | Maybe> {
	public readonly name = 'Boolean';

	constructor(optional = false, nullable = false) {
		super(optional, nullable);

		this.push(v =>
			isNotABoolean(v)
				? new Error('must-be-a-boolean')
				: true
		);
	}

	//#region ✨ Some magicks ✨
	public makeOptional(): BooleanContext<undefined> {
		return new BooleanContext(true, false);
	}

	public makeNullable(): BooleanContext<null> {
		return new BooleanContext(false, true);
	}

	public makeOptionalNullable(): BooleanContext<undefined | null> {
		return new BooleanContext(true, true);
	}
	//#endregion
}
