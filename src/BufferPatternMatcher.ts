/**
 * 処理名: バッファパターンマッチャークラス
 * 処理概要:
 * バイナリデータ（Buffer）に対して複数のパターンマッチングを行うクラス。
 * 複数のBufferパターンと比較し、いずれかがマッチするか判定する。
 * 実装理由:
 * ファイルシグネチャ判定やバイナリデータの識別など、
 * バイナリレベルでのパターンマッチングが必要なユースケースに対応するため。
 * 正規表現では扱えないバイト列の比較を実現する。
 */
export class BufferPatternMatcher {
    /**
     * 処理名: BufferPatternMatcherコンストラクタ
     * 処理概要:
     * BufferPatternMatcherのインスタンスを作成する。
     * 現在は状態を持たないシンプルな実装。
     * 実装理由:
     * 将来的な拡張性を考慮してクラスとして実装。
     * 状態管理やキャッシュ機能を追加する可能性がある。
     * @returns BufferPatternMatcherインスタンス
     */
    constructor() {
        // 現在は状態を持たない
    }

    /**
     * 処理名: バッファパターン比較
     * 処理概要:
     * バッファを複数のパターンと比較する。
     * いずれかのパターンがマッチすればtrue、マッチしなければfalse、
     * patternsがnullの場合はnullを返す。
     * 実装理由:
     * バイナリファイルの種類判定（PNG、JPEG等のシグネチャチェック）や、
     * バイト列パターンの検出に使用するため。
     * Buffer.compareを使用して効率的なバイト列比較を実現する。
     * @param buffer - 比較対象のバッファ
     * @param patterns - マッチング対象のバッファパターンの配列
     * @returns マッチした場合true、マッチしない場合false、patternsがnullの場合null
     * @throws エラーが発生した場合は例外を投げる
     */
    compareBuf(buffer: Buffer, patterns: Array<Buffer> | null): boolean | null {
        try {
            if (!patterns) return null;
            
            for (const pattern of patterns) {
                if (pattern.length <= buffer.length && 
                    pattern.compare(buffer.slice(0, pattern.length)) === 0) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            if (error instanceof Error) {
                console.error(`正規表現バッファ比較エラー: ${error.message}`);
            }
            throw error;
        }
    }
}

export default BufferPatternMatcher;
