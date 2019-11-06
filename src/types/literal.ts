import Context from '../ctx';

/**
 * Literal
 */
export default class LiteralContext<Literal, Maybe extends null | undefined | Literal = Literal> extends Context<Literal | Maybe> {
	public readonly name = 'Literal';

	public readonly literal: any;

	constructor(literal: Literal, optional = false, nullable = false) {
		super(optional, nullable);

		this.literal = literal;

		this.push(v =>
			v !== literal
				? new Error('must be ' + literal)
				: true
		);
	}

	public getType(): string {
		return super.getType(typeof this.literal === 'string' ? `'${this.literal}'` : this.literal);
	}

	//#region ✨ Some magicks ✨
	public makeOptional(): LiteralContext<Literal, undefined> {
		return new LiteralContext(this.literal, true, false);
	}

	public makeNullable(): LiteralContext<Literal, null> {
		return new LiteralContext(this.literal, false, true);
	}

	public makeOptionalNullable(): LiteralContext<Literal, undefined | null> {
		return new LiteralContext(this.literal, true, true);
	}
	//#endregion
}
