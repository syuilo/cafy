import Query from '../query';
import { isNotANumber } from '../core';

export default class NumberQuery extends Query<number> {

	constructor(optional = false, nullable = false, value?: any) {
		super(optional, nullable, value);
		this.pushValidator(v => {
			if (isNotANumber(v)) return new Error('must-be-a-number');
			return true;
		});
	}

	/**
	 * 値が指定された範囲内にない場合エラーにします
	 * @param min 下限
	 * @param max 上限
	 */
	range(min: number, max: number) {
		this.min(min);
		this.max(max);
		return this;
	}

	/**
	 * このインスタンスの値が指定された下限より下回っている場合エラーにします
	 * @param threshold 下限
	 */
	min(threshold: number) {
		this.pushValidator(v => {
			if (v < threshold) return new Error('invalid-range');
			return true;
		});
		return this;
	}

	/**
	 * このインスタンスの値が指定された上限より上回っている場合エラーにします
	 * @param threshold 上限
	 */
	max(threshold: number) {
		this.pushValidator(v => {
			if (v > threshold) return new Error('invalid-range');
			return true;
		});
		return this;
	}

	/**
	 * このインスタンスの値が整数でなければエラーにします
	 */
	int() {
		this.pushValidator(v => {
			if (!Number.isInteger(v)) return new Error('must-be-an-intager');
			return true;
		});
		return this;
	}
}
