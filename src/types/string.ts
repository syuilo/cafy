import Context from '../ctx';

export const isAString = x => typeof x == 'string';
export const isNotAString = x => !isAString(x);

function stringToArray(str) {
	return str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || [];
}

/**
 * String
 */
export default class StringContext extends Context<string> {
	constructor() {
		super();

		this.push(v =>
			isNotAString(v)
				? new Error('must-be-a-string')
				: true
		);
	}

	/**
	 * 文字数が指定された範囲内にない場合エラーにします
	 * @param min 下限
	 * @param max 上限
	 */
	public range(min: number, max: number) {
		this.min(min);
		this.max(max);
		return this;
	}

	/**
	 * 文字数が指定された下限より下回っている場合エラーにします
	 * @param threshold 下限
	 */
	public min(threshold: number) {
		this.push(v =>
			stringToArray(v).length < threshold
				? new Error('invalid-range')
				: true
		, 'min');
		return this;
	}

	/**
	 * 文字数が指定された上限より上回っている場合エラーにします
	 * @param threshold 上限
	 */
	public max(threshold: number) {
		this.push(v =>
			stringToArray(v).length > threshold
				? new Error('invalid-range')
				: true
		, 'max');
		return this;
	}

	/**
	 * 指定された文字数でなければエラーにします
	 * @param length 文字数
	 */
	public length(length: number) {
		this.push(v =>
			stringToArray(v).length !== length
				? new Error('invalid-length')
				: true
		, 'length');
		return this;
	}

	/**
	 * このインスタンスの文字列が、与えられたパターン内の文字列のどれかと一致するか検証します
	 * どれとも一致しない場合エラーにします
	 * @param pattern 文字列の配列または|で区切られた文字列
	 */
	public or(pattern: string | string[]) {
		if (typeof pattern == 'string') pattern = pattern.split('|');
		this.push(v => {
			const match = (pattern as string[]).some(x => x === v);
			if (!match) return new Error('not-match-pattern');
			return true;
		}, 'or');
		return this;
	}

	/**
	 * このインスタンスの文字列が、与えられた文字列を含んでいないか検証します
	 * 含んでいる場合エラーにします
	 * @param str 文字列または文字列の配列
	 */
	public notInclude(str: string | string[]) {
		if (typeof str == 'string') str = [str];
		this.push(v => {
			const match = (str as string[]).some(x => v.indexOf(x) !== -1);
			if (match) return new Error('includes-forbidden-string');
			return true;
		}, 'notInclude');
		return this;
	}

	/**
	 * このインスタンスの文字列が、与えられた正規表現と一致するか検証します
	 * 一致しない場合エラーにします
	 * @param pattern 正規表現
	 */
	public match(pattern: RegExp) {
		this.push(v =>
			!pattern.test(v)
				? new Error('not-match-pattern')
				: true
		, 'match');
		return this;
	}

	/**
	 * このインスタンスの文字列が、与えられた正規表現と一致しないか検証します
	 * 一致する場合エラーにします
	 * @param pattern 正規表現
	 */
	public notMatch(pattern: RegExp) {
		this.push(v =>
			pattern.test(v)
				? new Error('match-pattern')
				: true
		, 'notMatch');
		return this;
	}

	public getType(): string {
		return super.getType('string');
	}
}
