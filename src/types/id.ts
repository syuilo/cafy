import * as mongo from 'mongodb';
import Query from '../query';

export const isAnId = x => mongo.ObjectID.isValid(x);
export const isNotAnId = x => !isAnId(x);

export default class IdQuery extends Query<mongo.ObjectID> {
	constructor(optional: boolean, nullable: boolean, lazy: boolean, value?: any) {
		super(optional, nullable, lazy, value);
		this.pushValidator((v: any) => {
			if (!mongo.ObjectID.prototype.isPrototypeOf(v) && !isAnId(v)) {
				return new Error('must-be-an-id');
			}
			return true;
		}, v => {
			if (mongo.ObjectID.prototype.isPrototypeOf(v)) {
				return v;
			} else {
				return new mongo.ObjectID(v);
			}
		});
	}
}
