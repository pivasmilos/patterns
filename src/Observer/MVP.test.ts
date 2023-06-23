import { Model, View, Presenter } from "./MVP";

describe("MVP", () => {
  describe("Model", () => {
    it("should set and get data", () => {
      const model = new Model<string>();
      model.setData("test");
      expect(model.getData()).toBe("test");
    });

    it("should return true when data is updated", () => {
      const model = new Model<string>();
      const hasChanged = model.setData("test");
      expect(hasChanged).toBe(true);
    });

    it("should return false when data is not updated", () => {
      const model = new Model<string>();
      model.setData("test");
      const hasChanged = model.setData("test");
      expect(hasChanged).toBe(false);
    });
  });

  describe("View", () => {
    it("is a passive interface", () => {
      const inputElement = { toString: jest.fn() };
      const outputElement = { fromString: jest.fn() };
      const view = new View(inputElement, outputElement);
      view.getInputValue();
      view.setOutputValue("test");
      expect(inputElement.toString).toHaveBeenCalled();
      expect(outputElement.fromString).toHaveBeenCalledWith("test");
    });
  });

  describe("Presenter", () => {
    it("should update model and view when input element changes", () => {
      const model = new Model<string>();
      const view = new View({ toString: jest.fn().mockReturnValue("test") }, { fromString: jest.fn() });
      const presenter = new Presenter(model, view);
      const spy = jest.spyOn(view, "setOutputValue");
      presenter.handleInputChange();
      expect(spy).toHaveBeenCalledWith("test");
      spy.mockRestore();
    });

    it("should not update model and view when input element does not change", () => {
      const model = new Model<string>();
      const view = new View({ toString: jest.fn().mockReturnValue("test") }, { fromString: jest.fn() });
      const presenter = new Presenter(model, view);
      const spy = jest.spyOn(view, "setOutputValue");
      presenter.handleInputChange();
      presenter.handleInputChange();
      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });
  });
});
