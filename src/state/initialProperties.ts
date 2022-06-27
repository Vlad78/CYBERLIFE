import { firstRun } from "../features/playgroundSlice";
import initValues from "../functions/initialValueForPlayground";
import { initiatePlaygroundMatrix } from "./playgroundMatrix";

const initialProperties = {
  speed: 1, // Скорость обновления площадки. Начальное - 2 сек/день
  colonies: 1, // Количество колоний в начале. По-умолчанию 4
  radiation: 18, // Энергия солнца
  minerals: 15, // Количество минералов
  numberOfCommand: 6, // Максимальное кол-во команд генома
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
  initiatePlaygroundMatrix(initialProperties.initialPlayground, initialProperties.matrixSize);
}

export default initialProperties;
