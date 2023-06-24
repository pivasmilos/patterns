import { setup, teardown } from "../TestUtils/testUtils";
import { TextField, WordList, ScrollableList, DictionaryEntryMediator } from "./DictionaryEntryMediator";

describe("DictionaryEntryMediator", () => {
  beforeEach(setup);
  afterEach(teardown);

  it("should display words in scrollable list when text field input changes", () => {
    const words = ["word1", "word2", "word3"];
    const wordLookup = { find: jest.fn().mockReturnValue(words) };
    const textField = new TextField();
    const wordList = new WordList(wordLookup);
    const scrollableList = new ScrollableList();

    new DictionaryEntryMediator(textField, wordList, scrollableList);
    textField.onKeyPress("w");

    expect(console.log).toHaveBeenCalledWith(words);
  });
});
