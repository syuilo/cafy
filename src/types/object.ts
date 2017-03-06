import Query from '../query';
import { isNotAnObject } from '../core';

export default class ObjectQuery extends Query<any> {

	constructor(optional: boolean, nullable: boolean, lazy: boolean, value?: any) {
		super(optional, nullable, lazy, value);
		this.pushValidator(v => {
			if (isNotAnObject(v)) return new Error('must-be-an-object');
			return true;
		});
	}
}
