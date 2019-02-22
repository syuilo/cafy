import Context from '../ctx';
import { TypeOf, Dummy } from '.';

/**
 * Either
 */
export default class EitherContext<CtxA extends Context, CtxB extends Context, Maybe = Dummy> extends Context<Maybe extends Dummy ? (TypeOf<CtxA> | TypeOf<CtxB>) : (TypeOf<CtxA> | TypeOf<CtxB> | Maybe)> {
	public readonly name = 'Either';

	public readonly ctxA: Context;
	public readonly ctxB: Context;

	constructor(ctxA: Context, ctxB: Context, optional = false, nullable = false) {
		super(optional, nullable);

		this.ctxA = ctxA;
		this.ctxB = ctxB;

		this.push(v =>
			ctxA.nok(v) && ctxB.nok(v) ? new Error('not match') : true
		);
	}

	public getType(): string {
		return super.getType(`(${this.ctxA.getType()} | ${this.ctxB.getType()})`);
	}

	//#region ✨ Some magicks ✨
	public makeOptional(): EitherContext<CtxA, CtxB, undefined> {
		return new EitherContext(this.ctxA, this.ctxB, true, false);
	}

	public makeNullable(): EitherContext<CtxA, CtxB, null> {
		return new EitherContext(this.ctxA, this.ctxB, false, true);
	}

	public makeOptionalNullable(): EitherContext<CtxA, CtxB, undefined | null> {
		return new EitherContext(this.ctxA, this.ctxB, true, true);
	}
	//#endregion
}
