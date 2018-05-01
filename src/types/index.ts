import Query from "../query";

export type TypeOf<Q> =
	Q extends Query<infer T> ? T :
	any;
