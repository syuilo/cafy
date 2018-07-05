import Context from '../ctx';

export const isABoolean = x => typeof x == 'boolean';
export const isNotABoolean = x => !isABoolean(x);

/**
 * Boolean
 */
export default class BooleanContext extends Context<boolean> {
	constructor() {
		super();

		this.push(v =>
			isNotABoolean(v)
				? new Error('must-be-a-boolean')
				: true
		);
	}

	public getType(): string {
		return 'boolean';
	}
}
