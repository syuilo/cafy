/**
 * Tests!
 */

'use strict';

const assert = require('assert');
const test = require('../').default;

it('デフォルトの値を設定できる', () => {
	const def = 'strawberry pasta';
	const [val = def, err] = test(undefined).expect.string().get();
	assert.equal(val, def);
	assert.equal(err, null);
});

describe('Common', () => {

	it('nullを与えられない', () => {
		const err = test(null).expect.string().check();
		assert.notEqual(err, null);
	});

	it('undefinedを与えられる', () => {
		const err = test(undefined).expect.string().check();
		assert.equal(err, null);
	});

	describe('required', () => {
		it('値を与えられる', () => {
			const x = 'strawberry pasta';
			const [val, err] = test(x).expect.string().required().get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('nullを与えられない', () => {
			const err = test(null).expect.string().required().check();
			assert.notEqual(err, null);
		});

		it('undefinedを与えられない', () => {
			const err = test(undefined).expect.string().required().check();
			assert.notEqual(err, null);
		});
	});

	describe('nullable', () => {
		it('値を与えられる', () => {
			const x = 'strawberry pasta';
			const [val, err] = test(x).expect.nullable.string().get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('nullを与えられる', () => {
			const err = test(null).expect.nullable.string().check();
			assert.equal(err, null);
		});

		it('undefinedを与えられる', () => {
			const err = test(undefined).expect.nullable.string().check();
			assert.equal(err, null);
		});
	});

	describe('required + nullable', () => {
		it('値を与えられる', () => {
			const x = 'strawberry pasta';
			const [val, err] = test(x).expect.nullable.string().required().get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('nullを与えられる', () => {
			const err = test(null).expect.nullable.string().required().check();
			assert.equal(err, null);
		});

		it('undefinedを与えられない', () => {
			const err = test(undefined).expect.nullable.string().required().check();
			assert.notEqual(err, null);
		});
	});
});

describe('Queries', () => {
	describe('String', () => {
		it('正当な値を与える', () => {
			const x = 'strawberry pasta';
			const [val, err] = test(x).expect.string().get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('文字列以外でエラー', () => {
			const x = [1, 2, 3];
			const [val, err] = test(x).expect.string().get();
			assert.notEqual(err, null);
		});

		describe('# or', () => {
			it('文字列の配列を与えて検証できる', () => {
				const err = test('strawberry').expect.string().or(['strawberry', 'pasta']).check();
				assert.equal(err, null);
			});

			it('キーワードをスペースで区切った文字列を与えて検証できる', () => {
				const err = test('strawberry').expect.string().or('strawberry pasta').check();
				assert.equal(err, null);
			});

			it('合致しない文字列でエラー', () => {
				const err = test('alice').expect.string().or(['strawberry', 'pasta']).check();
				assert.notEqual(err, null);
			});
		});
	});
});

describe('syntax sugger', () => {
	describe('default', () => {
		it('値を与えられる', () => {
			const x = 'strawberry pasta';
			const [val, err] = test(x, 'string').get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('null不可', () => {
			const [, err] = test(null, 'string').get();
			assert.notEqual(err, null);
		});

		it('undefined可', () => {
			const [val, err] = test(undefined, 'string').get();
			assert.equal(val, undefined);
			assert.equal(err, null);
		});
	});

	describe('required (!)', () => {
		it('値を与えられる', () => {
			const x = 'strawberry pasta';
			const [val, err] = test(x, 'string!').get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('null不可', () => {
			const [, err] = test(null, 'string!').get();
			assert.notEqual(err, null);
		});

		it('undefined不可', () => {
			const [, err] = test(undefined, 'string!').get();
			assert.notEqual(err, null);
		});
	});

	describe('nullable (?)', () => {
		it('値を与えられる', () => {
			const x = 'strawberry pasta';
			const [val, err] = test(x, 'string?').get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('null可', () => {
			const [val, err] = test(null, 'string?').get();
			assert.equal(val, null);
			assert.equal(err, null);
		});

		it('undefined可', () => {
			const [val, err] = test(undefined, 'string?').get();
			assert.equal(val, undefined);
			assert.equal(err, null);
		});
	});

	describe('required + nullable (!?)', () => {
		it('値を与えられる', () => {
			const x = 'strawberry pasta';
			const [val, err] = test(x, 'string!?').get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('null可', () => {
			const [val, err] = test(null, 'string!?').get();
			assert.equal(val, null);
			assert.equal(err, null);
		});

		it('undefined不可', () => {
			const [, err] = test(undefined, 'string!?').get();
			assert.notEqual(err, null);
		});
	});
});
