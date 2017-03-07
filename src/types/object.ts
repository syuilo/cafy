import Query from '../query';

export const isAnObject = x => typeof x == 'object';
export const isNotAnObject = x => !isAnObject(x);

export default class ObjectQuery extends Query<Object> {
	constructor(optional: boolean, nullable: boolean, lazy: boolean, value?: any) {
		super(optional, nullable, lazy, value);
		this.pushValidator(v => {
			if (isNotAnObject(v)) return new Error('must-be-an-object');
			return true;
		});
	}

	/**
	 * 指定されたプロパティに対して妥当性を検証します
	 * プロパティが存在しない場合無視されます
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param name プロパティ名
	 * @param validator バリデータ
	 */
	prop(name: string, validator: ((prop: any) => boolean | Error) | Query<any>) {
		const validate = validator instanceof Query ? validator.test : validator;
		this.pushValidator(v => {
			if (!v.hasOwnProperty(name)) return true;
			const result = validate(v[name]);
			if (result === false) {
				return new Error('invalid-prop');
			} else if (result instanceof Error) {
				return result;
			} else {
				return true;
			}
		});
		return this;
	}

	/**
	 * 指定されたプロパティに対して妥当性を検証します
	 * プロパティが存在しない場合エラーにします
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param name プロパティ名
	 * @param validator バリデータ
	 */
	have(name: string, validator: ((prop: any) => boolean | Error) | Query<any>) {
		const validate = validator instanceof Query ? validator.test : validator;
		this.pushValidator(v => {
			if (!v.hasOwnProperty(name)) return new Error('prop-required');
			const result = validate(v[name]);
			if (result === false) {
				return new Error('invalid-prop');
			} else if (result instanceof Error) {
				return result;
			} else {
				return true;
			}
		});
		return this;
	}
}
