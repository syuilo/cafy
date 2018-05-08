import Query from '../query';
import { TypeOf } from '.';

/**
 * Or
 */
export default class OrQuery<QA extends Query, QB extends Query> extends Query<TypeOf<QA> | TypeOf<QB>> {
	constructor(qA: Query, qB: Query) {
		super();

		this.push(v =>
			qA.nok(v) && qB.nok(v) ? new Error('not match') : true
		);
	}
}
