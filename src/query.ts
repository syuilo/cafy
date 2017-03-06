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
	private lazy: boolean = false;

	private validators: Validator<T>[] = [];

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

	protected pushValidator(validator: Validator<T>) {
		if (this.isSafe) {
			if (this.lazy) {
				this.validators.push(validator);
			} else {
				this.execValidator(validator);
			}
		}
	}

	@autobind
	protected execValidator(validator: Validator<T>): boolean {
		if (this.optional && this.value === undefined) return true;
		if (this.nullable && this.value === null) return true;

		const result = validator(this.value);
		if (result === false) {
			this.error = new Error('something-happened');
			return true;
		} else if (result instanceof Error) {
			this.error = result;
			return true;
		}
		return false;
	}

	/**
	 * スタックにあるバリデーションを走査&実行します
	 */
	protected eval(): void {
		this.validators.some(this.execValidator);
	}

	protected get isSafe() {
		return this.error === null;
	}

	/**
	 * 妥当な値かどうかを取得します
	 */
	get isValid(): boolean {
		if (this.lazy) throw new Error('このインスタンスには値がセットされていません');
		return this.error == null;
	}

	/**
	 * エラーを取得します
	 */
	@autobind
	test(value: any): Error {
		if (!this.lazy) throw new Error('このインスタンスには既に値がセットされています');
		this.value = value;
		this.eval();
		return this.error;
	}

	/**
	 * このインスタンスのエラーを取得します
	 */
	get result(): Error {
		if (this.lazy) throw new Error('このインスタンスには値がセットされていません');
		return this.error;
	}

	/**
	 * このインスタンスの値およびエラーを取得します
	 */
	get qed(): [T, Error] {
		if (this.lazy) throw new Error('このインスタンスには値がセットされていません');
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
