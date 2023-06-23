import { Model, View, Controller } from "./MVC";

describe("MVC", () => {
  let model: Model;
  let view: View;
  let controller: Controller;

  beforeEach(() => {
    model = new Model();
    view = new View(model);
    controller = new Controller(model, view);
  });

  test("Model sets and gets data correctly", () => {
    const data = "test data";
    model.setData(data);
    const result = model.getData();
    expect(result).toBe(data);
  });

  test("View renders data correctly", () => {
    const data = "test data";
    model.setData(data);
    const spy = jest.spyOn(console, "log");
    view.render();
    expect(spy).toHaveBeenCalledWith(`View: ${data}`);
    spy.mockRestore();
  });

  test("Controller updates data and renders view correctly", () => {
    const data = "test data";
    const spy = jest.spyOn(console, "log");
    controller.updateData(data);
    expect(model.getData()).toBe(data);
    expect(spy).toHaveBeenCalledWith(`View: ${data}`);
    spy.mockRestore();
  });
});
