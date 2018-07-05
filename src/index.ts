/**
 * cafy
 */

import AnyContext from './types/any';
import ArrayContext from './types/array';
import BooleanContext from './types/boolean';
import NumberContext from './types/number';
import ObjectContext, { Props } from './types/object';
import StringContext from './types/string';
import OrContext from './types/or';

import Context from './ctx';
import { TypeOf } from './types';

export default {
	get any() { return new AnyContext() },
	arr<T extends Context = Context>(ctx?: T): ArrayContext<T> { return new ArrayContext(ctx) },
	array<T extends Context = Context>(ctx?: T): ArrayContext<T> { return new ArrayContext(ctx) },
	get bool() { return new BooleanContext() },
	get boolean() { return new BooleanContext() },
	get num() { return new NumberContext() },
	get number() { return new NumberContext() },
	obj<T extends Props>(ctx?: T): ObjectContext<T> { return new ObjectContext(ctx) },
	object<T extends Props>(ctx?: T): ObjectContext<T> { return new ObjectContext(ctx) },
	or<CtxA extends Context, CtxB extends Context>(ctxA: CtxA, ctxB: CtxB): OrContext<CtxA, CtxB> { return new OrContext(ctxA, ctxB) },
	get str() { return new StringContext() },
	get string() { return new StringContext() },
	type<T>(Ctx: { new(): T; }): T { return new Ctx() },
	use<T extends Context = Context>(ctx: T): AnyContext<TypeOf<T>> {
		return new AnyContext<TypeOf<T>>().pipe(ctx.test);
	}
};

export { Context };
