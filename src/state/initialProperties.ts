import { firstRun } from "../features/playgroundSlice";
import initValues from "../functions/initialValueForPlayground";
import { setPlaygroundMatrix } from "./playgroundMatrix";

const initialProperties = {
  speed: 500, // Скорость обновления площадки. Начальное - 2 сек/день
  colonies: 4, // Количество колоний в начале. По-умолчанию 4
  radiation: 15, // Энергия солнца
  minerals: 15, // Количество минералов
  numberOfCommand: 15, // Максимальное кол-во команд генома
  matrixSize: [105, 60] as [number, number], // размер матрицы
  initialPlayground: initValues([105, 60]),
  firstRun: true,
  init: false,
};

export function initialize() {
  initialProperties.init = true;
}

export function getInitProps() {
  return initialProperties;
}

export function endInitializing() {
  initialProperties.firstRun = false;
  setPlaygroundMatrix(
    initialProperties.initialPlayground,
    initialProperties.matrixSize
  );
}

export default initialProperties;
