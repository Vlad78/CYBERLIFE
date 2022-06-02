import GridCell from "../components/GridCell";
import Organism, { Direction } from "../components/Organism";
import Color from "../properties/Color";
import initialProperties from "./initialProperties";

let playgroundMatrix: GridCell[][];
let matrixSize: [number, number];
let lightEnergy = initialProperties.radiation;
let mineralsEnergy = initialProperties.minerals;

export function setPlaygroundMatrix(a: GridCell[][], b: [number, number]) {
  playgroundMatrix = a;
  matrixSize = b;
}

export function getPGMatrix() {
  return playgroundMatrix;
}

export function setMatrixCell(a: GridCell) {
  // проверить скорость исполнения кода
  playgroundMatrix[a.x][a.y] = {
    ...playgroundMatrix[a.x][a.y],
    x: a.x,
    y: a.y,
    isEmpty: a.isEmpty,
    organismId: a.organismId,
    isDead: a.isDead,
    color: a.color,
  };
}

export function cellIsTaken([x, y]: [number, number]): 0 | 2 | 4 | 5 | 6 {
  if (playgroundMatrix[x][y].isEmpty) {
    return 2;
  } else {
    if (playgroundMatrix[x][y].isDead) return 4;
    if (
      playgroundMatrix[x][y].organismId != undefined &&
      playgroundMatrix[x][y].organismId > 0
    )
      return 5;
    if (false) return 6; //  определяем родственные связи с соседней клеткой
  }
  return 0;
}

export function getFreeCell([x, y]: [number, number], direction: Direction) {
  let freeCellCoord: [number, number] | null = null;
  for (let i = 1; i < 8; i++) {
    let nextDirection = direction + i;
    if (nextDirection >= 8) nextDirection - 8;
    const coord = Organism.getCoordsOfDirection(
      x,
      y,
      nextDirection as Direction
    );
    const b = cellIsTaken(coord);
    if (b === 2) {
      freeCellCoord = coord;
      break;
    }
  }
  return freeCellCoord;
}

export function clearCell([x, y]: [number, number]) {
  const organismId = playgroundMatrix[x][y].organismId;
  playgroundMatrix[x][y] = {
    ...playgroundMatrix[x][y],
    isEmpty: true,
    organismId: -1,
    isDead: false,
    color: Color.EMPTY,
  };
  return organismId;
}

export function setMatrixCellDead(a: GridCell) {
  playgroundMatrix[a.x][a.y] = {
    ...playgroundMatrix[a.x][a.y],
    isEmpty: a.isEmpty,
    organismId: a.organismId,
    isDead: a.isDead,
    color: a.color,
  };
}

export function getLightEnergy(y: number) {
  if (y < matrixSize[1] / 5) {
    return lightEnergy;
  }
  if (y < (matrixSize[1] / 5) * 2) {
    return (lightEnergy / 3) * 2;
  }
  if (y < (matrixSize[1] / 5) * 3) {
    return lightEnergy / 3;
  }
  if (y < (matrixSize[1] / 5) * 4) {
    return 0;
  }
  if (y < matrixSize[1]) {
    return 0;
  }

  return 0;
}

export function getMineralsEnergy(y: number) {
  if (y < matrixSize[1] / 5) {
    return 0;
  }
  if (y < (matrixSize[1] / 5) * 2) {
    return 0;
  }
  if (y < (matrixSize[1] / 5) * 3) {
    return mineralsEnergy / 3;
  }
  if (y < (matrixSize[1] / 5) * 4) {
    return (mineralsEnergy / 3) * 2;
  }
  if (y < matrixSize[1]) {
    return mineralsEnergy;
  }

  return 0;
}
