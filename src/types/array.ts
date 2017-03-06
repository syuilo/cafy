import { Query, fx } from '../query';
import { isNotAnArray, isNotABoolean, isNotAnId, isNotANumber, isNotAnObject, isNotAString } from '../core';

const hasDuplicates = (array: any[]) => (new Set(array)).size !== array.length;

export default class ArrayQuery<T> extends Query<T[]> {

	constructor(value: any, nullable: boolean = false, type: string = null) {
		super(value, nullable);
		if (!this.isEmpty) {
			if (isNotAnArray(value)) {
				this.error = new Error('must-be-an-array');
			} else if (type != null) {
				switch (type) {
					case 'array': if (this.value.some(isNotAnArray)) this.setError('dirty-array'); break;
					case 'boolean': if (this.value.some(isNotABoolean)) this.setError('dirty-array'); break;
					case 'id': if (this.value.some(isNotAnId)) this.setError('dirty-array'); break;
					case 'number': if (this.value.some(isNotANumber)) this.setError('dirty-array'); break;
					case 'object': if (this.value.some(isNotAnObject)) this.setError('dirty-array'); break;
					case 'string': if (this.value.some(isNotAString)) this.setError('dirty-array'); break;
				}
			}
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
	 * 配列の各要素に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param validator バリデータ
	 */
	@fx()
	validateEach(validator: (element: T, index: number, array: T[]) => boolean | Error) {
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
