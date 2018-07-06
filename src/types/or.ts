import Context from '../ctx';
import { TypeOf } from '.';

/**
 * Or
 */
export default class OrContext<CtxA extends Context, CtxB extends Context> extends Context<TypeOf<CtxA> | TypeOf<CtxB>> {
	private ctxA: Context;
	private ctxB: Context;

	constructor(ctxA: Context, ctxB: Context) {
		super();

		this.ctxA = ctxA;
		this.ctxB = ctxB;

		this.push(v =>
			ctxA.nok(v) && ctxB.nok(v) ? new Error('not match') : true
		);
	}

	public getType(): string {
		return super.getType(`(${this.ctxA.getType()} | ${this.ctxA.getType()})`);
	}
}
