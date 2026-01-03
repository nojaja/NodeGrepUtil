import {RegExpArray} from '../../src'
test('new', () => {
  expect(new RegExpArray(['test.']).sourceLiat).toEqual([["test.",""]])
  expect(new RegExpArray([/t(e)(st(\d?))/g]).sourceLiat).toEqual([["t(e)(st(\\d?))","g"]])
  expect(new RegExpArray(["t(e)(st(\\d?))"]).sourceLiat).toEqual([["t(e)(st(\\d?))",""]])
  expect(new RegExpArray([["t(e)(st(\\d?))","g"]]).sourceLiat).toEqual([["t(e)(st(\\d?))","g"]])
});

test('exec', () => {
  const regExpUtil = new RegExpArray([/t(e)(st(\d?))/g])
  expect(regExpUtil.exec("test1test2")).toEqual(["test1","e","st1","1"])
  expect(regExpUtil.exec("test1test2")).toEqual(["test2","e","st2","2"])
  expect(regExpUtil.exec("test1test2")).toEqual([])
});
test('test', () => {
  const regExpUtil = new RegExpArray([/t(e)(st(\d?))/g])
  expect(regExpUtil.test("test1test2")).toEqual(true)
  expect(regExpUtil.test("test1test2")).toEqual(true)
  expect(regExpUtil.test("test1test2")).toEqual(false)
});

test('matchAll', () => {
  expect(JSON.stringify(RegExpArray.matchAll('test1test2',  [/t(e)(st(\d?))/g]))).toEqual(JSON.stringify([["test1","e","st1","1"],["test2","e","st2","2"]]))
  expect(JSON.stringify(RegExpArray.matchAll('test1test2',  'test.'))).toEqual(JSON.stringify([["test1"],["test2"]]))
  expect(JSON.stringify(RegExpArray.matchAll('test1test2',  'string'))).toEqual(JSON.stringify([]))

});
