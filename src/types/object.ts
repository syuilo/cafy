import Context from '../ctx';
import { TypeOf } from '.';

export const isAnObject = x => typeof x == 'object' && !(x instanceof Array);
export const isNotAnObject = x => !isAnObject(x);

export type Props = { [key: string]: Context };

export class ObjError extends Error {
	public prop: string;
	public valueError: Error;

	constructor(prop: string | null, error: Error | string) {
		if (prop == null) {
			super(error as string);
			return;
		}

		let path = prop;
		let leafError: Error = null;
		const digg = (e: Error) => {
			if (e instanceof ObjError) {
				path += '.' + e.prop;
				digg(e.valueError);
			} else {
				leafError = e;
			}
		};
		digg(error as Error);
		super(`${path}: ${leafError.message}`);

		this.prop = prop;
		this.valueError = error as Error;
	}
}

/**
 * Object
 */
export default class ObjectContext<Ps extends Props> extends Context<{ [P in keyof Ps]: TypeOf<Ps[P]> }, ObjError> {
	private isStrict = false;
	public props: Props;

	constructor(props?: Props) {
		super();

		this.props = props;

		this.push(v =>
			isNotAnObject(v)
				? new ObjError(null, 'must-be-an-object')
				: true
		);

		if (props) {
			Object.entries(props).forEach(([k, ctx]) => {
				this.push(v => {
					const e = ctx.test(v[k]);
					if (e) {
						return new ObjError(k, e);
					} else {
						return null;
					}
				});
			});
		}

		this.push(v => {
			if (this.isStrict) {
				const actual = Object.keys(v);
				const expect = Object.keys(props);
				const hasNotMentionedProperty = actual.some(p => !expect.some(m => m == p));
				if (hasNotMentionedProperty) return new ObjError(null, 'dirty-object');
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
		return super.getType('object');
	}
}
