import { Model, View, Controller } from "./MVC";

describe("MVC", () => {
  describe("Model", () => {
    it("should set and get data", () => {
      const model = new Model();
      model.setData("test");
      expect(model.getData()).toBe("test");
    });

    it("should notify observers when data is updated", () => {
      const model = new Model();
      const observer = { update: jest.fn() };
      model.addObserver(observer);
      model.setData("test");
      expect(observer.update).toHaveBeenCalled();
    });

    it("should remove observer", () => {
      const model = new Model();
      const observer = { update: jest.fn() };
      model.addObserver(observer);
      model.removeObserver(observer);
      model.setData("test");
      expect(observer.update).not.toHaveBeenCalled();
    });
  });

  describe("View", () => {
    it("should update when model data is updated", () => {
      const model = new Model();
      new View(model);
      const spy = jest.spyOn(console, "log");
      model.setData("test");
      expect(spy).toHaveBeenCalledWith("View: test");
      spy.mockRestore();
    });
  });

  describe("Controller", () => {
    it("should update model data", () => {
      const model = new Model();
      const controller = new Controller(model);
      controller.updateData("test");
      expect(model.getData()).toBe("test");
    });
  });
});
