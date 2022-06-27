import Organism, { Genome } from "../components/Organism";

export const coloniesInit = (numColonies: number, matrixSize: [number, number]) => {
  const [x, y] = matrixSize;

  const a = (y - (y % 3)) / 3;
  const b = ((y - (y % 3)) / 3) * 2;
  const c = (x - (x % 3)) / 3;
  const d = ((x - (x % 3)) / 3) * 2;

  // prettier-ignore
  const seedGenotype = [
    25, 25, 25, 25, 28, 0, 28, 1, 
    0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 25
  ]
  // prettier-ignore-end

  // prettier-ignore
  const seedGenotype2:Genome = [
    4, 4, 4, 4, 4, 4, 4, 4, 
    25, 4, 4, 4, 4, 4, 4, 4, 
    4, 4, 4, 4, 4, 4, 4, 4, 
    4, 4, 4, 4, 4, 4, 4, 4,
    4, 4, 4, 4, 4, 4, 4, 4,
    4, 4, 4, 4, 4, 4, 4, 4,
    4, 4, 4, 4, 4, 4, 4, 4,
    4, 4, 4, 4, 4, 4, 4, 4
  ]
  // prettier-ignore-end

  // prettier-ignore
  const seedGenotype3: Genome = [
  25, 25, 26, 23, 25, 25, 25, 29, 
  25, 25, 26, 23, 25, 25, 25, 29, 
  25, 25, 25, 23, 25, 25, 25, 29, 
  25, 25, 25, 24, 26, 25, 25, 25,
  25, 25, 25, 24, 26, 25, 25, 25,
  25, 25, 25, 24, 25, 26, 25, 25,
  25, 25, 25, 24, 25, 26, 29, 29,
  25, 25, 25, 24, 25, 25, 25, 25
]
  // prettier-ignore-end

  // prettier-ignore
  const seedGenotype4: Genome = [
  25, 25, 25, 25, 25, 25, 25, 25, 
  25, 25, 25, 25, 25, 25, 25, 25, 
  25, 25, 25, 25, 25, 25, 25, 25, 
  25, 25, 25, 25, 25, 25, 25, 25,
  25, 25, 25, 25, 25, 25, 25, 25,
  25, 25, 25, 25, 25, 25, 25, 25,
  25, 25, 25, 25, 25, 25, 25, 25,
  25, 25, 25, 25, 25, 25, 25, 25
  ]
  let colorCode = { r: 0, g: 100, b: 0 };
  // prettier-ignore-end

  new Organism(c, a, seedGenotype4, colorCode);
  // new Organism(c, a - 1, seedGenotype3);
  // new Organism(d, a, seedGenotype3);
  // new Organism(c, b, seedGenotype3);
  // new Organism(d, b, seedGenotype3);
};
