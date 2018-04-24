import StringQuery from "./string";
import NumberQuery from "./number";
import BooleanQuery from "./boolean";
import ObjectQuery from "./object";
import ArrayQuery from "./array";
import AnyQuery from "./any";
import Query from "../query";

export type TypeOf<Q> =
	Q extends StringQuery ? string :
	Q extends NumberQuery ? number :
	Q extends BooleanQuery ? boolean :
	Q extends ObjectQuery ? { [x: string]: any } :
	Q extends ArrayQuery<Query<infer T>> ? T[] :
	Q extends Query<infer T> ? T :
	Q extends AnyQuery ? any :
	any;
