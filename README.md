cafy
============
Simple, fun, flexible query-based validator

[![][npm-badge]][npm-link]
[![][mit-badge]][mit]
[![][travis-badge]][travis-link]
[![][himawari-badge]][himasaku]
[![][sakurako-badge]][himasaku]

Installation
------------
`npm install cafy`

Usage
------------
``` javascript
cafy(value)[.anyQueries()...]
```

### Examples
``` javascript
import it from 'cafy';

const [val, err] = it(x).must.be.a.string().or('asc desc').get();
//→ xは文字列でなければならず、'asc'または'desc'でなければならない。

const err = it(x).must.be.a.number().required().range(0, 100).check();
//→ xは数値でなければならず、かつ0~100の範囲内でなければならない。この値は省略することはできない。

const err = it(x).must.be.an.array().unique().required().validate(x => x[0] != 'strawberry pasta').check();
//→ xは配列でなければならず、かつ中身が重複していてはならない。この値を省略することはできない。そして配列の最初の要素が'strawberry pasta'という文字列であってはならない。
```

・意味的に矛盾するので、required と default は併用できません。

### API
#### `.get()`
テスト対象の値とテスト結果の配列を取得します。

#### `.check()`
テスト結果を取得します。

### 糖衣構文
``` javascript
const err = it(x).must.be.a.string().required().check();
```
は次のように書くこともできます:
``` javascript
const err = it(x, 'string', true);
```

### 規定値を設定する
Destructuring assignmentの規定値機能を使うことができます。
``` javascript
const [val = 'desc', err] = it(x).must.be.a.string().or('asc desc').get();
//→ xは文字列でなければならず、'asc'または'desc'でなければならない。省略された場合は'desc'とする。
```

### BDD風記法
must.be.a(n) の代わりに　expect とも書けます:
``` javascript
const err = it(x).expect.string().required().check();
```

### null と undefined の扱い
「値が`null`または`undefined`」な状態を「値が空である」と表現しています。
値が空である場合、バリデータやその他の処理メソッドは呼ばれません。

明示的に`null`を許可しない限り、`null`はエラーになります。
`null`を許可する場合は**nullable**をプリフィックスします:
``` javascript
const err = it(x).must.be.a.nullable.string().required().check();
```

Testing
-------
`npm run test`

License
-------
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
