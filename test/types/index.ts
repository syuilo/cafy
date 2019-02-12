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

// $ExpectType any
$.any.get(42)[0];

// $ExpectType any[]
$.arr().get(42)[0];

// $ExpectType boolean
$.bool.get(42)[0];

// $ExpectType number
$.num.get(42)[0];

// $ExpectType { [x: string]: any; }
$.obj().get(42)[0];

// $ExpectType string | number
$.or($.str, $.num).get(42)[0];

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
