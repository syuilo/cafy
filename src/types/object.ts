import Query from '../query';
import { TypeOf } from '.';

export const isAnObject = x => typeof x == 'object' && !(x instanceof Array);
export const isNotAnObject = x => !isAnObject(x);

export type Props = { [key: string]: Query };

/**
 * Object
 */
export default class ObjectQuery<Ps extends Props> extends Query<{ [P in keyof Ps]: TypeOf<Ps[P]> }> {
	private isStrict = false;

	constructor(props?: Props) {
		super();

		this.push(v =>
			isNotAnObject(v)
				? new Error('must-be-an-object')
				: true
		);

		if (props) {
			Object.entries(props).forEach(([k, q]) => {
				this.push(v => q.test(v[k]));
			});
		}

		this.push(v => {
			if (this.isStrict) {
				const actual = Object.keys(v);
				const expect = Object.keys(props);
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
