import _ from "lodash";
import { edge_type } from "@prisma/client";

const columns = [
  _.range(1, 13 + 1),
  _.range(14, 25 + 1),
  _.range(26, 37 + 1),
  _.range(38, 50 + 1),
  _.range(51, 63 + 1),
  _.range(64, 74 + 1),
  _.range(75, 85 + 1),
  _.range(86, 95 + 1),
  _.range(96, 105 + 1),
  _.range(106, 118 + 1),
];

export const calcEdgeDistance = (
  location: number,
  sameTypeLocations: number[]
): { edgeDistance: number; edgeRef: edge_type } | undefined => {
  // 同一機種が1or2台のみの場合は計算しない
  if (sameTypeLocations.length <= 2) {
    return;
  }

  const column = columns.find((column) => column.includes(location));

  if (!column) {
    throw new Error(`unknown location: ${location}`);
  }

  const columnEdges = [column[0], column[column.length - 1]];

  // 同一機種が複数列に配置されている場合を考慮
  const sameTypeLocationsInColumn = sameTypeLocations.filter((l) =>
    column.includes(l)
  );

  const outerEdges = sameTypeLocationsInColumn.filter((l) =>
    columnEdges.includes(l)
  );

  // 両端が内角の場合は計算しない
  if (outerEdges.length === 0) {
    return;
  }
  // 通常パターン
  else if (outerEdges.length === 1) {
    const outerEdge = outerEdges[0];
    const innerEdge =
      outerEdge === sameTypeLocationsInColumn[0]
        ? sameTypeLocationsInColumn[sameTypeLocationsInColumn.length - 1]
        : sameTypeLocationsInColumn[0];

    const distanceFromOuterEdge = Math.abs(location - outerEdge) + 1;
    const distanceFromInnerEdge = Math.abs(location - innerEdge) + 1;

    // 外角と内角が同じ距離の場合は外角を採用
    if (distanceFromOuterEdge <= distanceFromInnerEdge) {
      return {
        edgeRef: "outer",
        edgeDistance: distanceFromOuterEdge,
      };
    } else {
      return {
        edgeRef: "inner",
        edgeDistance: distanceFromInnerEdge,
      };
    }
  }
  // 両端が外角の場合（= 列の台全てが同一機種）
  else {
    // 近い方を採用
    const edgeDistance =
      Math.min(
        Math.abs(location - outerEdges[0]),
        Math.abs(location - outerEdges[1])
      ) + 1;

    return {
      edgeRef: "outer",
      edgeDistance,
    };
  }
};
