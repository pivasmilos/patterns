import { integers, take, squares } from "./SquintIterator";

describe("Squint Iterator", () => {
  describe("integers", () => {
    it("should generate an infinite sequence of integers", () => {
      const ints = integers();
      const expected = [1, 2, 3, 4, 5];

      const result = take(5, ints);

      expect(result).toEqual(expected);
    });
  });

  describe("squares", () => {
    it("should generate the squares of an input sequence", () => {
      const ints = [1, 2, 3, 4, 5];
      const squaresIter = squares(ints[Symbol.iterator]());
      const expected = [1, 4, 9, 16, 25];

      const result = take(5, squaresIter);

      expect(result).toEqual(expected);
    });
  });

  describe("take", () => {
    it("should return the first n elements of an input sequence", () => {
      const ints = [1, 2, 3, 4, 5];
      const expected = [1, 2, 3];

      const result = take(3, ints[Symbol.iterator]());

      expect(result).toEqual(expected);
    });

    it("should return all elements if n is greater than the length of the input sequence", () => {
      const ints = [1, 2, 3, 4, 5];
      const expected = [1, 2, 3, 4, 5];

      const result = take(10, ints[Symbol.iterator]());

      expect(result).toEqual(expected);
    });
  });
});
