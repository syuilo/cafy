15.2.0 / 2019-11-07
-------------------
* Add `literal` context
* Type Guard support

15.1.1 / 2019-04-12
-------------------
* 型定義を修正

15.1.0 / 2019-02-23
-------------------
* note機能を復活
* いくつかのプロパティをpublicに

15.0.0 / 2019-02-22
-------------------
* **[BREAKING]** ユーザー定義型を作るときに`name`プロパティを実装していることが必須に
* **[BREAKING]** `or`コンテキストが`either`に改名
* いくつかのプロパティをpublicに

14.0.1 / 2019-02-12
-------------------
* Improve document

14.0.0 / 2019-02-12
-------------------
* **[BREAKING]** `optional` and `nullable` is now can't used as a method. Please use these options as prefix. e.g. `$.str.optional` --> `$.optional.str`
* **[BREAKING]** The spec of custom type class changed. for more details, please see README.
* **[BREAKING]** Drop `note` feature
* Improve: `strictNullChecks` support

13.0.0 / 2019-02-11
-------------------
* **[BREAKING]** Drop surrogate pair support
* Error of object ctx improved

12.1.1 / 2019-02-10
-------------------
* Fix type of `throw` method (Thanks @rinsuki)

12.1.0 / 2019-01-12
-------------------
* Add: `notMatch` method

12.0.0 / 2018-11-01
-------------------
* **[BREAKING]** Remove `transform` property in user defined type
* Fix: Got wrong type string when use Or query

11.3.0 / 2018-07-07
-------------------
* Export each contexts for typescript

11.2.0 / 2018-07-06
-------------------
* Improve: `getType` method

11.1.0 / 2018-07-06
-------------------
* Add: `props`
* Add: `getType`

11.0.0 / 2018-07-05
-------------------
* **[BREAKING]** `Query` --> `Context`
* Add: `isOptional`
* Add: `isNullable`
* Add: `note()`

10.0.0 / 2018-05-09
-------------------
* **[BREAKING]** `optional()` --> `optional`
* **[BREAKING]** `nullable()` --> `nullable`
* **[BREAKING]** strictの引数廃止

9.1.0 / 2018-05-09
------------------
* Add: use

9.0.0 / 2018-05-09
------------------
* **[BREAKING]** objectの引数でプロパティ定義を行うように

8.0.0 / 2018-05-01
------------------
* **[BREAKING]** 先行検証廃止
* **[BREAKING]** optional廃止(代わりにoptionalメソッドを使用してください)
* **[BREAKING]** nullable廃止(代わりにnullableメソッドを使用してください)
* **[BREAKING]** objectの引数廃止(代わりにstrictメソッドを使用してください)
* **[BREAKING]** Use `push` instead of `pushValidator`
* Add: 型の短いエイリアスを追加:
	* str (string)
	* arr (array)
	* obj (object)
	* num (number)
	* bool (boolean)

7.0.1 / 2018-04-25
------------------
* Fix: サロゲートペアが正しく認識されない

7.0.0 / 2018-04-25
------------------
* **[BREAKING]** Use `get()` instead of `$`
* Add: throw

6.0.0 / 2018-04-24
------------------
* **[BREAKING]** Use `pushValidator` instead of `pushFirstTimeValidator`
* Bug fix

5.1.0 / 2018-04-24
------------------
* Add: transform

5.0.0 / 2018-04-24
------------------
* **[BREAKING]** ユーザー定義型の定義方法を変更

4.1.0 / 2018-04-24
------------------
* Add: カスタムクエリ
* Add: Orクエリ

4.0.2 / 2018-04-04
------------------
* より良い型定義

4.0.1 / 2018-04-04
------------------
* READMEの更新

4.0.0 / 2018-04-04
------------------
* **[BREAKING]** IDが廃止されました。
* **[BREAKING]** Flexible Arrayが廃止されました。
* **[BREAKING]** Arrayの引数に型を表す文字列を渡せなくなりました。その代わりcafyインスタンスを渡せるようになりました
* **[BREAKING]** Arrayの`eachQ`が廃止されました。
* **[BREAKING]** strict objectの指定方法が変更されました。`strict.object` --> `object(true)`
* Add: 後から optional および nullable の設定を上書きできるメソッド`optional()`と`nullable()`が全てのクエリに対して追加されました。

3.2.1 / 2018-01-23
------------------
* Fix: AnyQueryの型がbooleanになっている

3.2.0 / 2017-11-08
------------------
* Add: StringQuery.notInclude (#12)
* Add: toStringにverboseオプションを追加
* Fix: strictなobjectが正しく判定されていなかった問題を修正

3.1.1 / 2017-11-05
------------------
* Fix: $([]).object().ok() がtrueを返す (#11)

3.1.0 / 2017-11-05
------------------
* Add `eachQ` method to ArrayQuery (#10)

3.0.0 / 2017-09-19
------------------
* **[BREAKING]** `isOk` is now `ok`
* **[BREAKING]** `isNg` is now `nok`

2.4.0 / 2017-05-16
------------------
* Add flexible option to array

2.3.0 / 2017-03-08
------------------
* Add overload to `have()`
* Add `any` type

2.2.0 / 2017-03-08
------------------
* Add `strict` option ObjectQuery
* Add `have()` to ObjectQuery

2.1.0 / 2017-03-08
------------------
* Add `length()` to StringQuery and ArrayQuery
* Add `item()` to ArrayQuery
* Add `prop()` to ObjectQuery

2.0.0 / 2017-03-07
------------------
* なんかもうめっちゃ変えた

1.3.0 / 2017-03-06
------------------
* arrayの引数で要素の型を指定できるようにするなど

1.2.0 / 2017-03-06
------------------
* なんか

1.1.0 / 2017-03-06
------------------
* なんかいろいろ

1.0.1 / 2017-03-05
------------------
* Bug fix

1.0.0 / 2017-03-05
------------------
なんかもうめっちゃ変えた

0.0.0 / 2017-03-04
------------------
Initial release
