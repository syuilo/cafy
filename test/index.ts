/**
 * Tests!
 */

import * as assert from 'assert';
import $, { Context } from '../';
import { ObjError } from '../built/types/object';

it('デフォルトの値を設定できる', () => {
	const def = 'strawberry pasta';
	const [val = def, err] = $.str.optional.get(undefined);
	assert.equal(val, def);
	assert.equal(err, null);
});

it('使いまわせる', () => {
	const isValidGender = $.str.or('male|female').ok;
	assert.equal(isValidGender('male'), true);
	assert.equal(isValidGender('female'), true);
	assert.equal(isValidGender('alice'), false);
});

it('nullを与えられない', () => {
	const err = $.str.test(null);
	assert.notEqual(err, null);
});

it('undefinedを与えられない', () => {
	const err = $.str.test(undefined);
	assert.notEqual(err, null);
});

it('note', () => {
	const x = $.str.note(42);
	assert.equal(x.data, 42);
});

describe('Common', () => {
	describe('optional', () => {
		it('値を与えられる', () => {
			const x = 'strawberry pasta';
			const [val, err] = $.str.optional.get(x);
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('nullを与えられない', () => {
			const err = $.str.optional.test(null);
			assert.notEqual(err, null);
		});

		it('undefinedを与えられる', () => {
			const err = $.str.optional.test(undefined);
			assert.equal(err, null);
		});
	});

	describe('nullable', () => {
		it('値を与えられる', () => {
			const x = 'strawberry pasta';
			const [val, err] = $.str.nullable.get(x);
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('nullを与えられる', () => {
			const err = $.str.nullable.test(null);
			assert.equal(err, null);
		});

		it('undefinedを与えられない', () => {
			const err = $.str.nullable.test(undefined);
			assert.notEqual(err, null);
		});
	});

	describe('optional + nullable', () => {
		it('値を与えられる', () => {
			const x = 'strawberry pasta';
			const [val, err] = $.str.nullable.optional.get(x);
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('nullを与えられる', () => {
			const err = $.str.nullable.optional.test(null);
			assert.equal(err, null);
		});

		it('undefinedを与えらる', () => {
			const err = $.str.nullable.optional.test(undefined);
			assert.equal(err, null);
		});
	});

	describe('# throw', () => {
		it('エラーをthrowする', () => {
			assert.throws(() => $.num.throw('strawberry pasta'));
		});

		it('正しい値のときにはエラーがthrowされない', () => {
			assert.equal($.num.throw(1), 1)
		})
	});

	describe('# get', () => {
		it('GOOD', () => {
			const x = 'strawberry pasta';
			const [v, e] = $.str.get(x);
			assert.equal(v, x);
			assert.equal(e, null);
		});

		it('BAD', () => {
			const x = 42;
			const [v, e] = $.str.get(x);
			assert.equal(v, x);
			assert.notEqual(e, null);
		});
	});

	describe('# pipe', () => {
		it('バリデータが true を返したら合格', () => {
			const err = $.str.pipe(() => true).test('strawberry pasta');
			assert.equal(err, null);
		});

		it('バリデータが false を返したら失格', () => {
			const err = $.str.pipe(() => false).test('strawberry pasta');
			assert.notEqual(err, null);
		});

		it('バリデータが Error を返したら失格', () => {
			const err = $.str.pipe(() => new Error('something')).test('strawberry pasta');
			assert.notEqual(err, null);
		});

		it('nullのときには実行されない', () => {
			const err = $.str.nullable.pipe(x => x[0] == 'a').test(null);
			assert.equal(err, null);
		});

		it('undefinedのときには実行されない', () => {
			const err = $.str.optional.pipe(x => x[0] == 'a').test(undefined);
			assert.equal(err, null);
		});
	});
});

describe('Queries', () => {
	describe('String', () => {
		it('正当な値を与える', () => {
			const x = 'strawberry pasta';
			const [val, err] = $.str.get(x);
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('文字列以外でエラー', () => {
			const x = [1, 2, 3];
			const [val, err] = $.str.get(x);
			assert.notEqual(err, null);
		});

		describe('# min', () => {
			it('しきい値より長くて成功', () => {
				const err = $.str.min(8).test('strawberry');
				assert.equal(err, null);
			});

			it('しきい値より短くて失敗', () => {
				const err = $.str.min(8).test('pasta');
				assert.notEqual(err, null);
			});
		});

		describe('# max', () => {
			it('しきい値より短くて成功', () => {
				const err = $.str.max(8).test('pasta');
				assert.equal(err, null);
			});

			it('しきい値より長くて失敗', () => {
				const err = $.str.max(8).test('strawberry');
				assert.notEqual(err, null);
			});
		});

		it('# length', () => {
			const validate = $.str.length(3).test;

			const x = 'abc';
			assert.equal(validate(x), null);

			const y = 'abcd';
			assert.notEqual(validate(y), null);
		});

		describe('# match', () => {
			it('マッチして成功', () => {
				const err = $.str.match(/^[a-z]+$/).test('foo');
				assert.equal(err, null);
			});

			it('マッチせず失敗', () => {
				const err = $.str.match(/^[a-z]+$/).test('foo123');
				assert.notEqual(err, null);
			});
		});

		describe('# notMatch', () => {
			it('マッチして失敗', () => {
				const err = $.str.notMatch(/^[a-z]+$/).test('foo');
				assert.notEqual(err, null);
			});

			it('マッチせず成功', () => {
				const err = $.str.notMatch(/^[a-z]+$/).test('foo123');
				assert.equal(err, null);
			});
		});

		describe('# or', () => {
			it('合致する文字列で成功 (配列)', () => {
				const err = $.str.or(['strawberry', 'pasta']).test('strawberry');
				assert.equal(err, null);
			});

			it('合致しない文字列で失敗 (配列)', () => {
				const err = $.str.or(['strawberry', 'pasta']).test('alice');
				assert.notEqual(err, null);
			});

			it('合致する文字列で成功 (文字列)', () => {
				const err = $.str.or('strawberry|pasta').test('strawberry');
				assert.equal(err, null);
			});

			it('合致しない文字列で失敗 (文字列)', () => {
				const err = $.str.or('strawberry|pasta').test('alice');
				assert.notEqual(err, null);
			});
		});

		describe('# notInclude', () => {
			it('含まない文字列で成功 (配列)', () => {
				const err = $.str.notInclude(['alice', 'tachibana']).test('strawberry pasta');
				assert.equal(err, null);
			});

			it('含む文字列で失敗 (配列)', () => {
				const err = $.str.notInclude(['alice', 'tachibana']).test('strawberry alice');
				assert.notEqual(err, null);
			});

			it('含まない文字列で成功 (文字列)', () => {
				const err = $.str.notInclude('alice').test('strawberry pasta');
				assert.equal(err, null);
			});

			it('含む文字列で失敗 (文字列)', () => {
				const err = $.str.notInclude('alice').test('strawberry alice');
				assert.notEqual(err, null);
			});
		});
	});

	describe('Number', () => {
		it('正当な値を与える', () => {
			const x = 42;
			const [val, err] = $.num.get(x);
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('数値以外でエラー', () => {
			const x = 'strawberry pasta';
			const [val, err] = $.num.get(x);
			assert.notEqual(err, null);
		});

		describe('# int', () => {
			it('整数で合格', () => {
				const err = $.num.int().test(42);
				assert.equal(err, null);
			});

			it('非整数で不合格', () => {
				const err = $.num.int().test(3.14);
				assert.notEqual(err, null);
			});
		});

		describe('# min', () => {
			it('しきい値より大きくて成功', () => {
				const err = $.num.min(42).test(50);
				assert.equal(err, null);
			});

			it('しきい値より小さくて失敗', () => {
				const err = $.num.min(42).test(30);
				assert.notEqual(err, null);
			});
		});

		describe('# max', () => {
			it('しきい値より小さくて成功', () => {
				const err = $.num.max(42).test(30);
				assert.equal(err, null);
			});

			it('しきい値より大きくて失敗', () => {
				const err = $.num.max(42).test(50);
				assert.notEqual(err, null);
			});
		});
	});

	describe('Array', () => {
		it('正当な値を与える', () => {
			const x = [1, 2, 3];
			const [val, err] = $.arr().get(x);
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('配列以外でエラー', () => {
			const x = 'strawberry pasta';
			const [val, err] = $.arr().get(x);
			assert.notEqual(err, null);
		});

		describe('要素の型指定', () => {
			it('正当な値を与えて合格', () => {
				const err = $.arr($.str).test(['a', 'b', 'c']);
				assert.equal(err, null);
			});

			it('不正な値を与えて不合格', () => {
				const err = $.arr($.str).test(['a', 1, 'c']);
				assert.notEqual(err, null);
			});
		});

		describe('入れ子', () => {
			it('正しく成功する', () => {
				const err = $.arr($.num.range(0, 10)).test([1, 2, 3]);
				assert.equal(err, null);
			});

			it('正しく失敗する', () => {
				const err = $.arr($.num.range(0, 10)).test([1, -1, 3]);
				assert.notEqual(err, null);
			});
		});

		describe('# unique', () => {
			it('ユニークで合格', () => {
				const err = $.arr().unique().test(['a', 'b', 'c']);
				assert.equal(err, null);
			});

			it('重複した要素が有って不合格', () => {
				const err = $.arr().unique().test(['a', 'b', 'c', 'b']);
				assert.notEqual(err, null);
			});
		});

		describe('# min', () => {
			it('しきい値より長くて成功', () => {
				const err = $.arr().min(3).test([1, 2, 3, 4]);
				assert.equal(err, null);
			});

			it('しきい値より短くて失敗', () => {
				const err = $.arr().min(3).test([1, 2]);
				assert.notEqual(err, null);
			});
		});

		describe('# max', () => {
			it('しきい値より短くて成功', () => {
				const err = $.arr().max(3).test([1, 2]);
				assert.equal(err, null);
			});

			it('しきい値より長くて失敗', () => {
				const err = $.arr().max(3).test([1, 2, 3, 4]);
				assert.notEqual(err, null);
			});
		});

		it('# length', () => {
			const validate = $.arr().length(3).test;

			const x = [1, 2, 3];
			assert.equal(validate(x), null);

			const y = [1, 2, 3, 4];
			assert.notEqual(validate(y), null);
		});

		it('# item', () => {
			const validate = $.arr().item(1, $.num).test;

			const x = ['a', 42, 'c'];
			assert.equal(validate(x), null);

			const y = ['a', 'b', 'c'];
			assert.notEqual(validate(y), null);
		});

		describe('# each', () => {
			it('バリデータが true を返したら合格', () => {
				const err = $.arr().each(() => true).test([1, 2, 3]);
				assert.equal(err, null);
			});

			it('バリデータが false を返したら失格', () => {
				const err = $.arr().each(() => false).test([1, 2, 3]);
				assert.notEqual(err, null);
			});

			it('バリデータが Error を返したら失格', () => {
				const err = $.arr().each(() => new Error('something')).test([1, 2, 3]);
				assert.notEqual(err, null);
			});
		});
	});

	describe('Boolean', () => {
		it('正当な値を与える', () => {
			const x = true;
			const [valx, errx] = $.bool.get(x);
			assert.equal(valx, x);
			assert.equal(errx, null);

			const y = false;
			const [valy, erry] = $.bool.get(y);
			assert.equal(valy, y);
			assert.equal(erry, null);
		});

		it('真理値以外でエラー', () => {
			const x = 'strawberry pasta';
			const [val, err] = $.bool.get(x);
			assert.notEqual(err, null);
		});
	});

	describe('Object', () => {
		it('正当な値を与えられる', () => {
			const x = { myProp: 42 };
			const [val, err] = $.obj().get(x);
			assert.deepEqual(val, x);
			assert.equal(err, null);
		});

		it('オブジェクト以外でエラー', () => {
			const x = 'strawberry pasta';
			const err = $.obj().test(x);
			assert.notEqual(err, null);
		});

		it('オブジェクト以外でエラー (配列)', () => {
			const x = [];
			const err = $.obj().test(x);
			assert.notEqual(err, null);
		});

		it('エラーにプロパティ情報が含まれる', () => {
			const err: any = $.obj({ x: $.num }).test({ x: 'foo' });
			assert.notEqual(err, null);
			assert.deepStrictEqual(err.path, ['x']);
			assert.equal(err.error.message, 'must-be-a-number');
		});

		it('エラーにプロパティ情報が含まれる (ネスト)', () => {
			const err = $.obj({
				x: $.obj({
					y: $.obj({
						z: $.num
					})
				})
			}).test({
				x: {
					y: {
						z: 'foo'
					}
				}
			});

			assert.notEqual(err, null);
			assert.deepStrictEqual(err.path, ['x', 'y', 'z']);
			assert.equal(err.error.message, 'must-be-a-number');
		});

		it('strict', () => {
			const err1 = $.obj({
				x: $.num
			}).strict().test({ x: 42 });
			assert.equal(err1, null);

			const err2 = $.obj({
				x: $.num
			}).strict().test({ x: 42, y: 24 });
			assert.notEqual(err2, null);

			const err3 = $.obj({
				x: $.num,
				y: $.num
			}).strict().test({ x: 42, y: 24 });
			assert.equal(err3, null);

			const err4 = $.obj({
				x: $.num
			}).test({ x: 42, y: 24 });
			assert.equal(err4, null);
		});

		it('strict (null)', () => {
			const err1 = $.obj({
				x: $.num
			}).strict().test(null);
			assert.notEqual(err1, null);

			const err2 = $.obj({
				x: $.num
			}).strict().nullable.test(null);
			assert.equal(err2, null);
		});

		it('strict (undefined)', () => {
			const err1 = $.obj({
				x: $.num
			}).strict().test(undefined);
			assert.notEqual(err1, null);

			const err2 = $.obj({
				x: $.num
			}).strict().optional.test(undefined);
			assert.equal(err2, null);
		});

		it('入れ子', () => {
			const validate = $.obj({
				some: $.obj({
					strawberry: $.str,
					alice: $.bool,
					tachibana: $.obj({
						bwh: $.arr($.num)
					})
				}),
				thing: $.num
			}).test;

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
			const ok = $.or($.str, $.num).ok(42);
			assert.equal(ok, true);
		});

		it('NOT OK', () => {
			const ok = $.or($.str, $.num).ok({});
			assert.equal(ok, false);
		});

		it('With array', () => {
			const ok = $.arr($.or($.str, $.num)).ok(['x', 42]);
			assert.equal(ok, true);
		});

		it('Type', () => {
			const type = $.or($.str, $.num).getType();
			assert.equal(type, '(string | number)');
		});
	});

	describe('use', () => {
		it('OK', () => {
			const ok = $.use($.num).ok(42);
			assert.equal(ok, true);
		});

		it('NOT OK', () => {
			const ok = $.use($.num).ok('foo');
			assert.equal(ok, false);
		});

		it('optional', () => {
			const base = $.num;

			const ok1 = $.use(base).optional.ok(undefined);
			assert.equal(ok1, true);

			const ok2 = $.use(base).ok(undefined);
			assert.equal(ok2, false);
		});
	});
});

class MyClass {
	x: number;
}

class MyClassContext extends Context<MyClass> {
	constructor() {
		super();

		this.push(v =>
			v instanceof MyClass ? true : new Error('value is not an instance of MyClass')
		);
	}
}

it('Custom Context', () => {
	const ok1 = $.type(MyClassContext).ok(new MyClass());
	assert.equal(ok1, true);

	const ok2 = $.type(MyClassContext).ok('abc');
	assert.equal(ok2, false);

	const ok3 = $.arr($.type(MyClassContext)).ok([new MyClass(), new MyClass()]);
	assert.equal(ok3, true);

	const ok4 = $.arr($.type(MyClassContext)).ok([new MyClass(), 42]);
	assert.equal(ok4, false);
});
