import React, { useState } from "react";
import initialValue from "../playgroundProps/playgroundInitialValue";
import Cell from "./Cell";

function Playground() {
  // Размер матрицы при инициализации. Если пользователь меняет начальные значения, нужно сбросить всю программу
  const [matrixSize, setMatrixSize] = useState([105, 60] as [number, number]);
  // Матрица c объектами состояний клеток
  const [playground, setPlayground] = useState(initialValue(matrixSize));

  return (
    <div
      className="playground"
      style={{
        gridTemplate: `repeat(${matrixSize[1]}, max(11px)) / repeat(${matrixSize[0]}, max(11px))`,
        width: `${11 * matrixSize[0]}px`,
        height: `${11 * matrixSize[1]}px`,
      }}
    >
      {playground.map((e1) => {
        return e1.map((e2) => (
          <Cell
            x={e2.x}
            y={e2.y}
            key={e2.id}
            id={e2.id}
            isDead={e2.isDead}
            isEmpty={e2.isEmpty}
          />
        ));
      })}
    </div>
  );
}

export default Playground;
