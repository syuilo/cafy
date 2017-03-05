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
			it('合致する文字列で成功 (配列)', () => {
				const err = test('strawberry').expect.string().or(['strawberry', 'pasta']).check();
				assert.equal(err, null);
			});

			it('合致しない文字列で失敗 (配列)', () => {
				const err = test('alice').expect.string().or(['strawberry', 'pasta']).check();
				assert.notEqual(err, null);
			});

			it('合致する文字列で成功 (文字列)', () => {
				const err = test('strawberry').expect.string().or('strawberry pasta').check();
				assert.equal(err, null);
			});

			it('合致しない文字列で失敗 (文字列)', () => {
				const err = test('alice').expect.string().or('strawberry pasta').check();
				assert.notEqual(err, null);
			});
		});
	});

	describe('Number', () => {
		it('正当な値を与える', () => {
			const x = 42;
			const [val, err] = test(x).expect.number().get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('数値以外でエラー', () => {
			const x = 'strawberry pasta';
			const [val, err] = test(x).expect.number().get();
			assert.notEqual(err, null);
		});

		describe('# int', () => {
			it('整数で合格', () => {
				const err = test(42).expect.number().int().check();
				assert.equal(err, null);
			});

			it('非整数で不合格', () => {
				const err = test(3.14).expect.number().int().check();
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
