import { Query, fx } from '../query';
import Validator from '../validator';

export default class NumberQuery extends Query<number> {

	constructor(value: any, nullable: boolean = false) {
		super(value, nullable);
		if (!this.isEmpty && !Number.isFinite(value)) {
			this.error = new Error('must-be-a-number');
		}
	}

	/**
	 * 値が指定された範囲内にない場合エラーにします
	 * @param min 下限
	 * @param max 上限
	 */
	@fx()
	range(min: number, max: number) {
		this.min(min);
		this.max(max);
		return this;
	}

	/**
	 * このインスタンスの値が指定された下限より下回っている場合エラーにします
	 * @param threshold 下限
	 */
	@fx()
	min(threshold: number) {
		if (this.value < threshold) {
			this.error = new Error('invalid-range');
		}
		return this;
	}

	/**
	 * このインスタンスの値が指定された上限より上回っている場合エラーにします
	 * @param threshold 上限
	 */
	@fx()
	max(threshold: number) {
		if (this.value > threshold) {
			this.error = new Error('invalid-range');
		}
		return this;
	}

	/**
	 * このインスタンスの値が整数でなければエラーにします
	 */
	@fx()
	int() {
		if (!Number.isInteger(this.value)) {
			this.error = new Error('must-be-an-intager');
		}
		return this;
	}
}
