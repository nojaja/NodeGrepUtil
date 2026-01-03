
export class BufferPatternMatcher {

    constructor() {
    }

    /**
     * Compares a buffer against an array of patterns.
     * @param {Buffer} buffer The buffer to compare.
     * @param {Array<Buffer>} patterns The array of buffer patterns to match against.
     * @returns {boolean|null} Returns true if a match is found, false if no match is found, or null if patterns is not provided.
     */
    compareBuf(buffer, patterns) {
        try {
            if (!patterns) return null;
            for (const pattern of patterns) {
                if (pattern.length <= buffer.length && pattern.compare(buffer.slice(0, pattern.length)) == 0) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            logger.error(`正規表現バッファ比較エラー: ${error.message}`);
            //エラーの例外を投げる
            throw error;
        }
    }
}
export default BufferPatternMatcher;