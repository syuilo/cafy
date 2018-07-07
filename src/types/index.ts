import Context from '../ctx';

export type TypeOf<Ctx> =
	Ctx extends Context<infer T> ? T :
	any;
