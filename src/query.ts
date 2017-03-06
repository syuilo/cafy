import autobind from './autobind';
import Validator from './validator';

/**
 * クエリベース
 */
abstract class Query<T> {
	protected value: T = undefined;
	private error: Error = null;
	private optional: boolean;
	private nullable: boolean;

	private validators: Validator<T>[] = [];

	constructor(optional = false, nullable = false, value?: any) {
		this.optional = optional;
		this.nullable = nullable;
		this.value = value;
		this.pushValidator(v => {
			if (!optional && v === undefined) return new Error('must-be-not-undefined');
			if (!nullable && v === null) return new Error('must-be-not-null');
			return true;
		});
	}

	protected pushValidator(validator: Validator<T>) {
		if (this.isSafe) {
			this.validators.push(validator);
		}
	}

	/**
	 * スタックにあるバリデーションを走査実行し、妥当な場合は null を、そうでない場合は Error を返します
	 */
	protected eval() {
		if (this.optional && this.value === undefined) return null;
		if (this.nullable && this.value === null) return null;

		this.validators.some(validator => {
			const result = validator(this.value);
			if (result === false) {
				this.error = new Error('something-happened');
				return true;
			} else if (result instanceof Error) {
				this.error = result;
				return true;
			}
			return false;
		});

		return this.error;
	}

	protected get isSafe() {
		return this.error === null;
	}

	/**
	 * テストして結果を取得します。
	 * テストに合格した場合は`null`を、そうでない場合は`Error`を返します。
	 * @param value テストする値
	 */
	@autobind
	test(value?: any): Error {
		if (arguments.length != 0) this.value = value;
		return this.eval();
	}

	/**
	 * このインスタンスの値およびエラーを取得します
	 */
	get(): [T, Error] {
		this.eval();
		return [this.value, this.error];
	}

	/**
	 * このインスタンスの値に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param validator バリデータ
	 */
	validate(validator: Validator<T>) {
		this.pushValidator(validator);
		return this;
	}
}

export default Query;
