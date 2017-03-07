cafy
===============================================
> Simple, fun, flexible query-based validator

**cafy**は、アサーションのようにメソッドチェーンで値のバリデーションを行うライブラリです。

─堅牢なAPIには、何らかのバリデーションは必要不可欠です。
あなたのAPIサーバーは、ユーザー名の更新で文字列以外を弾けていますか？
サインイン時のパスワードの値で、クエリのインジェクションができるようになっていませんか？
もしくは、それらのバリデーションのために長いコードを書くことに疲れていませんか？
cafyを使えばそれらのバリデーションを楽しく簡単に、そして柔軟に書くことができます！
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

---

まずその値がどんな型でなければならないかを示し、
そのあとに追加の制約をメソッドチェーンで追加していくスタイルです。

(以下のドキュメントでは、`import $ from 'cafy';`している前提で書いていきます(実際にはcafy関数にどんな名前を付けるかは自由です)。)

たとえば*「`x`は文字列でなければならない」*はこう書きます:
``` javascript
$(x).string()
```
`range`メソッドを利用して、*「10文字以上100文字以下でなければならない」*という制約を追加してみましょう:
``` javascript
$(x).string().range(10, 100)
```
検証して結果を取得するには`test`や`isOk`メソッドなどを利用できます:
``` javascript
$('strawberry pasta').string().range(10, 100).isOk() // => true
$('alice'           ).string().range(10, 100).isOk() // => false
```

`isOk`メソッドはバリデーションに合格した場合は`true`を、失格した場合は`false`を返します。
`test`メソッドはバリデーションに合格した場合は`null`を、失格した場合は`Error`を返します。

---

もちろん文字列以外にも、次の型をサポートしています:

Supported types
* **array** ... e.g.`$(x).array()...`
* **boolean** ... e.g.`$(x).boolean()...`
* **number** ... e.g.`$(x).number()...`
* **object** ... e.g.`$(x).object()...`
* **string** ... e.g.`$(x).string()...`
* **ObjectID** (MongoDB) ... e.g.`$(x).id()...`

どんな型のバリデータにどんなメソッドがあるかはAPIのセクションを見てみてください！

### 配列の要素の型を指定する
配列の要素がどんな型でなければならないか指定することもできます:
``` javascript
$(x).array('string')
```
ちなみにこれは次の糖衣構文です:
``` javascript
$(x).array().each($().string())
```

### null と undefined の扱い
#### undefined を許可する *(optional)*
デフォルトで`undefined`はエラーになります:
``` javascript
$(undefined).string().isOk() // <= false
```
`undefined`を許可する場合は`optional`を型の前に付けます:
``` javascript
$(undefined).optional.string().isOk() // <= true
```

#### null を許可する *(nullable)*
デフォルトで`null`はエラーになります:
``` javascript
$(null).string().isOk() // <= false
```
`null`を許可する場合は`nullable`を型の前に付けます:
``` javascript
$(null).nullable.string().isOk() // <= true
```

#### null と undefined を許可する
`nullable`と`optional`は併用できます:
``` javascript
$(x).nullable.optional.string()
```

|                     | undefined | null |
| -------------------:|:---------:|:----:|
| default             | x         | x    |
| optional            | o         | x    |
| nullable            | x         | o    |
| optional + nullable | o         | o    |

### 遅延検証
cafyの引数を省略することで、後から値を検証するバリデータになります:
``` javascript
$().number().range(30, 50)
```
`test`や`isOk`メソッドに値を与えて検証します:
``` javascript
$().number().range(30, 50).test(42) // <= null
```

この遅延検証を利用すると、配列の`some`などに渡すときに便利です:
``` javascript
xs.some($().number().max(30).isNg)
```

ℹ️ `isNg`は`isOk`の逆です。

Tips
-----------------------------------------------
### 規定値を設定する
[Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)の規定値構文を使うことができます。
``` javascript
const [val = 'desc', err] = $(x).optional.string().or('asc|desc').$;
//→ xは文字列でなければならず、'asc'または'desc'でなければならない。省略された場合は'desc'とする。
```

### cafyの入れ子
cafy同士はシームレスに連携するので、入れ子にして使うこともできます:
``` javascript
$(x).array().each($().string().range(0, 100))
//→ xは全ての要素が0文字以上100文字以内の文字列の配列でなければならない
```

API
-----------------------------------------------
ℹ️ 返り値が`Query`と表記されているものは、そのあとにメソッドチェーンを
繋げていくことができるということを示しています。

### 共通

#### `.pipe(fn)` => `Query`
カスタムのバリデーションを実行できます。
引数の関数が`true`を返すと妥当ということになり、`false`または`Error`を返すと不正な値とします。
``` javascript
$('strawberry pasta').string().pipe(x => x.indexOf('alice') == -1).isOk() // true
$(['a', 'b', 'c']).array().pipe(x => x[1] != 'b').isOk() // false
```

#### `.$` => `[any, Error]`
テスト対象の値とテスト結果のペア(配列)。先行検証のときのみ利用可能です。

#### `.test()` => `Error`
バリデーションを実行します。
合格した場合は`null`で、そうでない場合は`Error`です。

#### `.isOk()` => `boolean`
バリデーションを実行します。
合格した場合は`true`で、そうでない場合は`false`です。
`.test() == null`と同義です。

#### `.isNg()` => `boolean`
バリデーションを実行します。
合格した場合は`false`で、そうでない場合は`true`です。
`.isOk()`の否定です。
(*Ng*は**N**o**G**oogの略です)

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
$(['a', 'b', 'c']).range(2, 5).isOk()                // true
$(['a', 'b', 'c', 'd', 'e', 'f']).range(2, 5).isOk() // false
$(['a']).range(2, 5).isOk()                          // false
```

ℹ️ `range(30, 50)`は`min(30).max(50)`と同義です。

#### `.unique()` => `Query`
ユニークな配列(=重複した値を持っていない)でなければならないという制約を追加します。
重複した要素がある場合エラーにします。
``` javascript
$(['a', 'b', 'c']).array().unique().isOk()      // true
$(['a', 'b', 'c', 'b']).array().unique().isOk() // false
```

#### `.each(fn)` => `Query`
各要素に対してカスタムのバリデーションを実行できます。
引数の関数が`true`を返すと妥当ということになり、`false`または`Error`を返すと不正な値とします。
``` javascript
$([1, 2, 3]).array().each(x => x < 4).isOk() // true
$([1, 4, 3]).array().each(x => x < 4).isOk() // false
```

### Number
#### `.int()` => `Query`
整数でなければならないという制約を追加します。
整数でない場合エラーにします。
``` javascript
$(0).number().int().isOk()        // true
$(1).number().int().isOk()        // true
$(-100).number().int().isOk()     // true

$(0.1).number().int().isOk()      // false
$(Math.PI).number().int().isOk()  // false

$(NaN).number().int().isOk()      // false
$(Infinity).number().int().isOk() // false
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
`pattern`は文字列の配列または`|`で区切られた文字列です。
どれとも一致しない場合エラーにします。
``` javascript
$('strawberry').string().or(['strawberry', 'pasta']).isOk() // true
$('alice').string().or(['strawberry', 'pasta']).isOk()      // false
$('pasta').string().or('strawberry|pasta').isOk()           // true
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
import $ from 'cafy';
import db from './mydb';

const app = express();

app.post('/create-account', (req, res) => {
  // アカウント名は文字列で、30文字以内でなければならない。この値は必須である。
  const [name, nameErr] = $(req.body.name).string().max(30).$;
  if (nameErr) return res.status(400).send('invalid name');

  // 年齢は数値で、0~100の整数でなければならない。この値は必須である。
  const [age, ageErr] = $(req.body.age).number().int().range(0,100).$;
  if (ageErr) return res.status(400).send('invalid age');

  // 性別は'male'か'female'かnull(=設定なし)でなければならない。省略した場合はnullとして扱う。
  const [gender = null, genderErr] = $(req.body.gender).nullable.optional.string().or('male|female').$;
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
