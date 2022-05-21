import Cell from "../components/Cell";

const initialValue = (pair: [number, number]) => {
  let initialValue = [];
  let line = [];
  let id = 0;
  for (let iY = 0; iY < pair[0]; iY++) {
    for (let iX = 0; iX < pair[1]; iX++) {
      // здесь создается объект клетки
      line.push({
        id: id++,
        x: iY,
        y: iX,
        isEmpty: true,
        isDead: false,
      } as Cell);
    }
    initialValue.push(line);
    line = [];
  }

  return initialValue;
};

export default initialValue;
