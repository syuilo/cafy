import Query from '../query';
import Validator from '../validator';

const hasDuplicates = (array: any[]) => (new Set(array)).size !== array.length;

export default class ArrayQuery extends Query {
	value: any[];
	error: Error;

	constructor(value: any, nullable: boolean = false) {
		super(value, nullable);
		if (!this.isEmpty && !Array.isArray(value)) {
			this.error = new Error('must-be-an-array');
		}
	}

	/**
	 * 配列の値がユニークでない場合(=重複した項目がある場合)エラーにします
	 */
	unique() {
		if (this.shouldSkip) return this;
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
	range(min: number, max: number) {
		if (this.shouldSkip) return this;
		if (this.value.length < min || this.value.length > max) {
			this.error = new Error('invalid-range');
		}
		return this;
	}

	/**
	 * このインスタンスの配列内の要素すべてが文字列であるか検証します
	 * ひとつでも文字列以外の要素が存在する場合エラーにします
	 */
	allString() {
		if (this.shouldSkip) return this;
		if (this.value.some(x => typeof x != 'string')) {
			this.error = new Error('dirty-array');
		}
		return this;
	}

	/**
	 * このインスタンスの値およびエラーを取得します
	 */
	get(): [any[], Error] {
		return super.get();
	}

	/**
	 * このインスタンスの値に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param validator バリデータ
	 */
	validate(validator: Validator<any[]>) {
		return super.validate(validator);
	}
}
