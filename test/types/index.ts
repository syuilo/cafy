/**
 * Unit testing TypeScript types.
 * with https://github.com/Microsoft/dtslint
 */

import $ from 'cafy';

// $ExpectType string
$.str.get(42)[0];

// $ExpectType string | undefined
$.optional.str.get(42)[0];

// $ExpectType string | null
$.nullable.str.get(42)[0];

// $ExpectType string | null | undefined
$.optional.nullable.str.get(42)[0];

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
