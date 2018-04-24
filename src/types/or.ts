import Query from '../query';
import { TypeOf } from '.';

/**
 * Or
 */
export default class OrQuery<QA extends Query<any>, QB extends Query<any>> extends Query<TypeOf<QA> | TypeOf<QB>> {
	constructor(qA: Query<any>, qB: Query<any>, ...args) {
		super(...args);

		this.pushValidator(v =>
			qA.nok(v) && qB.nok(v) ? new Error('not match') : true
		);
	}
}
