import Validator from './validator';

function fx() {
	return function(target, key: string, descripter: PropertyDescriptor) {
		const original = descripter.value;
		descripter.value = function(...args) {
			return this.shouldSkip ? this : original.call(this, ...args);
		};
	};
}

/**
 * クエリベース
 */
abstract class Query<T> {
	protected value: T;
	protected error: Error;

	constructor(value: any, nullable: boolean = false) {
		if (value === null && !nullable) {
			this.value = undefined;
			this.error = new Error('must-be-not-a-null');
		} else {
			this.value = value;
			this.error = null;
		}
	}

	protected get isUndefined() {
		return this.value === undefined;
	}

	protected get isNull() {
		return this.value === null;
	}

	protected get isEmpty() {
		return this.isUndefined || this.isNull;
	}

	/**
	 * このインスタンスの値が空、またはエラーが存在しているなどして、処理をスキップするべきか否か
	 */
	protected get shouldSkip() {
		return this.error !== null || this.isEmpty;
	}

	/**
	 * このインスタンスの値が指定されていない(=undefined)ときにエラーにします
	 */
	required() {
		if (this.error === null && this.isUndefined) {
			this.error = new Error('required');
		}
		return this;
	}

	/**
	 * このインスタンスの値が妥当かをチェックします
	 */
	get isValid(): boolean {
		return this.error === null;
	}

	/**
	 * このインスタンスの値およびエラーを取得します
	 */
	get(): [T, Error] {
		return [this.value, this.error];
	}

	/**
	 * このインスタンスのエラーを取得します
	 */
	check(): Error {
		return this.error;
	}

	/**
	 * このインスタンスの値に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param validator バリデータ
	 */
	@fx()
	validate(validator: Validator<T>) {
		const result = validator(this.value);
		if (result === false) {
			this.error = new Error('invalid-format');
		} else if (result instanceof Error) {
			this.error = result;
		}
		return this;
	}
}

export {
	Query,
	fx
};
