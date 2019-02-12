/*!
 * cafy
 * Copyright(c) 2017-2019 syuilo
 * MIT Licensed
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

type TypeContext = {
	makeOptional: () => Context;
	makeNullable: () => Context;
	makeOptionalNullable: () => Context;
};

const optionalNullable = {
	get any() { return new AnyContext().makeOptionalNullable() },
	arr<T extends Context = Context>(ctx?: T): ArrayContext<T, undefined | null> { return new ArrayContext(ctx).makeOptionalNullable() },
	array<T extends Context = Context>(ctx?: T): ArrayContext<T, undefined | null> { return new ArrayContext(ctx).makeOptionalNullable() },
	get bool() { return new BooleanContext().makeOptionalNullable() },
	get boolean() { return new BooleanContext().makeOptionalNullable() },
	get num() { return new NumberContext().makeOptionalNullable() },
	get number() { return new NumberContext().makeOptionalNullable() },
	obj<T extends Props>(ctx?: T): ObjectContext<T, undefined | null> { return new ObjectContext(ctx).makeOptionalNullable() as any },
	object<T extends Props>(ctx?: T): ObjectContext<T, undefined | null> { return new ObjectContext(ctx).makeOptionalNullable() as any },
	or<CtxA extends Context, CtxB extends Context>(ctxA: CtxA, ctxB: CtxB): OrContext<CtxA, CtxB, undefined | null> { return new OrContext(ctxA, ctxB).makeOptionalNullable() },
	get str() { return new StringContext().makeOptionalNullable() },
	get string() { return new StringContext().makeOptionalNullable() },
	type<T extends Context & TypeContext>(Ctx: { new(): T; }): ReturnType<T['makeOptionalNullable']> { return new Ctx().makeOptionalNullable() as any },
	use<T extends Context = Context>(ctx: T): AnyContext<TypeOf<T>, undefined | null> { return new AnyContext<TypeOf<T>>().makeOptionalNullable().pipe(ctx.test); },
};

const $ = {
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
	use<T extends Context = Context>(ctx: T): AnyContext<TypeOf<T>> { return new AnyContext<TypeOf<T>>().pipe(ctx.test); },

	/**
	 * undefined を許容します
	 */
	optional: {
		get any() { return new AnyContext().makeOptional() },
		arr<T extends Context = Context>(ctx?: T): ArrayContext<T, undefined> { return new ArrayContext(ctx).makeOptional() },
		array<T extends Context = Context>(ctx?: T): ArrayContext<T, undefined> { return new ArrayContext(ctx).makeOptional() },
		get bool() { return new BooleanContext().makeOptional() },
		get boolean() { return new BooleanContext().makeOptional() },
		get num() { return new NumberContext().makeOptional() },
		get number() { return new NumberContext().makeOptional() },
		obj<T extends Props>(ctx?: T): ObjectContext<T, undefined> { return new ObjectContext(ctx).makeOptional() as any },
		object<T extends Props>(ctx?: T): ObjectContext<T, undefined> { return new ObjectContext(ctx).makeOptional() as any },
		or<CtxA extends Context, CtxB extends Context>(ctxA: CtxA, ctxB: CtxB): OrContext<CtxA, CtxB, undefined> { return new OrContext(ctxA, ctxB).makeOptional() },
		get str() { return new StringContext().makeOptional() },
		get string() { return new StringContext().makeOptional() },
		type<T extends Context & TypeContext>(Ctx: { new(): T; }): ReturnType<T['makeOptional']> { return new Ctx().makeOptional() as any },
		use<T extends Context = Context>(ctx: T): AnyContext<TypeOf<T>, undefined> { return new AnyContext<TypeOf<T>>().makeOptional().pipe(ctx.test); },

		/**
		 * undefined と null を許容します
		 */
		nullable: optionalNullable
	},

	/**
	 * null を許容します
	 */
	nullable: {
		get any() { return new AnyContext().makeNullable() },
		arr<T extends Context = Context>(ctx?: T): ArrayContext<T, null> { return new ArrayContext(ctx).makeNullable() },
		array<T extends Context = Context>(ctx?: T): ArrayContext<T, null> { return new ArrayContext(ctx).makeNullable() },
		get bool() { return new BooleanContext().makeNullable() },
		get boolean() { return new BooleanContext().makeNullable() },
		get num() { return new NumberContext().makeNullable() },
		get number() { return new NumberContext().makeNullable() },
		obj<T extends Props>(ctx?: T): ObjectContext<T, null> { return new ObjectContext(ctx).makeNullable() as any },
		object<T extends Props>(ctx?: T): ObjectContext<T, null> { return new ObjectContext(ctx).makeNullable() as any },
		or<CtxA extends Context, CtxB extends Context>(ctxA: CtxA, ctxB: CtxB): OrContext<CtxA, CtxB, null> { return new OrContext(ctxA, ctxB).makeNullable() },
		get str() { return new StringContext().makeNullable() },
		get string() { return new StringContext().makeNullable() },
		type<T extends Context & TypeContext>(Ctx: { new(): T; }): ReturnType<T['makeNullable']> { return new Ctx().makeNullable() as any },
		use<T extends Context = Context>(ctx: T): AnyContext<TypeOf<T>, null> { return new AnyContext<TypeOf<T>>().makeNullable().pipe(ctx.test); },

		/**
		 * undefined と null を許容します
		 */
		optional: optionalNullable
	},

	/**
	 * undefined と null を許容します
	 */
	optionalNullable: optionalNullable
};

export default $;

export {
	Context,
	AnyContext,
	ArrayContext,
	BooleanContext,
	NumberContext,
	ObjectContext,
	StringContext,
	OrContext
};
