import Query from '../query';
import { isNotAnObject } from '../core';

export default class ObjectQuery extends Query<any> {

	constructor(optional = false, nullable = false, value?: any) {
		super(optional, nullable, value);
		this.pushValidator(v => {
			if (isNotAnObject(v)) return new Error('must-be-an-object');
			return true;
		});
	}
}
