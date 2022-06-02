import Organism from "../components/Organism";
import { deleteOrganism, getOrganismsArray } from "../state/organismsArray";
import { setMatrixCellDead, setMatrixCell } from "../state/playgroundMatrix";

const iteration = () => {
  const organisms = getOrganismsArray();

  organisms.forEach((element, index) => {
    const gridCell = element.exec(); // выполняем действие генов, возвращает параметры клетки матрицы
    if (gridCell.isDead) {
      // удаляем объект
      console.log("удаляем объект");
      setMatrixCellDead(gridCell);
      deleteOrganism(gridCell.organismId!);
    } else {
      setMatrixCell(gridCell);
    }
  });
  return 1;
};

export default iteration;

// Мы будем итерироваться по массиву и выполнять действия каждого организма согласно геному.
// В конце каждого действия организм будет записывать новые данные в матрицу Playground.
// Так же в будущем организм должен будет получить данные из матрицы об источнике энергии и о расположении соседних организмов.
