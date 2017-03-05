import { Query, fx } from '../query';
import Validator from '../validator';

const hasDuplicates = (array: any[]) => (new Set(array)).size !== array.length;

export default class ArrayQuery extends Query<any[]> {

	constructor(value: any, nullable: boolean = false) {
		super(value, nullable);
		if (!this.isEmpty && !Array.isArray(value)) {
			this.error = new Error('must-be-an-array');
		}
	}

	/**
	 * 配列の値がユニークでない場合(=重複した項目がある場合)エラーにします
	 */
	@fx()
	unique() {
		if (hasDuplicates(this.value)) {
			this.error = new Error('must-be-unique');
		}
		return this;
	}

	/**
	 * 配列の長さが指定された範囲内にない場合エラーにします
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
	 * 配列の長さが指定された下限より下回っている場合エラーにします
	 * @param threshold 下限
	 */
	@fx()
	min(threshold: number) {
		if (this.value.length < threshold) {
			this.error = new Error('invalid-range');
		}
		return this;
	}

	/**
	 * 配列の長さが指定された上限より上回っている場合エラーにします
	 * @param threshold 上限
	 */
	@fx()
	max(threshold: number) {
		if (this.value.length > threshold) {
			this.error = new Error('invalid-range');
		}
		return this;
	}

	/**
	 * このインスタンスの配列内の要素すべてが文字列であるか検証します
	 * ひとつでも文字列以外の要素が存在する場合エラーにします
	 */
	@fx()
	allString() {
		if (this.value.some(x => typeof x != 'string')) {
			this.error = new Error('dirty-array');
		}
		return this;
	}

	/**
	 * 配列の各要素に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param validator バリデータ
	 */
	@fx()
	validateEach(validator: (element: any, index: number, array: any[]) => boolean | Error) {
		this.value.some((x, i, s) => {
			const result = validator(x, i, s);
			if (result === false) {
				this.error = new Error('invalid-item');
				return true;
			} else if (result instanceof Error) {
				this.error = result;
				return true;
			} else {
				return false;
			}
		});
		return this;
	}
}
