import { Query, fx } from '../query';
import Validator from '../validator';

export default class ObjectQuery extends Query {
	value: any;
	error: Error;

	constructor(value: any, nullable: boolean = false) {
		super(value, nullable);
		if (!this.isEmpty && typeof value != 'object') {
			this.error = new Error('must-be-an-object');
		}
	}

	/**
	 * このインスタンスの値およびエラーを取得します
	 */
	get(): [any, Error] {
		return super.get();
	}

	/**
	 * このインスタンスの値に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param validator バリデータ
	 */
	validate(validator: Validator<any>) {
		return super.validate(validator);
	}
}
