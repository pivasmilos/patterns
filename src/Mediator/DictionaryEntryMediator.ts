export class DictionaryApplication {
  constructor(
    private readonly textField: TextField,
    private readonly wordList: WordList,
    private readonly scrollableList: ScrollableList
  ) {}

  public run(): void {
    new DictionaryEntryMediator(this.textField, this.wordList, this.scrollableList);
  }
}

export class DictionaryEntryMediator {
  constructor(private textField: TextField, private wordList: WordList, private scrollableList: ScrollableList) {
    this.textField = textField;
    this.wordList = wordList;
    this.scrollableList = scrollableList;

    this.textField.addListener((input) => {
      const words = this.wordList.lookup(input);
      this.scrollableList.display(words);
    });
  }
}

export class TextField {
  private listeners: ((input: string) => void)[] = [];

  public addListener(listener: (input: string) => void): void {
    this.listeners.push(listener);
  }

  public onKeyPress(input: string): void {
    this.listeners.forEach((listener) => listener(input));
  }
}

export interface EfficientWordLookupDataStructure {
  find(input: string): string[];
}

export class WordList {
  constructor(private readonly wordLookup: EfficientWordLookupDataStructure) {}

  public lookup(input: string): string[] {
    return this.wordLookup.find(input);
  }
}

export class ScrollableList {
  public display(words: string[]): void {
    console.log(words);
  }
}
