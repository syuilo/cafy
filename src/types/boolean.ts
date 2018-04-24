import Query from '../query';

export const isABoolean = x => typeof x == 'boolean';
export const isNotABoolean = x => !isABoolean(x);

/**
 * Boolean
 */
export default class BooleanQuery extends Query<boolean> {
	constructor(...args) {
		super(...args);

		this.pushFirstTimeValidator(v =>
			isNotABoolean(v)
				? new Error('must-be-a-boolean')
				: true
		);
	}
}
