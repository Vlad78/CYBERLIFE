import Organism from "../components/Organism";

const organismsArray: Organism[] = [];

export const getOrganismsArray = () => {
  return [...organismsArray];
};

export const add1Organism = (o: Organism) => {
  organismsArray.unshift(o);
};

export const deleteOrganism = (id: number) => {
  // найти организм по айдишнику и удалить
  // console.log("объект для удаления = ");
  // console.log(organismsArray.find((obj) => obj.id === id));
  for (let i = 0; i < organismsArray.length; i++) {
    if (organismsArray[i].id === id) {
      // этот объект нужно удалить
      organismsArray.splice(i, 1);
    }
  }
};
