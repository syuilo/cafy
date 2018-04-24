/**
 * cafy
 */

import AnyQuery from './types/any';
import ArrayQuery from './types/array';
import BooleanQuery from './types/boolean';
import NumberQuery from './types/number';
import ObjectQuery from './types/object';
import StringQuery from './types/string';
import OrQuery from './types/or';

import Query from './query';

export function createArrayQuery(): ArrayQuery<any>;
export function createArrayQuery<T extends Query<any>>(q: T): ArrayQuery<T>;
export function createArrayQuery(q?: Query<any>): ArrayQuery<any> {
	const lazy = this.lazy;
	const value = this.value;
	const optional = this.optional;
	const nullable = this.nullable;

	return new ArrayQuery(q, optional, nullable, lazy, value);
}

export type Types = {
	any: () => AnyQuery;
	string: () => StringQuery;
	number: () => NumberQuery;
	boolean: () => BooleanQuery;
	array: typeof createArrayQuery;
	object: (strict?: boolean) => ObjectQuery;
	type: <T>(q: { new(...args): T; }) => T;
	or: <QA extends Query<any>, QB extends Query<any>>(qA: QA, qB: QB) => OrQuery<QA, QB>;
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
		array: (q?: Query<any>) => createArrayQuery.bind({
			value,
			lazy,
			optional: false,
			nullable: false
		})(q),
		object: (strict?: boolean) => new ObjectQuery(strict, false, false, lazy, value),
		type: (q: any) => new q(false, false, lazy, value),
		or: (qA: Query<any>, qB: Query<any>) => new OrQuery(qA, qB, false, false, lazy, value),
		nullable: {
			any: () => new AnyQuery(false, true, lazy, value),
			string: () => new StringQuery(false, true, lazy, value),
			number: () => new NumberQuery(false, true, lazy, value),
			boolean: () => new BooleanQuery(false, true, lazy, value),
			array: (q?: Query<any>) => createArrayQuery.bind({
				value,
				lazy,
				optional: false,
				nullable: true
			})(q),
			object: (strict?: boolean) => new ObjectQuery(strict, false, true, lazy, value),
			type: (q: any) => new q(false, true, lazy, value),
			or: (qA: Query<any>, qB: Query<any>) => new OrQuery(qA, qB, false, true, lazy, value),
			optional: {
				any: () => new AnyQuery(true, true, lazy, value),
				string: () => new StringQuery(true, true, lazy, value),
				number: () => new NumberQuery(true, true, lazy, value),
				boolean: () => new BooleanQuery(true, true, lazy, value),
				array: (q?: Query<any>) => createArrayQuery.bind({
					value,
					lazy,
					optional: true,
					nullable: true
				})(q),
				object: (strict?: boolean) => new ObjectQuery(true, true, lazy, value, strict),
				type: (q: any) => new q(true, true, lazy, value),
				or: (qA: Query<any>, qB: Query<any>) => new OrQuery(qA, qB, true, true, lazy, value),
			}
		},
		optional: {
			any: () => new AnyQuery(true, false, lazy, value),
			string: () => new StringQuery(true, false, lazy, value),
			number: () => new NumberQuery(true, false, lazy, value),
			boolean: () => new BooleanQuery(true, false, lazy, value),
			array: (q?: Query<any>) => createArrayQuery.bind({
				value,
				lazy,
				optional: true,
				nullable: false
			})(q),
			object: (strict?: boolean) => new ObjectQuery(true, false, lazy, value, strict),
			type: (q: any) => new q(true, false, lazy, value),
			or: (qA: Query<any>, qB: Query<any>) => new OrQuery(qA, qB, true, false, lazy, value),
			nullable: {
				any: () => new AnyQuery(true, true, lazy, value),
				string: () => new StringQuery(true, true, lazy, value),
				number: () => new NumberQuery(true, true, lazy, value),
				boolean: () => new BooleanQuery(true, true, lazy, value),
				array: (q?: Query<any>) => createArrayQuery.bind({
					value,
					lazy,
					optional: true,
					nullable: true
				})(q),
				object: (strict?: boolean) => new ObjectQuery(true, true, lazy, value, strict),
				type: (q: any) => new q(true, true, lazy, value),
				or: (qA: Query<any>, qB: Query<any>) => new OrQuery(qA, qB, true, false, lazy, value),
			}
		}
	};
}

export default $;

export { Query };
