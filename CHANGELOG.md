4.1.0 / 2018-04-24
------------------
* Add: カスタムクエリ

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
