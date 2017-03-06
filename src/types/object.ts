import { Query, fx } from '../query';

export default class ObjectQuery extends Query<any> {

	constructor(value: any, nullable: boolean = false) {
		super(value, nullable);
		if (!this.isEmpty && typeof value != 'object') {
			this.error = new Error('must-be-an-object');
		}
	}
}
