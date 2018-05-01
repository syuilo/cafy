import autobind from './autobind';
import Validator from './validator';

/**
 * クエリ基底クラス
 */
abstract class Query<T> {
	private isOptional = false;
	private isNullable = false;

	private validators: Validator<T>[] = [];
	protected transform: (value: any) => T;

	/**
	 * バリデーションを追加します
	 * @param validator バリデータ
	 * @param name バリデータ名
	 */
	@autobind
	protected push(validator: Validator<T>, name?: string) {
		validator.toString = name ? () => name : () => null;
		this.validators.push(validator);
	}

	private exec(value: any): Error;
	private exec(value: any, withValue: boolean): [any, Error];
	@autobind
	private exec(value: any, withValue?: boolean): Error | [any, Error] {
		function res(val, err) {
			return withValue ? [val, err] : err;
		}

		if (this.isOptional && (value === undefined)) return res(value, null);
		if (this.isNullable && (value === null)) return res(value, null);

		if (!this.isOptional && (value === undefined)) return res(null, new Error('must-be-not-undefined'));
		if (!this.isNullable && (value === null)) return res(null, new Error('must-be-not-null'));

		if (this.transform) value = this.transform(value);

		let err = null;
		this.validators.some(validate => {
			const result = validate(value);
			if (result === false) {
				err = new Error('something-happened');
				return true;
			} else if (result instanceof Error) {
				err = result;
				return true;
			} else {
				return false;
			}
		});

		return res(value, err);
	}

	/**
	 * 値を検証して、バリデーションに不合格なら Error をthrowします。
	 */
	@autobind
	public throw(value: any): void {
		const [v, e] = this.exec(value, true);

		if (e) {
			throw e;
		} else {
			return v;
		}
	}

	/**
	 * 値を検証して、妥当な場合は null を、そうでない場合は Error を返します。
	 */
	@autobind
	public test(value: any): Error {
		return this.exec(value);
	}

	/**
	 * 値を検証して、妥当な場合は true を、そうでない場合は false を返します
	 */
	@autobind
	public ok(value: any): boolean {
		return this.test(value) == null;
	}

	/**
	 * 値を検証して、妥当な場合は false を、そうでない場合は true を返します
	 */
	@autobind
	public nok(value: any): boolean {
		return !this.ok(value);
	}

	/**
	 * 値を検証して、値およびエラーを取得します
	 */
	@autobind
	public get(value: any): [T, Error] {
		return this.exec(value, true);
	}

	/**
	 * このインスタンスの値に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param validator バリデータ
	 */
	@autobind
	public pipe(validator: Validator<T>) {
		this.push(validator, 'pipe');
		return this;
	}

	/**
	 * undefined を許可するか否かを設定します。
	 * @param optional 許可するか否か
	 */
	@autobind
	public optional(optional = true) {
		this.isOptional = optional;
		return this;
	}

	/**
	 * null を許可するか否かを設定します。
	 * @param nullable 許可するか否か
	 */
	@autobind
	public nullable(nullable = true) {
		this.isNullable = nullable;
		return this;
	}

	/**
	 * このcafyインスタンスを表す文字列を取得します
	 */
	@autobind
	public toString(verbose = false) {
		return this.constructor.name + ' ' + (verbose
			? `(${this.validators.map(v => v.toString() || '[anonymous]').join(' > ')})`
			: `(${this.validators.map(v => v.toString()).filter(n => n != null).join(' > ')})`);
	}
}

export default Query;
