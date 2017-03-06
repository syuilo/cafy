import { Query, fx } from '../query';
import { isNotAnObject } from '../core';

export default class ObjectQuery extends Query<any> {

	constructor(value: any, nullable: boolean = false) {
		super(value, nullable);
		if (!this.isEmpty && isNotAnObject(value)) {
			this.error = new Error('must-be-an-object');
		}
	}
}
