import Query from '../query';

export const isAString = x => typeof x == 'string';
export const isNotAString = x => !isAString(x);

/**
 * String
 */
export default class StringQuery extends Query<string> {
	constructor(optional: boolean, nullable: boolean, lazy: boolean, value?: any) {
		super(optional, nullable, lazy, value);

		this.pushValidator(v =>
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
		this.pushValidator(v =>
			v.length < threshold
				? new Error('invalid-range')
				: true
		);
		return this;
	}

	/**
	 * 文字数が指定された上限より上回っている場合エラーにします
	 * @param threshold 上限
	 */
	public max(threshold: number) {
		this.pushValidator(v =>
			v.length > threshold
				? new Error('invalid-range')
				: true
		);
		return this;
	}

	/**
	 * 指定された文字数でなければエラーにします
	 * @param length 文字数
	 */
	public length(length: number) {
		this.pushValidator(v =>
			v.length !== length
				? new Error('invalid-length')
				: true
		);
		return this;
	}

	/**
	 * このインスタンスの文字列が、与えられたパターン内の文字列のどれかと一致するか検証します
	 * どれとも一致しない場合エラーにします
	 * @param pattern 文字列の配列または|で区切られた文字列
	 */
	public or(pattern: string | string[]) {
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
	public match(pattern: RegExp) {
		this.pushValidator(v =>
			!pattern.test(v)
				? new Error('not-match-pattern')
				: true
		);
		return this;
	}
}
