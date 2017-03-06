/**
 * Tests!
 */

'use strict';

const assert = require('assert');
const f = require('../').default;

it('デフォルトの値を設定できる', () => {
	const def = 'strawberry pasta';
	const [val = def, err] = f(undefined).optional.string().get();
	assert.equal(val, def);
	assert.equal(err, null);
});

describe('統合', () => {

	it('正しく成功する', () => {
		const err = f('strawberry pasta').string().min(1).min(10).test();
		assert.equal(err, null);
	});

	it('正しく失敗する', () => {
		const err = f('alice').string().min(1).min(10).test();
		assert.notEqual(err, null);
	});

	describe('遅延評価', () => {
		it('正しく成功する', () => {
			const err = f().string().min(10).test('strawberry pasta');
			assert.equal(err, null);
		});

		it('正しく失敗する', () => {
			const err = f().string().min(10).test('alice');
			assert.notEqual(err, null);
		});
	});

	describe('入れ子', () => {
		it('正しく成功する', () => {
			const err = f([1, 2, 3]).array().each(f().number().range(0, 100)).test();
			assert.equal(err, null);
		});

		it('正しく失敗する', () => {
			const err = f([1, -1, 3]).array().each(f().number().range(0, 100)).test();
			assert.notEqual(err, null);
		});
	});
});

describe('Common', () => {

	it('nullを与えられない', () => {
		const err = f(null).string().test();
		assert.notEqual(err, null);
	});

	it('undefinedを与えられない', () => {
		const err = f(undefined).string().test();
		assert.notEqual(err, null);
	});

	describe('optional', () => {
		it('値を与えられる', () => {
			const x = 'strawberry pasta';
			const [val, err] = f(x).optional.string().get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('nullを与えられない', () => {
			const err = f(null).optional.string().test();
			assert.notEqual(err, null);
		});

		it('undefinedを与えられる', () => {
			const err = f(undefined).optional.string().test();
			assert.equal(err, null);
		});
	});

	describe('nullable', () => {
		it('値を与えられる', () => {
			const x = 'strawberry pasta';
			const [val, err] = f(x).nullable.string().get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('nullを与えられる', () => {
			const err = f(null).nullable.string().test();
			assert.equal(err, null);
		});

		it('undefinedを与えられない', () => {
			const err = f(undefined).nullable.string().test();
			assert.notEqual(err, null);
		});
	});

	describe('optional + nullable', () => {
		it('値を与えられる', () => {
			const x = 'strawberry pasta';
			const [val, err] = f(x).nullable.optional.string().get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('nullを与えられる', () => {
			const err = f(null).nullable.optional.string().test();
			assert.equal(err, null);
		});

		it('undefinedを与えらる', () => {
			const err = f(undefined).nullable.optional.string().test();
			assert.equal(err, null);
		});
	});

	describe('# validate', () => {
		it('バリデータが true を返したら合格', () => {
			const err = f('strawberry pasta').string().validate(() => true).test();
			assert.equal(err, null);
		});

		it('バリデータが false を返したら失格', () => {
			const err = f('strawberry pasta').string().validate(() => false).test();
			assert.notEqual(err, null);
		});

		it('バリデータが Error を返したら失格', () => {
			const err = f('strawberry pasta').string().validate(() => new Error('something')).test();
			assert.notEqual(err, null);
		});
	});
});

describe('Queries', () => {
	describe('String', () => {
		it('正当な値を与える', () => {
			const x = 'strawberry pasta';
			const [val, err] = f(x).string().get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('文字列以外でエラー', () => {
			const x = [1, 2, 3];
			const [val, err] = f(x).string().get();
			assert.notEqual(err, null);
		});

		describe('# min', () => {
			it('しきい値より長くて成功', () => {
				const err = f('strawberry').string().min(8).test();
				assert.equal(err, null);
			});

			it('しきい値より短くて失敗', () => {
				const err = f('pasta').string().min(8).test();
				assert.notEqual(err, null);
			});
		});

		describe('# max', () => {
			it('しきい値より短くて成功', () => {
				const err = f('pasta').string().max(8).test();
				assert.equal(err, null);
			});

			it('しきい値より長くて失敗', () => {
				const err = f('strawberry').string().max(8).test();
				assert.notEqual(err, null);
			});
		});

		describe('# or', () => {
			it('合致する文字列で成功 (配列)', () => {
				const err = f('strawberry').string().or(['strawberry', 'pasta']).test();
				assert.equal(err, null);
			});

			it('合致しない文字列で失敗 (配列)', () => {
				const err = f('alice').string().or(['strawberry', 'pasta']).test();
				assert.notEqual(err, null);
			});

			it('合致する文字列で成功 (文字列)', () => {
				const err = f('strawberry').string().or('strawberry pasta').test();
				assert.equal(err, null);
			});

			it('合致しない文字列で失敗 (文字列)', () => {
				const err = f('alice').string().or('strawberry pasta').test();
				assert.notEqual(err, null);
			});
		});
	});

	describe('Number', () => {
		it('正当な値を与える', () => {
			const x = 42;
			const [val, err] = f(x).number().get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('数値以外でエラー', () => {
			const x = 'strawberry pasta';
			const [val, err] = f(x).number().get();
			assert.notEqual(err, null);
		});

		describe('# int', () => {
			it('整数で合格', () => {
				const err = f(42).number().int().test();
				assert.equal(err, null);
			});

			it('非整数で不合格', () => {
				const err = f(3.14).number().int().test();
				assert.notEqual(err, null);
			});
		});

		describe('# min', () => {
			it('しきい値より大きくて成功', () => {
				const err = f(50).number().min(42).test();
				assert.equal(err, null);
			});

			it('しきい値より小さくて失敗', () => {
				const err = f(30).number().min(42).test();
				assert.notEqual(err, null);
			});
		});

		describe('# max', () => {
			it('しきい値より小さくて成功', () => {
				const err = f(30).number().max(42).test();
				assert.equal(err, null);
			});

			it('しきい値より大きくて失敗', () => {
				const err = f(50).number().max(42).test();
				assert.notEqual(err, null);
			});
		});
	});

	describe('Array', () => {
		it('正当な値を与える', () => {
			const x = [1, 2, 3];
			const [val, err] = f(x).array().get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('配列以外でエラー', () => {
			const x = 'strawberry pasta';
			const [val, err] = f(x).array().get();
			assert.notEqual(err, null);
		});

		describe('要素の型指定', () => {
			it('正当な値を与えて合格', () => {
				const err = f(['a', 'b', 'c']).array('string').test();
				assert.equal(err, null);
			});

			it('不正な値を与えて不合格', () => {
				const err = f(['a', 1, 'c']).array('string').test();
				assert.notEqual(err, null);
			});
		});

		describe('# unique', () => {
			it('ユニークで合格', () => {
				const err = f(['a', 'b', 'c']).array().unique().test();
				assert.equal(err, null);
			});

			it('重複した要素が有って不合格', () => {
				const err = f(['a', 'b', 'c', 'b']).array().unique().test();
				assert.notEqual(err, null);
			});
		});

		describe('# min', () => {
			it('しきい値より長くて成功', () => {
				const err = f([1, 2, 3, 4]).array().min(3).test();
				assert.equal(err, null);
			});

			it('しきい値より短くて失敗', () => {
				const err = f([1, 2]).array().min(3).test();
				assert.notEqual(err, null);
			});
		});

		describe('# max', () => {
			it('しきい値より短くて成功', () => {
				const err = f([1, 2]).array().max(3).test();
				assert.equal(err, null);
			});

			it('しきい値より長くて失敗', () => {
				const err = f([1, 2, 3, 4]).array().max(3).test();
				assert.notEqual(err, null);
			});
		});

		describe('# each', () => {
			it('バリデータが true を返したら合格', () => {
				const err = f([1, 2, 3]).array().each(() => true).test();
				assert.equal(err, null);
			});

			it('バリデータが false を返したら失格', () => {
				const err = f([1, 2, 3]).array().each(() => false).test();
				assert.notEqual(err, null);
			});

			it('バリデータが Error を返したら失格', () => {
				const err = f([1, 2, 3]).array().each(() => new Error('something')).test();
				assert.notEqual(err, null);
			});
		});
	});
});
