cafy
===============================================
> Simple, fun, flexible query-based validator

cafyは、アサーションのようにメソッドチェーンで値のバリデーションを行うライブラリです。
[Try it out!](https://runkit.com/npm/cafy)

[![][npm-badge]][npm-link]
[![][mit-badge]][mit]
[![][travis-badge]][travis-link]
[![][himawari-badge]][himasaku]
[![][sakurako-badge]][himasaku]

[![NPM](https://nodei.co/npm/cafy.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/cafy)

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

たとえば「`x`は文字列でなければならない」はこう書きます(`import it from 'cafy';`している前提です):
``` javascript
it(x).string()
```
`range`メソッドを利用して、「10文字以上100文字以下でなければならない」という制約を追加してみましょう:
``` javascript
it(x).string().range(10, 100)
```
検証結果の取得は`isValid`メソッドなどを利用できます:
``` javascript
const x = 'strawberry pasta';
const xIsValid = it(x).string().range(10, 100).isValid() // => true

const y = 'alice';
const yIsValid = it(y).string().range(10, 100).isValid() // => false
```

どんな型のバリデータにどんなメソッドがあるかはAPIのセクションを見てみてください！

---

もちろん文字列以外にも、次の型をサポートしています:

Supported types
* **array** ... e.g.`it(x).array()...`
* **boolean** ... e.g.`it(x).boolean()...`
* **number** ... e.g.`it(x).number()...`
* **object** ... e.g.`it(x).object()...`
* **string** ... e.g.`it(x).string()...`
* **ObjectID** (MongoDB) ... e.g.`it(x).id()...`

### 配列の要素の型を指定する
配列の要素がどんな型でなければならないか指定することもできます:
``` javascript
it(x).array('string');
```

### undefined を許可する (optional)
デフォルトで`undefined`はエラーになります:
``` javascript
it(undefined).string().isValid() // <= false
```
`undefined`を許可する場合は`optional`を型の前に付けます:
``` javascript
it(undefined).optional.string().isValid() // <= true
```

### null を許可する (nullable)
デフォルトで`null`はエラーになります:
``` javascript
it(null).string().isValid() // <= false
```
`null`を許可する場合は`nullable`をプリフィックスします:
``` javascript
it(null).nullable.string().isValid() // <= true
```

### null と undefined を許可する
`nullable`と`optional`は併用できます:
``` javascript
it(x).nullable.optional.string()
```

|                     | undefined | null |
| -------------------:|:---------:|:----:|
| default             | x         | x    |
| optional            | o         | x    |
| nullable            | x         | o    |
| optional + nullable | o         | o    |

Tips
-----------------------------------------------
### 規定値を設定する
[Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)の規定値構文を使うことができます。
``` javascript
const [val = 'desc', err] = it(x).string().or('asc desc').get();
//→ xは文字列でなければならず、'asc'または'desc'でなければならない。省略された場合は'desc'とする。
```

API
-----------------------------------------------
ℹ️ 返り値が`Query`と表記されているものは、そのあとにメソッドチェーンを
繋げていくことができるということを示しています。

### 共通

#### `.validate(fn)` => `Query`
カスタムのバリデーションを実行できます。
引数の関数が`true`を返すと妥当ということになり、`false`または`Error`を返すと不正な値とします。
``` javascript
it('strawberry pasta').string().validate(x => x.indexOf('alice') == -1).isValid() // true
it(['a', 'b', 'c']).array().validate(x => x[1] != 'b').isValid() // false
```

#### `.get()` => `[any, Error]`
テスト対象の値とテスト結果の配列を取得します。

#### `.test([value])` => `Error`
テストして結果を取得します。
テストに合格した場合は`null`を、そうでない場合は`Error`を返します。
`value`はオプションです。

#### `.isValid()` => `boolean`
テストに合格したかどうかを取得します。

### Array
#### `.min(threshold)` => `Query`
要素の数が`threshold`以上でなければならないという制約を追加します。
要素数が`threshold`を下回る場合エラーにします。

#### `.max(threshold)` => `Query`
要素の数が`threshold`以下でなければならないという制約を追加します。
要素数が`threshold`を上回る場合エラーにします。

#### `.range(min, max)` => `Query`
`min`以上`max`以下の数の要素を持っていなければならないという制約を追加します。
要素数が指定された範囲内にない場合エラーにします。
``` javascript
it(['a', 'b', 'c']).range(2, 5).isValid()                // true
it(['a', 'b', 'c', 'd', 'e', 'f']).range(2, 5).isValid() // false
it(['a']).range(2, 5).isValid()                          // false
```

ℹ️ `range(30, 50)`は`min(30).max(50)`と同義です。

#### `.unique()` => `Query`
ユニークな配列(=重複した値を持っていない)でなければならないという制約を追加します。
重複した要素がある場合エラーにします。
``` javascript
it(['a', 'b', 'c']).array().unique().isValid()      // true
it(['a', 'b', 'c', 'b']).array().unique().isValid() // false
```

#### `.each(fn)` => `Query`
各要素に対してカスタムのバリデーションを実行できます。
引数の関数が`true`を返すと妥当ということになり、`false`または`Error`を返すと不正な値とします。
``` javascript
it([1, 2, 3]).array().each(x => x < 4).isValid() // true
it([1, 4, 3]).array().each(x => x < 4).isValid() // false
```

cafyの入れ子:
``` javascript
const xsIsValid = it(xs).array().each(it().string().range(0, 100)).isValid();
```

### Number
#### `.int()` => `Query`
整数でなければならないという制約を追加します。
整数でない場合エラーにします。
``` javascript
it(0).number().int().isValid()        // true
it(1).number().int().isValid()        // true
it(-100).number().int().isValid()     // true

it(0.1).number().int().isValid()      // false
it(Math.PI).number().int().isValid()  // false

it(NaN).number().int().isValid()      // false
it(Infinity).number().int().isValid() // false
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
``` javascript
it('strawberry').string().or(['strawberry', 'pasta']).isValid() // true
it('alice').string().or(['strawberry', 'pasta']).isValid()      // false
it('pasta').string().or('strawberry pasta').isValid()           // true
```

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

Examples
-----------------------------------------------

### With your api server
``` javascript
import * as express from 'express';
import it from 'cafy';
import db from './mydb';

const app = express();

app.post('/create-account', (req, res) => {
  // アカウント名は文字列で、30文字以内でなければならない。この値は必須である。
  const [name, nameErr] = it(req.body.name).string().max(30).get();
  if (nameErr) return res.status(400).send('invalid name');

  // 年齢は数値で、0~100の整数でなければならない。この値は必須である。
  const [age, ageErr] = it(req.body.age).number().int().range(0,100).get();
  if (ageErr) return res.status(400).send('invalid age');

  // 性別は'male'か'female'かnull(=設定なし)でなければならない。省略した場合はnullとして扱う。
  const [gender = null, genderErr] = it(req.body.gender).nullable.optional.string().or('male female').get();
  if (genderErr) return res.status(400).send('invalid gender');

  db.insert({
    name, age, gender
  });

  res.send('yee haw!');
});
```

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
