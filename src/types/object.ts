import Context from '../ctx';
import { TypeOf } from '.';

export const isAnObject = x => typeof x == 'object' && !(x instanceof Array);
export const isNotAnObject = x => !isAnObject(x);

export type Props = { [key: string]: Context };

export class ObjError extends Error {
	public path: string[] | undefined;
	public error: Error | undefined;

	constructor(prop: string | null, error: Error | string) {
		if (prop == null) {
			super(error as string);
			return;
		}

		let leaf: Error;

		let path = [prop];
		if (error instanceof ObjError && error.path && error.error) {
			path = path.concat(error.path);
			leaf = error.error;
		} else {
			leaf = error as Error;
		}

		super(`${path.join('.')}: ${leaf.message}`);

		this.path = path;
		this.error = leaf;
	}
}

type O<Ps> = { [P in keyof Ps]: TypeOf<Ps[P]> };

/**
 * Object
 */
export default class ObjectContext<Ps extends Props, Maybe extends null | undefined | O<Ps> = O<Ps>> extends Context<Maybe extends O<Ps> ? O<Ps> : (O<Ps> | Maybe), ObjError> {
	public readonly name = 'Object';

	private isStrict = false;
	public readonly props: Props | undefined;

	constructor(props?: Props, optional = false, nullable = false) {
		super(optional, nullable);

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
				const expect = Object.keys(props as NonNullable<Props>);
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
		if (this.props) {
			const entries = Object.entries(this.props).map(([k, v]) => `k: ${v.getType()}`).join(', ');
			return super.getType(`{ ${entries} }`);
		} else {
			return super.getType();
		}
	}

	//#region ✨ Some magicks ✨
	public makeOptional(): ObjectContext<Props, undefined> {
		return new ObjectContext(this.props, true, false);
	}

	public makeNullable(): ObjectContext<Props, null> {
		return new ObjectContext(this.props, false, true);
	}

	public makeOptionalNullable(): ObjectContext<Props, undefined | null> {
		return new ObjectContext(this.props, true, true);
	}
	//#endregion
}
