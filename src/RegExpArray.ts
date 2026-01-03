/**
 * 処理名: 正規表現配列クラス
 * 
 * 処理概要:
 * 複数の正規表現パターンを配列として管理し、文字列に対して順次適用するためのクラス。
 * 文字列、RegExpオブジェクト、[パターン, フラグ]配列の混在をサポートする。
 * 
 * 実装理由:
 * 標準のJavaScript正規表現APIでは単一パターンのみ扱えるため、
 * 複数パターンの一括処理を簡潔に記述できるユーティリティクラスが必要。
 * grepのような複数パターンマッチングを効率的に実装するため。
 */
export class RegExpArray {
    /**
     * 正規表現インスタンスのリスト
     */
    private regExpInstanceList: RegExp[];

    /**
     * ソースパターンとフラグのリスト
     */
    private sourceLiat: Array<[string, string]>;

    /**
     * 最後に実行された正規表現
     */
    public last: RegExp | null;

    /**
     * 処理名: RegExpArrayコンストラクタ
     *
     * 処理概要:
     * 複数の正規表現パターンからインスタンスを作成する。
     * 文字列、RegExpオブジェクト、[パターン, フラグ]配列の混在可能。
     *
     * 実装理由:
     * 柔軟なパターン指定を可能にし、様々な入力形式に対応するため。
     * 配列でない単一パターンも自動的に配列化して統一的に処理する。
     * @param patternList - 正規表現パターンのリスト（文字列、RegExp、[パターン, フラグ]の配列）
     * @returns RegExpArrayインスタンス
     */
    constructor(patternList?: RegExp | string | Array<string> | Array<RegExp | string | Array<string>>) {
        const _patternList = (!patternList) 
            ? [] 
            : (!Array.isArray(patternList)) 
                ? [patternList] 
                : patternList;
        
        this.regExpInstanceList = _patternList.map((pattern) => {
            if (pattern instanceof RegExp) {
                return pattern;
            } else if (Array.isArray(pattern)) {
                return new RegExp(pattern[0], pattern[1]);
            } else {
                return new RegExp(pattern);
            }
        });

        this.sourceLiat = this.regExpInstanceList.map((regExp) => 
            [regExp.source, regExp.flags]
        );
        this.last = null;
    }

    /**
     * 処理名: 順次マッチング実行
     *
     * 処理概要:
     * 各正規表現を順次実行し、すべてのマッチ結果を配列で返す。
     * グローバルフラグ使用時はステートフルに動作する。
     *
     * 実装理由:
     * 複数パターンのマッチ結果を一度に取得するため。
     * reduceを使用して効率的に結果を集約する。
     * @param string - マッチング対象の文字列
     * @returns マッチした文字列の配列
     */
    exec(string: string): string[] {
        return this.regExpInstanceList.reduce((previousValue, regexp) => {
            this.last = regexp;
            const result = regexp.exec(string);
            return (result) ? previousValue.concat([...result]) : previousValue;
        }, [] as string[]);
    }

    /**
     * 処理名: 最初のマッチ取得
     *
     * 処理概要:
     * 最初にマッチした正規表現の結果を返す。
     * マッチしない場合はnullを返す。
     *
     * 実装理由:
     * 全パターンをテストする必要がなく、最初のマッチで処理を終了できるため効率的。
     * testメソッドの内部実装としても使用される。
     * @param string - マッチング対象の文字列
     * @returns マッチ結果の配列、またはnull
     */
    firstMatch(string: string): RegExpExecArray | null {
        for (const regexp of this.regExpInstanceList) {
            this.last = regexp;
            const result = regexp.exec(string);
            if (result) return result;
        }
        return null;
    }

    /**
     * 処理名: マッチテスト
     *
     * 処理概要:
     * いずれかの正規表現がマッチすればtrueを返す。
     * グローバルフラグ使用時はステートフルに動作する。
     *
     * 実装理由:
     * 真偽値のみが必要な場合に、マッチ結果の詳細を取得するオーバーヘッドを避けるため。
     * firstMatchの結果を利用して効率的に判定する。
     * @param string - テスト対象の文字列
     * @returns マッチする場合true、しない場合false
     */
    test(string: string): boolean {
        return this.firstMatch(string) !== null;
    }

    /**
     * 処理名: RegExp配列取得
     *
     * 処理概要:
     * 内部で保持している正規表現オブジェクトの配列を返す。
     *
     * 実装理由:
     * インスタンス内部の正規表現を外部から参照・検査できるようにするため。
     * デバッグやテスト時に有用。
     * @returns 正規表現オブジェクトの配列
     */
    toArray(): RegExp[] {
        return this.regExpInstanceList;
    }

    /**
     * 処理名: 全マッチ結果取得（静的メソッド）
     *
     * 処理概要:
     * 複数の正規表現パターンに対するすべてのマッチ結果を二次元配列で返す。
     * regexpsがnullの場合はnullを返す。
     *
     * 実装理由:
     * インスタンスを作成せずに一時的なマッチング処理を実行できるようにするため。
     * String.prototype.matchAllを活用して効率的にマッチングを行う。
     * @param string - マッチング対象の文字列
     * @param regexps - 正規表現パターン（単一または配列）、nullの場合はnullを返す
     * @returns マッチ結果の二次元配列、またはnull
     * @throws エラーが発生した場合は例外を投げる
     */
    static matchAll(string: string, regexps: RegExp | string | Array<RegExp | string> | null): Array<Array<string>> | null {
        if (regexps === null) return null;
        const _regexps = (!Array.isArray(regexps)) ? [regexps] : regexps;
        return _regexps.reduce((previousValue, regexp) => {
            const matches = Array.from(string.matchAll(regexp instanceof RegExp ? regexp : new RegExp(regexp, 'g')));
            return previousValue.concat(matches.map(m => Array.from(m)));
        }, [] as Array<Array<string>>);
    }

    /**
     * 処理名: 最初のマッチ取得（静的メソッド）
     *
     * 処理概要:
     * 複数の正規表現パターンから最初にマッチした結果を返す。
     * regexpsがnullの場合はnullを返す。
     *
     * 実装理由:
     * インスタンスを作成せずに一時的なマッチング処理を実行できるようにするため。
     * 最初のマッチで処理を終了するため効率的。
     * @param string - マッチング対象の文字列
     * @param regexps - 正規表現パターン（単一または配列）、nullの場合はnullを返す
     * @returns マッチ結果の配列、またはnull
     * @throws エラーが発生した場合は例外を投げる
     */
    static firstMatch(string: string, regexps: RegExp | string | Array<RegExp | string> | null): RegExpExecArray | null {
        if (regexps === null) return null;
        const _regexps = (!Array.isArray(regexps)) ? [regexps] : regexps;
        for (const regexp of _regexps) {
            const _regexp = regexp instanceof RegExp ? regexp : new RegExp(regexp);
            const result = _regexp.exec(string);
            if (result) return result;
        }
        return null;
    }

    /**
     * 処理名: マッチテスト（静的メソッド）
     *
     * 処理概要:
     * 複数の正規表現パターンのいずれかがマッチするか判定する。
     * 内部でfirstMatchを使用して効率的に判定。
     *
     * 実装理由:
     * インスタンスを作成せずに真偽値判定を行えるようにするため。
     * firstMatchの結果を利用して簡潔に実装。
     * @param string - テスト対象の文字列
     * @param regexps - 正規表現パターン（単一または配列）
     * @returns マッチする場合true、しない場合false
     */
    static test(string: string, regexps: RegExp | string | Array<RegExp | string> | null): boolean {
        return RegExpArray.firstMatch(string, regexps) !== null;
    }
}

export default RegExpArray;
