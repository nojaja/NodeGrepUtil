export class RegExpArray {

    /**
     * Constructs a RegExpArray instance.
     * The RegExpArray constructor creates a regular expression object list for matching text with a pattern.
     * 複数の正規表現パターンからインスタンスを作成。文字列、RegExpオブジェクト、[パターン, フラグ]配列の混在可
     * 
     * For an introduction to regular expressions, read the Regular Expressions chapter in the JavaScript Guide.
     * @param {Array<RegExp|string|Array<string>>|RegExp|string|Array<string>} patternList Array of regular expression text
     * @returns {RegExpArray} A new RegExpArray object instance
     */
    constructor(patternList) {
        const _patternList = (!patternList) ? [] : (!Array.isArray(patternList)) ? [patternList] : patternList
        this.regExpInstanceList = _patternList.map((pattern) => (pattern instanceof RegExp) ? pattern : (Array.isArray(pattern)) ? new RegExp(pattern[0], pattern[1]) : new RegExp(pattern))
        this.sourceLiat = this.regExpInstanceList.map((regExp) => [regExp.source, regExp.flags])
        this.last=null
    }

    /**
     * The exec() method executes a search for a match in a specified string. Returns a result array, or null.
     * 各正規表現を順次実行し、すべてのマッチ結果を配列で返す（グローバルフラグ使用時はステートフル）
     * @param {string} string
     * @returns {Array<string>}
     */
    exec(string) {
        return this.regExpInstanceList.reduce((previousValue, regexp) => {
            this.last = regexp
            const result = regexp.exec(string)
            return (result)? previousValue.concat([...result]): previousValue
        }, [])
    }

    /**
     * firstMatch
     * 最初にマッチした結果を返す
     * @param {*} string
     * @returns {regExp}
     */
    firstMatch(string) {
        for (const regexp of this.regExpInstanceList) {
            this.last = regexp
            const result = regexp.exec(string)
            if (result) return result
        }  
        return null
    }

    /**
     * Tests for a match in a string. Returns true or false.
     * The test() method executes a search for a match between a regular expression and a specified string. Returns true or false.
     * いずれかの正規表現がマッチすればtrue（グローバルフラグ使用時はステートフル）
     * 
     * @param {*} string 
     * @returns {boolean}
     */
    test(string) {
        return (this.firstMatch(string)) ? true : false
    }

    /**
     * toArray() は RegExpArray インスタンスのメソッドで、は正規表現の配列を返します。
     * @return {Array<RegExp>} 正規表現の配列
     */
    toArray() {
        return this.regExpInstanceList
    }

    /**
     * The matchAll() method returns an iterator of all results matching a string against a regular expression, including capturing groups.
     * 静的メソッド。すべてのマッチ結果を二次元配列で返す
     * @param {*} string 
     * @param {*} regexps 
     * @returns 
     */
    static matchAll(string, regexps) {
        try {
            if (regexps === null) return null
            const _regexps = (!Array.isArray(regexps)) ? [regexps] : regexps
            const result = _regexps.reduce((previousValue, regexp) => {
                return previousValue.concat([...string.matchAll(regexp)])
            }, [])
            return result
        } catch (error) {
            //エラーの例外を投げる
            throw error
        }
    }

    /**
     * firstMatch
     * firstMatchは静的メソッドで最初にマッチした結果を返す
     * @param {*} string
     * @param {*} regexps regexpsがnullの場合はnullを返す
     * @returns {regExp}
     */
    static firstMatch(string, regexps) {
        try {
            if (regexps === null) return null
            const _regexps = (!Array.isArray(regexps)) ? [regexps] : regexps
            for (const regexp of _regexps) {
                const result = regexp.exec(string)
                if (result) return result
            }
            return null
        } catch (error) {
            //エラーの例外を投げる
            throw error
        }
    }

    /**
     * The test() method executes a search for a match between a regular expression and a specified string. Returns true or false.
     * 
     * @param {*} string 
     * @param {*} regexps 
     * @returns 
     */
    static test(string, regexps) {
        return (RegExpArray.firstMatch(string, regexps)) ? true : false
    }

}
export default RegExpArray