import GridCell from "../components/GridCell";
import Organism, { Direction } from "../components/Organism";
import Color from "../properties/Color";
import initialProperties, { getInitProps } from "./initialProperties";

let playgroundMatrix: GridCell[][];
let matrixSize: [number, number];
let lightEnergy = initialProperties.radiation;
let mineralsEnergy = initialProperties.minerals;

export function initiatePlaygroundMatrix(a: GridCell[][], b: [number, number]) {
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
    energy: a.energy,
  };
}

export function reserveMatrixCell(x: number, y: number, id: number) {
  playgroundMatrix[x][y] = {
    ...playgroundMatrix[x][y],
    x: x,
    y: y,
    isEmpty: false,
    organismId: id,
  };
}

export function cellIsTaken([x, y]: [number, number]): 0 | 2 | 4 | 5 | 6 {
  const a = playgroundMatrix[x][y];

  //   console.log("playgroundMatrix[x][y].isEmpty = " + a + ` x=${x} y=${y}`);

  if (a.isEmpty) {
    return 2;
  } else {
    if (a.isDead) return 4;
    if (a.organismId != undefined && a.organismId > -1) return 5;
    if (false) return 6; //  определяем родственные связи с соседней клеткой
  }

  throw new Error(
    `playgroundMatrix[x][y].isEmpty =${a.isEmpty} x=${x} y=${y} playgroundMatrix[x][y].isDead =${a.isDead} playgroundMatrix[x][y].organismId =${a.organismId}`
  );
}

export function getFreeCell([x, y]: [number, number], direction: Direction) {
  let freeCellCoord: [number, number] | null = null;

  for (let i = 1; i < 8; i++) {
    let nextDirection = direction + i;
    if (nextDirection >= 8) nextDirection = nextDirection - 8;
    const coord = getCoordsOfDirection(x, y, nextDirection as Direction);
    if (2 === cellIsTaken(coord)) {
      freeCellCoord = coord;
      break;
    }
  }

  return freeCellCoord;
}

export function getCoordsOfDirection(
  x: number,
  y: number,
  direction: Direction
): [number, number] {
  let newCoords: [number, number] | null = null;
  // prettier-ignore
  switch(direction) {
        case 0: newCoords = [x, y-1]; break
        case 1: newCoords = [x+1, y-1]; break
        case 2: newCoords = [x+1, y]; break
        case 3: newCoords = [x+1, y+1]; break
        case 4: newCoords = [x, y+1]; break
        case 5: newCoords = [x-1, y+1]; break
        case 6: newCoords = [x-1, y]; break
        case 7: newCoords = [x-1, y-1]; break
      } // prettier-ignore-end

  if (
    newCoords === null ||
    newCoords[0] > matrixSize[0] ||
    newCoords[1] > matrixSize[1] ||
    newCoords[0] === null ||
    newCoords[1] === null
  )
    throw new Error(
      `ошибка координат. newCoords=${newCoords} newCoords[0]=${newCoords[0]} newCoords[1]=${newCoords[1]}`
    );

  // проверяем выход организма за пределы матрицы. Поле сквозное

  if (newCoords[0] < 0) {
    newCoords[0] = getInitProps().matrixSize[0] + newCoords[0];
  }

  if (newCoords[1] < 0) {
    newCoords[1] = getInitProps().matrixSize[1] + newCoords[1];
  }

  if (newCoords[0] == getInitProps().matrixSize[0]) {
    newCoords[0] = 0;
  }

  if (newCoords[1] == getInitProps().matrixSize[1]) {
    newCoords[1] = 0;
  }

  return newCoords;
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
