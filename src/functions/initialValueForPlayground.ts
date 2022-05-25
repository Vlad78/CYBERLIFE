import GridCell from "../components/GridCell";
import Organism from "../components/Organism";
import Color from "../properties/Color";

const initValues = (pair: [number, number], colonies = 4) => {
  console.log("initializing"); // инициализация матрицы

  let initialValue: GridCell[][] = [];
  let column: GridCell[] = [];
  let id = 0;
  for (let iX = 0; iX < pair[0]; iX++) {
    // заполнение столбца сверху вниз
    for (let iY = 0; iY < pair[1]; iY++) {
      // здесь создается объект клетки
      column.push({
        id: id++,
        x: iX,
        y: iY,
        isEmpty: true,
        isDead: false,
        color: Color.EMPTY,
      });
    }
    initialValue.push(column);
    column = [];
  }

  return initialValue;
};

export default initValues;
