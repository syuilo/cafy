import { Query, fx } from '../query';
import { isNotABoolean } from '../core';

export default class BooleanQuery extends Query<boolean> {

	constructor(value: any, nullable: boolean = false) {
		super(value, nullable);
		if (!this.isEmpty && isNotABoolean(value)) {
			this.error = new Error('must-be-a-boolean');
		}
	}
}
