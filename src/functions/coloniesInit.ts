import { PGProps } from "../App";
import Organism from "../components/Organism";

export const coloniesInit = (numColonies: number) => {
  console.log("colonies " + PGProps.firstRun);

  const [x, y] = PGProps.matrixSize;

  const a = (y - (y % 3)) / 3;
  const b = ((y - (y % 3)) / 3) * 2;
  const c = (x - (x % 3)) / 3;
  const d = ((x - (x % 3)) / 3) * 2;

  const seed1 = Organism(a, c);
  const seed2 = Organism(a, d);
  const seed3 = Organism(b, c);
  const seed4 = Organism(b, d);
};
