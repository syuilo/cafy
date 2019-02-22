import Context from '../ctx';

export const isAString = x => typeof x == 'string';
export const isNotAString = x => !isAString(x);

/**
 * String
 */
export default class StringContext<Maybe extends null | undefined | string = string> extends Context<string | Maybe> {
	public readonly name = 'String';

	public enum: string[] | null = null;
	public minLength: number | null = null;
	public maxLength: number | null = null;

	constructor(optional = false, nullable = false) {
		super(optional, nullable);

		this.push(v =>
			isNotAString(v)
				? new Error('must-be-a-string')
				: true
		);

		this.push(v => this.minLength != null ?
			v.length < this.minLength
				? new Error('invalid-range')
				: true
		: true, 'min');

		this.push(v => this.maxLength != null ?
			v.length > this.maxLength
				? new Error('invalid-range')
				: true
		: true, 'max');

		this.push(v => this.enum != null ?
			!this.enum.some(x => x === v)
				? new Error('not-match-pattern')
				: true
		: true, 'enum');
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
		this.minLength = threshold;
		return this;
	}

	/**
	 * 文字数が指定された上限より上回っている場合エラーにします
	 * @param threshold 上限
	 */
	public max(threshold: number) {
		this.maxLength = threshold;
		return this;
	}

	/**
	 * 指定された文字数でなければエラーにします
	 * @param length 文字数
	 */
	public length(length: number) {
		this.min(length);
		this.max(length);
		return this;
	}

	/**
	 * このインスタンスの文字列が、与えられたパターン内の文字列のどれかと一致するか検証します
	 * どれとも一致しない場合エラーにします
	 * @param pattern 文字列の配列または|で区切られた文字列
	 */
	public or(pattern: string | string[]) {
		if (typeof pattern == 'string') pattern = pattern.split('|');
		this.enum = pattern;
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

	//#region ✨ Some magicks ✨
	public makeOptional(): StringContext<undefined> {
		return new StringContext(true, false);
	}

	public makeNullable(): StringContext<null> {
		return new StringContext(false, true);
	}

	public makeOptionalNullable(): StringContext<undefined | null> {
		return new StringContext(true, true);
	}
	//#endregion
}
