/**
 * Tests!
 */

'use strict';

const assert = require('assert');
const check = require('../').default;

it('デフォルトの値を設定できる', () => {
	const def = 'strawberry pasta';
	const [val = def, err] = check(undefined).expect.string().get();
	assert.equal(val, def);
	assert.equal(err, null);
});

describe('StringQuery', () => {
	it('問題なく取得できる', () => {
		const x = 'strawberry pasta';
		const [val, err] = check(x).expect.string().get();
		assert.equal(val, x);
		assert.equal(err, null);
	});

	it('文字列以外でエラー', () => {
		const x = [1, 2, 3];
		const [val, err] = check(x).expect.string().get();
		assert.notEqual(err, null);
	});

	describe('required', () => {
		it('問題なく取得できる', () => {
			const x = 'strawberry pasta';
			const [val, err] = check(x).expect.string().required().get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('nullでエラー', () => {
			const x = null;
			const [val, err] = check(x).expect.string().required().get();
			assert.notEqual(err, null);
		});

		it('undefinedでエラー', () => {
			const x = undefined;
			const [val, err] = check(x).expect.string().required().get();
			assert.notEqual(err, null);
		});
	});
});

describe('syntax sugger', () => {
	it('?無しでnull禁止', () => {
		const [val, err] = check(null, 'string');
		assert.notEqual(err, null);
	});

	it('?付きでnullable', () => {
		const [val, err] = check(null, 'string?');
		assert.equal(val, null);
		assert.equal(err, null);
	});
});
