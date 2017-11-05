import Query from '../query';

export const isAnObject = x => typeof x == 'object' && !(x instanceof Array);
export const isNotAnObject = x => !isAnObject(x);

/**
 * Object
 */
export default class ObjectQuery extends Query<object> {
	private mentions: string[] = [];

	constructor(optional: boolean, nullable: boolean, lazy: boolean, value?: any, strict?: boolean) {
		super(optional, nullable, lazy, value);

		this.pushFirstTimeValidator(v =>
			isNotAnObject(v)
				? new Error('must-be-an-object')
				: true
		);

		if (strict) {
			this.pushValidator(v => {
				const properties = Object.keys(v);
				const hasNotMentionedProperty = properties.some(p => this.mentions.some(m => m != p));
				if (hasNotMentionedProperty) return new Error('dirty-object');
				return true;
			});
		}
	}

	/**
	 * 指定されたプロパティに対して妥当性を検証します
	 * プロパティが存在しない場合無視されます
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param name プロパティ名
	 * @param validator バリデータ
	 */
	public prop(name: string, validator: ((prop: any) => boolean | Error) | Query<any>) {
		this.mentions.push(name);
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
		}, 'prop');
		return this;
	}

	/**
	 * 指定されたプロパティに対して妥当性を検証します
	 * プロパティが存在しない場合エラーにします
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param name プロパティ名
	 * @param validator バリデータ
	 */
	public have(name: string, validator?: ((prop: any) => boolean | Error) | Query<any>) {
		this.mentions.push(name);
		validator = arguments.length == 1 ? () => true : validator;
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
		}, 'have');
		return this;
	}
}
