# ☕ cafy
> Simple, lightweight, flexible validator generator

**cafy**は、アサーションのようにメソッドチェーンで値のバリデーションを行うライブラリです。
cafyを使えばバリデーションを簡単かつ柔軟に書くことができます。すべてTypeScriptで書かれていて、型定義との相性も抜群です。
[Try it out!](https://runkit.com/npm/cafy)

[![][npm-badge]][npm-link]
[![][mit-badge]][mit]
[![][travis-badge]][travis-link]
[![][himawari-badge]][himasaku]
[![][sakurako-badge]][himasaku]

[![NPM](https://nodei.co/npm/cafy.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/cafy)

## 🤔 Why cafy
たとえばサーバー側で、クライアントから送信されてきたパラメータが正しい形式であるかどうか確認しないと、データベースのエラーやプログラムの例外を引き起こしたりする可能性があります。
<i>「このパラメータはnullやundefinedではない文字列でなくてはならず、1文字以上100文字以下でなくてはならず、a-z0-9の文字種で構成されてなければならない」</i>といった長いバリデーションを、cafyを使えば一行で簡潔に書くことができます。
例外も行うバリデーションごとに用意されているので、ユーザーにわかりやすいエラーメッセージを返すこともできます。
また、バリデータの型文字列を取得する機能があるので、それを使えばドキュメントを生成するときにも役立ちます。
TypeScriptの`strictNullChecks`オプションもサポートしています。

### ✨ 特徴
* **軽量** ... 依存関係無し。ブラウザでも使えます
* **簡単** ... 複雑にネストされたオブジェクトも直感的にバリデーションできる
* **柔軟** ... メソッドチェーンで制約を追加したり、独自の型を追加できる
* **強力な型サポート** ... 型注釈不要で、バリデータに即した型を取得できる
  * `strictNullChecks`サポートも含む

## 📦 Installation
Just:
```
npm install cafy
```
Happy validation👍

## ☘ Usage
TL;DR
``` javascript
import $ from 'cafy';

const isValidGender = $.str.or(['male', 'female']).ok;

isValidGender('male')   // true
isValidGender('female') // true
isValidGender('alice')  // false
isValidGender(42)       // false
```

---

まずその値がどんな型でなければならないかを示し、
そのあとに追加の制約をメソッドチェーンで追加していきます。

(以下のドキュメントでは、`import $ from 'cafy';`している前提で書いていきます(実際にはcafy関数にどんな名前を付けるかは自由です)。)

たとえば **「それは文字列でなければならない」** という制約を表すにはこう書きます:
``` javascript
$.str
```

`range`メソッドを利用して、さらに **「10文字以上20文字以下でなければならない」** という制約を追加してみます:
``` javascript
$.str.range(10, 20)
```

実際にバリデーションしてみましょう。
`ok`メソッドに検証する値を渡すと、それが条件を満たせば`true`が返り、そうでなければ`false`が返ります:
``` javascript
$.str.range(10, 20).ok('strawberry pasta') // true

$.str.range(10, 20).ok('alice') // false (短すぎるので)

$.str.range(10, 20).ok('i love strawberry pasta') // false (長すぎるので)
```

もちろん、上記の例はこのようにまとめられます:
``` javascript
const validate = $.str.range(10, 20).ok;

validate('strawberry pasta') // true
validate('alice') // false (短すぎるので)
validate('i love strawberry pasta') // false (長すぎるので)
```

---

cafyは様々な型をサポートしています:

* **文字列** ... `$.str`
* **数値** ... `$.num`
* **真理値** ... `$.bool`
* **配列** ... `$.arr()`
* **オブジェクト** ... `$.obj`
* **ユーザー定義型** ... `$.type()`
* **ユニオン** ... `$.or()`
* **なんでも** ... `$.any`

> ℹ JavaScriptの仕様上では配列はobjectですが、cafyでは配列はobjectとは見なされません。

後述するように、ユーザー定義型を使えば**独自の型**を追加することもできます。

それぞれの型がどのようなメソッドを持っているかなどは、APIのセクションをご確認ください。

### null と undefined の扱い
**cafyは、デフォルトで`null`も`undefined`も許容しません。**
`null`や`undefined`を許可したい場合は、これらのオプションを使用します:

#### undefined を許可する *(optional)*
デフォルトで`undefined`はエラーになります:
``` javascript
$.str.ok(undefined) // false
```
`undefined`を許可する場合は`optional`を型の前にプリフィクスします:
``` javascript
$.optional.str.ok(undefined) // true
```

#### null を許可する *(nullable)*
デフォルトで`null`はエラーになります:
``` javascript
$.str.ok(null) // false
```
`null`を許可する場合は`nullable`を型の前にプリフィクスします:
``` javascript
$.nullable.str.ok(null) // true
```

#### null と undefined を許可する
`nullable`と`optional`は併用できます:
``` javascript
$.nullable.optional.str...
$.optional.nullable.str...

// または

$.optionalNullable.str...
```

|                         | undefined | null |
| -----------------------:|:---------:|:----:|
| (default)               | x         | x    |
| `optional`              | o         | x    |
| `nullable`              | x         | o    |
| `optional` + `nullable` | o         | o    |

## 📖 API
### **Context**
cafyの実体は`Context`クラスです。そして、cafyで実装されている全ての型は`Context`クラスを継承したクラスです。
従って、`Context`クラスにある次のメソッドおよびプロパティは全ての型で利用可能です。

#### メソッド
##### `.get(value)` => `[any, Error]`
テスト対象の値とテスト結果のペア(配列)を取得します。

##### `.nok(value)` => `boolean`
バリデーションを実行します。
合格した場合は`false`で、そうでない場合は`true`です。
`.ok()`の否定です。
(*nok* は _**n**ot **ok**_ の略です)

##### `.ok(value)` => `boolean`
バリデーションを実行します。
合格した場合は`true`で、そうでない場合は`false`です。
`.test() == null`と同義です。

##### `.pipe(fn)` => `Context`
カスタムのバリデーションを実行できます。
引数の関数が`true`を返すと妥当ということになり、`false`または`Error`を返すと不正な値とします。
``` javascript
$.str.pipe(x => x.indexOf('alice') == -1).ok('strawberry pasta') // true
$.arr().pipe(x => x[1] != 'b').ok(['a', 'b', 'c']) // false
```

##### `.test(value)` => `Error`
バリデーションを実行します。
合格した場合は`null`で、そうでない場合は`Error`です。

##### `.throw(value)` => `any`
バリデーションを実行します。
合格した場合は値を返し、そうでない場合は`Error`をthrowします。

##### `.getType()` => `string`
このインスタンスの型を表す文字列を取得します。

###### 例
|                           | 型                   |
| -------------------------:|:--------------------:|
| `$.str`                   | `string`             |
| `$.optional.str`          | `string?`            |
| `$.nullable.str`          | `(string \| null)`   |
| `$.optional.nullable.str` | `(string \| null)?`  |
| `$.arr($.str)`            | `string[]`           |
| `$.or($.str, $.num)`      | `(string \| number)` |

#### プロパティ
##### `.isOptional`: `Boolean`
`optional`か否か(読み取り専用)

##### `.isNullable`: `Boolean`
`nullable`か否か(読み取り専用)

---

### 型: **Any**
``` javascript
.any
```

Any型を使うと、「*undefined*や*null*はダメだけど、型は何でもいい」といった値を検証したいときに便利です:
``` javascript
$.any.ok('strawberry pasta') // true
```

#### メソッド
Any固有のメソッドはありません。

---

### 型: **Array**
``` javascript
.arr(query)
.array(query)
```

配列をバリデーションしたいときはこの型を使用します。

#### 配列の要素をバリデーションする
配列の各々の要素に対してバリデーションを定義できます:
``` javascript
$.arr($.num)         // 数値の配列でなければならない
$.arr($.str.min(10)) // 10文字以上の文字列の配列でなければならない
```
もちろんarrayを入れ子にもできます:
``` javascript
$.arr($.arr($.num))         // 「数値の配列」の配列でなければならない
$.arr($.arr($.str.min(10))) // 「10文字以上の文字列の配列」の配列でなければならない
```

#### メソッド
##### `.min(threshold)`
要素の数が`threshold`以上でなければならないという制約を追加します。

##### `.max(threshold)`
要素の数が`threshold`以下でなければならないという制約を追加します。

##### `.range(min, max)`
`min`以上`max`以下の数の要素を持っていなければならないという制約を追加します。
``` javascript
$.arr().range(2, 5).ok(['a', 'b', 'c'])                // true
$.arr().range(2, 5).ok(['a', 'b', 'c', 'd', 'e', 'f']) // false
$.arr().range(2, 5).ok(['a'])                          // false
```

ℹ️ `range(30, 50)`は`min(30).max(50)`と同義です。

##### `.length(length)`
要素の数が`length`でなければならないという制約を追加します。

##### `.unique()`
ユニークな配列(=重複した値を持っていない)でなければならないという制約を追加します。
``` javascript
$.arr().unique().ok(['a', 'b', 'c'])      // true
$.arr().unique().ok(['a', 'b', 'c', 'b']) // false
```

##### `.item(index, fn)`
特定のインデックスの要素に対してカスタムのバリデーションを実行できます。
引数の関数が`true`を返すと妥当ということになり、`false`または`Error`を返すと不正な値とします。
引数にはcafyインスタンスも渡せます。
``` javascript
$.arr().item(1, $.num).ok(['a', 42, 'c'])  // true
$.arr().item(1, $.num).ok(['a', 'b', 'c']) // false
```

##### `.each(fn)`
各要素に対してカスタムのバリデーションを実行できます。
引数の関数が`true`を返すと妥当ということになり、`false`または`Error`を返すと不正な値とします。
引数にはcafyインスタンスも渡せます。
``` javascript
$.arr().each(x => x < 4).ok([1, 2, 3]) // true
$.arr().each(x => x < 4).ok([1, 4, 3]) // false
```

---

### 型: **Boolean**
``` javascript
.bool
.boolean
```

真理値(`true`か`false`)をバリデーションしたいときはこの型を使用します。

#### メソッド
固有のメソッドはありません。

---

### 型: **Number**
``` javascript
.num
.number
```

数値をバリデーションしたいときはこの型を使用します。

#### メソッド

##### `.int()`
整数でなければならないという制約を追加します。
``` javascript
$.num.int().ok(0)        // true
$.num.int().ok(1)        // true
$.num.int().ok(-100)     // true

$.num.int().ok(0.1)      // false
$.num.int().ok(Math.PI)  // false

$.num.int().ok(NaN)      // false
$.num.int().ok(Infinity) // false
```

##### `.min(threshold)`
`threshold`以上の数値でなければならないという制約を追加します。

##### `.max(threshold)`
`threshold`以下の数値でなければならないという制約を追加します。

##### `.range(min, max)`
`min`以上`max`以下の数値でなければならないという制約を追加します。

ℹ️ `range(30, 50)`は`min(30).max(50)`と同義です。

---

### 型: **Object**
``` javascript
.obj(props)
.object(props)
```

オブジェクトをバリデーションしたいときはこの型を使用します。

#### プロパティを定義する
引数にプロパティの定義を与えて、複雑なオブジェクトも簡単にバリデーションできます。

例えば次のようなオブジェクトをバリデーションしたいとします:
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
```

バリデータはこのように定義できます:
``` javascript
$.obj({
  some: $.obj({
    strawberry: $.str,
    alice: $.bool,
    tachibana: $.obj({
      bwh: $.arr($.num)
    })
  }),
  thing: $.num
}).ok(x) // true
```

#### エラー
この型では、エラーに次のプロパティが含まれています:
* `prop` ... バリデーションに不合格になったプロパティ名
* `path` ... 不合格になった子のプロパティまでのパス
* `valueError` ... バリデーションに不合格に際のエラー

例えば次のような検証を行った時、エラーは次のようになります:
``` javascript
$.obj({
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
```

```
Thrown:
{ Error: x.y.z: must-be-a-number
    at ...
  path: [ 'x', 'y', 'z' ],
  error:
   Error: must-be-a-number
       at ... }
```

#### メソッド

##### `.strict()`
引数のプロパティ定義で言及した以外のプロパティを持っている場合にエラーにします。

デフォルト:
``` javascript
$.obj({ foo: $.num }).ok({ foo: 42, bar: 24 }) // true
```

strict:
``` javascript
$.obj({ foo: $.num }).strict().ok({ foo: 42, bar: 24 }) // false
```

---

### 型: **String**
``` javascript
.str
.string
```

文字列をバリデーションしたいときはこの型を使用します。

#### メソッド
##### `.match(pattern)`
与えられた正規表現とマッチしていなければならないという制約を追加します。
``` javascript
$.str.match(/^([0-9]{4})\-([0-9]{2})-([0-9]{2})$/).ok('2017-03-07') // true
```

##### `.notMatch(pattern)`
`match`の否定。

##### `.or(pattern)`
与えられたパターン内の文字列のいずれかでなければならないという制約を追加します。
`pattern`は文字列の配列または`|`で区切られた文字列です。
``` javascript
$.str.or(['strawberry', 'pasta']).ok('strawberry') // true
$.str.or(['strawberry', 'pasta']).ok('alice')      // false
$.str.or('strawberry|pasta').ok('pasta')           // true
```

##### `.notInclude(str | str[])`
引数に与えられた文字列を含んでいてはならないという制約を追加します。
``` javascript
$.str.notInclude('fuck').ok('She is fucking rich.') // false
$.str.notInclude(['strawberry', 'alice']).ok('strawberry pasta') // false
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

---

### **Or**
``` javascript
.or(queryA, queryB)
```

「文字列または数値」とか「真理値または真理値の配列」のようなバリデーションを行いたいときは、`or`を使うことができます。
例:
``` javascript
// 文字列または数値
$.or($.str, $.num).ok(42) // true
```

---

### **Use**
``` javascript
.use(query)
```

既存のContextを拡張したいときに使います。
``` javascript
const other = $.str;
$.optional.use(other).ok(undefined) // true
$.nullable.use(other).ok(null) // true
```

---

### **Type** (ユーザー定義型)
``` javascript
.type(type)
```

cafyで標準で用意されている`string`や`number`等の基本的な型以外にも、ユーザーが型を登録してバリデーションすることができます。
型を定義するには、まずcafyの`Context`クラスを継承したContextクラスを作ります。
TypeScriptでの例:
``` typescript
import $, { Context } from 'cafy';

// あなたのクラス
class Foo {
  bar: number;
}

// あなたのクラスを検証するための、cafyのContextクラスを継承したクラス
class FooContext<Maybe = Foo> extends Context<Foo | Maybe> {
  constructor(optional = false, nullable = false) {
    // ✨おまじない✨
    super(optional, nullable);

    // 値が Foo のインスタンスであるかチェック
    this.push(v => v instanceof Foo);
  }

  //#region ✨もっとおまじない✨
  public makeOptional(): FooContext<undefined> {
    return new FooContext(true, false);
  }

  public makeNullable(): FooContext<null> {
    return new FooContext(false, true);
  }

  public makeOptionalNullable(): FooContext<undefined | null> {
    return new FooContext(true, true);
  }
  //#endregion
}
```

バリデーションするときは、`type`メソッドにクラスを渡します:
``` typescript
$.type(FooContext).ok(new Foo()); // true
$.type(FooContext).ok('abc');     // false
```

#### カスタムメソッド
また、`Context`を継承するクラスにメソッドを実装することで、Context中でそのメソッドを利用することもできます。
例として、上述の`FooContext`に、「プロパティ`bar`が指定された値以上でなければならない」という制約を追加するメソッド`min`を定義してみましょう:
``` typescript
class FooContext<Maybe = Foo> extends Context<Foo | Maybe> {
  ...

  public min(threshold: number) {
    this.push(v => v.bar >= threshold);
    return this;
  }
}
```
> `return this;`しているのは、メソッドチェーンできるようにするためです。

このメソッドを使う例:
``` typescript
const foo = new Foo();
foo.bar = 42;

$.type(FooContext).min(40).ok(foo); // true
$.type(FooContext).min(48).ok(foo); // false
```

#### `getType`メソッドのオーバーライド
`getType`メソッドでユーザー定義型の型文字列を取得できるようにするには、メソッドをオーバーライドします。
`optional`などの情報も反映させるために、`super.getType`を呼ぶのを忘れないでください。例:
``` typescript
class FooContext<Maybe = Foo> extends Context<Foo | Maybe> {
  ...

  public getType() {
    return super.getType('Foo');
  }
}
```
``` typescript
$.type(FooContext).getType(); // 'Foo'
```

## TypeScriptで使う
cafyはTypeScriptで書かれているため、強力な型定義を持ちます。
例えば、「`x`は*文字列*でなければならない」とバリデーションした後の`x`の型は明らかに*文字列*です。
いくつかバリデーション後の型定義がどうなるのかの例を示します:
``` ts
const a = $.str.get(foo)[0];
// ↑ a の型は string

const b = $.arr($.num).get(foo)[0];
// ↑ b の型は number[]

const c = $.or($.str, $.num).get(foo)[0];
// ↑ c の型は string | number

const d = $.obj({
  foo: $.obj({
    bar: $.obj({
      baz: $.num
    }),
    qux: $.arr($.arr($.bool))
  })
}).get(foo)[0];
/* ↑ d の型は:
{
  foo: {
    bar: {
      baz: number;
    };
    qux: boolean[][];
  };
}
*/
```

### `strictNullChecks`と一緒に使う
cafyはTypeScriptの`strictNullChecks`をサポートしていて、型定義において`null`、`undefined`、またはそうでないかを区別できます。例:
``` ts
const x =                   $.str.get(foo)[0]; // x の型は string
const y =          $.optional.str.get(foo)[0]; // y の型は string | undefined
const z = $.optional.nullable.str.get(foo)[0]; // z の型は string | undefined | null
```

## Release Notes
Please see [ChangeLog](CHANGELOG.md)!

## License
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
