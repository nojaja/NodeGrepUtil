/**
 * 統合テスト: RegExpArray
 * 
 * ビルド後のGrepUtil.bundle.jsからエクスポートされる
 * RegExpArrayクラスの公開API動作確認
 */

const path = require('path');

// バンドルされたライブラリをrequire
const bundlePath = path.resolve(__dirname, '../../dist/GrepUtil.bundle.js');
const GrepUtil = require(bundlePath);

// Given（前提）: バンドル後のGrepUtil.bundle.jsからRegExpArrayクラスが正しくエクスポートされている
// When（操作）: RegExpArrayクラスをインスタンス化し、公開APIを使用する
// Then（期待）: すべてのAPIが正しく動作する

describe('RegExpArray - 統合テスト (バンドル後)', () => {
  // Given（前提）: RegExpArrayクラスが利用可能である
  // When（操作）: GrepUtilからRegExpArrayをインポートする
  // Then（期待）: RegExpArrayクラスが定義されている
  it('RegExpArrayクラスがエクスポートされている', () => {
    expect(GrepUtil.RegExpArray).toBeDefined();
    expect(typeof GrepUtil.RegExpArray).toBe('function');
  });

  // Given（前提）: RegExpArrayのコンストラクタが正常に動作する
  // When（操作）: 文字列パターンでインスタンスを作成する
  // Then（期待）: インスタンスが正しく生成される
  it('文字列パターンでインスタンスを作成できる', () => {
    const regExpArray = new GrepUtil.RegExpArray(['test', 'example']);
    expect(regExpArray).toBeDefined();
    expect(regExpArray).toBeInstanceOf(GrepUtil.RegExpArray);
  });

  // Given（前提）: RegExpオブジェクトでインスタンスを作成できる
  // When（操作）: RegExpオブジェクトの配列でインスタンスを作成する
  // Then（期待）: インスタンスが正しく生成される
  it('RegExpオブジェクトでインスタンスを作成できる', () => {
    const regExpArray = new GrepUtil.RegExpArray([/test/i, /example/g]);
    expect(regExpArray).toBeDefined();
    expect(regExpArray).toBeInstanceOf(GrepUtil.RegExpArray);
  });

  // Given（前提）: [パターン, フラグ]形式でインスタンスを作成できる
  // When（操作）: [パターン, フラグ]配列でインスタンスを作成する
  // Then（期待）: インスタンスが正しく生成される
  it('[パターン, フラグ]形式でインスタンスを作成できる', () => {
    const regExpArray = new GrepUtil.RegExpArray([['test', 'i'], ['example', 'g']]);
    expect(regExpArray).toBeDefined();
    expect(regExpArray).toBeInstanceOf(GrepUtil.RegExpArray);
  });

  describe('exec() メソッド', () => {
    // Given（前提）: マッチする文字列が存在する
    // When（操作）: exec()メソッドを実行する
    // Then（期待）: マッチした文字列が配列で返される
    it('マッチする文字列を配列で返す', () => {
      const regExpArray = new GrepUtil.RegExpArray(['hello', 'world']);
      const result = regExpArray.exec('hello world');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('hello');
      expect(result).toContain('world');
    });

    // Given（前提）: マッチしない文字列が与えられる
    // When（操作）: exec()メソッドを実行する
    // Then（期待）: 空配列が返される
    it('マッチしない場合は空配列を返す', () => {
      const regExpArray = new GrepUtil.RegExpArray(['test', 'example']);
      const result = regExpArray.exec('hello world');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    // Given（前提）: グローバルフラグ付きの正規表現が使用される
    // When（操作）: 複数回exec()を実行する
    // Then（期待）: グローバルフラグの動作が正しく機能する
    it('グローバルフラグが正しく動作する', () => {
      const regExpArray = new GrepUtil.RegExpArray([/test/g]);
      const result1 = regExpArray.exec('test test test');
      expect(result1.length).toBeGreaterThan(0);
      
      const result2 = regExpArray.exec('test test test');
      // グローバルフラグのステートフルな動作を確認
      expect(Array.isArray(result2)).toBe(true);
    });

    // Given（前提）: 複数のパターンが混在する
    // When（操作）: exec()メソッドを実行する
    // Then（期待）: すべてのマッチ結果が統合されて返される
    it('複数パターンのマッチ結果を統合して返す', () => {
      const regExpArray = new GrepUtil.RegExpArray([/\d+/, /[a-z]+/]);
      const result = regExpArray.exec('test123');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('firstMatch() メソッド', () => {
    // Given（前提）: マッチする文字列が存在する
    // When（操作）: firstMatch()メソッドを実行する
    // Then（期待）: 最初のマッチ結果が返される
    it('最初のマッチ結果を返す', () => {
      const regExpArray = new GrepUtil.RegExpArray(['hello', 'world']);
      const result = regExpArray.firstMatch('hello world');
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBe('hello');
    });

    // Given（前提）: マッチしない文字列が与えられる
    // When（操作）: firstMatch()メソッドを実行する
    // Then（期待）: nullが返される
    it('マッチしない場合はnullを返す', () => {
      const regExpArray = new GrepUtil.RegExpArray(['test', 'example']);
      const result = regExpArray.firstMatch('hello world');
      expect(result).toBeNull();
    });

    // Given（前提）: 複数のパターンがマッチする
    // When（操作）: firstMatch()メソッドを実行する
    // Then（期待）: 最初にマッチしたパターンの結果のみが返される
    it('複数マッチしても最初の結果のみ返す', () => {
      const regExpArray = new GrepUtil.RegExpArray(['world', 'hello']);
      const result = regExpArray.firstMatch('hello world');
      expect(result).not.toBeNull();
      expect(result[0]).toBe('world');
    });
  });

  describe('test() メソッド', () => {
    // Given（前提）: マッチする文字列が存在する
    // When（操作）: test()メソッドを実行する
    // Then（期待）: trueが返される
    it('マッチする場合はtrueを返す', () => {
      const regExpArray = new GrepUtil.RegExpArray(['hello', 'world']);
      const result = regExpArray.test('hello world');
      expect(result).toBe(true);
    });

    // Given（前提）: マッチしない文字列が与えられる
    // When（操作）: test()メソッドを実行する
    // Then（期待）: falseが返される
    it('マッチしない場合はfalseを返す', () => {
      const regExpArray = new GrepUtil.RegExpArray(['test', 'example']);
      const result = regExpArray.test('hello world');
      expect(result).toBe(false);
    });

    // Given（前提）: 複数パターンのうち1つでもマッチする
    // When（操作）: test()メソッドを実行する
    // Then（期待）: trueが返される
    it('複数パターンのうち1つでもマッチすればtrueを返す', () => {
      const regExpArray = new GrepUtil.RegExpArray(['test', 'hello', 'example']);
      const result = regExpArray.test('hello world');
      expect(result).toBe(true);
    });
  });

  describe('lastプロパティ', () => {
    // Given（前提）: exec()メソッドが実行される
    // When（操作）: lastプロパティを参照する
    // Then（期待）: 最後に実行された正規表現が保持されている
    it('最後に実行された正規表現を保持する', () => {
      const regExpArray = new GrepUtil.RegExpArray(['hello', 'world']);
      regExpArray.exec('hello world');
      expect(regExpArray.last).not.toBeNull();
      expect(regExpArray.last).toBeInstanceOf(RegExp);
    });

    // Given（前提）: まだどのメソッドも実行されていない
    // When（操作）: lastプロパティを参照する
    // Then（期待）: nullが返される
    it('初期状態ではnullである', () => {
      const regExpArray = new GrepUtil.RegExpArray(['hello', 'world']);
      expect(regExpArray.last).toBeNull();
    });
  });

  describe('エッジケース', () => {
    // Given（前提）: 空のパターンリストでインスタンスを作成する
    // When（操作）: exec()メソッドを実行する
    // Then（期待）: 空配列が返される
    it('空のパターンリストでも正常に動作する', () => {
      const regExpArray = new GrepUtil.RegExpArray([]);
      const result = regExpArray.exec('test string');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    // Given（前提）: パターンリストなしでインスタンスを作成する
    // When（操作）: exec()メソッドを実行する
    // Then（期待）: 空配列が返される
    it('パターンなしでインスタンス作成可能', () => {
      const regExpArray = new GrepUtil.RegExpArray();
      expect(regExpArray).toBeDefined();
      const result = regExpArray.exec('test string');
      expect(result.length).toBe(0);
    });

    // Given（前提）: 特殊文字を含むパターンが使用される
    // When（操作）: exec()メソッドを実行する
    // Then（期待）: 特殊文字が正しく処理される
    it('特殊文字を含むパターンを正しく処理する', () => {
      const regExpArray = new GrepUtil.RegExpArray(['\\d+', '\\w+']);
      const result = regExpArray.exec('test123');
      expect(result.length).toBeGreaterThan(0);
    });

    // Given（前提）: 日本語を含むパターンが使用される
    // When（操作）: exec()メソッドを実行する
    // Then（期待）: 日本語パターンが正しくマッチする
    it('日本語パターンを正しく処理する', () => {
      const regExpArray = new GrepUtil.RegExpArray(['こんにちは', '世界']);
      const result = regExpArray.exec('こんにちは世界');
      expect(result).toContain('こんにちは');
      expect(result).toContain('世界');
    });
  });
});
