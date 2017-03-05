import Query from '../query';
import Validator from '../validator';

export default class BooleanQuery extends Query {
	value: boolean;
	error: Error;

	constructor(value: any, nullable: boolean = false) {
		super(value, nullable);
		if (!this.isEmpty && typeof value != 'boolean') {
			this.error = new Error('must-be-a-boolean');
		}
	}

	/**
	 * このインスタンスの値およびエラーを取得します
	 */
	get(): [boolean, Error] {
		return super.get();
	}

	/**
	 * このインスタンスの値に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param validator バリデータ
	 */
	validate(validator: Validator<boolean>) {
		return super.validate(validator);
	}
}
