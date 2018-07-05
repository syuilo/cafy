import Context from '../ctx';
import { TypeOf } from '.';

export const isAnObject = x => typeof x == 'object' && !(x instanceof Array);
export const isNotAnObject = x => !isAnObject(x);

export type Props = { [key: string]: Context };

/**
 * Object
 */
export default class ObjectContext<Ps extends Props> extends Context<{ [P in keyof Ps]: TypeOf<Ps[P]> }> {
	private isStrict = false;
	public props: Props;

	constructor(props?: Props) {
		super();

		this.props = props;

		this.push(v =>
			isNotAnObject(v)
				? new Error('must-be-an-object')
				: true
		);

		if (props) {
			Object.entries(props).forEach(([k, ctx]) => {
				this.push(v => ctx.test(v[k]));
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

	public getType(): string {
		return 'object';
	}
}
