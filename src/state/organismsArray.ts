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
  // console.log(`удаляем ${id} из массива объектов`);

  let mutex = true;
  for (let i = 0; i < organismsArray.length && mutex; i++) {
    if (organismsArray[i].id === id) {
      organismsArray.splice(i, 1);
      mutex = false;
      break;
    }
  }

  // console.log("сам массив: ");
  // console.log(organismsArray);

  if (mutex) throw new Error(`ошибка удаления организма ${id} из массива`);
};

export const getOrganism = (id: number | string | null) => {
  if (id === -1) return null;
  if (id === "-1") return null;
  if (id === "") return null;
  if (id === null) return null;
  if (id === undefined) return null;

  let id_: number;

  typeof id === "string" ? (id_ = Number(id)) : (id_ = id);

  for (let i = 0; i < organismsArray.length; i++) {
    if (organismsArray[i].id === id_) {
      // этот объект нужно вернуть
      return organismsArray[i];
    }
  }

  throw new Error(
    `Организм ${id} не был найден в массиве, возможно, организм уже умер. id=${id}, typeof id=${typeof id}`
  );
  return null;
};
