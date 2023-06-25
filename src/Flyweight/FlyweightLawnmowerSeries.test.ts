import { FlyweightLawnmowerSeries, Lawnmower, LawnmowerStore } from "./FlyweightLawnmowerSeries";

describe("Flyweight", () => {
  describe("LawnmowerStore", () => {
    let store: LawnmowerStore;

    beforeEach(() => {
      store = new LawnmowerStore();
    });

    it("should set and get a lawnmower", () => {
      store.setLawnmower("123", "456", "Model X", "ACME", 50, 1000, "base64image");
      const lawnmower = store.getLawnmower("123", "456");

      expect(lawnmower).toBeDefined();
      expect(lawnmower?.serialNumber).toBe("123");
      expect(lawnmower?.manufacturer).toBe("ACME");
      expect(lawnmower?.model).toBe("Model X");
      expect(lawnmower?.weight).toBe(50);
      expect(lawnmower?.price).toBe(1000);
      expect(lawnmower?.picture).toBe("base64image");
    });

    it("should not get a lawnmower with an invalid serial number", () => {
      store.setLawnmower("123", "456", "Model X", "ACME", 50, 1000, "base64image");
      const lawnmower = store.getLawnmower("456", "456");

      expect(lawnmower).toBeUndefined();
    });

    it("should not get a lawnmower with an invalid series ID", () => {
      store.setLawnmower("123", "456", "Model X", "ACME", 50, 1000, "base64image");
      const lawnmower = store.getLawnmower("123", "789");

      expect(lawnmower).toBeUndefined();
    });
  });

  describe("FlyweightLawnmowerSeries", () => {
    it("should create a new series with the given data", () => {
      const series = new FlyweightLawnmowerSeries({
        id: "123",
        model: "Model X",
        manufacturer: "ACME",
        weight: 50,
        price: 1000,
        picture: "base64image",
      });
      const data = series.getData();

      expect(data.id).toBe("123");
      expect(data.model).toBe("Model X");
      expect(data.manufacturer).toBe("ACME");
      expect(data.weight).toBe(50);
      expect(data.price).toBe(1000);
      expect(data.picture).toBe("base64image");
    });
  });

  describe("Lawnmower", () => {
    it("should create a new lawnmower with the given serial number and series", () => {
      const series = new FlyweightLawnmowerSeries({
        id: "123",
        model: "Model X",
        manufacturer: "ACME",
        weight: 50,
        price: 1000,
        picture: "base64image",
      });
      const lawnmower = new Lawnmower("456", series);

      expect(lawnmower.serialNumber).toBe("456");
      expect(lawnmower.manufacturer).toBe("ACME");
      expect(lawnmower.model).toBe("Model X");
      expect(lawnmower.weight).toBe(50);
      expect(lawnmower.price).toBe(1000);
      expect(lawnmower.picture).toBe("base64image");
    });
  });
});
