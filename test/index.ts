/**
 * Tests!
 */

import * as assert from 'assert';
import $, { Query } from '../';

it('デフォルトの値を設定できる', () => {
	const def = 'strawberry pasta';
	const [val = def, err] = $(undefined).optional.string().get();
	assert.equal(val, def);
	assert.equal(err, null);
});

describe('統合', () => {

	it('正しく成功する', () => {
		const err = $('strawberry pasta').string().min(1).min(10).test();
		assert.equal(err, null);
	});

	it('正しく失敗する', () => {
		const err = $('alice').string().min(1).min(10).test();
		assert.notEqual(err, null);
	});

	describe('遅延検証', () => {
		it('正しく成功する', () => {
			const err = $().string().min(10).test('strawberry pasta');
			assert.equal(err, null);
		});

		it('正しく失敗する', () => {
			const err = $().string().min(10).test('alice');
			assert.notEqual(err, null);
		});

		it('使いまわせる', () => {
			const isValidGender = $().string().or('male|female').ok;
			assert.equal(isValidGender('male'), true);
			assert.equal(isValidGender('female'), true);
			assert.equal(isValidGender('alice'), false);
		});
	});

	describe('入れ子', () => {
		it('正しく成功する', () => {
			const err = $([1, 2, 3]).array().each($().number().range(0, 10)).test();
			assert.equal(err, null);
		});

		it('正しく失敗する', () => {
			const err = $([1, -1, 3]).array().each($().number().range(0, 10)).test();
			assert.notEqual(err, null);
		});
	});

	it('lazy optional', () => {
		const genderValidator = $().string().or('male|female');

		const err1 = genderValidator.test(undefined);
		assert.notEqual(err1, null);

		const err2 = genderValidator.test('male');
		assert.equal(err2, null);

		const err3 = genderValidator.test('alice');
		assert.notEqual(err3, null);

		const err4 = genderValidator.optional().test(undefined);
		assert.equal(err4, null);

		const err5 = genderValidator.optional().test('male');
		assert.equal(err5, null);

		const err6 = genderValidator.optional().test('alice');
		assert.notEqual(err6, null);
	});
});

describe('Common', () => {

	it('nullを与えられない', () => {
		const err = $(null).string().test();
		assert.notEqual(err, null);
	});

	it('undefinedを与えられない', () => {
		const err = $(undefined).string().test();
		assert.notEqual(err, null);
	});

	describe('optional', () => {
		it('値を与えられる', () => {
			const x = 'strawberry pasta';
			const [val, err] = $(x).optional.string().get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('nullを与えられない', () => {
			const err = $(null).optional.string().test();
			assert.notEqual(err, null);
		});

		it('undefinedを与えられる', () => {
			const err = $(undefined).optional.string().test();
			assert.equal(err, null);
		});
	});

	describe('nullable', () => {
		it('値を与えられる', () => {
			const x = 'strawberry pasta';
			const [val, err] = $(x).nullable.string().get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('nullを与えられる', () => {
			const err = $(null).nullable.string().test();
			assert.equal(err, null);
		});

		it('undefinedを与えられない', () => {
			const err = $(undefined).nullable.string().test();
			assert.notEqual(err, null);
		});
	});

	describe('optional + nullable', () => {
		it('値を与えられる', () => {
			const x = 'strawberry pasta';
			const [val, err] = $(x).nullable.optional.string().get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('nullを与えられる', () => {
			const err = $(null).nullable.optional.string().test();
			assert.equal(err, null);
		});

		it('undefinedを与えらる', () => {
			const err = $(undefined).nullable.optional.string().test();
			assert.equal(err, null);
		});
	});

	describe('# throw', () => {
		it('エラーをthrowする', () => {
			assert.throws($('strawberry pasta').number().throw);
		});
	});

	describe('# get', () => {
		it('GOOD', () => {
			const [v, e] = $('strawberry pasta').string().get();
			assert.equal(v, 'strawberry pasta');
			assert.equal(e, null);
		});

		it('BAD', () => {
			const [v, e] = $(42).string().get();
			assert.equal(v, 42);
			assert.notEqual(e, null);
		});

		it('GOOD (lazy)', () => {
			const [v, e] = $().string().get('strawberry pasta');
			assert.equal(v, 'strawberry pasta');
			assert.equal(e, null);
		});

		it('BAD (lazy)', () => {
			const [v, e] = $().string().get(42);
			assert.equal(v, 42);
			assert.notEqual(e, null);
		});
	});

	describe('# pipe', () => {
		it('バリデータが true を返したら合格', () => {
			const err = $('strawberry pasta').string().pipe(() => true).test();
			assert.equal(err, null);
		});

		it('バリデータが false を返したら失格', () => {
			const err = $('strawberry pasta').string().pipe(() => false).test();
			assert.notEqual(err, null);
		});

		it('バリデータが Error を返したら失格', () => {
			const err = $('strawberry pasta').string().pipe(() => new Error('something')).test();
			assert.notEqual(err, null);
		});

		it('nullのときには実行されない', () => {
			const err = $(null).nullable.string().pipe(x => x[0] == 'a').test();
			assert.equal(err, null);
		});

		it('undefinedのときには実行されない', () => {
			const err = $(undefined).optional.string().pipe(x => x[0] == 'a').test();
			assert.equal(err, null);
		});
	});
});

describe('Queries', () => {
	describe('String', () => {
		it('正当な値を与える', () => {
			const x = 'strawberry pasta';
			const [val, err] = $(x).string().get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('文字列以外でエラー', () => {
			const x = [1, 2, 3];
			const [val, err] = $(x).string().get();
			assert.notEqual(err, null);
		});

		it('サロゲートペア', () => {
			const ok = $('😀').string().length(1).ok();
			assert.equal(ok, true);
		});

		describe('# min', () => {
			it('しきい値より長くて成功', () => {
				const err = $('strawberry').string().min(8).test();
				assert.equal(err, null);
			});

			it('しきい値より短くて失敗', () => {
				const err = $('pasta').string().min(8).test();
				assert.notEqual(err, null);
			});
		});

		describe('# max', () => {
			it('しきい値より短くて成功', () => {
				const err = $('pasta').string().max(8).test();
				assert.equal(err, null);
			});

			it('しきい値より長くて失敗', () => {
				const err = $('strawberry').string().max(8).test();
				assert.notEqual(err, null);
			});
		});

		it('# length', () => {
			const validate = $().string().length(3).test;

			const x = 'abc';
			assert.equal(validate(x), null);

			const y = 'abcd';
			assert.notEqual(validate(y), null);
		});

		describe('# or', () => {
			it('合致する文字列で成功 (配列)', () => {
				const err = $('strawberry').string().or(['strawberry', 'pasta']).test();
				assert.equal(err, null);
			});

			it('合致しない文字列で失敗 (配列)', () => {
				const err = $('alice').string().or(['strawberry', 'pasta']).test();
				assert.notEqual(err, null);
			});

			it('合致する文字列で成功 (文字列)', () => {
				const err = $('strawberry').string().or('strawberry|pasta').test();
				assert.equal(err, null);
			});

			it('合致しない文字列で失敗 (文字列)', () => {
				const err = $('alice').string().or('strawberry|pasta').test();
				assert.notEqual(err, null);
			});
		});

		describe('# notInclude', () => {
			it('含まない文字列で成功 (配列)', () => {
				const err = $('strawberry pasta').string().notInclude(['alice', 'tachibana']).test();
				assert.equal(err, null);
			});

			it('含む文字列で失敗 (配列)', () => {
				const err = $('strawberry alice').string().notInclude(['alice', 'tachibana']).test();
				assert.notEqual(err, null);
			});

			it('含まない文字列で成功 (文字列)', () => {
				const err = $('strawberry pasta').string().notInclude('alice').test();
				assert.equal(err, null);
			});

			it('含む文字列で失敗 (文字列)', () => {
				const err = $('strawberry alice').string().notInclude('alice').test();
				assert.notEqual(err, null);
			});
		});
	});

	describe('Number', () => {
		it('正当な値を与える', () => {
			const x = 42;
			const [val, err] = $(x).number().get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('数値以外でエラー', () => {
			const x = 'strawberry pasta';
			const [val, err] = $(x).number().get();
			assert.notEqual(err, null);
		});

		describe('# int', () => {
			it('整数で合格', () => {
				const err = $(42).number().int().test();
				assert.equal(err, null);
			});

			it('非整数で不合格', () => {
				const err = $(3.14).number().int().test();
				assert.notEqual(err, null);
			});
		});

		describe('# min', () => {
			it('しきい値より大きくて成功', () => {
				const err = $(50).number().min(42).test();
				assert.equal(err, null);
			});

			it('しきい値より小さくて失敗', () => {
				const err = $(30).number().min(42).test();
				assert.notEqual(err, null);
			});
		});

		describe('# max', () => {
			it('しきい値より小さくて成功', () => {
				const err = $(30).number().max(42).test();
				assert.equal(err, null);
			});

			it('しきい値より大きくて失敗', () => {
				const err = $(50).number().max(42).test();
				assert.notEqual(err, null);
			});
		});
	});

	describe('Array', () => {
		it('正当な値を与える', () => {
			const x = [1, 2, 3];
			const [val, err] = $(x).array().get();
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('配列以外でエラー', () => {
			const x = 'strawberry pasta';
			const [val, err] = $(x).array().get();
			assert.notEqual(err, null);
		});

		describe('要素の型指定', () => {
			it('正当な値を与えて合格', () => {
				const err = $(['a', 'b', 'c']).array($().string()).test();
				assert.equal(err, null);
			});

			it('不正な値を与えて不合格', () => {
				const err = $(['a', 1, 'c']).array($().string()).test();
				assert.notEqual(err, null);
			});
		});

		describe('# unique', () => {
			it('ユニークで合格', () => {
				const err = $(['a', 'b', 'c']).array().unique().test();
				assert.equal(err, null);
			});

			it('重複した要素が有って不合格', () => {
				const err = $(['a', 'b', 'c', 'b']).array().unique().test();
				assert.notEqual(err, null);
			});
		});

		describe('# min', () => {
			it('しきい値より長くて成功', () => {
				const err = $([1, 2, 3, 4]).array().min(3).test();
				assert.equal(err, null);
			});

			it('しきい値より短くて失敗', () => {
				const err = $([1, 2]).array().min(3).test();
				assert.notEqual(err, null);
			});
		});

		describe('# max', () => {
			it('しきい値より短くて成功', () => {
				const err = $([1, 2]).array().max(3).test();
				assert.equal(err, null);
			});

			it('しきい値より長くて失敗', () => {
				const err = $([1, 2, 3, 4]).array().max(3).test();
				assert.notEqual(err, null);
			});
		});

		it('# length', () => {
			const validate = $().array().length(3).test;

			const x = [1, 2, 3];
			assert.equal(validate(x), null);

			const y = [1, 2, 3, 4];
			assert.notEqual(validate(y), null);
		});

		it('# item', () => {
			const validate = $().array().item(1, $().number()).test;

			const x = ['a', 42, 'c'];
			assert.equal(validate(x), null);

			const y = ['a', 'b', 'c'];
			assert.notEqual(validate(y), null);
		});

		describe('# each', () => {
			it('バリデータが true を返したら合格', () => {
				const err = $([1, 2, 3]).array().each(() => true).test();
				assert.equal(err, null);
			});

			it('バリデータが false を返したら失格', () => {
				const err = $([1, 2, 3]).array().each(() => false).test();
				assert.notEqual(err, null);
			});

			it('バリデータが Error を返したら失格', () => {
				const err = $([1, 2, 3]).array().each(() => new Error('something')).test();
				assert.notEqual(err, null);
			});
		});
	});

	describe('Boolean', () => {
		it('正当な値を与える', () => {
			const x = true;
			const [valx, errx] = $(x).boolean().get();
			assert.equal(valx, x);
			assert.equal(errx, null);

			const y = false;
			const [valy, erry] = $(y).boolean().get();
			assert.equal(valy, y);
			assert.equal(erry, null);
		});

		it('真理値以外でエラー', () => {
			const x = 'strawberry pasta';
			const [val, err] = $(x).boolean().get();
			assert.notEqual(err, null);
		});
	});

	describe('Object', () => {
		it('正当な値を与えられる', () => {
			const x = { myProp: 42 };
			const [val, err] = $(x).object().get();
			assert.deepEqual(val, x);
			assert.equal(err, null);
		});

		it('オブジェクト以外でエラー', () => {
			const x = 'strawberry pasta';
			const err = $(x).object().test();
			assert.notEqual(err, null);
		});

		it('オブジェクト以外でエラー (配列)', () => {
			const x = [];
			const err = $(x).object().test();
			assert.notEqual(err, null);
		});

		it('strict', () => {
			const err1 = $({ x: 42 }).object(true).have('x', $().number()).test();
			assert.equal(err1, null);

			const err2 = $({ x: 42, y: 24 }).object(true).have('x', $().number()).test();
			assert.notEqual(err2, null);

			const err3 = $({ x: 42, y: 24 }).object(true)
				.have('x', $().number())
				.have('y', $().number())
				.test();
			assert.equal(err3, null);

			const err4 = $({ x: 42, y: 24 }).object().have('x', $().number()).test();
			assert.equal(err4, null);
		});

		it('strict (null)', () => {
			const err1 = $(null).object(true).have('x', $().number()).test();
			assert.notEqual(err1, null);

			const err2 = $(null).nullable.object(true).have('x', $().number()).test();
			assert.equal(err2, null);
		});

		it('strict (undefined)', () => {
			const err1 = $(undefined).object(true).have('x', $().number()).test();
			assert.notEqual(err1, null);

			const err2 = $(undefined).optional.object(true).have('x', $().number()).test();
			assert.equal(err2, null);
		});

		it('# have', () => {
			const err1 = $({ myProp: 42 }).object().have('myProp', $().number()).test();
			assert.equal(err1, null);

			const err2 = $({}).object().have('myProp', $().number()).test();
			assert.notEqual(err2, null);

			const err3 = $({ myProp: 'strawberry pasta' }).object().have('myProp', $().number()).test();
			assert.notEqual(err3, null);
		});

		it('# prop', () => {
			const err1 = $({ myProp: 42 }).object().prop('myProp', $().number()).test();
			assert.equal(err1, null);

			const err2 = $({}).object().prop('myProp', $().number()).test();
			assert.equal(err2, null);

			const err3 = $({ myProp: 'strawberry pasta' }).object().prop('myProp', $().number()).test();
			assert.notEqual(err3, null);
		});

		it('入れ子prop', () => {
			const validate = $().object()
				.prop('some', $().object()
					.prop('strawberry', $().string())
					.prop('alice', $().boolean())
					.prop('tachibana', $().object()
						.prop('bwh', $().array($().number()))))
				.prop('thing', $().number())
				.test;

			const x = {
				some: {
					strawberry: 'pasta',
					alice: false,
					tachibana: {
						bwh: [68, 52, 67]
					}
				},
				thing: 42
			};
			assert.equal(validate(x), null);

			const y = {
				some: {
					strawberry: 'pasta',
					alice: false,
					tachibana: {
						bwh: [68, '52', 67]
					}
				},
				thing: 42
			};
			assert.notEqual(validate(y), null);
		});
	});

	describe('Or', () => {
		it('OK', () => {
			const ok = $(42).or($().string(), $().number()).ok();
			assert.equal(ok, true);
		});

		it('NOT OK', () => {
			const ok = $({}).or($().string(), $().number()).ok();
			assert.equal(ok, false);
		});

		it('With array', () => {
			const ok = $(['x', 42]).array($().or($().string(), $().number())).ok();
			assert.equal(ok, true);
		});
	});
});

class MyClass {
	x: number;
}

class MyClassQuery extends Query<MyClass> {
	constructor(...args) {
		super(...args);

		this.pushValidator(v =>
			v instanceof MyClass ? true : new Error('value is not an instance of MyClass')
		);
	}
}

it('Custom Query', () => {
	const ok1 = $(new MyClass()).type(MyClassQuery).ok();
	assert.equal(ok1, true);

	const ok2 = $('abc').type(MyClassQuery).ok();
	assert.equal(ok2, false);

	const ok3 = $([new MyClass(), new MyClass()]).array($().type(MyClassQuery)).ok();
	assert.equal(ok3, true);

	const ok4 = $([new MyClass(), 42]).array($().type(MyClassQuery)).ok();
	assert.equal(ok4, false);
});
