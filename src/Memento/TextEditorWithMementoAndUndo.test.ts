import { TextEditorWithMemento, TextEditorWithUndo } from "./TextEditorWithMementoAndUndo";

describe("Memento", () => {
  describe("TextEditorWithMemento", () => {
    let editor: TextEditorWithMemento;

    beforeEach(() => {
      editor = new TextEditorWithMemento();
    });

    it("should set and get text", () => {
      editor.setText("Hello, world!");
      expect(editor.getText()).toBe("Hello, world!");
    });

    it("should create and set memento", () => {
      editor.setText("Hello, world!");
      const memento = editor.getMemento();
      editor.setText("Goodbye, world!");
      editor.setMemento(memento);
      expect(editor.getText()).toBe("Hello, world!");
    });
  });

  describe("TextEditorWithUndo", () => {
    let editor: TextEditorWithUndo;

    beforeEach(() => {
      editor = new TextEditorWithUndo(new TextEditorWithMemento());
    });

    it("should add and undo actions on TextEditor", () => {
      editor.setText("Hello, world!");
      editor.setText("Goodbye, world!");
      editor.setText("Hello again, world!");

      expect(editor.getText()).toBe("Hello again, world!");

      editor.undo();
      expect(editor.getText()).toBe("Goodbye, world!");

      editor.undo();
      expect(editor.getText()).toBe("Hello, world!");

      editor.undo();
      expect(editor.getText()).toBe("");
    });
  });
});
