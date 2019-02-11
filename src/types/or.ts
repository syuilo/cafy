import Context from '../ctx';
import { TypeOf, Dummy } from '.';

/**
 * Or
 */
export default class OrContext<CtxA extends Context, CtxB extends Context, Maybe = Dummy> extends Context<Maybe extends Dummy ? (TypeOf<CtxA> | TypeOf<CtxB>) : (TypeOf<CtxA> | TypeOf<CtxB> | Maybe)> {
	private ctxA: Context;
	private ctxB: Context;

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
	public makeOptional(): OrContext<CtxA, CtxB, undefined> {
		return new OrContext(this.ctxA, this.ctxB, true, false);
	}

	public makeNullable(): OrContext<CtxA, CtxB, null> {
		return new OrContext(this.ctxA, this.ctxB, false, true);
	}

	public makeOptionalNullable(): OrContext<CtxA, CtxB, undefined | null> {
		return new OrContext(this.ctxA, this.ctxB, true, true);
	}
	//#endregion
}
