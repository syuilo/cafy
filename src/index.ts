/**
 * cafy
 */

import * as mongo from 'mongodb';

import AnyQuery from './types/any';
import ArrayQuery from './types/array';
import BooleanQuery from './types/boolean';
import IdQuery from './types/id';
import NumberQuery from './types/number';
import ObjectQuery from './types/object';
import StringQuery from './types/string';

export function createArrayQuery(): ArrayQuery<any, AnyQuery>;
export function createArrayQuery(type: 'array'): ArrayQuery<any[], ArrayQuery<any, any>>;
export function createArrayQuery(type: 'boolean'): ArrayQuery<boolean, BooleanQuery>;
export function createArrayQuery(type: 'id'): ArrayQuery<mongo.ObjectID, IdQuery>;
export function createArrayQuery(type: 'number'): ArrayQuery<number, NumberQuery>;
export function createArrayQuery(type: 'object'): ArrayQuery<object, ObjectQuery>;
export function createArrayQuery(type: 'string'): ArrayQuery<string, StringQuery>;
export function createArrayQuery(type?: 'array' | 'boolean' | 'id' | 'number' | 'object' | 'string'): any {
	const lazy = this.lazy;
	const value = this.value;
	const optional = this.optional;
	const nullable = this.nullable;
	const flexible = this.flexible;

	if (type == null) return new ArrayQuery<any, AnyQuery>(optional, nullable, lazy, value, flexible);

	switch (type) {
		case 'array': return new ArrayQuery<any[], ArrayQuery<any, any>>(optional, nullable, lazy, value, flexible, 'array');
		case 'boolean': return new ArrayQuery<boolean, BooleanQuery>(optional, nullable, lazy, value, flexible, 'boolean');
		case 'id': return new ArrayQuery<mongo.ObjectID, IdQuery>(optional, nullable, lazy, value, flexible, 'id');
		case 'number': return new ArrayQuery<number, NumberQuery>(optional, nullable, lazy, value, flexible, 'number');
		case 'object': return new ArrayQuery<object, ObjectQuery>(optional, nullable, lazy, value, flexible, 'object');
		case 'string': return new ArrayQuery<string, StringQuery>(optional, nullable, lazy, value, flexible, 'string');
	}
}

export type Types = {
	any: () => AnyQuery;
	string: () => StringQuery;
	number: () => NumberQuery;
	boolean: () => BooleanQuery;
	id: () => IdQuery;
	array: typeof createArrayQuery;
	object: () => ObjectQuery;
	strict: {
		object: () => ObjectQuery;
	};
	flexible: {
		array: typeof createArrayQuery;
	};
};

export type It = Types & {
	nullable: Types & { optional: Types; };
	optional: Types & { nullable: Types; };
};

function $(value?: any): It {
	const lazy = arguments.length === 0;

	return {
		any: () => new AnyQuery(false, false, lazy, value),
		string: () => new StringQuery(false, false, lazy, value),
		number: () => new NumberQuery(false, false, lazy, value),
		boolean: () => new BooleanQuery(false, false, lazy, value),
		id: () => new IdQuery(false, false, lazy, value),
		array: (type?) => createArrayQuery.bind({
			value,
			lazy,
			optional: false,
			nullable: false
		})(type),
		object: () => new ObjectQuery(false, false, lazy, value),
		strict: {
			object: () => new ObjectQuery(false, false, lazy, value, true)
		},
		flexible: {
			array: (type?) => createArrayQuery.bind({
				value,
				lazy,
				optional: false,
				nullable: false,
				flexible: true
			})(type)
		},
		nullable: {
			any: () => new AnyQuery(false, true, lazy, value),
			string: () => new StringQuery(false, true, lazy, value),
			number: () => new NumberQuery(false, true, lazy, value),
			boolean: () => new BooleanQuery(false, true, lazy, value),
			id: () => new IdQuery(false, true, lazy, value),
			array: (type?) => createArrayQuery.bind({
				value,
				lazy,
				optional: false,
				nullable: true
			})(type),
			object: () => new ObjectQuery(false, true, lazy, value),
			strict: {
				object: () => new ObjectQuery(false, true, lazy, value, true)
			},
			flexible: {
				array: (type?) => createArrayQuery.bind({
					value,
					lazy,
					optional: false,
					nullable: true,
					flexible: true
				})(type)
			},
			optional: {
				any: () => new AnyQuery(true, true, lazy, value),
				string: () => new StringQuery(true, true, lazy, value),
				number: () => new NumberQuery(true, true, lazy, value),
				boolean: () => new BooleanQuery(true, true, lazy, value),
				id: () => new IdQuery(true, true, lazy, value),
				array: (type?) => createArrayQuery.bind({
					value,
					lazy,
					optional: true,
					nullable: true
				})(type),
				object: () => new ObjectQuery(true, true, lazy, value),
				strict: {
					object: () => new ObjectQuery(true, true, lazy, value, true)
				},
				flexible: {
					array: (type?) => createArrayQuery.bind({
						value,
						lazy,
						optional: true,
						nullable: true,
						flexible: true
					})(type)
				},
			}
		},
		optional: {
			any: () => new AnyQuery(true, false, lazy, value),
			string: () => new StringQuery(true, false, lazy, value),
			number: () => new NumberQuery(true, false, lazy, value),
			boolean: () => new BooleanQuery(true, false, lazy, value),
			id: () => new IdQuery(true, false, lazy, value),
			array: (type?) => createArrayQuery.bind({
				value,
				lazy,
				optional: true,
				nullable: false
			})(type),
			object: () => new ObjectQuery(true, false, lazy, value),
			strict: {
				object: () => new ObjectQuery(true, false, lazy, value, true)
			},
			flexible: {
				array: (type?) => createArrayQuery.bind({
					value,
					lazy,
					optional: true,
					nullable: false,
					flexible: true
				})(type)
			},
			nullable: {
				any: () => new AnyQuery(true, true, lazy, value),
				string: () => new StringQuery(true, true, lazy, value),
				number: () => new NumberQuery(true, true, lazy, value),
				boolean: () => new BooleanQuery(true, true, lazy, value),
				id: () => new IdQuery(true, true, lazy, value),
				array: (type?) => createArrayQuery.bind({
					value,
					lazy,
					optional: true,
					nullable: true
				})(type),
				object: () => new ObjectQuery(true, true, lazy, value),
				strict: {
					object: () => new ObjectQuery(true, true, lazy, value, true)
				},
				flexible: {
					array: (type?) => createArrayQuery.bind({
						value,
						lazy,
						optional: true,
						nullable: true,
						flexible: true
					})(type)
				},
			}
		}
	};
}

export default $;
