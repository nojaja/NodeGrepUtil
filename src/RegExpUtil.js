export class RegExpUtil {

    /**
     * The RegExpUtil constructor creates a regular expression object list for matching text with a pattern.
     * 
     * For an introduction to regular expressions, read the Regular Expressions chapter in the JavaScript Guide.
     * @param {string[]} patternList Array of regular expression text
     */
    constructor(patternList) {
        const _patternList = (!patternList) ? [] : (!Array.isArray(patternList)) ? [patternList] : patternList
        this.regExpInstanceList = _patternList.map((pattern) => (pattern instanceof RegExp) ? pattern : (Array.isArray(pattern)) ? new RegExp(pattern[0], pattern[1]) : new RegExp(pattern))
        this.sourceLiat = this.regExpInstanceList.map((regExp) => [regExp.source, regExp.flags])
        this.last=null
    }
    /**
     * The exec() method executes a search for a match in a specified string and returns a result array, or empty array.
     * @param {string} string 
     * @returns 
     */
    exec(string) {
        return this.regExpInstanceList.reduce((previousValue, regexp) => {
            this.last = regexp
            const result = regexp.exec(string)
            return (result)? previousValue.concat([...result]): previousValue
        }, [])
    }
    /**
     * The test() method executes a search for a match between a regular expression and a specified string. Returns true or false.
     * @param {string} string 
     * @returns 
     */
    test(string) {
        for (const regexp of this.regExpInstanceList) {
            this.last = regexp
            if(regexp.test(string))return true
        }
        return false
    }
    static matchAll(string, regexps) {
        try {
            const _regexps = (!regexps) ? [""] : (!Array.isArray(regexps)) ? [regexps] : regexps
            const result = _regexps.reduce((previousValue, regexp) => {
                return previousValue.concat([...string.matchAll(regexp)])
            }, [])
            return result
        } catch (error) {
            console.log(error)
        }
    }

    static test(string, regexps) {
        try {
            const _regexps = (!regexps) ? [""] : (!Array.isArray(regexps)) ? [regexps] : regexps
            const result = _regexps.reduce((previousValue, regexp) => {
                return previousValue.concat([...string.matchAll(regexp)])
            }, [])
            return result
        } catch (error) {
            console.log(error)
        }
    }

}
export default RegExpUtil