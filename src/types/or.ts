import Context from '../ctx';
import { TypeOf } from '.';

/**
 * Or
 */
export default class OrContext<CtxA extends Context, CtxB extends Context> extends Context<TypeOf<CtxA> | TypeOf<CtxB>> {
	constructor(ctxA: Context, ctxB: Context) {
		super();

		this.push(v =>
			ctxA.nok(v) && ctxB.nok(v) ? new Error('not match') : true
		);
	}
}
