# NodeGrepUtil

複数の正規表現パターンを効率的に扱うためのJavaScriptユーティリティライブラリです。文字列に対して複数の正規表現を一度に適用し、マッチング結果を取得できます。また、バッファパターンマッチング機能も提供します。

## プロジェクト概要

NodeGrepUtilは、複数の正規表現パターンを配列として管理し、それらを文字列に対して順次適用するための`RegExpArray`クラスを提供します。標準のJavaScript正規表現APIを拡張し、複数パターンの一括処理を簡潔に記述できます。さらに、`BufferPatternMatcher`クラスによるバイナリデータのパターンマッチング機能も備えています。

## プロジェクト構造

```
NodeGrepUtil/
├── src/
│   ├── index.js                  # ライブラリエントリポイント（RegExpArray、BufferPatternMatcherのエクスポート）
│   ├── RegExpArray.js            # RegExpArrayクラスの実装
│   └── BufferPatternMatcher.js   # BufferPatternMatcherクラスの実装
├── tests/
│   └── unit/
│       └── RegExpArray.spec.js   # ユニットテスト
├── dist/                         # ビルド出力ディレクトリ（webpack）
├── jest.config.js                # Jestテスト設定
├── webpack.config.js             # Webpackビルド設定（UMD形式）
├── package.json                  # プロジェクトメタデータと依存関係
├── LICENSE                       # MITライセンス
└── README.md                     # プロジェクトドキュメント
```

## 技術スタック

- **言語**: JavaScript (ES6+)
- **ビルドツール**: Webpack 5
- **テストフレームワーク**: Jest 29
- **トランスパイラ**: Babel (Jest用)
- **出力形式**: UMD (Universal Module Definition)

## 機能

### 完了している機能

#### RegExpArray（正規表現配列）
- ✅ 複数の正規表現パターンを配列で管理
- ✅ 正規表現の文字列表記、配列表記、RegExpオブジェクトの混在をサポート
- ✅ `exec()` - 複数パターンでの順次マッチング実行
- ✅ `test()` - 複数パターンでのテスト（いずれかがマッチすればtrue）
- ✅ `firstMatch()` - 最初にマッチした結果を返すインスタンスメソッド
- ✅ `toArray()` - RegExpオブジェクトの配列を取得
- ✅ `RegExpArray.matchAll()` - 静的メソッドによる全マッチ結果の取得
- ✅ `RegExpArray.firstMatch()` - 静的メソッドで最初のマッチを取得
- ✅ `RegExpArray.test()` - 静的メソッドでマッチテスト（修正済み）

#### BufferPatternMatcher（バッファパターンマッチング）
- ✅ `compareBuf()` - バイナリデータ（Buffer）に対するパターンマッチング
- ✅ 複数のバッファパターンとの比較
- ✅ エラーハンドリングとthrowによる例外送出

#### 共通機能
- ✅ UMDバンドルによるNode.js/ブラウザ両対応
- ✅ null入力時の適切な処理（nullを返す）
- ✅ 改善されたエラーハンドリング（throw使用）

## セットアップ

### インストール

```powershell
# リポジトリのクローン
git clone https://github.com/nojaja/NodeGrepUtil.git
cd NodeGrepUtil

# 依存関係のインストール
npm install
```

### ビルド

```powershell
# UMDバンドルのビルド (dist/GrepUtil.bundle.js)
npm run build
```

## 使用方法

### ライブラリとしての使用

#### インストール

```powershell
npm install @nojaja/greputil
```

#### API リファレンス

##### RegExpArray クラス

| メソッド/関数 | パラメータ | 戻り値 | 説明 |
|--------------|-----------|--------|------|
| `new RegExpArray(patternList)` | `patternList: string[] \| RegExp[] \| Array<[string, string]>` | `RegExpArray` | 複数の正規表現パターンからインスタンスを作成。文字列、RegExpオブジェクト、[パターン, フラグ]配列の混在可 |
| `exec(string)` | `string: string` | `Array<string>` | 各正規表現を順次実行し、すべてのマッチ結果を配列で返す（グローバルフラグ使用時はステートフル） |
| `firstMatch(string)` | `string: string` | `RegExpExecArray \| null` | 最初にマッチした結果を返す。マッチしない場合はnull |
| `test(string)` | `string: string` | `boolean` | いずれかの正規表現がマッチすればtrue（firstMatchを内部使用） |
| `toArray()` | なし | `Array<RegExp>` | RegExpオブジェクトの配列を返す |
| `RegExpArray.matchAll(string, regexps)` | `string: string`, `regexps: string \| RegExp \| Array \| null` | `Array<Array<string>> \| null` | 静的メソッド。すべてのマッチ結果を二次元配列で返す。regexpsがnullの場合はnullを返す |
| `RegExpArray.firstMatch(string, regexps)` | `string: string`, `regexps: string \| RegExp \| Array \| null` | `RegExpExecArray \| null` | 静的メソッド。最初のマッチ結果を返す。regexpsがnullの場合はnullを返す |
| `RegExpArray.test(string, regexps)` | `string: string`, `regexps: string \| RegExp \| Array \| null` | `boolean` | 静的メソッド。マッチするかテスト（内部でfirstMatchを使用） |

##### BufferPatternMatcher クラス

| メソッド/関数 | パラメータ | 戻り値 | 説明 |
|--------------|-----------|--------|------|
| `new BufferPatternMatcher()` | なし | `BufferPatternMatcher` | BufferPatternMatcherのインスタンスを作成 |
| `compareBuf(buffer, patterns)` | `buffer: Buffer`, `patterns: Array<Buffer>` | `boolean \| null` | バッファを複数のパターンと比較。マッチすればtrue、マッチしなければfalse、patternsがnullの場合はnull |

#### 基本的な使用例

##### RegExpArray の使用

```javascript
import { RegExpArray } from '@nojaja/greputil';

// 1. インスタンス作成 - 複数のパターンを配列で指定
const util = new RegExpArray([
  /test\d/g,              // RegExpオブジェクト
  'hello',                // 文字列
  ['world', 'i']          // [パターン, フラグ]配列
]);

// 2. exec() - 順次マッチング実行
const result1 = util.exec('test1 hello test2');
// => ["test1", "hello"]

// 3. firstMatch() - 最初のマッチを取得
const result2 = util.firstMatch('test1 hello test2');
// => ["test1"] (配列形式で詳細含む)

// 4. test() - いずれかがマッチするか判定
const result3 = util.test('test1 hello');
// => true

// 5. toArray() - RegExpオブジェクト配列を取得
const regexps = util.toArray();
// => [/test\d/g, /hello/, /world/i]

// 6. 静的メソッド matchAll() - すべてのマッチを取得
const matches = RegExpArray.matchAll('test1test2', [/t(e)(st(\d?))/g]);
// => [["test1","e","st1","1"], ["test2","e","st2","2"]]

// 7. 静的メソッド firstMatch() - 最初のマッチのみ
const firstMatch = RegExpArray.firstMatch('test1test2', [/test\d/g]);
// => ["test1"]
```

##### BufferPatternMatcher の使用

```javascript
import { BufferPatternMatcher } from '@nojaja/greputil';

// バイナリデータのパターンマッチング
const matcher = new BufferPatternMatcher();

// PNG/JPEGファイルの判定例
const fileBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, ...]);
const patterns = [
  Buffer.from([0x89, 0x50, 0x4E, 0x47]),  // PNGシグネチャ
  Buffer.from([0xFF, 0xD8, 0xFF])         // JPEGシグネチャ
];

const isMatch = matcher.compareBuf(fileBuffer, patterns);
// => true (PNGパターンにマッチ)
```

#### 実用例 - ログファイルの解析

```javascript
import { RegExpArray } from '@nojaja/greputil';

const logText = `
2026-01-01 ERROR: Database connection failed
2026-01-01 WARN: Slow query detected
2026-01-02 ERROR: Timeout occurred
`;

// ERRORとWARNの両方を抽出
const patterns = [
  /\d{4}-\d{2}-\d{2} ERROR: .+/g,
  /\d{4}-\d{2}-\d{2} WARN: .+/g
];

const matches = RegExpArray.matchAll(logText, patterns);
console.log(matches);
// => [
//   ["2026-01-01 ERROR: Database connection failed"],
//   ["2026-01-01 WARN: Slow query detected"],
//   ["2026-01-02 ERROR: Timeout occurred"]
// ]

// 最初のエラーのみを取得
const firstError = RegExpArray.firstMatch(logText, [/ERROR: .+/]);
// => ["ERROR: Database connection failed"]
```

#### エラーハンドリング

```javascript
import { RegExpArray, BufferPatternMatcher } from '@nojaja/greputil';

// RegExpArray: エラーは例外として送出される
try {
  const matches = RegExpArray.matchAll('test', [/[/]); // 不正な正規表現
} catch (error) {
  console.error('正規表現エラー:', error);
  // エラーがthrowされるため、適切にキャッチする必要がある
}

// null入力時の処理
const result = RegExpArray.matchAll('test', null);
// => null（エラーではなくnullを返す）

// BufferPatternMatcher: エラーは例外として送出される
try {
  const matcher = new BufferPatternMatcher();
  const isMatch = matcher.compareBuf(invalidBuffer, patterns);
} catch (error) {
  console.error('バッファ比較エラー:', error);
}
```

### 開発セットアップ

開発環境のセットアップと一般的な開発コマンド：

```powershell
# リポジトリをクローン
git clone https://github.com/nojaja/NodeGrepUtil.git
cd NodeGrepUtil

# 依存関係をインストール
npm install

# ユニットテストを実行
npm run test

# 統合テストを実行（ビルド後のGrepUtil.bundle.jsのテスト）
npm run test:integration

# すべてのテストを実行
npm run test:all

# カバレッジ付きでテストを実行
npm run test:ci

# ビルドを実行（dist/GrepUtil.bundle.js を生成）
npm run build
```

#### 開発ワークフロー

1. `src/RegExpArray.js` または `src/BufferPatternMatcher.js` でコードを修正
2. `tests/unit/RegExpArray.spec.js` でユニットテストを追加・更新
3. `npm run test` でユニットテストを実行
4. `npm run build` でビルドを実行
5. `npm run test:integration` で統合テストを実行（バンドル後のAPIテスト）

## テスト構成

本プロジェクトでは、以下の3種類のテストを実装しています。

### ユニットテスト (Unit Tests)

- **場所**: `tests/unit/`
- **設定**: `jest.unit.config.js`
- **実行**: `npm run test`
- **対象**: TypeScriptソースコード（`src/*.ts`）を直接テスト
- **目的**: クラスの各メソッドの動作を個別に検証

```powershell
# ユニットテストのみ実行
npm run test

# カバレッジ付きで実行
npm run test:ci
```

### 統合テスト (Integration Tests)

- **場所**: `tests/integration/`
- **設定**: `jest.integration.config.js`
- **実行**: `npm run test:integration`
- **対象**: ビルド後の`dist/GrepUtil.bundle.js`（UMDバンドル）
- **目的**: パッケージングされた公開APIの動作を検証

```powershell
# 統合テストのみ実行
npm run test:integration
```

**統合テストの特徴**:
- バンドル後のJavaScriptファイルをrequireで読み込んでテスト
- 実際の利用者が使用する形式（UMD）での動作を保証
- RegExpArrayとBufferPatternMatcherの両方の公開APIをカバー
- エッジケース、異常系、ファイルシグネチャ判定などの実践的なケースを含む

### 全テスト実行

```powershell
# ユニットテスト → 統合テストの順で実行
npm run test:all
```

## 開発フロー

推奨される開発フローは以下の通りです：

1. `src/RegExpArray.ts` または `src/BufferPatternMatcher.ts` でコードを修正
2. `tests/unit/` 配下でユニットテストを追加・更新
3. `npm run test` でユニットテストを実行
4. `npm run build` でUMDバンドルをビルド
5. `npm run test:integration` で統合テストを実行
6. `npm run test:all` で全テストを実行して最終確認

## 技術的な詳細

### パターン指定の柔軟性

`RegExpArray`のコンストラクタは、以下の3つの形式を受け付けます：

```javascript
new RegExpArray([
  /pattern/g,              // 1. RegExpオブジェクト
  'string pattern',        // 2. 文字列（フラグなし）
  ['pattern', 'gi']        // 3. [パターン, フラグ]配列
]);
```

### ステートフルな動作

グローバルフラグ（`g`）を使用した正規表現は、`exec()`や`test()`呼び出し時にステートを保持します：

```javascript
const util = new RegExpArray([/test\d/g]);

util.exec('test1 test2'); // => ["test1"]
util.exec('test1 test2'); // => ["test2"]  （次のマッチに進む）
util.exec('test1 test2'); // => []        （マッチなし）
```

最後に使用された正規表現は`util.last`で参照可能です。

### null入力時の動作

`RegExpArray`の静的メソッドは、null入力に対して適切に処理します：

```javascript
RegExpArray.matchAll('test', null);    // => null
RegExpArray.firstMatch('test', null);  // => null
RegExpArray.test('test', null);        // => false
```

`BufferPatternMatcher.compareBuf()`もpatternsがnullの場合はnullを返します。

### UMDバンドル

Webpackで生成される`dist/GrepUtil.bundle.js`は、以下の環境で使用可能：

- **Node.js**: `require('@nojaja/greputil')`
- **ブラウザ（グローバル）**: `<script>`タグで読み込み後、グローバル変数として利用
- **AMD/RequireJS**: AMD形式で読み込み可能

## 現在のステータス

### 実装済み

- ✅ RegExpArrayコアAPIの実装完了（`constructor`, `exec`, `firstMatch`, `test`, `toArray`, 静的メソッド）
- ✅ BufferPatternMatcherの実装完了（`compareBuf`）
- ✅ ユニットテスト実装（カバレッジ: 主要機能）
- ✅ Webpackビルド設定完了（UMD出力）
- ✅ エラーハンドリング改善（throw使用）
- ✅ null入力時の適切な処理
- ✅ 静的メソッド`test()`の修正（firstMatch使用）
- ✅ ドキュメント整備（この README.md）

### 未実装・検討中

- ❌ TypeScript型定義ファイル（`.d.ts`）
- ❌ ESM形式での配布対応
- ❌ より詳細なエラーハンドリングとバリデーション
- ❌ パフォーマンス最適化（大量パターン処理時）

## パフォーマンス・目標

- **目標**: 100個以上の正規表現パターンを同時に扱える設計
- **現状**: 小〜中規模のパターン配列（10〜50個）での動作を想定した実装

## ライセンス & 作者

- **ライセンス**: MIT License
- **作者**: nojaja <free.riccia@gmail.com>
- **リポジトリ**: [https://github.com/nojaja/NodeGrepUtil](https://github.com/nojaja/NodeGrepUtil)
- **バージョン**: 1.0.0

## バグ報告・機能要望

問題や機能要望は [GitHub Issues](https://github.com/nojaja/NodeGrepUtil/issues) までお願いします。