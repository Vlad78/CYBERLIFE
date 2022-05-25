import { Provider } from "react-redux";
import "./App.scss";
import { store } from "./app/store";
import Playground from "./components/Playground";
import initValues from "./functions/initialValueForPlayground";

console.log("app");
export const PGProps = {
  speed: 2000, // Скорость обновления площадки. Начальное - 2 сек/день
  colonies: 4, // Количество колоний в начале. По-умолчанию 4
  radiation: 10, // Энергия солнца
  minerals: 10, // Количество минералов
  matrixSize: [105, 60] as [number, number], // размер матрицы
  initialPlayground: initValues([105, 60]),
  firstRun: true,
};

function App() {
  console.log("app F");
  return (
    <Provider store={store}>
      <div className="header">CYBER EVOLUTION</div>
      <Playground />
    </Provider>
  );
}

export default App;
