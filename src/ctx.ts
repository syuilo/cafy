import autobind from './autobind';
import Validator from './validator';

/**
 * Context基底クラス
 */
abstract class Context<T = any> {
	public isOptional = false;
	public isNullable = false;

	public data: any;

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
	 * このインスタンスに任意のデータを保存します
	 * @param data データ
	 */
	@autobind
	public note(data: any) {
		this.data = data;
		return this;
	}

	/**
	 * undefined を許可します。
	 */
	get optional() {
		this.isOptional = true;
		return this;
	}

	/**
	 * null を許可します。
	 */
	get nullable() {
		this.isNullable = true;
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

	/**
	 * このcafyインスタンスの型を表す文字列を取得します
	 */
	public getType() {
		return '?';
	}
}

export default Context;
