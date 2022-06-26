import GridCell from "../components/GridCell";
import { deleteOrganism, getOrganismsArray } from "../state/organismsArray";
import { setMatrixCellDead, setMatrixCell } from "../state/playgroundMatrix";

const iteration = () => {
  //   console.log("==============================turn");

  const organisms = getOrganismsArray();
  const eatenCells: (number | null)[] = []; // сюда должны поступать айди убитых клеток

  for (let i = organisms.length - 1; i >= 0; i--) {
    if (!eatenCells.includes(organisms[i].id)) {
      const [gridCell, whoWasEaten] = organisms[i].exec(); // выполняем действие генов, возвращает параметры клетки матрицы, так же нужно вернуть айди съеденой клетки
      // либо айди можно записывать в глобальный стейт
      eatenCells.push(whoWasEaten);

      if (gridCell.isDead) {
        setMatrixCellDead(gridCell);
        deleteOrganism(gridCell.organismId);
      } else {
        setMatrixCell(gridCell);
      }
    }
  }
  return 1;
};

export default iteration;

// берем копию массива организмов
// Итерируемся по массиву и выполняем код генома
// После выполнения генома организм записывает новые данные в ячейку матрицы Playground.
// После выполнения генома организм резервирует клетку матрицы при необходимости.
// Так же в будущем организм должен будет получить данные из матрицы об источнике энергии и о расположении соседних организмов.
// Реализовать, чтобы организм не смог съесть молодой организм.
