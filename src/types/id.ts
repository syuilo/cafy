import * as mongo from 'mongodb';
import { Query, fx } from '../query';
import Validator from '../validator';

export default class IdQuery extends Query {
	value: mongo.ObjectID;
	error: Error;

	constructor(value: any, nullable: boolean = false) {
		super(value, nullable);
		if (!this.isEmpty && !mongo.ObjectID.prototype.isPrototypeOf(value)) {
			if (mongo.ObjectID.isValid(value)) {
				this.value = new mongo.ObjectID(value);
			} else {
				this.error = new Error('must-be-an-id');
			}
		}
	}

	/**
	 * このインスタンスの値およびエラーを取得します
	 */
	get(): [mongo.ObjectID, Error] {
		return super.get();
	}

	/**
	 * このインスタンスの値に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param validator バリデータ
	 */
	validate(validator: Validator<mongo.ObjectID>) {
		return super.validate(validator);
	}
}
