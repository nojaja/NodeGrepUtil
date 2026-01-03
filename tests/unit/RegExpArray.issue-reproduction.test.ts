import { RegExpArray } from '../../src/RegExpArray';

describe('RegExpArray.test() - Issue Reproduction', () => {
  /**
   * TC-001: 基本的なケース - 単一パターンでの拡張子マッチング
   * 
   * 現象: /\.log$/ パターンが 'test.log' にマッチしない
   * 期待値: true
   * 実際値: false
   */
  test('TC-001: Should match simple file extension .log', () => {
    const patterns = [/\.log$/];
    const filePath = 'test.log';
    
    const regexpArray = new RegExpArray(patterns);
    const result = regexpArray.test(filePath);
    
    // Expected behavior: true (matches .log extension)
    expect(result).toBe(true);
  });

  /**
   * TC-002: フルパスでの拡張子パターンマッチング
   * 
   * 現象: /\.log$/ パターンが '/mock/target/test.log' にマッチしない
   * 期待値: true
   * 実際値: false
   */
  test('TC-002: Should match file extension in full path', () => {
    const patterns = [/\.log$/];
    const filePath = '/mock/target/test.log';
    
    const regexpArray = new RegExpArray(patterns);
    const result = regexpArray.test(filePath);
    
    // Expected behavior: true
    expect(result).toBe(true);
  });

  /**
   * TC-003: 複数パターンでのマッチング（OR logic）
   * 
   * 現象: 複数パターンのいずれかに一致すべきだが、マッチしない
   * 期待値: 各ケースで指定の結果
   * 実際値: すべて false
   */
  test('TC-003: Should match any of multiple patterns', () => {
    const patterns = [/\.log$/, /\.tmp$/];
    
    const testCases: Array<{ path: string; expected: boolean }> = [
      { path: 'test.log', expected: true },
      { path: 'test.tmp', expected: true },
      { path: 'test.js', expected: false },
      { path: '/path/to/file.log', expected: true },
      { path: '/path/to/readme.md', expected: false },
    ];
    
    const regexpArray = new RegExpArray(patterns);
    
    testCases.forEach(({ path, expected }) => {
      const result = regexpArray.test(path);
      expect(result).toBe(expected);
    });
  });

  /**
   * TC-004: DirWalker実装時のシナリオ - ファイル除外フィルター
   * 
   * 現象: excludeExt パターンを RegExpArray で実装すると、
   *      除外されるべきファイルが通過してしまう
   * 期待値: ['test.js', 'readme.md']
   * 実際値: ['test.js', 'readme.md', 'test.log'] (すべてのファイルが通過)
   */
  test('TC-004: Should filter files using RegExpArray exclusion', () => {
    const excludeExt = [/\.log$/];
    const files = ['test.js', 'readme.md', 'test.log'];
    
    const regexpArray = new RegExpArray(excludeExt);
    const filtered = files.filter(file => !regexpArray.test(file));
    
    expect(filtered).toEqual(['test.js', 'readme.md']);
    expect(filtered).not.toContain('test.log');
  });

  /**
   * TC-005: 複数パターンでの除外フィルター
   * 
   * 現象: 複数の拡張子パターンで除外フィルターを実装すると失敗
   * 期待値: ['test.js', 'readme.md', 'archive.zip']
   * 実際値: すべてのファイル
   */
  test('TC-005: Should filter with multiple exclusion patterns', () => {
    const excludeExt = [/\.log$/, /\.tmp$/];
    const files = ['test.js', 'readme.md', 'test.log', 'temp.tmp', 'archive.zip'];
    
    const regexpArray = new RegExpArray(excludeExt);
    const filtered = files.filter(file => !regexpArray.test(file));
    
    expect(filtered).toEqual(['test.js', 'readme.md', 'archive.zip']);
    expect(filtered).not.toContain('test.log');
    expect(filtered).not.toContain('temp.tmp');
  });

  /**
   * TC-006: 直接 regex.test() との動作比較
   * 
   * 現象: RegExpArray.test() と直接 regex.test() の結果が異なる
   * 期待値: 両者の結果が同じ
   * 実際値: RegExpArray.test() がすべて false を返す
   */
  test('TC-006: RegExpArray.test() should match direct regex.test() behavior', () => {
    const patterns = [/\.log$/, /\.tmp$/, /\.bak$/];
    const testPaths = [
      'test.log',
      'readme.md',
      '/path/to/file.tmp',
      'backup.bak',
    ];

    // Direct regex approach (expected correct behavior)
    const directMatches = testPaths.map(path =>
      patterns.some(pattern => pattern.test(path))
    );

    // RegExpArray approach
    const regexpArray = new RegExpArray(patterns);
    const regexpArrayMatches = testPaths.map(path =>
      regexpArray.test(path)
    );

    // Both should produce identical results
    expect(regexpArrayMatches).toEqual(directMatches);
  });

  /**
   * TC-007: エッジケース - 空パターン配列
   * 
   * 現象: 空パターン配列での動作
   * 期待値: false (マッチするパターンなし)
   * 実際値: true または エラー
   */
  test('TC-007: Should handle empty patterns gracefully', () => {
    const emptyPatterns: RegExp[] = [];
    const filePath = 'test.log';

    const regexpArray = new RegExpArray(emptyPatterns);
    const result = regexpArray.test(filePath);

    // Expected: false (no patterns to match against)
    expect(result).toBe(false);
  });

  /**
   * TC-008: 大量データセットでの処理精度
   * 
   * 現象: 大量のファイルに対するフィルタリングで不正確な結果
   * 期待値: 除外パターンに該当するファイルが0個
   * 実際値: 除外パターンに該当するファイルが含まれている
   */
  test('TC-008: Should correctly filter large file sets', () => {
    const excludeExt = [/\.log$/, /\.tmp$/, /\.bak$/];
    const regexpArray = new RegExpArray(excludeExt);

    // Generate large file set
    const largeFileSet = Array.from({ length: 1000 }, (_, i) => {
      const extensions = ['js', 'ts', 'log', 'tmp', 'bak', 'md', 'json'];
      const ext = extensions[i % extensions.length];
      return `file_${i}.${ext}`;
    });

    const filtered = largeFileSet.filter(file => !regexpArray.test(file));
    const logFiles = filtered.filter(f => f.endsWith('.log'));
    const tmpFiles = filtered.filter(f => f.endsWith('.tmp'));
    const bakFiles = filtered.filter(f => f.endsWith('.bak'));

    // Verify excluded patterns are not in filtered result
    expect(logFiles).toHaveLength(0);
    expect(tmpFiles).toHaveLength(0);
    expect(bakFiles).toHaveLength(0);
  });

  /**
   * TC-009: グローバルフラグを持つパターン
   * 
   * 現象: グローバルフラグ付きのパターンでlastIndexが影響する可能性
   * 期待値: true
   * 実際値: false（2回目以降）
   */
  test('TC-009: Should handle patterns with global flag correctly', () => {
    const patterns = [/\.log$/g];  // Note: global flag
    const filePath = 'test.log';

    const regexpArray = new RegExpArray(patterns);
    const result1 = regexpArray.test(filePath);
    const result2 = regexpArray.test(filePath);  // Should also be true

    expect(result1).toBe(true);
    expect(result2).toBe(true);  // May fail if lastIndex is not reset
  });

  /**
   * TC-010: 複雑なパターンでのマッチング
   * 
   * 現象: より複雑な正規表現パターンでの動作確認
   * 期待値: パターンに一致するファイルのみマッチ
   * 実際値: すべて false
   */
  test('TC-010: Should match complex regex patterns', () => {
    const patterns = [
      /\.(log|tmp)$/,      // .log or .tmp
      /^test_.*\.js$/,     // test_*.js
      /\.backup\.\d+$/,    // .backup.123
    ];

    const testCases: Array<{ path: string; expected: boolean }> = [
      { path: 'app.log', expected: true },
      { path: 'cache.tmp', expected: true },
      { path: 'test_runner.js', expected: true },
      { path: 'app.backup.2024', expected: true },
      { path: 'readme.md', expected: false },
      { path: 'main.js', expected: false },
    ];

    const regexpArray = new RegExpArray(patterns);

    testCases.forEach(({ path, expected }) => {
      const result = regexpArray.test(path);
      expect(result).toBe(expected);
    });
  });
});
