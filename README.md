# NodeGrepUtil

複数の正規表現パターンを効率的に扱うためのJavaScriptユーティリティライブラリです。文字列に対して複数の正規表現を一度に適用し、マッチング結果を取得できます。

## プロジェクト概要

NodeGrepUtilは、複数の正規表現パターンを配列として管理し、それらを文字列に対して順次適用するための`RegExpUtil`クラスを提供します。標準のJavaScript正規表現APIを拡張し、複数パターンの一括処理を簡潔に記述できます。

## プロジェクト構造

```
NodeGrepUtil/
├── src/
│   ├── index.js         # ライブラリエントリポイント（RegExpUtilのエクスポート）
│   └── RegExpUtil.js    # RegExpUtilクラスの実装
├── tests/
│   └── unit/
│       └── matchAll.spec.js  # ユニットテスト
├── dist/                # ビルド出力ディレクトリ（webpack）
├── jest.config.js       # Jestテスト設定
├── webpack.config.js    # Webpackビルド設定（UMD形式）
├── package.json         # プロジェクトメタデータと依存関係
├── LICENSE              # MITライセンス
└── README.md            # プロジェクトドキュメント
```

## 技術スタック

- **言語**: JavaScript (ES6+)
- **ビルドツール**: Webpack 5
- **テストフレームワーク**: Jest 29
- **トランスパイラ**: Babel (Jest用)
- **出力形式**: UMD (Universal Module Definition)

## 機能

### 完了している機能

- ✅ 複数の正規表現パターンを配列で管理
- ✅ 正規表現の文字列表記、配列表記、RegExpオブジェクトの混在をサポート
- ✅ `exec()` - 複数パターンでの順次マッチング実行
- ✅ `test()` - 複数パターンでのテスト（いずれかがマッチすればtrue）
- ✅ `matchAll()` - 静的メソッドによる全マッチ結果の取得
- ✅ UMDバンドルによるNode.js/ブラウザ両対応

### 実験的・未完成の機能

- ⚠️ `RegExpUtil.test()` 静的メソッドは実装されていますが、`matchAll()`と同じ動作になっており、テストが不足しています

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

| メソッド/関数 | パラメータ | 戻り値 | 説明 |
|--------------|-----------|--------|------|
| `new RegExpUtil(patternList)` | `patternList: string[] \| RegExp[] \| Array<[string, string]>` | `RegExpUtil` | 複数の正規表現パターンからインスタンスを作成。文字列、RegExpオブジェクト、[パターン, フラグ]配列の混在可 |
| `exec(string)` | `string: string` | `Array<string>` | 各正規表現を順次実行し、すべてのマッチ結果を配列で返す（グローバルフラグ使用時はステートフル） |
| `test(string)` | `string: string` | `boolean` | いずれかの正規表現がマッチすればtrue（グローバルフラグ使用時はステートフル） |
| `RegExpUtil.matchAll(string, regexps)` | `string: string`, `regexps: string \| RegExp \| Array` | `Array<Array<string>>` | 静的メソッド。すべてのマッチ結果を二次元配列で返す |

#### 基本的な使用例

```javascript
import { RegExpUtil } from '@nojaja/greputil';

// 1. インスタンス作成 - 複数のパターンを配列で指定
const util = new RegExpUtil([
  /test\d/g,              // RegExpオブジェクト
  'hello',                // 文字列
  ['world', 'i']          // [パターン, フラグ]配列
]);

// 2. exec() - 順次マッチング実行
const result1 = util.exec('test1 hello test2');
// => ["test1", "hello"]

// 3. test() - いずれかがマッチするか判定
const result2 = util.test('test1 hello');
// => true

// 4. 静的メソッド matchAll() - すべてのマッチを取得
const matches = RegExpUtil.matchAll('test1test2', [/t(e)(st(\d?))/g]);
// => [["test1","e","st1","1"], ["test2","e","st2","2"]]
```

#### 実用例 - ログファイルの解析

```javascript
import { RegExpUtil } from '@nojaja/greputil';

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

const matches = RegExpUtil.matchAll(logText, patterns);
console.log(matches);
// => [
//   ["2026-01-01 ERROR: Database connection failed"],
//   ["2026-01-01 WARN: Slow query detected"],
//   ["2026-01-02 ERROR: Timeout occurred"]
// ]
```

#### エラーハンドリング

```javascript
import { RegExpUtil } from '@nojaja/greputil';

try {
  // 不正なパターンでもエラーは内部でキャッチされる
  const matches = RegExpUtil.matchAll('test', [/[/]); // 不正な正規表現
  // => コンソールにエラーログ出力、undefinedを返す
} catch (error) {
  console.error('予期しないエラー', error);
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

# テストを実行
npm run test

# ビルドを実行（dist/GrepUtil.bundle.js を生成）
npm run build
```

#### 開発ワークフロー

1. `src/RegExpUtil.js` でコードを修正
2. `tests/unit/matchAll.spec.js` でテストを追加・更新
3. `npm run test` でテスト実行
4. `npm run build` でUMDバンドルをビルド
5. コミット＆プッシュ

## 技術的な詳細

### パターン指定の柔軟性

`RegExpUtil`のコンストラクタは、以下の3つの形式を受け付けます：

```javascript
new RegExpUtil([
  /pattern/g,              // 1. RegExpオブジェクト
  'string pattern',        // 2. 文字列（フラグなし）
  ['pattern', 'gi']        // 3. [パターン, フラグ]配列
]);
```

### ステートフルな動作

グローバルフラグ（`g`）を使用した正規表現は、`exec()`や`test()`呼び出し時にステートを保持します：

```javascript
const util = new RegExpUtil([/test\d/g]);

util.exec('test1 test2'); // => ["test1"]
util.exec('test1 test2'); // => ["test2"]  （次のマッチに進む）
util.exec('test1 test2'); // => []        （マッチなし）
```

最後に使用された正規表現は`util.last`で参照可能です。

### UMDバンドル

Webpackで生成される`dist/GrepUtil.bundle.js`は、以下の環境で使用可能：

- **Node.js**: `require('@nojaja/greputil')`
- **ブラウザ（グローバル）**: `<script>`タグで読み込み後、グローバル変数として利用
- **AMD/RequireJS**: AMD形式で読み込み可能

## 現在のステータス

### 実装済み

- ✅ コアAPIの実装完了（`constructor`, `exec`, `test`, `matchAll`）
- ✅ ユニットテスト実装（カバレッジ: 主要機能）
- ✅ Webpackビルド設定完了（UMD出力）

### 進行中・実験的

- ⚠️ `RegExpUtil.test()` 静的メソッドの動作が`matchAll()`と重複（要修正）
- 📝 ドキュメント整備（この README.md を含む）

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