interface TextEditor {
  setText(text: string): void;
  getText(): string;
}

interface TextEditorMementoProvider {
  getMemento(): TextEditorMemento;
  setMemento(memento: TextEditorMemento): void;
}

interface Undoable {
  undo(): void;
}

// Notice that Memento provides no *public* API for getting or setting state
export class TextEditorMemento {
  private stateMetadata: string;

  protected constructor(state: string) {
    this.stateMetadata = this.getMetadataFromState(state);
  }

  private getMetadataFromState(state: string) {
    // This is trivial for demo purposes, but it would be a complex operation.
    return state;
  }

  protected reconstructState(memento: TextEditorMemento): string {
    // This is trivial for demo purposes, but it would be a complex operation.
    return memento.stateMetadata;
  }
}

export class TextEditorWithMemento extends TextEditorMemento implements TextEditor, TextEditorMementoProvider {
  private state = "";

  public constructor(text = "") {
    // doesn't do anything, but it's required to call the parent constructor
    super(text);
    this.setText(text);
  }

  public setText(text: string): void {
    this.state = text;
  }

  public getText(): string {
    return this.state;
  }

  public getMemento(): TextEditorMemento {
    return new TextEditorMemento(this.state);
  }

  public setMemento(memento: TextEditorMemento): void {
    this.state = this.reconstructState(memento);
  }
}

// Notice that TextEditorWithUndo knows nothing about what's inside the memento.
// TextEditorWithMemento can hold a lot of complex state but TextEditorWithUndo knows only the public stuff.
export class TextEditorWithUndo implements TextEditor, Undoable {
  private history: TextEditorMemento[] = [];

  constructor(private editor: TextEditorWithMemento) {}

  public setText(text: string): void {
    this.rememberCurrentState();
    this.editor.setText(text);
  }

  private rememberCurrentState() {
    this.history.push(this.editor.getMemento());
  }

  public getText(): string {
    return this.editor.getText();
  }

  public undo(): void {
    const memento = this.history.pop();

    if (!memento) {
      return;
    }

    this.editor.setMemento(memento);
  }
}
