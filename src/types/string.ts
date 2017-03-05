import { Query, fx } from '../query';
import Validator from '../validator';

export default class StringQuery extends Query<string> {

	constructor(value: any, nullable: boolean = false) {
		super(value, nullable);
		if (!this.isEmpty && typeof value != 'string') {
			this.error = new Error('must-be-a-string');
		}
	}

	@fx()
	trim() {
		this.value = this.value.trim();
		return this;
	}

	/**
	 * 文字数が指定された範囲内にない場合エラーにします
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
	 * 文字数が指定された下限より下回っている場合エラーにします
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
	 * 文字数が指定された上限より上回っている場合エラーにします
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
	 * このインスタンスの文字列が、与えられたパターン内の文字列のどれかと一致するか検証します
	 * どれとも一致しない場合エラーにします
	 * @param pattern 文字列の配列またはスペースで区切られた文字列
	 */
	@fx()
	or(pattern: string | string[]) {
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
	@fx()
	match(pattern: RegExp) {
		if (!pattern.test(this.value)) this.error = new Error('not-match-pattern');
		return this;
	}
}
