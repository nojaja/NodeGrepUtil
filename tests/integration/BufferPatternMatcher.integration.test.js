/**
 * 統合テスト: BufferPatternMatcher
 * 
 * ビルド後のGrepUtil.bundle.jsからエクスポートされる
 * BufferPatternMatcherクラスの公開API動作確認
 */

const path = require('path');

// バンドルされたライブラリをrequire
const bundlePath = path.resolve(__dirname, '../../dist/GrepUtil.bundle.js');
const GrepUtil = require(bundlePath);

// Given（前提）: バンドル後のGrepUtil.bundle.jsからBufferPatternMatcherクラスが正しくエクスポートされている
// When（操作）: BufferPatternMatcherクラスをインスタンス化し、公開APIを使用する
// Then（期待）: すべてのAPIが正しく動作する

describe('BufferPatternMatcher - 統合テスト (バンドル後)', () => {
  // Given（前提）: BufferPatternMatcherクラスが利用可能である
  // When（操作）: GrepUtilからBufferPatternMatcherをインポートする
  // Then（期待）: BufferPatternMatcherクラスが定義されている
  it('BufferPatternMatcherクラスがエクスポートされている', () => {
    expect(GrepUtil.BufferPatternMatcher).toBeDefined();
    expect(typeof GrepUtil.BufferPatternMatcher).toBe('function');
  });

  // Given（前提）: BufferPatternMatcherのコンストラクタが正常に動作する
  // When（操作）: インスタンスを作成する
  // Then（期待）: インスタンスが正しく生成される
  it('インスタンスを作成できる', () => {
    const matcher = new GrepUtil.BufferPatternMatcher();
    expect(matcher).toBeDefined();
    expect(matcher).toBeInstanceOf(GrepUtil.BufferPatternMatcher);
  });

  describe('compareBuf() メソッド', () => {
    let matcher;

    beforeEach(() => {
      matcher = new GrepUtil.BufferPatternMatcher();
    });

    // Given（前提）: マッチするバッファパターンが存在する
    // When（操作）: compareBuf()メソッドを実行する
    // Then（期待）: trueが返される
    it('マッチするパターンが存在する場合trueを返す', () => {
      const buffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
      const patterns = [
        Buffer.from([0x89, 0x50, 0x4E, 0x47]) // PNGシグネチャ
      ];
      
      const result = matcher.compareBuf(buffer, patterns);
      expect(result).toBe(true);
    });

    // Given（前提）: マッチしないバッファパターンが与えられる
    // When（操作）: compareBuf()メソッドを実行する
    // Then（期待）: falseが返される
    it('マッチしないパターンの場合falseを返す', () => {
      const buffer = Buffer.from([0x89, 0x50, 0x4E, 0x47]);
      const patterns = [
        Buffer.from([0xFF, 0xD8, 0xFF]) // JPEGシグネチャ
      ];
      
      const result = matcher.compareBuf(buffer, patterns);
      expect(result).toBe(false);
    });

    // Given（前提）: 複数のパターンが与えられ、いずれか1つがマッチする
    // When（操作）: compareBuf()メソッドを実行する
    // Then（期待）: trueが返される
    it('複数パターンのうち1つでもマッチすればtrueを返す', () => {
      const buffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]);
      const patterns = [
        Buffer.from([0x89, 0x50, 0x4E, 0x47]), // PNG
        Buffer.from([0xFF, 0xD8, 0xFF]),        // JPEG
        Buffer.from([0x47, 0x49, 0x46])         // GIF
      ];
      
      const result = matcher.compareBuf(buffer, patterns);
      expect(result).toBe(true);
    });

    // Given（前提）: patternsがnullの場合
    // When（操作）: compareBuf()メソッドを実行する
    // Then（期待）: nullが返される
    it('patternsがnullの場合nullを返す', () => {
      const buffer = Buffer.from([0x89, 0x50, 0x4E, 0x47]);
      const result = matcher.compareBuf(buffer, null);
      expect(result).toBeNull();
    });

    // Given（前提）: パターンがバッファより長い場合
    // When（操作）: compareBuf()メソッドを実行する
    // Then（期待）: falseが返される
    it('パターンがバッファより長い場合falseを返す', () => {
      const buffer = Buffer.from([0x89, 0x50]);
      const patterns = [
        Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A])
      ];
      
      const result = matcher.compareBuf(buffer, patterns);
      expect(result).toBe(false);
    });

    // Given（前提）: バッファの先頭部分のみがマッチする
    // When（操作）: compareBuf()メソッドを実行する
    // Then（期待）: trueが返される（先頭マッチのみで判定）
    it('バッファの先頭部分がマッチすればtrueを返す', () => {
      const buffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x00, 0x00, 0x00, 0x00]);
      const patterns = [
        Buffer.from([0x89, 0x50, 0x4E, 0x47]) // 先頭4バイトのみ
      ];
      
      const result = matcher.compareBuf(buffer, patterns);
      expect(result).toBe(true);
    });

    // Given（前提）: 空のバッファが与えられる
    // When（操作）: compareBuf()メソッドを実行する
    // Then（期待）: falseが返される
    it('空のバッファの場合falseを返す', () => {
      const buffer = Buffer.from([]);
      const patterns = [
        Buffer.from([0x89, 0x50])
      ];
      
      const result = matcher.compareBuf(buffer, patterns);
      expect(result).toBe(false);
    });

    // Given（前提）: 空のパターン配列が与えられる
    // When（操作）: compareBuf()メソッドを実行する
    // Then（期待）: falseが返される
    it('空のパターン配列の場合falseを返す', () => {
      const buffer = Buffer.from([0x89, 0x50, 0x4E, 0x47]);
      const patterns = [];
      
      const result = matcher.compareBuf(buffer, patterns);
      expect(result).toBe(false);
    });
  });

  describe('ファイルシグネチャの実践例', () => {
    let matcher;

    beforeEach(() => {
      matcher = new GrepUtil.BufferPatternMatcher();
    });

    // Given（前提）: PNGファイルのシグネチャが与えられる
    // When（操作）: compareBuf()で判定する
    // Then（期待）: PNGとして正しく認識される
    it('PNGファイルシグネチャを正しく判定する', () => {
      const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
      const patterns = [Buffer.from([0x89, 0x50, 0x4E, 0x47])];
      
      expect(matcher.compareBuf(pngSignature, patterns)).toBe(true);
    });

    // Given（前提）: JPEGファイルのシグネチャが与えられる
    // When（操作）: compareBuf()で判定する
    // Then（期待）: JPEGとして正しく認識される
    it('JPEGファイルシグネチャを正しく判定する', () => {
      const jpegSignature = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]);
      const patterns = [Buffer.from([0xFF, 0xD8, 0xFF])];
      
      expect(matcher.compareBuf(jpegSignature, patterns)).toBe(true);
    });

    // Given（前提）: GIFファイルのシグネチャが与えられる
    // When（操作）: compareBuf()で判定する
    // Then（期待）: GIFとして正しく認識される
    it('GIFファイルシグネチャを正しく判定する', () => {
      const gifSignature = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
      const patterns = [Buffer.from([0x47, 0x49, 0x46])];
      
      expect(matcher.compareBuf(gifSignature, patterns)).toBe(true);
    });

    // Given（前提）: PDFファイルのシグネチャが与えられる
    // When（操作）: compareBuf()で判定する
    // Then（期待）: PDFとして正しく認識される
    it('PDFファイルシグネチャを正しく判定する', () => {
      const pdfSignature = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2D]);
      const patterns = [Buffer.from([0x25, 0x50, 0x44, 0x46])]; // %PDF
      
      expect(matcher.compareBuf(pdfSignature, patterns)).toBe(true);
    });

    // Given（前提）: 複数の画像形式のシグネチャが登録されている
    // When（操作）: PNGファイルで判定する
    // Then（期待）: 正しくPNGとして認識される
    it('複数の画像形式から正しい形式を判定する', () => {
      const pngBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
      const imagePatterns = [
        Buffer.from([0xFF, 0xD8, 0xFF]),        // JPEG
        Buffer.from([0x89, 0x50, 0x4E, 0x47]),  // PNG
        Buffer.from([0x47, 0x49, 0x46]),        // GIF
        Buffer.from([0x42, 0x4D])               // BMP
      ];
      
      expect(matcher.compareBuf(pngBuffer, imagePatterns)).toBe(true);
    });

    // Given（前提）: 未知のファイル形式のバッファが与えられる
    // When（操作）: 既知の画像形式パターンで判定する
    // Then（期待）: falseが返される
    it('未知のファイル形式はfalseを返す', () => {
      const unknownBuffer = Buffer.from([0x00, 0x00, 0x00, 0x00]);
      const imagePatterns = [
        Buffer.from([0xFF, 0xD8, 0xFF]),        // JPEG
        Buffer.from([0x89, 0x50, 0x4E, 0x47]),  // PNG
        Buffer.from([0x47, 0x49, 0x46])         // GIF
      ];
      
      expect(matcher.compareBuf(unknownBuffer, imagePatterns)).toBe(false);
    });
  });

  describe('エッジケースとエラーハンドリング', () => {
    let matcher;

    beforeEach(() => {
      matcher = new GrepUtil.BufferPatternMatcher();
    });

    // Given（前提）: 完全一致するバッファとパターンが与えられる
    // When（操作）: compareBuf()メソッドを実行する
    // Then（期待）: trueが返される
    it('完全一致するバッファとパターンでtrueを返す', () => {
      const buffer = Buffer.from([0x01, 0x02, 0x03]);
      const patterns = [Buffer.from([0x01, 0x02, 0x03])];
      
      expect(matcher.compareBuf(buffer, patterns)).toBe(true);
    });

    // Given（前提）: 1バイトのバッファとパターンが与えられる
    // When（操作）: compareBuf()メソッドを実行する
    // Then（期待）: 正しく比較される
    it('1バイトのバッファとパターンを正しく比較する', () => {
      const buffer = Buffer.from([0xFF]);
      const patterns = [Buffer.from([0xFF])];
      
      expect(matcher.compareBuf(buffer, patterns)).toBe(true);
    });

    // Given（前提）: バイト値が0のパターンが含まれる
    // When（操作）: compareBuf()メソッドを実行する
    // Then（期待）: 0を含むパターンも正しく処理される
    it('バイト値0を含むパターンを正しく処理する', () => {
      const buffer = Buffer.from([0x00, 0x01, 0x02]);
      const patterns = [Buffer.from([0x00, 0x01])];
      
      expect(matcher.compareBuf(buffer, patterns)).toBe(true);
    });
  });
});
