import Query from '../query';

export const isANumber = x => Number.isFinite(x);
export const isNotANumber = x => !isANumber(x);

/**
 * Number
 */
export default class NumberQuery extends Query<number> {
	constructor(optional: boolean, nullable: boolean, lazy: boolean, value?: any) {
		super(optional, nullable, lazy, value);

		this.pushValidator(v =>
			isNotANumber(v)
				? new Error('must-be-a-number')
				: true
		);
	}

	/**
	 * 値が指定された範囲内にない場合エラーにします
	 * @param min 下限
	 * @param max 上限
	 */
	public range(min: number, max: number) {
		this.min(min);
		this.max(max);
		return this;
	}

	/**
	 * このインスタンスの値が指定された下限より下回っている場合エラーにします
	 * @param threshold 下限
	 */
	public min(threshold: number) {
		this.pushValidator(v =>
			v < threshold
				? new Error('invalid-range')
				: true
		, 'min');
		return this;
	}

	/**
	 * このインスタンスの値が指定された上限より上回っている場合エラーにします
	 * @param threshold 上限
	 */
	public max(threshold: number) {
		this.pushValidator(v =>
			v > threshold
				? new Error('invalid-range')
				: true
		, 'max');
		return this;
	}

	/**
	 * このインスタンスの値が整数でなければエラーにします
	 */
	public int() {
		this.pushValidator(v =>
			!Number.isInteger(v)
				? new Error('must-be-an-intager')
				: true
		, 'int');
		return this;
	}
}
