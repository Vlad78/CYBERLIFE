import { useEffect, useState } from "react";
import { coloniesInit } from "../functions/coloniesInit";
import iteration from "../functions/iteration";
import { endInitializing, getInitProps, initialize } from "../state/initialProperties";
import style from "./Playground.module.scss";
import { getLightEnergy, getPGMatrix } from "../state/playgroundMatrix";
import { getOrganism } from "../state/organismsArray";
import OrganismGenes from "./OrganismGenes";
import Organism from "./Organism";
import Matrix from "./Matrix";
import OrganismData from "./OrganismData";

let mutex = false;
// TODO
// TODO github and deploy
// TODO genome functions
// TODO instructions (use router)
// TODO input interface (use forms) + dynamic input
// TODO mark used genes
// TODO styles (research approaches)
// TODO save/load/export/import state
// TODO render speed optimisation
// TODO animation of moving

function Playground() {
  let tsStart = new Date();
  let tsEnd = new Date();
  // сделать инициацию через переменную в этом файле. Сначала underfined, потом true
  initialize();
  const initProps = getInitProps();
  if (initProps.firstRun) {
    coloniesInit(initProps.colonies, initProps.matrixSize);
    endInitializing();
    iteration();
  }

  const [nTurns, setnTurns] = useState({ turns: 0, time: new Date().getTime(), deltaTime: 0 });
  const playground = getPGMatrix();
  const [orgamismOnScreen, setOrgamismOnScreen] = useState<
    [Organism | undefined | null, HTMLDivElement | undefined]
  >([null, undefined]);

  // стейт тикающий со скоростью обновления
  // ручное упавление
  const aTurn = () => {
    tsStart = new Date();
    iteration();
    tsEnd = new Date();
    setnTurns((pr) => {
      const currentT = new Date().getTime();
      return { time: currentT, turns: pr.turns + 1, deltaTime: currentT - pr.time };
    });
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
    if (element.getAttribute("data-organism-id") !== "-1") element.classList.add(style.isActive);

    // записываем новое состояние
    organism !== null ? setOrgamismOnScreen([organism, element]) : "";
    // console.log("============================================");
  };

  const play = () => {
    mutex = true;
    setnTurns((pr) => {
      const currentT = new Date().getTime();
      return { time: currentT, turns: pr.turns + 1, deltaTime: currentT - pr.time };
    });
  };
  const stop_ = () => (mutex = false);
  useEffect(() => {
    if (mutex) {
      var refreshId = setInterval(() => {
        tsStart = new Date();
        iteration();
        tsEnd = new Date();
        setnTurns((pr) => {
          const currentT = new Date().getTime();
          return { time: currentT, turns: pr.turns + 1, deltaTime: currentT - pr.time };
        });
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

  // нужно сделать тест на проверку целостности матрицы
  return (
    <>
      <button onClick={aTurn}>Next turn</button>
      <button onClick={play}>Play</button>
      <button onClick={stop_}>Stop</button>
      <div style={{ display: "inline-block" }}>
        {"  "}Number of turns: {nTurns.turns}
      </div>
      <div style={{ display: "inline-block" }}>
        {"  "}Time to render: {nTurns.deltaTime}
      </div>
      <div style={{ display: "inline-block" }}>
        {"  "}Time of calculation: {tsEnd!.getTime() - tsStart.getTime() + " ms"}
      </div>
      <div className={style.body}>
        <div className={style.playground} style={gridSize}>
          <Matrix playground={playground} selectCell={selectCell} />
        </div>

        <div className={style.gene}>
          {orgamismOnScreen[0] != null ? <OrganismGenes organism={orgamismOnScreen[0]} /> : ""}
        </div>

        <div className={style.data}>
          {orgamismOnScreen[0] != null ? <OrganismData organism={orgamismOnScreen[0]} /> : ""}
        </div>
      </div>
      {/* {console.log(
        "--------------------- Iteration time ms: " + (new Date().getTime() - tsStart.getTime())
      )} */}
    </>
  );
}

export default Playground;
