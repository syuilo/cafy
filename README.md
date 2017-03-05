cafy
===============================================
> Simple, fun, flexible query-based validator

cafyは、アサーションのようにメソッドチェーンで値のバリデーションを行うライブラリです。

[![][npm-badge]][npm-link]
[![][mit-badge]][mit]
[![][travis-badge]][travis-link]
[![][himawari-badge]][himasaku]
[![][sakurako-badge]][himasaku]

Installation
-----------------------------------------------
`npm install cafy`

Usage
-----------------------------------------------
``` javascript
cafy(value)[.anyQueries()...]
```

まずその値がどんな型でなければならないかを示し、
そのあとに追加の制約をメソッドチェーンで追加していくスタイルです。

### Examples
``` javascript
import it from 'cafy';

const x = 42;

const err1 = it(x).must.be.a.string().or('asc desc').check();
//→ xは文字列でなければならず、'asc'または'desc'でなければならない。

const err2 = it(x).must.be.a.number().required().range(0, 100).check();
//→ xは数値でなければならず、かつ0~100の範囲内でなければならない。この値は省略することはできない。

const err3 = it(x).must.be.an.array().unique().validate(x => x[0] != 'strawberry pasta').check();
//→ xは配列でなければならず、かつ中身が重複していてはならない。かつ配列の最初の要素が'strawberry pasta'であってはならない。
```

### With your api server
``` javascript
import * as express from 'express';
import it from 'cafy';
import db from './mydb';

const app = express();

app.post('/create-account', (req, res) => {
  // アカウント名は文字列で、30文字以内でなければならない。この値は必須である。
  const [name, nameErr] = it(req.body.name).must.be.a.string().required().max(30).get();
  if (nameErr) return res.status(400).send('invalid name');

  // 年齢は数値で、0~100の整数でなければならない。この値は必須である。
  const [age, ageErr] = it(req.body.age).must.be.a.number().required().int().range(0,100).get();
  if (ageErr) return res.status(400).send('invalid age');

  // 性別は'male'か'female'かnull(=設定なし)でなければならない。省略した場合はnullとして扱う。
  const [gender = null, genderErr] = it(req.body.gender).must.be.a.nullable.string().or('male female').get();
  if (genderErr) return res.status(400).send('invalid gender');

  db.insert({
    name, age, gender
  });

  res.send('yee haw!');
});
```

### 規定値を設定する
[Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)の規定値構文を使うことができます。
``` javascript
const [val = 'desc', err] = it(x).must.be.a.string().or('asc desc').get();
//→ xは文字列でなければならず、'asc'または'desc'でなければならない。省略された場合は'desc'とする。
```

### null と undefined の扱い
「値が`null`または`undefined`」な状態を「値が空である」と表現しています。
値が空である場合、バリデータやその他の処理メソッドは呼ばれません。

明示的に`null`を許可しない限り、`null`はエラーになります。
`null`を許可する場合は**nullable**をプリフィックスします:
``` javascript
const err = it(x).must.be.a.nullable.string().required().check();
```

|                     | undefined | null |
| -------------------:|:---------:|:----:|
| default             | o         | x    |
| required            | x         | x    |
| nullable            | o         | o    |
| required + nullable | x         | o    |

### BDD風記法
`must.be.a(n)`の代わりに`expect`とも書けます:
``` javascript
const err = it(x).expect.string().required().check();
```

### 糖衣構文
次のコード:
``` javascript
it(x).must.be.a.string()                     // default
it(x).must.be.a.string().required()          // required
it(x).must.be.a.nullable.string()            // nullable
it(x).must.be.a.nullable.string().required() // required nullable
```
はこのように書くこともできます:
``` javascript
it(x, 'string')   // default
it(x, 'string!')  // required
it(x, 'string?')  // nullable
it(x, 'string!?') // required nullable
```

API
-----------------------------------------------
ℹ️ 返り値が`Query`と表記されているものは、そのあとにメソッドチェーンを
繋げていくことができるということを示しています。

### 共通
#### `.required()` => `Query`
テスト対象の値は省略してはならないことを示します。
省略された場合エラーにします。

#### `.validate(fn)` => `Query`
カスタムのバリデーションを実行できます。
引数の関数が`true`を返すと妥当ということになり、`false`または`Error`を返すと不正な値とします。
``` javascript
it('strawberry pasta').expect.string().validate(x => x.indexOf('alice') == -1).isValid // true
it(['a', 'b', 'c']).expect.array().validate(x => x[1] != 'b').isValid // false
```

#### `.get()` => `[any, Error]`
テスト対象の値とテスト結果の配列を取得します。

#### `.check()` => `Error`
テスト結果を取得します。
テストに合格した場合は`null`を、そうでない場合は`Error`オブジェクトを返します。

#### `.isValid` => `boolean`
テストに合格したかどうかを取得します。

### Array
#### `.range(min, max)` => `Query`
`min`以上`max`以下の数の要素を持っていなければならないという制約を追加します。
要素数が指定された範囲内にない場合エラーにします。

#### `.unique()` => `Query`
ユニークな配列(=重複した値を持っていない)でなければならないという制約を追加します。
重複した要素がある場合エラーにします。

### Number
#### `.int()` => `Query`
整数でなければならないという制約を追加します。
整数でない場合エラーにします。
``` javascript
it(0).expect.number().int().isValid;        // true
it(1).expect.number().int().isValid;        // true
it(-100).expect.number().int().isValid;     // true

it(0.1).expect.number().int().isValid;      // false
it(Math.PI).expect.number().int().isValid;  // false

it(NaN).expect.number().int().isValid;      // false
it(Infinity).expect.number().int().isValid; // false
```

#### `.min(threshold)` => `Query`
`threshold`以上の数値でなければならないという制約を追加します。
値が`threshold`を下回る場合エラーにします。

#### `.max(threshold)` => `Query`
`threshold`以下の数値でなければならないという制約を追加します。
値が`threshold`を上回る場合エラーにします。

#### `.range(min, max)` => `Query`
`min`以上`max`以下の数値でなければならないという制約を追加します。
値が指定された範囲内にない場合エラーにします。

ℹ️ `range(30, 50)`は`min(30).max(50)`と同義です。

### String
#### `.match(pattern)` => `Query`
与えられた正規表現とマッチしていなければならないという制約を追加します。
正規表現と一致しない場合エラーにします。

#### `.or(pattern)` => `Query`
与えられたパターン内の文字列のいずれかでなければならないという制約を追加します。
`pattern`は文字列の配列またはスペースで区切られた文字列です。
どれとも一致しない場合エラーにします。

#### `.min(threshold)` => `Query`
`threshold`以上の文字数でなければならないという制約を追加します。
文字数が`threshold`を下回る場合エラーにします。

#### `.max(threshold)` => `Query`
`threshold`以下の文字数でなければならないという制約を追加します。
文字数が`threshold`を上回る場合エラーにします。

#### `.range(min, max)` => `Query`
`min`以上`max`以下の文字数でなければならないという制約を追加します。
文字数が指定された範囲内にない場合エラーにします。

ℹ️ `range(30, 50)`は`min(30).max(50)`と同義です。

Testing
-----------------------------------------------
`npm run test`

License
-----------------------------------------------
[MIT](LICENSE)

[npm-link]:       https://www.npmjs.com/package/cafy
[npm-badge]:      https://img.shields.io/npm/v/cafy.svg?style=flat-square
[mit]:            http://opensource.org/licenses/MIT
[mit-badge]:      https://img.shields.io/badge/license-MIT-444444.svg?style=flat-square
[travis-link]:    https://travis-ci.org/syuilo/cafy
[travis-badge]:   http://img.shields.io/travis/syuilo/cafy.svg?style=flat-square
[himasaku]:       https://himasaku.net
[himawari-badge]: https://img.shields.io/badge/%E5%8F%A4%E8%B0%B7-%E5%90%91%E6%97%A5%E8%91%B5-1684c5.svg?style=flat-square
[sakurako-badge]: https://img.shields.io/badge/%E5%A4%A7%E5%AE%A4-%E6%AB%BB%E5%AD%90-efb02a.svg?style=flat-square
