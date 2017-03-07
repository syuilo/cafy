import Query from '../query';

export const isAString = x => typeof x == 'string';
export const isNotAString = x => !isAString(x);

export default class StringQuery extends Query<string> {
	constructor(optional: boolean, nullable: boolean, lazy: boolean, value?: any) {
		super(optional, nullable, lazy, value);
		this.pushValidator(v => {
			if (isNotAString(v)) return new Error('must-be-a-string');
			return true;
		});
	}

	/**
	 * 文字数が指定された範囲内にない場合エラーにします
	 * @param min 下限
	 * @param max 上限
	 */
	range(min: number, max: number) {
		this.min(min);
		this.max(max);
		return this;
	}

	/**
	 * 文字数が指定された下限より下回っている場合エラーにします
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
	 * 文字数が指定された上限より上回っている場合エラーにします
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
	 * 指定された文字数でなければエラーにします
	 * @param length 文字数
	 */
	length(length: number) {
		this.pushValidator(v => {
			if (v.length !== length) return new Error('invalid-length');
			return true;
		});
		return this;
	}

	/**
	 * このインスタンスの文字列が、与えられたパターン内の文字列のどれかと一致するか検証します
	 * どれとも一致しない場合エラーにします
	 * @param pattern 文字列の配列または|で区切られた文字列
	 */
	or(pattern: string | string[]) {
		if (typeof pattern == 'string') pattern = pattern.split('|');
		this.pushValidator(v => {
			const match = (pattern as string[]).some(x => x === v);
			if (!match) return new Error('not-match-pattern');
			return true;
		});
		return this;
	}

	/**
	 * このインスタンスの文字列が、与えられた正規表現と一致するか検証します
	 * 一致しない場合エラーにします
	 * @param pattern 正規表現
	 */
	match(pattern: RegExp) {
		this.pushValidator(v => {
			if (!pattern.test(v)) return new Error('not-match-pattern');
			return true;
		});
		return this;
	}
}
