import Context from '../ctx';

export const isANumber = x => Number.isFinite(x);
export const isNotANumber = x => !isANumber(x);

/**
 * Number
 */
export default class NumberContext<Maybe extends null | undefined | number = number> extends Context<number | Maybe> {
	public readonly name = 'Number';

	public minimum: number | null = null;
	public maximum: number | null = null;

	constructor(optional = false, nullable = false) {
		super(optional, nullable);

		this.push(v =>
			isNotANumber(v)
				? new Error('must-be-a-number')
				: true
		);

		this.push(v => this.minimum != null ?
			v < this.minimum
				? new Error('invalid-range')
				: true
		: true, 'min');

		this.push(v => this.maximum != null ?
			v > this.maximum
				? new Error('invalid-range')
				: true
		: true, 'max');
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
		this.minimum = threshold;
		return this;
	}

	/**
	 * このインスタンスの値が指定された上限より上回っている場合エラーにします
	 * @param threshold 上限
	 */
	public max(threshold: number) {
		this.maximum = threshold;
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

	//#region ✨ Some magicks ✨
	public makeOptional(): NumberContext<undefined> {
		return new NumberContext(true, false);
	}

	public makeNullable(): NumberContext<null> {
		return new NumberContext(false, true);
	}

	public makeOptionalNullable(): NumberContext<undefined | null> {
		return new NumberContext(true, true);
	}
	//#endregion
}
