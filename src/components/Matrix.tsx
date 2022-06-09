import React from "react";
import GridCell from "./GridCell";

const Matrix = ({
  playground,
  selectCell,
}: {
  playground: GridCell[][];
  selectCell: (e: React.MouseEvent<HTMLElement>) => void;
}) => {
  return (
    <>
      {playground.map((e1) => {
        return e1.map((e2) => {
          // if (e2.x === 19 && e2.y === 2) console.log(e2);
          return (
            <GridCell
              x={e2.x}
              y={e2.y}
              key={e2.id}
              id={e2.id}
              isDead={e2.isDead}
              isEmpty={e2.isEmpty}
              color={e2.color}
              organismId={e2.organismId}
              energy={e2.energy}
              onClick={selectCell}
              immune={e2.immune}
            />
          );
        });
      })}
    </>
  );
};

export default Matrix;
