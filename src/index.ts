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

export function createArrayQuery(): ArrayQuery<any>;
export function createArrayQuery(type: 'array'): ArrayQuery<any[]>;
export function createArrayQuery(type: 'boolean'): ArrayQuery<boolean>;
export function createArrayQuery(type: 'id'): ArrayQuery<mongo.ObjectID>;
export function createArrayQuery(type: 'number'): ArrayQuery<number>;
export function createArrayQuery(type: 'object'): ArrayQuery<object>;
export function createArrayQuery(type: 'string'): ArrayQuery<string>;
export function createArrayQuery(type?: 'array' | 'boolean' | 'id' | 'number' | 'object' | 'string'): any {
	const lazy = this.lazy;
	const value = this.value;
	const optional = this.optional;
	const nullable = this.nullable;

	if (type == null) return new ArrayQuery<any>(optional, nullable, lazy, value);

	switch (type) {
		case 'array': return new ArrayQuery<any[]>(optional, nullable, lazy, value, 'array');
		case 'boolean': return new ArrayQuery<boolean>(optional, nullable, lazy, value, 'boolean');
		case 'id': return new ArrayQuery<mongo.ObjectID>(optional, nullable, lazy, value, 'id');
		case 'number': return new ArrayQuery<number>(optional, nullable, lazy, value, 'number');
		case 'object': return new ArrayQuery<object>(optional, nullable, lazy, value, 'object');
		case 'string': return new ArrayQuery<string>(optional, nullable, lazy, value, 'string');
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
				}
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
				}
			}
		}
	};
}

export default $;
