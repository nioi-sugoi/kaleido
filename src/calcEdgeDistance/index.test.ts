import { calcEdgeDistance } from "calcEdgeDistance";
import { describe } from "vitest";

describe("台の位置計算", () => {
  describe("同一機種が同一列のみに存在している場合", () => {
    const sameTypeLocations = [21, 22, 23, 24, 25];

    test("外角1", () => {
      expect(calcEdgeDistance(25, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 1,
      });
    });

    test("外角2", () => {
      expect(calcEdgeDistance(24, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 2,
      });
    });

    test("外角3 台数が奇数の場合、中央の台は外角扱い", () => {
      expect(calcEdgeDistance(23, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 3,
      });
    });

    test("内角2", () => {
      expect(calcEdgeDistance(22, sameTypeLocations)).toEqual({
        edgeRef: "inner",
        edgeDistance: 2,
      });
    });

    test("内角1", () => {
      expect(calcEdgeDistance(21, sameTypeLocations)).toEqual({
        edgeRef: "inner",
        edgeDistance: 1,
      });
    });
  });

  describe("同一機種が複数列に存在している場合", () => {
    const sameTypeLocations = [75, 76, 77, 78, 79, 80, 86, 87, 88];

    test("1列目外角1", () => {
      expect(calcEdgeDistance(75, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 1,
      });
    });

    test("1列目外角2", () => {
      expect(calcEdgeDistance(76, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 2,
      });
    });

    test("1列目外角3", () => {
      expect(calcEdgeDistance(77, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 3,
      });
    });

    test("1列目内角3", () => {
      expect(calcEdgeDistance(78, sameTypeLocations)).toEqual({
        edgeRef: "inner",
        edgeDistance: 3,
      });
    });

    test("1列目内角2", () => {
      expect(calcEdgeDistance(79, sameTypeLocations)).toEqual({
        edgeRef: "inner",
        edgeDistance: 2,
      });
    });

    test("1列目内角1", () => {
      expect(calcEdgeDistance(80, sameTypeLocations)).toEqual({
        edgeRef: "inner",
        edgeDistance: 1,
      });
    });

    test("2列目外角1", () => {
      expect(calcEdgeDistance(86, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 1,
      });
    });

    test("2列目外角2", () => {
      expect(calcEdgeDistance(87, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 2,
      });
    });

    test("2列目外角1", () => {
      expect(calcEdgeDistance(88, sameTypeLocations)).toEqual({
        edgeRef: "inner",
        edgeDistance: 1,
      });
    });
  });

  describe("両端が内角の場合", () => {
    const sameTypeLocations = [30, 31, 32];

    test("全台計算されない", () => {
      expect(calcEdgeDistance(30, sameTypeLocations)).toBeUndefined();
      expect(calcEdgeDistance(31, sameTypeLocations)).toBeUndefined();
      expect(calcEdgeDistance(32, sameTypeLocations)).toBeUndefined();
    });
  });

  describe("列全てが同一機種の場合", () => {
    const sameTypeLocations = [64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74];

    test("外角1", () => {
      expect(calcEdgeDistance(64, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 1,
      });
      expect(calcEdgeDistance(74, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 1,
      });
    });

    test("外角2", () => {
      expect(calcEdgeDistance(65, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 2,
      });
      expect(calcEdgeDistance(73, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 2,
      });
    });

    test("外角3", () => {
      expect(calcEdgeDistance(66, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 3,
      });
      expect(calcEdgeDistance(72, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 3,
      });
    });

    test("外角4", () => {
      expect(calcEdgeDistance(67, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 4,
      });
      expect(calcEdgeDistance(71, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 4,
      });
    });

    test("外角5", () => {
      expect(calcEdgeDistance(68, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 5,
      });
      expect(calcEdgeDistance(70, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 5,
      });
    });

    test("外角6", () => {
      expect(calcEdgeDistance(69, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 6,
      });
    });
  });

  describe("同一機種が1or2台のみの場合", () => {
    test("計算されない", () => {
      expect(calcEdgeDistance(1, [1])).toBeUndefined();
      expect(calcEdgeDistance(1, [1, 2])).toBeUndefined();
      expect(calcEdgeDistance(2, [1, 2])).toBeUndefined();
    });
  });

  describe("同一列にある同一機種が1or2台のみの場合", () => {
    const sameTypeLocations = [75, 76, 77, 78, 79, 80, 86, 87];

    test("計算される", () => {
      expect(calcEdgeDistance(86, sameTypeLocations)).toEqual({
        edgeRef: "outer",
        edgeDistance: 1,
      });
      expect(calcEdgeDistance(87, sameTypeLocations)).toEqual({
        edgeRef: "inner",
        edgeDistance: 1,
      });
    });
  });
});
