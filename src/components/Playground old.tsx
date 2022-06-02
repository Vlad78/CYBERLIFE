import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { firstRun, setOneCell } from "../features/playgroundSlice";
import { coloniesInit } from "../functions/coloniesInit";
import iteration from "../functions/iteration";
import Color from "../properties/Color";
import GridCell from "./GridCell";

function Playground() {
  const playground = useAppSelector((state) => state.playground.value);
  const dispatch = useAppDispatch();
  const [_, setUpdate] = useState(new Date().getTime());

  console.log("PLG F " + playground.firstRun);

  // инициализация
  if (playground.firstRun) {
    // создаем новые колонии
    coloniesInit(playground.colonies, playground.matrixSize);
    dispatch(firstRun()); // возможно, нужно использовать не стэйт, а просто данные
  } else {
    // тикающий стейт со скоростью обновления
    const tsStart = new Date();
    var refreshId = setInterval(() => {
      // const copy = [...playground.initialPlayground];

      // проходимся по массиву с организмами, выполняя их действия, согласно геному
      iteration();

      const time = new Date().getTime() - tsStart.getTime();
      console.log("Iteration time ms: " + time);
      setUpdate((state) => state + time);
      clearInterval(refreshId);
    }, playground.speed);

    const gridSize = {
      gridTemplate: `repeat(${playground.matrixSize[1]}, max(11px)) / repeat(${playground.matrixSize[0]}, max(11px))`,
      width: `${11 * playground.matrixSize[0]}px`,
      height: `${11 * playground.matrixSize[1]}px`,
      gridAutoFlow: "column",
    };

    return (
      <>
        <div className="playground" style={gridSize}>
          {playground.initialPlayground.map((e1) => {
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
  return <></>;
}

export default Playground;
