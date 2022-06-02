import { useState } from "react";
import { coloniesInit } from "../functions/coloniesInit";
import iteration from "../functions/iteration";
import {
  endInitializing,
  getInitProps,
  initialize,
} from "../state/initialProperties";
import { getLightEnergy, getPGMatrix } from "../state/playgroundMatrix";
import GridCell from "./GridCell";

function Playground() {
  initialize();
  const initProps = getInitProps();
  if (initProps.firstRun) {
    coloniesInit(initProps.colonies, initProps.matrixSize);
    endInitializing();
  }

  const [_, setUpdate] = useState(new Date().getTime());
  const playground = getPGMatrix();

  // стейт тикающий со скоростью обновления
  const tsStart = new Date();

  // var refreshId = setInterval(() => {
  // const run = () => {
  // проходимся по массиву с организмами, выполняя их действия, согласно геному
  iteration();

  const time = new Date().getTime() - tsStart.getTime();
  console.log("Iteration time ms: " + time);
  setUpdate((state) => state + time);
  // заменить на эффект?
  //   clearInterval(refreshId);
  // }, initProps.speed);
  // };

  const gridSize = {
    gridTemplate: `repeat(${initProps.matrixSize[1]}, max(11px)) / repeat(${initProps.matrixSize[0]}, max(11px))`,
    width: `${11 * initProps.matrixSize[0]}px`,
    height: `${11 * initProps.matrixSize[1]}px`,
    gridAutoFlow: "column",
  };

  // создать задержку рендера
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // нужно задать частоту рендера независимо от скорости чтения генома и операций
  // нужно сделать тест на проверку целостности матрицы
  return (
    <>
      <div className="playground" style={gridSize}>
        {playground.map((e1) => {
          console.log("рендерит");
          return e1.map((e2) => (
            <GridCell
              x={e2.x}
              y={e2.y}
              key={e2.id}
              id={e2.id}
              isDead={e2.isDead}
              isEmpty={e2.isEmpty}
              color={e2.color}
              organismId={e2.organismId}
            />
          ));
        })}
      </div>
    </>
  );
}

export default Playground;
