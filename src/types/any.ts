import Query from '../query';

/**
 * Any
 */
export default class AnyQuery extends Query<any> {
	constructor(optional: boolean, nullable: boolean, lazy: boolean, value?: any) {
		super(optional, nullable, lazy, value);
	}
}
