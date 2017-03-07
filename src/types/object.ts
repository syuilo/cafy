import Query from '../query';

export const isAnObject = x => typeof x == 'object';
export const isNotAnObject = x => !isAnObject(x);

export default class ObjectQuery extends Query<any> {
	constructor(optional: boolean, nullable: boolean, lazy: boolean, value?: any) {
		super(optional, nullable, lazy, value);
		this.pushValidator(v => {
			if (isNotAnObject(v)) return new Error('must-be-an-object');
			return true;
		});
	}
}
