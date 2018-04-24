import Query from '../query';
import { TypeOf } from '.';

/**
 * Or
 */
export default class OrQuery<QA extends Query<any>, QB extends Query<any>> extends Query<TypeOf<QA> | TypeOf<QB>> {
	constructor(optional: boolean, nullable: boolean, lazy: boolean, qA: Query<any>, qB: Query<any>, value?: any) {
		super(optional, nullable, lazy, value);

		this.pushFirstTimeValidator(v =>
			qA.nok(v) && qB.nok(v) ? new Error('not match') : true
		);
	}
}
