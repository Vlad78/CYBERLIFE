import { useEffect, useState } from "react";
import { coloniesInit } from "../functions/coloniesInit";
import iteration from "../functions/iteration";
import {
  endInitializing,
  getInitProps,
  initialize,
} from "../state/initialProperties";
import style from "./Playground.module.scss";
import { getLightEnergy, getPGMatrix } from "../state/playgroundMatrix";
import { getOrganism } from "../state/organismsArray";
import OrganismGenes from "./OrganismGenes";
import Organism from "./Organism";
import Matrix from "./Matrix";
import OrganismData from "./OrganismData";

let mutex = false;

function Playground() {
  // let tsStart = new Date();
  // сделать инициацию через переменную в этом файле. Сначала underfined, потом true
  initialize();
  const initProps = getInitProps();
  if (initProps.firstRun) {
    coloniesInit(initProps.colonies, initProps.matrixSize);
    endInitializing();
    // iteration();
  }

  const [nTurns, setnTurns] = useState(0);
  const playground = getPGMatrix();
  const [orgamismOnScreen, setOrgamismOnScreen] = useState<
    [Organism | undefined | null, HTMLDivElement | undefined]
  >([getOrganism(0), undefined]);

  // стейт тикающий со скоростью обновления
  // ручное упавление
  const run = () => {
    // tsStart = new Date();
    iteration();
    setnTurns((pr) => pr + 1);
  };

  // выбор клетки для отображение подробной информации организма

  const selectCell = (e: React.MouseEvent<HTMLElement>) => {
    // устанавливаем в стейт новый организм
    const element = e.target as HTMLDivElement;
    // console.log("SELECT============================================");
    // console.log("element = ");
    // console.log(element);

    let organism = getOrganism(element.getAttribute("data-organism-id"));
    // console.log("organism = ");
    // console.log(organism);

    // убираем стиль с предыдущей ячейки
    if (orgamismOnScreen[1] !== undefined) {
      orgamismOnScreen[1].classList.remove(style.isActive);
    }
    // console.log("orgamismOnScreen[1] = ");
    // console.log(orgamismOnScreen[1]);

    // меняем стиль выделенной ячейки
    // const el = e.target as HTMLDivElement;
    if (element.getAttribute("data-organism-id") !== "-1")
      element.classList.add(style.isActive);

    // записываем новое состояние
    organism !== null ? setOrgamismOnScreen([organism, element]) : "";
    // console.log("============================================");
  };

  const play = () => {
    mutex = true;
    setnTurns((pr) => pr + 1);
  };
  const stop_ = () => (mutex = false);
  useEffect(() => {
    if (mutex) {
      var refreshId = setInterval(() => {
        iteration();
        // const time = new Date().getTime() - tsStart.getTime();
        // console.log("Iteration time ms: " + time);
        setnTurns((pr) => pr + 1);
      }, initProps.speed);
      return () => {
        clearInterval(refreshId);
      };
    }
  }, [nTurns]);

  const gridSize = {
    gridTemplate: `repeat(${initProps.matrixSize[1]}, max(11px)) / repeat(${initProps.matrixSize[0]}, max(11px))`,
    width: `${11 * initProps.matrixSize[0]}px`,
    height: `${11 * initProps.matrixSize[1]}px`,
    gridAutoFlow: "column",
  };

  // нужно задать частоту рендера независимо от скорости чтения генома и операций
  // нужно сделать тест на проверку целостности матрицы
  return (
    <>
      {/* {console.log("render")} */}
      <button onClick={run}>Next turn</button>
      <button onClick={play}>Play</button>
      <button onClick={stop_}>Stop</button>
      <div style={{ display: "inline-block" }}>
        {"  "}Number of turns: {nTurns}
      </div>
      <div className={style.body}>
        <div className={style.playground} style={gridSize}>
          <Matrix playground={playground} selectCell={selectCell} />
        </div>

        <div className={style.gene}>
          {orgamismOnScreen[0] != null ? (
            <OrganismGenes organism={orgamismOnScreen[0]} />
          ) : (
            ""
          )}
        </div>

        <div className={style.data}>
          {orgamismOnScreen[0] != null ? (
            <OrganismData organism={orgamismOnScreen[0]} />
          ) : (
            ""
          )}
        </div>
      </div>
      {/* {console.log(
        "--------------------- Iteration time ms: " +
          (new Date().getTime() - tsStart.getTime())
      )} */}
    </>
  );
}

export default Playground;
