import Query from '../query';

/**
 * Any
 */
export default class AnyQuery extends Query<boolean> {
	constructor(optional: boolean, nullable: boolean, lazy: boolean, value?: any) {
		super(optional, nullable, lazy, value);
	}
}
