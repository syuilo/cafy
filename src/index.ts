/**
 * cafy
 */

import * as mongo from 'mongodb';

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
export function createArrayQuery(type: 'object'): ArrayQuery<any>;
export function createArrayQuery(type: 'string'): ArrayQuery<string>;
export function createArrayQuery(type?: 'array' | 'boolean' | 'id' | 'number' | 'object' | 'string'): any {
	const value = this.value;
	const optional = this.optional;
	const nullable = this.nullable;

	if (type == null) return new ArrayQuery<any>(optional, nullable, value);

	switch (type) {
		case 'array': return new ArrayQuery<any[]>(optional, nullable, value, 'array');
		case 'boolean': return new ArrayQuery<boolean>(optional, nullable, value, 'boolean');
		case 'id': return new ArrayQuery<mongo.ObjectID>(optional, nullable, value, 'id');
		case 'number': return new ArrayQuery<number>(optional, nullable, value, 'number');
		case 'object': return new ArrayQuery<any>(optional, nullable, value, 'object');
		case 'string': return new ArrayQuery<string>(optional, nullable, value, 'string');
	}
}

export type Types = {
	string: () => StringQuery;
	number: () => NumberQuery;
	boolean: () => BooleanQuery;
	id: () => IdQuery;
	array: typeof createArrayQuery;
	object: () => ObjectQuery;
};

export type It = Types & {
	nullable: Types & { optional: Types; };
	optional: Types & { nullable: Types; };
};

const it = (value: any): It => ({
	string: () => new StringQuery(false, false, value),
	number: () => new NumberQuery(false, false, value),
	boolean: () => new BooleanQuery(false, false, value),
	id: () => new IdQuery(false, false, value),
	array: (type?) => createArrayQuery.bind({
			value,
			optional: false,
			nullable: false
		})(type),
	object: () => new ObjectQuery(false, false, value),
	nullable: {
		string: () => new StringQuery(false, true, value),
		number: () => new NumberQuery(false, true, value),
		boolean: () => new BooleanQuery(false, true, value),
		id: () => new IdQuery(false, true, value),
		array: (type?) => createArrayQuery.bind({
			value,
			optional: false,
			nullable: true
		})(type),
		object: () => new ObjectQuery(false, true, value),
		optional: {
			string: () => new StringQuery(true, true, value),
			number: () => new NumberQuery(true, true, value),
			boolean: () => new BooleanQuery(true, true, value),
			id: () => new IdQuery(true, true, value),
			array: (type?) => createArrayQuery.bind({
				value,
				optional: true,
				nullable: true
			})(type),
			object: () => new ObjectQuery(true, true, value)
		}
	},
	optional: {
		string: () => new StringQuery(true, false, value),
		number: () => new NumberQuery(true, false, value),
		boolean: () => new BooleanQuery(true, false, value),
		id: () => new IdQuery(true, false, value),
		array: (type?) => createArrayQuery.bind({
			value,
			optional: true,
			nullable: false
		})(type),
		object: () => new ObjectQuery(true, false, value),
		nullable: {
			string: () => new StringQuery(true, true, value),
			number: () => new NumberQuery(true, true, value),
			boolean: () => new BooleanQuery(true, true, value),
			id: () => new IdQuery(true, true, value),
			array: (type?) => createArrayQuery.bind({
				value,
				optional: true,
				nullable: true
			})(type),
			object: () => new ObjectQuery(true, true, value)
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

function x(value?: any): It {
	return it(value);
}

export default x;
