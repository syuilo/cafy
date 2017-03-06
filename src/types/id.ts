import * as mongo from 'mongodb';
import Query from '../query';
import { isAnId, isNotAnId } from '../core';

export default class IdQuery extends Query<mongo.ObjectID> {

	constructor(optional: boolean, nullable: boolean, lazy: boolean, value?: any) {
		super(optional, nullable, lazy, value);
		this.pushValidator((v: any) => {
			if (!mongo.ObjectID.prototype.isPrototypeOf(v)) {
				if (isAnId(v)) {
					this.value = new mongo.ObjectID(v);
				} else {
					return new Error('must-be-an-id');
				}
			}
			return true;
		});
	}
}
