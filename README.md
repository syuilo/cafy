cafy
===============================================
> Simple, fun, flexible query-based validator

**cafy**は、アサーションのようにメソッドチェーンで値のバリデーションを行うライブラリです。
cafyを使えばバリデーションを楽しく・簡単に・柔軟に書くことができます。TypeScriptを完全にサポートしています💪
[Try it out!](https://runkit.com/npm/cafy)

[![][npm-badge]][npm-link]
[![][mit-badge]][mit]
[![][travis-badge]][travis-link]
[![][himawari-badge]][himasaku]
[![][sakurako-badge]][himasaku]

[![NPM](https://nodei.co/npm/cafy.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/cafy)

🤔 Why cafy
-----------------------------------------------
たとえばWeb APIを書くときに、ちゃんとクライアントから送信されてきたパラメータが正しい形式か確認しないと、プログラムの例外を引き起こしたり、非常に長い文字列を送られてサーバーがダウンしてしまうといった可能性もあります。それらを防ぐためにも値の正当性の検証は重要です。
cafyを使えば、*「このパラメータはnullやundefinedではない文字列でなくてはならず、1文字以上100文字以下でなくてはならず、a-z0-9の文字種で構成されてなければならない」*といった長いバリデーションを、**たった一行で簡潔に**書くことができます。
例外も行うバリデーションごとに用意されているので、ユーザーにわかりやすいエラーメッセージを返すこともできます。

📦 Installation
-----------------------------------------------
Just `npm install cafy`.
Happy validation👍

☘ Usage
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
`range`メソッドを利用して、*「10文字以上20文字以下でなければならない」*という制約を追加してみましょう:
``` javascript
$(x).string().range(10, 20)
```
検証して結果を取得するには`test`や`ok`メソッドなどを利用できます:
``` javascript
$('strawberry pasta').string().range(10, 20).ok()
// => true

$('alice').string().range(10, 20).ok()
// => 短すぎるので false

$('i love strawberry pasta').string().range(10, 20).ok()
// => 長すぎるので false
```

`ok`メソッドはバリデーションに合格した場合は`true`を、失格した場合は`false`を返します。
`test`メソッドはバリデーションに合格した場合は`null`を、失格した場合は`Error`を返します。

---

もちろん文字列以外にも、次の型をサポートしています:

Supported types
* **any** ... e.g.`$(x).any()...`
* **array** ... e.g.`$(x).array()...`
* **boolean** ... e.g.`$(x).boolean()...`
* **number** ... e.g.`$(x).number()...`
* **object** ... e.g.`$(x).object()...`
* **string** ... e.g.`$(x).string()...`

> ℹ JavaScriptの仕様上では配列はobjectですが、cafyでは配列はobjectとは見なされません。

また、後述するように**独自の型**を追加することもできます。

それぞれの型がどのようなメソッドを持っているかなどは、APIのセクションをご確認ください。

### null と undefined の扱い
**cafyは、デフォルトで`null`も`undefined`も許容しません。**
`null`や`undefined`を許可したい場合は、これらのオプションを使用します:

#### undefined を許可する *(optional)*
デフォルトで`undefined`はエラーになります:
``` javascript
$(undefined).string().ok() // <= false
```
`undefined`を許可する場合は`optional`を型の前に付けます:
``` javascript
$(undefined).optional.string().ok() // <= true
```

#### null を許可する *(nullable)*
デフォルトで`null`はエラーになります:
``` javascript
$(null).string().ok() // <= false
```
`null`を許可する場合は`nullable`を型の前に付けます:
``` javascript
$(null).nullable.string().ok() // <= true
```

#### null と undefined を許可する
`nullable`と`optional`は併用できます:
``` javascript
$(x).nullable.optional.string()
```

|                         | undefined | null |
| -----------------------:|:---------:|:----:|
| (default)               | x         | x    |
| `optional`              | o         | x    |
| `nullable`              | x         | o    |
| `optional` + `nullable` | o         | o    |

#### optional と nullable を後から設定する
後述の遅延検証を利用してバリデータを使い回したいときに、後から`optional`および/または`nullable`の設定を上書きできると便利なことがあります。

``` javascript
$().string().optional().ok(undefined); // false
$().optional.string().optional(false).ok(undefined); // true
```

### 遅延検証
cafyの引数を省略することで、後から値を検証するバリデータになります:
``` javascript
$().number().range(30, 50)
```
`test`や`ok`メソッドに値を与えて検証します:
``` javascript
$().number().range(30, 50).ok(42) // => true
```

この遅延検証を利用すると、配列の`some`などに渡すときに便利です:
``` javascript
xs.some($().number().max(30).nok)
```

ℹ️ `nok`は`ok`の逆です。

バリデータを使い回したいときも簡単です:
``` javascript
const isValidGender = $().string().or('male|female').ok;

isValidGender('male')   // true
isValidGender('female') // true
isValidGender('alice')  // false
```

📖 API
-----------------------------------------------
### **Query**
cafyの実体は`Query`クラスです。そして、cafyで実装されている全ての型は`Query`クラスを継承したクラスです。
従って、`Query`クラスにある次のメソッドは全ての型で利用可能です。

#### メソッド
##### `.pipe(fn)` => `Query`
カスタムのバリデーションを実行できます。
引数の関数が`true`を返すと妥当ということになり、`false`または`Error`を返すと不正な値とします。
``` javascript
$('strawberry pasta').string().pipe(x => x.indexOf('alice') == -1).ok() // true
$(['a', 'b', 'c']).array().pipe(x => x[1] != 'b').ok() // false
```

##### `.test(value?)` => `Error`
バリデーションを実行します。
合格した場合は`null`で、そうでない場合は`Error`です。
遅延検証を行うときは、テスト対象の値を引数として与えます。

##### `.ok(value?)` => `boolean`
バリデーションを実行します。
合格した場合は`true`で、そうでない場合は`false`です。
`.test() == null`と同義です。
遅延検証を行うときは、テスト対象の値を引数として与えます。

##### `.nok(value?)` => `boolean`
バリデーションを実行します。
合格した場合は`false`で、そうでない場合は`true`です。
`.ok()`の否定です。
(*nok* は _**n**ot **ok**_ の略です)
遅延検証を行うときは、テスト対象の値を引数として与えます。

##### `.throw(value?)` => `any`
バリデーションを実行します。
合格した場合は値を返し、そうでない場合は`Error`をthrowします。
遅延検証を行うときは、テスト対象の値を引数として与えます。

##### `.get(value?)` => `[any, Error]`
テスト対象の値とテスト結果のペア(配列)を取得します。
遅延検証を行うときは、テスト対象の値を引数として与えます。

### 型: **Any**
``` javascript
.any()...
```

Any型を使うと、「*undefined*や*null*はダメだけど、型は何でもいい」といった値を検証したいときに便利です:
``` javascript
$('strawberry pasta').any().ok() // <= true
```
「必ず`x`というプロパティを持っていてほしい。中身はnullやundefined以外なら何でもいい」のような場合もanyを活用できます:
``` javascript
$({ x: 'strawberry pasta' }).object().have('x', $().any()).ok() // <= true
```

#### メソッド
Any固有のメソッドはありません。

### 型: **Array**
``` javascript
.array(type)...
```

配列をバリデーションしたいときはこの型を使用します。

#### 配列の要素をバリデーションする
配列の各々の要素に対してバリデーションを定義できます:
``` javascript
$(x).array($().number())         // xは数値の配列でなければならない
$(x).array($().string().min(10)) // xは10文字以上の文字列の配列でなければならない
```

#### メソッド
##### `.min(threshold)`
要素の数が`threshold`以上でなければならないという制約を追加します。

##### `.max(threshold)`
要素の数が`threshold`以下でなければならないという制約を追加します。

##### `.range(min, max)`
`min`以上`max`以下の数の要素を持っていなければならないという制約を追加します。
``` javascript
$(['a', 'b', 'c']).array().range(2, 5).ok()                // true
$(['a', 'b', 'c', 'd', 'e', 'f']).array().range(2, 5).ok() // false
$(['a']).array().range(2, 5).ok()                          // false
```

ℹ️ `range(30, 50)`は`min(30).max(50)`と同義です。

##### `.length(length)`
要素の数が`length`でなければならないという制約を追加します。

##### `.unique()`
ユニークな配列(=重複した値を持っていない)でなければならないという制約を追加します。
``` javascript
$(['a', 'b', 'c']).array().unique().ok()      // true
$(['a', 'b', 'c', 'b']).array().unique().ok() // false
```

##### `.item(index, fn)`
特定のインデックスの要素に対してカスタムのバリデーションを実行できます。
引数の関数が`true`を返すと妥当ということになり、`false`または`Error`を返すと不正な値とします。
引数にはcafyインスタンスも渡せます。
``` javascript
$(['a', 42,  'c']).array().item(1, $().number()).ok() // true
$(['a', 'b', 'c']).array().item(1, $().number()).ok() // false
```

##### `.each(fn)`
各要素に対してカスタムのバリデーションを実行できます。
引数の関数が`true`を返すと妥当ということになり、`false`または`Error`を返すと不正な値とします。
引数にはcafyインスタンスも渡せます。
``` javascript
$([1, 2, 3]).array().each(x => x < 4).ok() // true
$([1, 4, 3]).array().each(x => x < 4).ok() // false
```

### 型: **Boolean**
``` javascript
.boolean()...
```
真理値(`true`か`false`)をバリデーションしたいときはこの型を使用します。

#### メソッド
固有のメソッドはありません。

### 型: **Number**
``` javascript
.number()...
```
数値をバリデーションしたいときはこの型を使用します。

#### メソッド

##### `.int()`
整数でなければならないという制約を追加します。
``` javascript
$(0       ).number().int().ok() // true
$(1       ).number().int().ok() // true
$(-100    ).number().int().ok() // true

$(0.1     ).number().int().ok() // false
$(Math.PI ).number().int().ok() // false

$(NaN     ).number().int().ok() // false
$(Infinity).number().int().ok() // false
```

##### `.min(threshold)`
`threshold`以上の数値でなければならないという制約を追加します。

##### `.max(threshold)`
`threshold`以下の数値でなければならないという制約を追加します。

##### `.range(min, max)`
`min`以上`max`以下の数値でなければならないという制約を追加します。

ℹ️ `range(30, 50)`は`min(30).max(50)`と同義です。

### 型: **Object**
``` javascript
.object(strict?)...
```
オブジェクトをバリデーションしたいときはこの型を使用します。

#### オブジェクトの厳格な検証 *(strict)*
デフォルトでは、`have`や`prop`で言及した以外のプロパティを持っていても、問題にはしません:
``` javascript
$({ x: 42, y: 24 }).object().have('x', $().number()).ok() // <= true
```
`have`または`prop`で言及した以外のプロパティを持っている場合にエラーにしたい場合は、`object`の引数に`true`を設定します:
``` javascript
$({ x: 42, y: 24 }).object(true).have('x', $().number()).ok() // <= false
```

#### メソッド
##### `.prop(name, fn)`
特定のプロパティにカスタムのバリデーションを実行できます。
引数の関数が`true`を返すと妥当ということになり、`false`または`Error`を返すと不正な値とします。
そのプロパティが存在しなかった場合は単に無視されます。
引数にはcafyインスタンスも渡せます。
``` javascript
$({ myProp: true }).object().prop('myProp', $().boolean()).ok() // true
```

複雑な例:
``` javascript
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

$(x).object()
  .prop('some', $().object()
    .prop('strawberry', $().string())
    .prop('alice', $().boolean())
    .prop('tachibana'), $().object()
      .prop('bwh', $().array($().number())))
  .prop('thing', $().number())
  .ok() // true
```

##### `.have(name, fn)`
特定のプロパティにカスタムのバリデーションを実行できます。
引数の関数が`true`を返すと妥当ということになり、`false`または`Error`を返すと不正な値とします。
引数にはcafyインスタンスも渡せます。

`fn`を省略することもできます。その場合、次と等価です:
``` javascript
have('x', () => true)
```

### 型: **String**
``` javascript
.string()...
```
文字列をバリデーションしたいときはこの型を使用します。

#### メソッド
##### `.match(pattern)`
与えられた正規表現とマッチしていなければならないという制約を追加します。
``` javascript
$('2017-03-07').string().match(/^([0-9]{4})\-([0-9]{2})-([0-9]{2})$/).ok() // true
```

##### `.or(pattern)`
与えられたパターン内の文字列のいずれかでなければならないという制約を追加します。
`pattern`は文字列の配列または`|`で区切られた文字列です。
``` javascript
$('strawberry').string().or(['strawberry', 'pasta']).ok() // true
$('alice').string().or(['strawberry', 'pasta']).ok()      // false
$('pasta').string().or('strawberry|pasta').ok()           // true
```

##### `.notInclude(str | str[])`
引数に与えられた文字列を含んでいてはならないという制約を追加します。
``` javascript
$('She is fucking rich.').string().notInclude('fuck').ok() // false
$('strawberry pasta').string().notInclude(['strawberry', 'alice']).ok() // false
```

##### `.min(threshold)`
`threshold`以上の文字数でなければならないという制約を追加します。

##### `.max(threshold)`
`threshold`以下の文字数でなければならないという制約を追加します。

##### `.range(min, max)`
`min`以上`max`以下の文字数でなければならないという制約を追加します。

ℹ️ `range(30, 50)`は`min(30).max(50)`と同義です。

##### `.length(length)`
文字数が`length`でなければならないという制約を追加します。

### **Type** (ユーザー定義型)
``` javascript
.type(type)...
```

cafyで標準で用意されている`string`や`number`等の基本的な型以外にも、ユーザーが型を登録してバリデーションすることができます。
型を定義するには、まずcafyの`Query`クラスを継承したクエリクラスを作ります。バリデーションするときは、`type`メソッドにクラスを渡します。
TypeScriptでの例:
``` typescript
import $, { Query } from 'cafy';

// あなたのクラス
class MyClass {
  x: number;
}

// あなたのクラスを検証するための、cafyのQueryクラスを継承したクラス
class MyClassQuery extends Query<MyClass> {
  constructor(...args) {
    // "おまじない"のようなものです
    super(...args);

    // 値が MyClass のインスタンスであるかチェック
    this.pushValidator(v =>
      v instanceof MyClass ? true : new Error('not an instance of MyClass')
    );
  }
}

$(new MyClass()).type(MyClassQuery).ok(); // true

$('abc').type(MyClassQuery).ok(); // false
```
また、`Query`を継承するクラスにメソッドを実装することで、クエリ中でそのメソッドを利用することもできます。
詳しくは、cafyのソースコード内の既存の型のクラスの実装を参考にしてください。

### **Or**
``` javascript
.or()...
```

時には、「文字列または数値」とか「真理値または真理値の配列」のようなバリデーションを行いたいときもあるでしょう。
そういった場合は、`or`を使うことができます。
例:
``` javascript
// 文字列または数値
$(42).or($().string(), $().number()).ok() // <= true
```

💡 Tips
-----------------------------------------------
### 規定値を設定する
[Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)の規定値構文を使うことができます。
``` javascript
const [val = 'desc', err] = $(x).optional.string().or('asc|desc').get();
// xは文字列でなければならず、'asc'または'desc'でなければならない。省略された場合は'desc'とする。
```

Release Notes
-----------------------------------------------
Please see [ChangeLog](CHANGELOG.md)!

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
