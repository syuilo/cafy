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

どんな型のバリデータにどんなメソッドがあるかは[APIのセクション](#api)を見てみてください！

また、後述するように独自の型を追加することもできます。

### null と undefined の扱い

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

### 配列の要素の型を指定する
配列の要素がどんな型でなければならないか指定することもできます:
``` javascript
$(x).array($().string()) // xは文字列の配列でなければならない
```

### 遅延検証
cafyの引数を省略することで、後から値を検証するバリデータになります:
``` javascript
$().number().range(30, 50)
```
`test`や`ok`メソッドに値を与えて検証します:
``` javascript
$().number().range(30, 50).test(42) // <= null
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

### オブジェクトの厳格な検証 *(strict)*
デフォルトでは、`have`や`prop`で言及した以外のプロパティを持っていても、問題にはしません:
``` javascript
$({ x: 42, y: 24 }).object().have('x', $().number()).ok() // <= true
```
`have`または`prop`で言及した以外のプロパティを持っている場合にエラーにしたい場合は、`object`の引数に`true`を設定します:
``` javascript
$({ x: 42, y: 24 }).object(true).have('x', $().number()).ok() // <= false
```

### Any
Any型を使うと、「*undefined*や*null*はダメだけど、型は何でもいい」といった値を検証したいときに便利です:
``` javascript
$('strawberry pasta').any().ok() // <= true
```
「必ず`x`というプロパティを持っていてほしい。中身はnullやundefined以外なら何でもいい」のような場合もanyを活用できます:
``` javascript
$({ x: 'strawberry pasta' }).object().have('x', $().any()).ok() // <= true
```

### ユーザー定義型
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
	// コンストラクタは、4つの引数を受け取ります。
	// それらの引数はすべて親クラス(=Queryクラス)に渡してください。
	constructor(optional, nullable, lazy, value?) {
		// ("おまじない"のようなものです)
		super(optional, nullable, lazy, value);

		// 値が MyClass のインスタンスであるかチェック
		this.pushFirstTimeValidator(v =>
			v instanceof MyClass ? true : new Error('not an instance of MyClass')
		);
	}
}

$(new MyClass()).type(MyClassQuery).ok(); // true

$('abc').type(MyClassQuery).ok(); // false
```
また、`Query`を継承するクラスにメソッドを実装することで、クエリ中でそのメソッドを利用することもできます。
詳しくは、cafyのソースコード内の既存の型のクラスの実装を参考にしてください。

### Or
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
const [val = 'desc', err] = $(x).optional.string().or('asc|desc').$;
// xは文字列でなければならず、'asc'または'desc'でなければならない。省略された場合は'desc'とする。
```

📖 API
-----------------------------------------------
ℹ️ 返り値が`Query`と表記されているものは、そのあとにメソッドチェーンを
繋げていくことができるということを示しています。

### 共通

#### `.pipe(fn)` => `Query`
カスタムのバリデーションを実行できます。
引数の関数が`true`を返すと妥当ということになり、`false`または`Error`を返すと不正な値とします。
``` javascript
$('strawberry pasta').string().pipe(x => x.indexOf('alice') == -1).ok() // true
$(['a', 'b', 'c']).array().pipe(x => x[1] != 'b').ok() // false
```

#### `.$` => `[any, Error]`
テスト対象の値とテスト結果のペア(配列)。先行検証のときのみ利用可能です。

#### `.test(value?)` => `Error`
バリデーションを実行します。
合格した場合は`null`で、そうでない場合は`Error`です。
遅延検証を行うときは、テスト対象の値を引数として与えます。
先行検証のときは、引数は単に無視されます。

#### `.ok(value?)` => `boolean`
バリデーションを実行します。
合格した場合は`true`で、そうでない場合は`false`です。
`.test() == null`と同義です。
遅延検証を行うときは、テスト対象の値を引数として与えます。
先行検証のときは、引数は単に無視されます。

#### `.nok(value?)` => `boolean`
バリデーションを実行します。
合格した場合は`false`で、そうでない場合は`true`です。
`.ok()`の否定です。
(*nok* は _**n**ot **ok**_ の略です)
遅延検証を行うときは、テスト対象の値を引数として与えます。
先行検証のときは、引数は単に無視されます。

### Any
Any固有のメソッドはありません。

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
$(['a', 'b', 'c']).array().range(2, 5).ok()                // true
$(['a', 'b', 'c', 'd', 'e', 'f']).array().range(2, 5).ok() // false
$(['a']).array().range(2, 5).ok()                          // false
```

ℹ️ `range(30, 50)`は`min(30).max(50)`と同義です。

#### `.length(length)` => `Query`
要素の数が`length`でなければならないという制約を追加します。
要素数が`length`でない場合エラーにします。

#### `.unique()` => `Query`
ユニークな配列(=重複した値を持っていない)でなければならないという制約を追加します。
重複した要素がある場合エラーにします。
``` javascript
$(['a', 'b', 'c']).array().unique().ok()      // true
$(['a', 'b', 'c', 'b']).array().unique().ok() // false
```

#### `.item(index, fn)` => `Query`
特定のインデックスの要素に対してカスタムのバリデーションを実行できます。
引数の関数が`true`を返すと妥当ということになり、`false`または`Error`を返すと不正な値とします。
引数にはcafyインスタンスも渡せます。
``` javascript
$(['a', 42,  'c']).array().item(1, $().number()).ok() // true
$(['a', 'b', 'c']).array().item(1, $().number()).ok() // false
```

#### `.each(fn)` => `Query`
各要素に対してカスタムのバリデーションを実行できます。
引数の関数が`true`を返すと妥当ということになり、`false`または`Error`を返すと不正な値とします。
引数にはcafyインスタンスも渡せます。
``` javascript
$([1, 2, 3]).array().each(x => x < 4).ok() // true
$([1, 4, 3]).array().each(x => x < 4).ok() // false
```

### Boolean
Boolean固有のメソッドはありません。

### Number
#### `.int()` => `Query`
整数でなければならないという制約を追加します。
整数でない場合エラーにします。
``` javascript
$(0       ).number().int().ok() // true
$(1       ).number().int().ok() // true
$(-100    ).number().int().ok() // true

$(0.1     ).number().int().ok() // false
$(Math.PI ).number().int().ok() // false

$(NaN     ).number().int().ok() // false
$(Infinity).number().int().ok() // false
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

### Object
#### `.prop(name, fn)` => `Query`
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

#### `.have(name, fn)` => `Query`
特定のプロパティにカスタムのバリデーションを実行できます。
引数の関数が`true`を返すと妥当ということになり、`false`または`Error`を返すと不正な値とします。
そのプロパティが存在しなかった場合はエラーにします。
引数にはcafyインスタンスも渡せます。

`fn`を省略することもできます。その場合、次と等価です:
``` javascript
have('x', () => true)
```

### String
#### `.match(pattern)` => `Query`
与えられた正規表現とマッチしていなければならないという制約を追加します。
正規表現と一致しない場合エラーにします。
``` javascript
$('2017-03-07').string().match(/^([0-9]{4})\-([0-9]{2})-([0-9]{2})$/).ok() // true
```

#### `.or(pattern)` => `Query`
与えられたパターン内の文字列のいずれかでなければならないという制約を追加します。
`pattern`は文字列の配列または`|`で区切られた文字列です。
どれとも一致しない場合エラーにします。
``` javascript
$('strawberry').string().or(['strawberry', 'pasta']).ok() // true
$('alice').string().or(['strawberry', 'pasta']).ok()      // false
$('pasta').string().or('strawberry|pasta').ok()           // true
```

#### `.notInclude(str | str[])` => `Query`
引数に与えられた文字列を含んでいてはならないという制約を追加します。
``` javascript
$('She is fucking rich.').string().notInclude('fuck').ok() // false
$('strawberry pasta').string().notInclude(['strawberry', 'alice']).ok() // false
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

#### `.length(length)` => `Query`
文字数が`length`でなければならないという制約を追加します。
文字数が`length`でない場合エラーにします。

Contribution
-----------------------------------------------
PullRequestやIssueの提出は歓迎です。

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
