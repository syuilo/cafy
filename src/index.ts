/**
 * cafy
 */

import * as mongo from 'mongodb';

const hasDuplicates = (array: any[]) => (new Set(array)).size !== array.length;

export type Validator<T> = (value: T) => boolean | Error;

/**
 * クエリベース
 */
export abstract class Query {
	protected value: any;
	protected error: Error;

	constructor(value: any, nullable: boolean = false) {
		if (value === null && !nullable) {
			this.value = undefined;
			this.error = new Error('must-be-not-a-null');
		} else {
			this.value = value;
			this.error = null;
		}
	}

	protected get isUndefined() {
		return this.value === undefined;
	}

	protected get isNull() {
		return this.value === null;
	}

	protected get isEmpty() {
		return this.isUndefined || this.isNull;
	}

	/**
	 * このインスタンスの値が空、またはエラーが存在しているなどして、処理をスキップするべきか否か
	 */
	protected get shouldSkip() {
		return this.error !== null || this.isEmpty;
	}

	/**
	 * このインスタンスの値が指定されていない(=undefined)ときにエラーにします
	 */
	required() {
		if (this.error === null && this.isUndefined) {
			this.error = new Error('required');
		}
		return this;
	}

	/**
	 * このインスタンスの値が妥当かをチェックします
	 */
	get isValid(): boolean {
		return this.error === null;
	}

	/**
	 * このインスタンスの値およびエラーを取得します
	 */
	get(): [any, Error] {
		return [this.value, this.error];
	}

	/**
	 * このインスタンスの値に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param validator バリデータ
	 */
	validate(validator: Validator<any>) {
		if (this.shouldSkip) return this;
		const result = validator(this.value);
		if (result === false) {
			this.error = new Error('invalid-format');
		} else if (result instanceof Error) {
			this.error = result;
		}
		return this;
	}
}

export class BooleanQuery extends Query {
	value: boolean;
	error: Error;

	constructor(value: any, nullable: boolean = false) {
		super(value, nullable);
		if (!this.isEmpty && typeof value != 'boolean') {
			this.error = new Error('must-be-a-boolean');
		}
	}

	/**
	 * このインスタンスの値およびエラーを取得します
	 */
	get(): [boolean, Error] {
		return super.get();
	}

	/**
	 * このインスタンスの値に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param validator バリデータ
	 */
	validate(validator: Validator<boolean>) {
		return super.validate(validator);
	}
}

export class NumberQuery extends Query {
	value: number;
	error: Error;

	constructor(value: any, nullable: boolean = false) {
		super(value, nullable);
		if (!this.isEmpty && !Number.isFinite(value)) {
			this.error = new Error('must-be-a-number');
		}
	}

	/**
	 * 値が指定された範囲内にない場合エラーにします
	 * @param min 下限
	 * @param max 上限
	 */
	range(min: number, max: number) {
		if (this.shouldSkip) return this;
		if (this.value < min || this.value > max) {
			this.error = new Error('invalid-range');
		}
		return this;
	}

	/**
	 * このインスタンスの値が指定された下限より下回っている場合エラーにします
	 * @param value 下限
	 */
	min(value: number) {
		if (this.shouldSkip) return this;
		if (this.value < value) {
			this.error = new Error('invalid-range');
		}
		return this;
	}

	/**
	 * このインスタンスの値が指定された上限より上回っている場合エラーにします
	 * @param value 上限
	 */
	max(value: number) {
		if (this.shouldSkip) return this;
		if (this.value > value) {
			this.error = new Error('invalid-range');
		}
		return this;
	}

	/**
	 * このインスタンスの値およびエラーを取得します
	 */
	get(): [number, Error] {
		return super.get();
	}

	/**
	 * このインスタンスの値に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param validator バリデータ
	 */
	validate(validator: Validator<number>) {
		return super.validate(validator);
	}
}

export class StringQuery extends Query {
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

export class ArrayQuery extends Query {
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

export class IdQuery extends Query {
	value: mongo.ObjectID;
	error: Error;

	constructor(value: any, nullable: boolean = false) {
		super(value, nullable);
		if (!this.isEmpty && (typeof value != 'string' || !mongo.ObjectID.isValid(value))) {
			this.error = new Error('must-be-an-id');
		}
	}

	/**
	 * このインスタンスの値およびエラーを取得します
	 */
	get(): [mongo.ObjectID, Error] {
		return super.get();
	}

	/**
	 * このインスタンスの値に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param validator バリデータ
	 */
	validate(validator: Validator<mongo.ObjectID>) {
		return super.validate(validator);
	}
}

export class ObjectQuery extends Query {
	value: any;
	error: Error;

	constructor(value: any, nullable: boolean = false) {
		super(value, nullable);
		if (!this.isEmpty && typeof value != 'object') {
			this.error = new Error('must-be-an-object');
		}
	}

	/**
	 * このインスタンスの値およびエラーを取得します
	 */
	get(): [any, Error] {
		return super.get();
	}

	/**
	 * このインスタンスの値に対して妥当性を検証します
	 * バリデータが false またはエラーを返した場合エラーにします
	 * @param validator バリデータ
	 */
	validate(validator: Validator<any>) {
		return super.validate(validator);
	}
}

export type It = {
	must: {
		be: {
			a: {
				string: () => StringQuery;
				number: () => NumberQuery;
				boolean: () => BooleanQuery;
				nullable: {
					string: () => StringQuery;
					number: () => NumberQuery;
					boolean: () => BooleanQuery;
					id: () => IdQuery;
					array: () => ArrayQuery;
					object: () => ObjectQuery;
				};
			};
			an: {
				id: () => IdQuery;
				array: () => ArrayQuery;
				object: () => ObjectQuery;
			};
		};
	};
	expect: {
		string: () => StringQuery;
		number: () => NumberQuery;
		boolean: () => BooleanQuery;
		id: () => IdQuery;
		array: () => ArrayQuery;
		object: () => ObjectQuery;
		nullable: {
			string: () => StringQuery;
			number: () => NumberQuery;
			boolean: () => BooleanQuery;
			id: () => IdQuery;
			array: () => ArrayQuery;
			object: () => ObjectQuery;
		};
	};
};

const it = (value: any) => ({
	must: {
		be: {
			a: {
				string: () => new StringQuery(value),
				number: () => new NumberQuery(value),
				boolean: () => new BooleanQuery(value),
				nullable: {
					string: () => new StringQuery(value, true),
					number: () => new NumberQuery(value, true),
					boolean: () => new BooleanQuery(value, true),
					id: () => new IdQuery(value, true),
					array: () => new ArrayQuery(value, true),
					object: () => new ObjectQuery(value, true)
				}
			},
			an: {
				id: () => new IdQuery(value),
				array: () => new ArrayQuery(value),
				object: () => new ObjectQuery(value)
			}
		}
	},
	expect: {
		string: () => new StringQuery(value),
		number: () => new NumberQuery(value),
		boolean: () => new BooleanQuery(value),
		id: () => new IdQuery(value),
		array: () => new ArrayQuery(value),
		object: () => new ObjectQuery(value),
		nullable: {
			string: () => new StringQuery(value, true),
			number: () => new NumberQuery(value, true),
			boolean: () => new BooleanQuery(value, true),
			id: () => new IdQuery(value, true),
			array: () => new ArrayQuery(value, true),
			object: () => new ObjectQuery(value, true)
		}
	}
});

type Type =
	'id' | 'id!' | 'id?' | 'id!?' |
	'string' | 'string!' | 'string?' | 'string!?' |
	'number' | 'number!' | 'number?' | 'number!?' |
	'boolean' | 'boolean!' | 'boolean?' | 'boolean!?' |
	'array' | 'array!' | 'array?' | 'array!?' |
	'set' | 'set!' | 'set?' | 'set!?' |
	'object' | 'object!' | 'object?' | 'object!?';

function x(value: any): It;
function x(value: any, type: 'id' | 'id!' | 'id?' | 'id!?'): IdQuery;
function x(value: any, type: 'string' | 'string!' | 'string?' | 'string!?'): StringQuery;
function x(value: any, type: 'number' | 'number!' | 'number?' | 'number!?'): NumberQuery;
function x(value: any, type: 'boolean' | 'boolean!' | 'boolean?' | 'boolean!?'): BooleanQuery;
function x(value: any, type: 'array' | 'array!' | 'array?' | 'array!?'): ArrayQuery;
function x(value: any, type: 'set' | 'set!' | 'set?' | 'set!?'): ArrayQuery;
function x(value: any, type: 'object' | 'object!' | 'object?' | 'object!?'): ObjectQuery;
function x(value: any, type?: Type): any {
	if (typeof type === 'undefined') return it(value);

	const [, name, suffixes] = type.match(/([a-z]+)(.+)?/);
	const isRequired = suffixes == '!' || suffixes == '!?';
	const isNullable = suffixes == '?' || suffixes == '!?';

	let q: any = it(value).expect;

	if (isNullable) q = q.nullable;

	switch (name) {
		case 'id': q = q.id(); break;
		case 'string': q = q.string(); break;
		case 'number': q = q.number(); break;
		case 'boolean': q = q.boolean(); break;
		case 'array': q = q.array(); break;
		case 'set': q = q.array().unique(); break;
		case 'object': q = q.object(); break;
	}

	if (isRequired) q = q.required();

	return q;
}

export default x;
