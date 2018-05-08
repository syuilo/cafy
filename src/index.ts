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

export default {
	get any() { return new AnyQuery() },
	arr<T extends Query = Query>(q?: T): ArrayQuery<T> { return new ArrayQuery(q) },
	array<T extends Query = Query>(q?: T): ArrayQuery<T> { return new ArrayQuery(q) },
	get bool() { return new BooleanQuery() },
	get boolean() { return new BooleanQuery() },
	get num() { return new NumberQuery() },
	get number() { return new NumberQuery() },
	obj<T extends { [key: string]: Query }>(q?: T): ObjectQuery<T> { return new ObjectQuery(q) },
	object<T extends { [key: string]: Query }>(q?: T): ObjectQuery<T> { return new ObjectQuery(q) },
	or<QA extends Query, QB extends Query>(qA: QA, qB: QB): OrQuery<QA, QB> { return new OrQuery(qA, qB) },
	get str() { return new StringQuery() },
	get string() { return new StringQuery() },
	type<T>(Q: { new(): T; }): T { return new Q() },
};

export { Query };
