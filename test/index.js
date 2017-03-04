/**
 * Tests!
 */

'use strict';

const assert = require('assert');
const check = require('../').default;

describe('StringQuery', () => {
	it('問題なく取得できる', () => {
		const x = 'strawberry pasta';
		const [val, err] = check(x).expect.string().qed();
		assert.equal(val, x);
		assert.equal(err, null);
	});

	it('文字列以外でエラー', () => {
		const x = [1, 2, 3];
		const [val, err] = check(x).expect.string().qed();
		assert.notEqual(err, null);
	});

	describe('required', () => {
		it('問題なく取得できる', () => {
			const x = 'strawberry pasta';
			const [val, err] = check(x).expect.string().required().qed();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('nullでエラー', () => {
			const x = null;
			const [val, err] = check(x).expect.string().required().qed();
			assert.notEqual(err, null);
		});

		it('undefinedでエラー', () => {
			const x = undefined;
			const [val, err] = check(x).expect.string().required().qed();
			assert.notEqual(err, null);
		});
	});
});
