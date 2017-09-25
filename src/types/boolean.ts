import Query from '../query';

export const isABoolean = x => typeof x == 'boolean';
export const isNotABoolean = x => !isABoolean(x);

/**
 * Boolean
 */
export default class BooleanQuery extends Query<boolean> {
	constructor(optional: boolean, nullable: boolean, lazy: boolean, value?: any) {
		super(optional, nullable, lazy, value);

		this.pushFirstTimeValidator(v =>
			isNotABoolean(v)
				? new Error('must-be-a-boolean')
				: true
		);
	}
}
