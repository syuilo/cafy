/**
 * Unit testing TypeScript types.
 * with https://github.com/Microsoft/dtslint
 */

import $ from 'cafy';

//#region null and undefined
// $ExpectType string | undefined
$.optional.str.get(42)[0];

// $ExpectType string | null
$.nullable.str.get(42)[0];

// $ExpectType string | null | undefined
$.optional.nullable.str.get(42)[0];
//#endregion

// Any
// $ExpectType any
$.any.get(42)[0];

// Array
// $ExpectType any[]
$.arr().get(42)[0];

// Array (with child context)
// $ExpectType string[]
$.arr($.str).get(42)[0];

// Array (nested)
// $ExpectType any[][]
$.arr($.arr()).get(42)[0];

// Boolean
// $ExpectType boolean
$.bool.get(42)[0];

// Number
// $ExpectType number
$.num.get(42)[0];

// Object
// $ExpectType { [x: string]: any; }
$.obj().get(42)[0];

// Either
// $ExpectType string | number
$.either($.str, $.num).get(42)[0];

// String
// $ExpectType string
$.str.get(42)[0];

/*
$ExpectType { x: { y: { z: number; }; }; }
$.obj({
	x: $.obj({
		y: $.obj({
			z: $.num
		})
	})
}).get(42)[0];
*/
