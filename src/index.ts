/**
 * 処理名: ライブラリエントリポイント
 * 
 * 処理概要:
 * NodeGrepUtilライブラリの公開APIをエクスポートする。
 * RegExpArrayとBufferPatternMatcherクラスを提供。
 * 
 * 実装理由:
 * ライブラリ利用者が必要なクラスを簡単にインポートできるようにするため。
 * 単一のエントリポイントから全機能にアクセス可能にする。
 */
import { RegExpArray } from './RegExpArray';
import { BufferPatternMatcher } from './BufferPatternMatcher';

export { RegExpArray, BufferPatternMatcher };
