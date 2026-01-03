import { RegExpArray } from '../../src/RegExpArray';

describe('RegExpArray.test() issue reproduction', () => {
  /**
   * 基本的なケース: 単一パターンでの拡張子マッチング
   */
  it('should match file extension pattern: /\.log$/ against "test.log"', () => {
    const patterns = [/\.log$/];
    const filePath = 'test.log';
    
    const regexpArray = new RegExpArray(patterns);
    const result = regexpArray.test(filePath);
    
    // Expected: true
    expect(result).toBe(true);
  });

  /**
   * パス付きのケース: フルパスで拡張子パターンをテスト
   */
  it('should match file extension pattern against full path: /\.log$/ against "/mock/target/test.log"', () => {
    const patterns = [/\.log$/];
    const filePath = '/mock/target/test.log';
    
    const regexpArray = new RegExpArray(patterns);
    const result = regexpArray.test(filePath);
    
    // Expected: true
    expect(result).toBe(true);
  });

  /**
   * 複数パターンのケース: 複数の拡張子パターンに対してテスト
   */
  it('should match any of multiple patterns', () => {
    const patterns = [/\.log$/, /\.tmp$/];
    const testCases: Array<{ path: string; expected: boolean }> = [
      { path: 'test.log', expected: true },
      { path: 'test.tmp', expected: true },
      { path: 'test.js', expected: false },
      { path: '/path/to/test.log', expected: true },
      { path: '/path/to/readme.md', expected: false },
    ];
    
    const regexpArray = new RegExpArray(patterns);
    
    testCases.forEach(({ path, expected }) => {
      expect(regexpArray.test(path)).toBe(expected);
    });
  });

  /**
   * DirWalker実装時の問題シナリオ: ファイル除外フィルター
   * 
   * DirWalker では以下のようにフィルタリングしていた：
   * const excluded = excludeExt.some(pattern => pattern.test(filePath));
   * 
   * これを RegExpArray で実装する際に失敗した：
   * const excluded = new RegExpArray(excludeExt).test(filePath);
   */
  it('should filter files using RegExpArray as exclusion filter (DirWalker scenario)', () => {
    const excludeExt = [/\.log$/];
    const files = ['test.js', 'readme.md', 'test.log'];
    
    const regexpArray = new RegExpArray(excludeExt);
    const filtered = files.filter(file => !regexpArray.test(file));
    
    // Expected: ['test.js', 'readme.md']
    // Actual in buggy version: ['test.js', 'readme.md', 'test.log'] (すべて通過)
    expect(filtered).toEqual(['test.js', 'readme.md']);
    expect(filtered).not.toContain('test.log');
  });

  /**
   * 複数パターンでの除外フィルター: 複数の拡張子を除外
   */
  it('should filter files with multiple exclusion patterns', () => {
    const excludeExt = [/\.log$/, /\.tmp$/];
    const files = ['test.js', 'readme.md', 'test.log', 'temp.tmp', 'archive.zip'];
    
    const regexpArray = new RegExpArray(excludeExt);
    const filtered = files.filter(file => !regexpArray.test(file));
    
    // Expected: ['test.js', 'readme.md', 'archive.zip']
    expect(filtered).toEqual(['test.js', 'readme.md', 'archive.zip']);
    expect(filtered).not.toContain('test.log');
    expect(filtered).not.toContain('temp.tmp');
  });

  /**
   * 比較テスト: 直接 regex.test() と RegExpArray.test() の動作確認
   * 
   * この結果を並べることで、RegExpArray の偏差を明確にできる
   */
  it('should have same behavior as direct regex.test() iteration', () => {
    const patterns = [/\.log$/, /\.tmp$/, /\.bak$/];
    const testPaths = [
      'test.log',
      'readme.md',
      '/path/to/file.tmp',
      'backup.bak',
    ];

    // Direct regex.test() approach (expected correct behavior)
    const directMatches = testPaths.map(path => {
      return patterns.some(pattern => pattern.test(path));
    });

    // RegExpArray approach
    const regexpArray = new RegExpArray(patterns);
    const regexpArrayMatches = testPaths.map(path => {
      return regexpArray.test(path);
    });

    // Expected: both approaches should return same results
    expect(regexpArrayMatches).toEqual(directMatches);
  });

  /**
   * エッジケース: 空パターン、null、undefined の扱い
   */
  it('should handle edge cases gracefully', () => {
    const emptyPatterns: RegExp[] = [];
    const singlePath = 'test.log';

    const regexpArray = new RegExpArray(emptyPatterns);
    const result = regexpArray.test(singlePath);

    // Expected: false (no patterns to match)
    expect(result).toBe(false);
  });

  /**
   * ストレステスト: 大量のファイルパスに対する処理速度と精度
   */
  it('should process large file sets correctly', () => {
    const excludeExt = [/\.log$/, /\.tmp$/, /\.bak$/];
    const regexpArray = new RegExpArray(excludeExt);

    // 大量のファイルを生成
    const largeFileSet = Array.from({ length: 1000 }, (_, i) => {
      const extensions = ['js', 'ts', 'log', 'tmp', 'bak', 'md', 'json'];
      const ext = extensions[i % extensions.length];
      return `file_${i}.${ext}`;
    });

    const filtered = largeFileSet.filter(file => !regexpArray.test(file));
    const logFiles = filtered.filter(f => f.endsWith('.log'));
    const tmpFiles = filtered.filter(f => f.endsWith('.tmp'));
    const bakFiles = filtered.filter(f => f.endsWith('.bak'));

    // 除外パターンに該当するファイルが含まれていないことを確認
    expect(logFiles).toHaveLength(0);
    expect(tmpFiles).toHaveLength(0);
    expect(bakFiles).toHaveLength(0);
  });
});
