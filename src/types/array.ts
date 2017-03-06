import Query from '../query';
import { isNotAnArray, isNotABoolean, isNotAnId, isNotANumber, isNotAnObject, isNotAString } from '../core';

const hasDuplicates = (array: any[]) => (new Set(array)).size !== array.length;

export default class ArrayQuery<T> extends Query<T[]> {

	constructor(optional = false, nullable = false, value?: any, type?) {
		super(optional, nullable, value);
		this.pushValidator(v => {
			if (isNotAnArray(v)) {
				return new Error('must-be-an-array');
			} else if (type != null) {
				switch (type) {
					case 'array': if (v.some(isNotAnArray)) return new Error('dirty-array'); break;
					case 'boolean': if (v.some(isNotABoolean)) return new Error('dirty-array'); break;
					case 'id': if (v.some(isNotAnId)) return new Error('dirty-array'); break;
					case 'number': if (v.some(isNotANumber)) return new Error('dirty-array'); break;
					case 'object': if (v.some(isNotAnObject)) return new Error('dirty-array'); break;
					case 'string': if (v.some(isNotAString)) return new Error('dirty-array'); break;
				}
			}
			return true;
		});
	}

	/**
	 * 配列の値がユニークでない場合(=重複した項目がある場合)エラーにします
	 */
	unique() {
		this.pushValidator(v => {
			if (hasDuplicates(v)) return new Error('must-be-unique');
			return true;
		});
		return this;
	}

	/**
	 * 配列の長さが指定された範囲内にない場合エラーにします
	 * @param min 下限
	 * @param max 上限
	 */
	range(min: number, max: number) {
		this.min(min);
		this.max(max);
		return this;
	}

	/**
	 * 配列の長さが指定された下限より下回っている場合エラーにします
	 * @param threshold 下限
	 */
	min(threshold: number) {
		this.pushValidator(v => {
			if (v.length < threshold) return new Error('invalid-range');
			return true;
		});
		return this;
	}

	/**
	 * 配列の長さが指定された上限より上回っている場合エラーにします
	 * @param threshold 上限
	 */
	max(threshold: number) {
		this.pushValidator(v => {
			if (v.length > threshold) return new Error('invalid-range');
			return true;
		});
		return this;
	}

	/**
	 * 配列の各要素に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param validator バリデータ
	 */
	each(validator: ((element: T, index: number, array: T[]) => boolean | Error) | Query<T>) {
		const _validator = validator instanceof Query ? validator.test : validator;
		this.pushValidator(v => {
			let err: Error;
			v.some((x, i, s) => {
				const result = _validator(x, i, s);
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
		});
		return this;
	}
}
