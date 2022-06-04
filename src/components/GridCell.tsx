import Color from "../properties/Color";
import style from "./GridCell.module.scss";

interface GridCell {
  energy?: number;
  id?: number;
  x: number;
  y: number;
  isEmpty: boolean;
  organismId: number;
  isDead: boolean;
  color: Color;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

function GridCell({
  x,
  y,
  isEmpty,
  isDead,
  id,
  color,
  organismId,
  energy,
  onClick,
}: GridCell) {
  return (
    <div
      className={style.background_default}
      style={{ background: color }}
      data-x={x}
      data-y={y}
      data-id={id}
      data-organism-id={organismId}
      onClick={onClick}
    >
      {energy != -1 && energy != undefined ? energy : ""}
    </div>
  );
}

export default GridCell;
