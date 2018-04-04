import Query from '../query';
import $ from '../index';

export const isAnArray = x => Array.isArray(x);
export const isNotAnArray = x => !isAnArray(x);
const hasDuplicates = (array: any[]) => (new Set(array)).size !== array.length;

/**
 * Array
 */
export default class ArrayQuery<T, Q extends Query<any>> extends Query<T[]> {
	constructor(optional: boolean, nullable: boolean, lazy: boolean, value?: any, q?: Query<any>) {
		super(optional, nullable, lazy, value);

		this.pushFirstTimeValidator(v =>
			isNotAnArray(v)
				? new Error('must-be-an-array')
				: true
		);

		if (q) {
			this.each(q);
		}
	}

	/**
	 * 配列の値がユニークでない場合(=重複した項目がある場合)エラーにします
	 */
	public unique() {
		this.pushValidator(v =>
			hasDuplicates(v)
				? new Error('must-be-unique')
				: true
		, 'unique');
		return this;
	}

	/**
	 * 配列の長さが指定された範囲内にない場合エラーにします
	 * @param min 下限
	 * @param max 上限
	 */
	public range(min: number, max: number) {
		this.min(min);
		this.max(max);
		return this;
	}

	/**
	 * 配列の長さが指定された下限より下回っている場合エラーにします
	 * @param threshold 下限
	 */
	public min(threshold: number) {
		this.pushValidator(v =>
			v.length < threshold
				? new Error('invalid-range')
				: true
		, 'min');
		return this;
	}

	/**
	 * 配列の長さが指定された上限より上回っている場合エラーにします
	 * @param threshold 上限
	 */
	public max(threshold: number) {
		this.pushValidator(v =>
			v.length > threshold
				? new Error('invalid-range')
				: true
		, 'max');
		return this;
	}

	/**
	 * 指定された数の要素を持っていなければエラーにします
	 * @param length 要素数
	 */
	public length(length: number) {
		this.pushValidator(v =>
			v.length !== length
				? new Error('invalid-length')
				: true
		, 'length');
		return this;
	}

	/**
	 * 指定されたインデックスの要素に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param index インデックス
	 * @param validator バリデータ
	 */
	public item(index: number, validator: ((element: T) => boolean | Error) | Query<any>) {
		const validate = validator instanceof Query ? validator.test : validator;
		this.pushValidator(v => {
			const result = validate(v[index]);
			if (result === false) {
				return new Error('invalid-item');
			} else if (result instanceof Error) {
				return result;
			} else {
				return true;
			}
		}, 'item');
		return this;
	}

	/**
	 * 配列の各要素に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param validator バリデータ
	 */
	public each(validator: ((element: T, index: number, array: T[]) => boolean | Error) | Query<any>) {
		const validate = validator instanceof Query ? validator.test : validator;
		this.pushValidator(v => {
			let err: Error;
			v.some((x, i, s) => {
				const result = validate(x, i, s);
				if (result === false) {
					err = new Error('invalid-item');
					return true;
				} else if (result instanceof Error) {
					err = result;
					return true;
				} else {
					return false;
				}
			});
			if (err) return err;
			return true;
		}, 'each');
		return this;
	}
}
