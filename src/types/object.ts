import Query from '../query';

export const isAnObject = x => typeof x == 'object';
export const isNotAnObject = x => !isAnObject(x);

export default class ObjectQuery extends Query<any> {
	constructor(optional: boolean, nullable: boolean, lazy: boolean, value?: any) {
		super(optional, nullable, lazy, value);
		this.pushValidator(v => {
			if (isNotAnObject(v)) return new Error('must-be-an-object');
			return true;
		});
	}

	/**
	 * 指定されたプロパティに対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param name プロパティ名
	 * @param validator バリデータ
	 */
	prop(name: string, validator: ((prop: any) => boolean | Error) | Query<any>) {
		const validate = validator instanceof Query ? validator.test : validator;
		this.pushValidator(v => {
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
