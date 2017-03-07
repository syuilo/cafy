import autobind from './autobind';
import Validator from './validator';

/**
 * クエリベース
 */
abstract class Query<T> {
	private value: T = undefined;
	private optional: boolean;
	private nullable: boolean;
	private lazy: boolean = false;

	private validators: {
		validate: Validator<T>;
		postfx?: any;
	}[] = [];

	constructor(optional: boolean, nullable: boolean, lazy: boolean, value?: any) {
		this.optional = optional;
		this.nullable = nullable;
		this.lazy = lazy;
		this.value = value;
		this.pushValidator(v => {
			if (!optional && v === undefined) return new Error('must-be-not-undefined');
			if (!nullable && v === null) return new Error('must-be-not-null');
			return true;
		});
	}

	protected pushValidator(validator: Validator<T>, postFx?: any) {
		this.validators.push({
			validate: validator,
			postfx: postFx
		});
	}

	private exec(value: any): Error;
	private exec(value: any, withValue: boolean): [any, Error];
	@autobind
	private exec(value: any, withValue?: boolean): Error | [any, Error] {
		if (this.optional && value === undefined) return withValue ? [value, null] : null;
		if (this.nullable && value === null) return withValue ? [value, null] : null;

		let err = null;
		this.validators.some(validator => {
			const result = validator.validate(value);
			if (result === false) {
				err = new Error('something-happened');
				return true;
			} else if (result instanceof Error) {
				err = result;
				return true;
			} else {
				if (validator.postfx) value = validator.postfx(value);
				return false;
			}
		});

		if (withValue) {
			return [value, err];
		} else {
			return err;
		}
	}

	/**
	 * 値を検証して、妥当な場合は null を、そうでない場合は Error を返します。
	 */
	@autobind
	test(value?: any): Error {
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
	isOk(value?: any): boolean {
		return this.test(value) == null;
	}

	/**
	 * 値を検証して、妥当な場合は false を、そうでない場合は true を返します
	 */
	@autobind
	isNg(value?: any): boolean {
		return !this.isOk(value);
	}

	/**
	 * 値を検証して、値およびエラーを取得します
	 */
	get $(): [T, Error] {
		if (this.lazy) throw new Error('このインスタンスには値がセットされていません');
		return this.exec(this.value, true);
	}

	/**
	 * このインスタンスの値に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param validator バリデータ
	 */
	pipe(validator: Validator<T>) {
		this.pushValidator(validator);
		return this;
	}
}

export default Query;
