import { useAppDispatch } from "../app/hooks";
import { setOneCell } from "../features/playgroundSlice";
import Color from "../properties/Color";
import newId from "./Id";

const Organism = (x: number, y: number) => {
  console.log("x = " + x + " y = " + y);

  const data = {
    id: newId(),
    x: x,
    y: y,
    // prettier-ignore
    genome: [
            0, 0, 0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ],
    // prettier-ignore-end
    color: Color.PHOTOSYNTHESIS,
  };

  const dispatch = useAppDispatch();
  dispatch(setOneCell({ x: x, y: y, color: data.color }));
  // организм должен в глобальный стейт матрицы записывать значение x y и color
};

export default Organism;
export type Organism = typeof Organism;
