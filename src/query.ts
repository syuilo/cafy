import autobind from './autobind';
import Validator from './validator';

/**
 * クエリ基底クラス
 */
abstract class Query<T> {
	private value: T = undefined;
	private isOptional: boolean;
	private isNullable: boolean;
	private lazy: boolean = false;

	private validators: Validator<T>[] = [];

	constructor(...args) {
		const [optional, nullable, lazy, value] = args;
		this.isOptional = optional;
		this.isNullable = nullable;
		this.lazy = lazy;
		this.value = value;
	}

	/**
	 * バリデーションを追加します
	 * @param validator バリデータ
	 * @param name バリデータ名
	 */
	protected pushValidator(validator: Validator<T>, name?: string) {
		validator.toString = name ? () => name : () => null;
		this.validators.push(validator);
	}

	/**
	 * 最初のバリデーションを追加します
	 * @param validator バリデータ
	 */
	protected pushFirstTimeValidator(validator: Validator<any>) {
		validator.toString = () => null;
		this.validators.push(validator);
	}

	private exec(value: any): Error;
	private exec(value: any, withValue: boolean): [any, Error];
	@autobind
	private exec(value: any, withValue?: boolean): Error | [any, Error] {
		function res(val, err) {
			return withValue ? [val, err] : err;
		}

		if (this.isOptional && value === undefined) return res(value, null);
		if (this.isNullable && value === null) return res(value, null);

		if (!this.isOptional && value === undefined) return res(null, new Error('must-be-not-undefined'));
		if (!this.isNullable && value === null) return res(null, new Error('must-be-not-null'));

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
	 * 値を検証して、妥当な場合は null を、そうでない場合は Error を返します。
	 */
	@autobind
	public test(value?: any): Error {
		if (this.lazy) {
			if (arguments.length == 0) throw new Error('値が指定されていません');
			return this.exec(value);
		} else {
			return this.exec(this.value);
		}
	}

	/**
	 * 値を検証して、妥当な場合は true を、そうでない場合は false を返します
	 */
	@autobind
	public ok(value?: any): boolean {
		return this.test(value) == null;
	}

	/**
	 * 値を検証して、妥当な場合は false を、そうでない場合は true を返します
	 */
	@autobind
	public nok(value?: any): boolean {
		return !this.ok(value);
	}

	/**
	 * 値を検証して、値およびエラーを取得します
	 */
	public get $(): [T, Error] {
		if (this.lazy) throw new Error('このインスタンスには値がセットされていません');
		return this.exec(this.value, true);
	}

	/**
	 * このインスタンスの値に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param validator バリデータ
	 */
	public pipe(validator: Validator<T>) {
		this.pushValidator(validator, 'pipe');
		return this;
	}

	/**
	 * undefined を許可するか否かを設定します。
	 * @param optional 許可するか否か
	 */
	public optional(optional = true) {
		this.isOptional = optional;
		return this;
	}

	/**
	 * null を許可するか否かを設定します。
	 * @param nullable 許可するか否か
	 */
	public nullable(nullable = true) {
		this.isNullable = nullable;
		return this;
	}

	/**
	 * このcafyインスタンスを表す文字列を取得します
	 */
	public toString(verbose = false) {
		return this.constructor.name + ' ' + (verbose
			? `(${this.validators.map(v => v.toString() || '[anonymous]').join(' > ')})`
			: `(${this.validators.map(v => v.toString()).filter(n => n != null).join(' > ')})`);
	}
}

export default Query;
