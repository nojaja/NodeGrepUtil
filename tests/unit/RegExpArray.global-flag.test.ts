import { RegExpArray } from '../../src/RegExpArray';

describe('RegExpArray.test() with global flag issues', () => {
  /**
   * グローバルフラグ付き正規表現の問題
   * 
   * JavaScript の正規表現では、グローバルフラグ（'g'）がある場合、
   * exec() や test() の呼び出しごとに lastIndex が進んでしまう（ステートフル）。
   * これにより、同じパターンを複数回テストする際に予期しない動作が発生する。
   */
  it('should handle global flag patterns correctly (first call)', () => {
    const patterns = [/\.log$/g]; // グローバルフラグ付き
    const filePath = 'test.log';
    
    const regexpArray = new RegExpArray(patterns);
    const result1 = regexpArray.test(filePath);
    
    // 最初のテストはマッチするはず
    expect(result1).toBe(true);
  });

  it('should handle global flag patterns correctly (second call with same instance)', () => {
    const patterns = [/\.log$/g]; // グローバルフラグ付き
    const filePath = 'test.log';
    
    const regexpArray = new RegExpArray(patterns);
    const result1 = regexpArray.test(filePath);
    const result2 = regexpArray.test(filePath); // 同じインスタンスで2回目
    
    // 2回目の呼び出しでマッチしなくなる可能性（グローバルフラグの副作用）
    console.log('First call:', result1, 'Second call:', result2);
    expect(result1).toBe(true);
    expect(result2).toBe(true); // これが失敗する可能性あり
  });

  it('should handle global flag patterns with multiple file filtering', () => {
    const excludeExt = [/\.log$/g]; // グローバルフラグ付き
    const files = ['test.js', 'readme.md', 'test.log', 'app.log', 'script.js'];
    
    const regexpArray = new RegExpArray(excludeExt);
    
    // filter内で複数回test()が呼ばれるため、グローバルフラグの副作用が累積
    const filtered = files.filter(file => {
      const testResult = regexpArray.test(file);
      console.log(`Testing ${file}: ${testResult}`);
      return !testResult;
    });
    
    // 期待: log ファイルがすべて除外される
    // 実際: グローバルフラグの副作用で後続のマッチが失敗する可能性
    expect(filtered).toEqual(['test.js', 'readme.md', 'script.js']);
    expect(filtered).not.toContain('test.log');
    expect(filtered).not.toContain('app.log');
  });

  it('should demonstrate lastIndex behavior with global flag', () => {
    const pattern = /\.log$/g;
    
    console.log('Initial lastIndex:', pattern.lastIndex);
    
    const result1 = pattern.test('test.log');
    console.log('After first test():', result1, 'lastIndex:', pattern.lastIndex);
    
    const result2 = pattern.test('test.log');
    console.log('After second test():', result2, 'lastIndex:', pattern.lastIndex);
    
    const result3 = pattern.test('test.log');
    console.log('After third test():', result3, 'lastIndex:', pattern.lastIndex);
    
    // グローバルフラグがある場合、test() は 0 と pattern.length の間で交互に
    // true/false を返す可能性がある
  });

  it('should compare with direct pattern.test() behavior (global flag)', () => {
    const pattern = /\.log$/g;
    const filePath = 'test.log';
    
    // Direct test()
    const directResult1 = pattern.test(filePath);
    const directResult2 = pattern.test(filePath);
    
    // グローバルフラグのため異なる結果が返される
    console.log('Direct pattern.test() results:', directResult1, directResult2);
    
    // Reset for RegExpArray
    pattern.lastIndex = 0;
    
    const regexpArray = new RegExpArray([pattern]);
    const arrayResult1 = regexpArray.test(filePath);
    const arrayResult2 = regexpArray.test(filePath);
    
    console.log('RegExpArray.test() results:', arrayResult1, arrayResult2);
  });

  /**
   * より実践的なテスト: キャッシュ効果と状態管理
   */
  it('should correctly handle repeated test calls in real-world scenario', () => {
    // グローバルフラグなしが推奨（修正案）
    const excludePatterns = [/\.log$/, /\.tmp$/];
    
    const regexpArray = new RegExpArray(excludePatterns);
    
    const files = ['app.js', 'debug.log', 'temp.tmp', 'readme.md', 'backup.log'];
    const excluded: string[] = [];
    const included: string[] = [];
    
    files.forEach(file => {
      if (regexpArray.test(file)) {
        excluded.push(file);
      } else {
        included.push(file);
      }
    });
    
    expect(excluded).toEqual(['debug.log', 'temp.tmp', 'backup.log']);
    expect(included).toEqual(['app.js', 'readme.md']);
  });
});
