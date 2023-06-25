import { compressWhiteSpace } from "./utilities";

describe("CompressWhiteSpace", () => {
  test("emptyString", () => {
    expect(compressWhiteSpace("")).toEqual("");
  });

  test("NoWhiteSpace", () => {
    expect(compressWhiteSpace("stringwithnowhitespace")).toEqual("stringwithnowhitespace");
  });

  test("oneSpace", () => {
    expect(compressWhiteSpace("one space")).toEqual("one space");
  });

  test("manyWordsWithSingleSpaces", () => {
    expect(compressWhiteSpace("many words with single spaces")).toEqual("many words with single spaces");
  });

  test("oneTab", () => {
    expect(compressWhiteSpace("one\ttab")).toEqual("one tab");
  });

  test("twoTabs", () => {
    expect(compressWhiteSpace("two\t\ttabs")).toEqual("two tabs");
  });

  test("oneReturn", () => {
    expect(compressWhiteSpace("one\nreturn")).toEqual("one\nreturn");
  });

  test("returnsAndSpaces", () => {
    expect(compressWhiteSpace("word \n word")).toEqual("word\nword");
  });

  test("startingWhitespace", () => {
    expect(compressWhiteSpace("\n  this")).toEqual("\nthis");
  });

  test("acceptanceTest", () => {
    expect(compressWhiteSpace("this  is\n\na\t\t  string     \n     \twith\n\nmany\n\n\n\t  whitespaces")).toEqual(
      "this is\na string\nwith\nmany\nwhitespaces"
    );
  });
});
