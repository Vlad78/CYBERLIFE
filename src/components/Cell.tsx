import React from "react";
import style from "./Cell.module.scss";

interface Cell {
  id: number;
  x: number;
  y: number;
  isEmpty: boolean;
  organismId?: number;
  isDead: boolean;
}

function Cell({ x, y, isEmpty, isDead, id }: Cell) {
  return <div className={style.background_null} data-x={x} data-y={y}></div>;
}

export default Cell;
