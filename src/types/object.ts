import Query from '../query';
import { TypeOf } from '.';

export const isAnObject = x => typeof x == 'object' && !(x instanceof Array);
export const isNotAnObject = x => !isAnObject(x);

/**
 * Object
 */
export default class ObjectQuery<Qs extends { [key: string]: Query }> extends Query<{ [P in keyof Qs]: TypeOf<Qs[P]> }> {
	private isStrict = false;

	constructor(q?: { [key: string]: Query }) {
		super();

		this.push(v =>
			isNotAnObject(v)
				? new Error('must-be-an-object')
				: true
		);

		if (q) {
			Object.entries(q).forEach(([k, q]) => {
				this.push(v => q.test(v[k]));
			});
		}

		this.push(v => {
			if (this.isStrict) {
				const actual = Object.keys(v);
				const expect = Object.keys(q);
				const hasNotMentionedProperty = actual.some(p => !expect.some(m => m == p));
				if (hasNotMentionedProperty) return new Error('dirty-object');
			}
			return true;
		});
	}

	/**
	 * 言及したプロパティ以外のプロパティを持つことを禁止します。
	 */
	public strict() {
		this.isStrict = true;
		return this;
	}
}
