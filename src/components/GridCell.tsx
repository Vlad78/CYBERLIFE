import Color from "../properties/Color";
import style from "./GridCell.module.scss";

interface GridCell {
  id?: number;
  x: number;
  y: number;
  isEmpty: boolean;
  organismId: number;
  isDead: boolean;
  color: Color;
}

function GridCell({ x, y, isEmpty, isDead, id, color }: GridCell) {
  return (
    <div
      className={style.background_null}
      style={{ background: color }}
      data-x={x}
      data-y={y}
      data-id={id}
    ></div>
  );
}

export default GridCell;
