import Query from '../query';
import Validator from '../validator';

export default  class StringQuery extends Query {
	value: string;
	error: Error;

	constructor(value: any, nullable: boolean = false) {
		super(value, nullable);
		if (!this.isEmpty && typeof value != 'string') {
			this.error = new Error('must-be-a-string');
		}
	}

	/**
	 * 文字数が指定された範囲内にない場合エラーにします
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

	trim() {
		if (this.shouldSkip) return this;
		this.value = this.value.trim();
		return this;
	}

	/**
	 * このインスタンスの値およびエラーを取得します
	 */
	get(): [string, Error] {
		return super.get();
	}

	/**
	 * このインスタンスの値に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param validator バリデータ
	 */
	validate(validator: Validator<string>) {
		return super.validate(validator);
	}

	/**
	 * このインスタンスの文字列が、与えられたパターン内の文字列のどれかと一致するか検証します
	 * どれとも一致しない場合エラーにします
	 * @param pattern 文字列の配列またはスペースで区切られた文字列
	 */
	or(pattern: string | string[]) {
		if (this.shouldSkip) return this;
		if (typeof pattern == 'string') pattern = pattern.split(' ');
		const match = pattern.some(x => x === this.value);
		if (!match) this.error = new Error('not-match-pattern');
		return this;
	}

	/**
	 * このインスタンスの文字列が、与えられた正規表現と一致するか検証します
	 * 一致しない場合エラーにします
	 * @param pattern 正規表現
	 */
	match(pattern: RegExp) {
		if (this.shouldSkip) return this;
		if (!pattern.test(this.value)) this.error = new Error('not-match-pattern');
		return this;
	}
}
