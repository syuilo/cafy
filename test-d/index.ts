/**
 * Unit testing TypeScript types.
 * with https://github.com/SamVerschueren/tsd
 */

import { expectType } from 'tsd';
import $ from '../src';

//#region null and undefined
{
	expectType<string | undefined>(
		$.optional.str.get(42)[0]
	);
}

{
	expectType<string | null>(
		$.nullable.str.get(42)[0]
	);
}

{
	expectType<string | null | undefined>(
		$.optional.nullable.str.get(42)[0]
	);
}
//#endregion

// Any
{
	expectType<any>(
		$.any.get(42)[0]
	);
}

// Array
{
	expectType<any[]>(
		$.arr().get(42)[0]
	);
}

// Array (with child context)
{
	expectType<string[]>(
		$.arr($.str).get(42)[0]
	);
}

// Array (nested)
{
	expectType<any[][]>(
		$.arr($.arr()).get(42)[0]
	);
}

// Boolean
{
	expectType<boolean>(
		$.bool.get(42)[0]
	);
}

// Number
{
	expectType<number>(
		$.num.get(42)[0]
	);
}

// Object
{
	expectType<{ [x: string]: any; }>(
		$.obj().get(42)[0]
	);

	expectType<{ x: { y: { z: number; }; }; }>(
		$.obj({
			x: $.obj({
				y: $.obj({
					z: $.num
				})
			})
		}).get(42)[0]
	);
}

// Either
{
	expectType<string | number>(
		$.either($.str, $.num).get(42)[0]
	);
}

// String
{
	expectType<string>(
		$.str.get(42)[0]
	);
}

// Literal
{
	expectType<'foo'>(
		$.literal('foo').get(42)[0]
	);

	expectType<42>(
		$.literal(42).get(42)[0]
	);
}

// .assert() method
// with Assertion Functions (TS 3.7)
/*
{
	const x = 42 as unknown;

	$.str.assert(x);

	expectType<string>(
		x
	);
}
*/
