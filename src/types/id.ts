import * as mongo from 'mongodb';
import { Query, fx } from '../query';
import { isNotAnId } from '../core';

export default class IdQuery extends Query<mongo.ObjectID> {

	constructor(value: any, nullable: boolean = false) {
		super(value, nullable);
		if (!this.isEmpty && !mongo.ObjectID.prototype.isPrototypeOf(value)) {
			if (isNotAnId(value)) {
				this.value = new mongo.ObjectID(value);
			} else {
				this.error = new Error('must-be-an-id');
			}
		}
	}
}
