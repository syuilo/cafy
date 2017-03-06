import Query from '../query';
import { isNotABoolean } from '../core';

export default class BooleanQuery extends Query<boolean> {

	constructor(optional = false, nullable = false, value?: any) {
		super(optional, nullable, value);
		this.pushValidator(v => {
			if (isNotABoolean(v)) return new Error('must-be-a-boolean');
			return true;
		});
	}
}
