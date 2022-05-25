import { useState } from "react";
import { PGProps } from "../App";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setOneCell } from "../features/playgroundSlice";
import { coloniesInit } from "../functions/coloniesInit";
import initValues from "../functions/initialValueForPlayground";
import iteration from "../functions/iteration";
import Color from "../properties/Color";
import GridCell from "./GridCell";

console.log("playgroundProperties");

function Playground() {
  const [init, setInit] = useState({
    speed: 2000, // Скорость обновления площадки. Начальное - 2 сек/день
    colonies: 4, // Количество колоний в начале. По-умолчанию 4
    radiation: 10, // Энергия солнца
    minerals: 10, // Количество минералов
    matrixSize: [105, 60] as [number, number], // размер матрицы
    initialPlayground: initValues([105, 60]),
    firstRun: true,
  }); // это нужно сделать глобальным стейтом
  const playground = useAppSelector((state) => state.playground.value);
  const dispatch = useAppDispatch();

  console.log("run " + PGProps.firstRun);

  // инициализация
  // if (PGProps.firstRun) {
  if (init.firstRun) {
    coloniesInit(PGProps.colonies);
    setInit({ ...init, firstRun: false });
    PGProps.firstRun = false;
  }

  // var tsStart = new Date();
  // var refreshId = setInterval(() => {
  //   const copy = [...playground];
  //   // dispatch(setOneCell({ x: 1, y: 1, color: Color.PHOTOSYNTHESIS }));
  //   // здесь мы вызываем функцию, которая нам возвращает обновления
  //   // iteration(copy);

  //   clearInterval(refreshId);
  //   console.log(
  //     "Iteration time ms: " + (new Date().getTime() - tsStart.getTime())
  //   );
  // }, PGProps.speed);

  const gridSize = {
    gridTemplate: `repeat(${PGProps.matrixSize[1]}, max(11px)) / repeat(${PGProps.matrixSize[0]}, max(11px))`,
    width: `${11 * PGProps.matrixSize[0]}px`,
    height: `${11 * PGProps.matrixSize[1]}px`,
    gridAutoFlow: "column",
  };

  return (
    <>
      <div className="playground" style={gridSize}>
        {playground.map((e1) => {
          return e1.map((e2) => (
            <GridCell
              x={e2.x}
              y={e2.y}
              key={e2.id}
              id={e2.id}
              isDead={e2.isDead}
              isEmpty={e2.isEmpty}
              color={e2.color}
            />
          ));
        })}
      </div>
    </>
  );
}

export default Playground;
