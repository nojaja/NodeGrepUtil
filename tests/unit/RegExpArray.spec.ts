import { RegExpArray } from '../../src/RegExpArray';
import { BufferPatternMatcher } from '../../src/BufferPatternMatcher';

describe('RegExpArray', () => {
  describe('constructor', () => {
    it('文字列配列から正規表現を生成できること', () => {
      const regExpArray = new RegExpArray(['test.']);
      expect(regExpArray.toArray()[0].source).toBe('test.');
      expect(regExpArray.toArray()[0].flags).toBe('');
    });

    it('RegExpオブジェクト配列から正規表現を生成できること', () => {
      const regExpArray = new RegExpArray([/t(e)(st(\d?))/g]);
      expect(regExpArray.toArray()[0].source).toBe('t(e)(st(\\d?))');
      expect(regExpArray.toArray()[0].flags).toBe('g');
    });

    it('文字列から正規表現を生成できること', () => {
      const regExpArray = new RegExpArray(['t(e)(st(\\d?))']);
      expect(regExpArray.toArray()[0].source).toBe('t(e)(st(\\d?))');
      expect(regExpArray.toArray()[0].flags).toBe('');
    });

    it('[パターン, フラグ]配列から正規表現を生成できること', () => {
      const regExpArray = new RegExpArray([['t(e)(st(\\d?))', 'g']]);
      expect(regExpArray.toArray()[0].source).toBe('t(e)(st(\\d?))');
      expect(regExpArray.toArray()[0].flags).toBe('g');
    });

    it('空の配列でインスタンス化できること', () => {
      const regExpArray = new RegExpArray([]);
      expect(regExpArray.toArray()).toEqual([]);
    });

    it('パターンなしでインスタンス化できること', () => {
      const regExpArray = new RegExpArray();
      expect(regExpArray.toArray()).toEqual([]);
    });
  });

  describe('exec', () => {
    it('グローバルフラグ付き正規表現で順次マッチできること', () => {
      const regExpArray = new RegExpArray([/t(e)(st(\d?))/g]);
      expect(regExpArray.exec('test1test2')).toEqual(['test1', 'e', 'st1', '1']);
      expect(regExpArray.exec('test1test2')).toEqual(['test2', 'e', 'st2', '2']);
      expect(regExpArray.exec('test1test2')).toEqual([]);
    });

    it('複数パターンのマッチ結果を返すこと', () => {
      const regExpArray = new RegExpArray([/hello/, /world/]);
      const result = regExpArray.exec('hello world');
      expect(result).toContain('hello');
      expect(result).toContain('world');
    });

    it('マッチしない場合は空配列を返すこと', () => {
      const regExpArray = new RegExpArray([/xyz/]);
      expect(regExpArray.exec('abc')).toEqual([]);
    });
  });

  describe('firstMatch', () => {
    it('最初のマッチ結果を返すこと', () => {
      const regExpArray = new RegExpArray([/test\d/, /hello/]);
      const result = regExpArray.firstMatch('test1 hello');
      expect(result).not.toBeNull();
      expect(result![0]).toBe('test1');
    });

    it('マッチしない場合はnullを返すこと', () => {
      const regExpArray = new RegExpArray([/xyz/]);
      expect(regExpArray.firstMatch('abc')).toBeNull();
    });
  });

  describe('test', () => {
    it('グローバルフラグ付き正規表現でマッチ判定できること', () => {
      const regExpArray = new RegExpArray([/t(e)(st(\d?))/g]);
      expect(regExpArray.test('test1test2')).toBe(true);
      expect(regExpArray.test('test1test2')).toBe(true);
      expect(regExpArray.test('test1test2')).toBe(false);
    });

    it('マッチする場合trueを返すこと', () => {
      const regExpArray = new RegExpArray([/hello/]);
      expect(regExpArray.test('hello world')).toBe(true);
    });

    it('マッチしない場合falseを返すこと', () => {
      const regExpArray = new RegExpArray([/xyz/]);
      expect(regExpArray.test('abc')).toBe(false);
    });
  });

  describe('toArray', () => {
    it('RegExpオブジェクトの配列を返すこと', () => {
      const regExpArray = new RegExpArray([/test/, /hello/]);
      const result = regExpArray.toArray();
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(RegExp);
      expect(result[1]).toBeInstanceOf(RegExp);
    });
  });

  describe('matchAll (static)', () => {
    it('すべてのマッチ結果を二次元配列で返すこと', () => {
      const result = RegExpArray.matchAll('test1test2', [/t(e)(st(\d?))/g]);
      expect(result).toEqual([['test1', 'e', 'st1', '1'], ['test2', 'e', 'st2', '2']]);
    });

    it('文字列パターンでマッチできること', () => {
      const result = RegExpArray.matchAll('test1test2', 'test.');
      expect(result).toHaveLength(2);
      expect(result![0][0]).toMatch(/test\d/);
    });

    it('マッチしない場合は空配列を返すこと', () => {
      const result = RegExpArray.matchAll('test1test2', 'string');
      expect(result).toEqual([]);
    });

    it('nullを渡した場合はnullを返すこと', () => {
      const result = RegExpArray.matchAll('test', null);
      expect(result).toBeNull();
    });
  });

  describe('firstMatch (static)', () => {
    it('最初のマッチ結果を返すこと', () => {
      const result = RegExpArray.firstMatch('test1 hello', [/test\d/, /hello/]);
      expect(result).not.toBeNull();
      expect(result![0]).toBe('test1');
    });

    it('マッチしない場合はnullを返すこと', () => {
      const result = RegExpArray.firstMatch('abc', [/xyz/]);
      expect(result).toBeNull();
    });

    it('nullを渡した場合はnullを返すこと', () => {
      const result = RegExpArray.firstMatch('test', null);
      expect(result).toBeNull();
    });
  });

  describe('test (static)', () => {
    it('マッチする場合trueを返すこと', () => {
      expect(RegExpArray.test('hello world', [/hello/])).toBe(true);
    });

    it('マッチしない場合falseを返すこと', () => {
      expect(RegExpArray.test('abc', [/xyz/])).toBe(false);
    });

    it('nullを渡した場合falseを返すこと', () => {
      expect(RegExpArray.test('test', null)).toBe(false);
    });
  });
});

describe('BufferPatternMatcher', () => {
  describe('compareBuf', () => {
    it('パターンにマッチする場合trueを返すこと', () => {
      const matcher = new BufferPatternMatcher();
      const buffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A]);
      const patterns = [Buffer.from([0x89, 0x50, 0x4E, 0x47])]; // PNGシグネチャ
      
      expect(matcher.compareBuf(buffer, patterns)).toBe(true);
    });

    it('パターンにマッチしない場合falseを返すこと', () => {
      const matcher = new BufferPatternMatcher();
      const buffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]);
      const patterns = [Buffer.from([0x89, 0x50, 0x4E, 0x47])]; // PNGシグネチャ
      
      expect(matcher.compareBuf(buffer, patterns)).toBe(false);
    });

    it('複数パターンの1つにマッチする場合trueを返すこと', () => {
      const matcher = new BufferPatternMatcher();
      const buffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]);
      const patterns = [
        Buffer.from([0x89, 0x50, 0x4E, 0x47]), // PNGシグネチャ
        Buffer.from([0xFF, 0xD8, 0xFF])        // JPEGシグネチャ
      ];
      
      expect(matcher.compareBuf(buffer, patterns)).toBe(true);
    });

    it('patternsがnullの場合nullを返すこと', () => {
      const matcher = new BufferPatternMatcher();
      const buffer = Buffer.from([0x89, 0x50, 0x4E, 0x47]);
      
      expect(matcher.compareBuf(buffer, null)).toBeNull();
    });

    it('バッファがパターンより短い場合falseを返すこと', () => {
      const matcher = new BufferPatternMatcher();
      const buffer = Buffer.from([0x89, 0x50]);
      const patterns = [Buffer.from([0x89, 0x50, 0x4E, 0x47])];
      
      expect(matcher.compareBuf(buffer, patterns)).toBe(false);
    });
  });
});
