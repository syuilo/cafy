import * as mongo from 'mongodb';
import Query from '../query';

export const isAnId = x => mongo.ObjectID.isValid(x);
export const isNotAnId = x => !isAnId(x);

/**
 * ID
 */
export default class IdQuery extends Query<mongo.ObjectID> {
	constructor(optional: boolean, nullable: boolean, lazy: boolean, value?: any) {
		super(optional, nullable, lazy, value);

		this.transformer = v => {
			if (isAnId(v) && !mongo.ObjectID.prototype.isPrototypeOf(v)) {
				return new mongo.ObjectID(v);
			} else {
				return v;
			}
		};

		this.pushValidator((v: any) => {
			if (!mongo.ObjectID.prototype.isPrototypeOf(v) && isNotAnId(v)) {
				return new Error('must-be-an-id');
			}
			return true;
		});
	}
}
