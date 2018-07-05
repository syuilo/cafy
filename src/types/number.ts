import Context from '../ctx';

export const isANumber = x => Number.isFinite(x);
export const isNotANumber = x => !isANumber(x);

/**
 * Number
 */
export default class NumberContext extends Context<number> {
	constructor() {
		super();

		this.push(v =>
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
		this.push(v =>
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
		this.push(v =>
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
		this.push(v =>
			!Number.isInteger(v)
				? new Error('must-be-an-intager')
				: true
		, 'int');
		return this;
	}
}
