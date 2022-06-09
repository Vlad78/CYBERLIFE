import { add1Organism, deleteOrganism, getOrganismsArray } from "../state/organismsArray";
import Color from "../properties/Color";
import newId from "./Id";
import GridCell from "./GridCell";
import {
  cellIsTaken,
  clearCell,
  getCoordsOfDirection,
  getFreeCell,
  getLightEnergy,
  getMineralsEnergy,
  reserveMatrixCell,
} from "../state/playgroundMatrix";
import initialProperties, { getInitProps } from "../state/initialProperties";

export type Direction = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
// prettier-ignore
export type Genome = [number, number, number, number, number, number, number, number,
              number,number,number,number,number,number,number,number,
              number,number,number,number,number,number,number,number,
              number,number,number,number,number,number,number,number,
              number,number,number,number,number,number,number,number,
              number,number,number,number,number,number,number,number,
              number,number,number,number,number,number,number,number,
              number,number,number,number,number,number,number,number];
// prettier-ignore-end

// после создания, организм должен попасть в массив организмов в начало. Действие он не должен делать
class Organism {
  static genomeMutation = (g: Genome): Genome => {
    const genome = [...g];
    if (Math.floor(Math.random() * 4) === 0) {
      let geneIndex = Math.floor(Math.random() * 64);
      let geneValue = Math.floor(Math.random() * 64);
      genome[geneIndex] = geneValue;

      if ((geneIndex || geneValue) >= 64)
        throw new Error(
          `неверная генерация генома geneIndex = ${geneIndex}, geneValue = ${geneValue}`
        );
      return genome as Genome;
    } else {
      return genome as Genome;
    }
  };

  id;
  x;
  y;
  isDead = false;
  genome: Genome;
  gCounter = 0;
  energy = 50;
  minerals = 50;
  direction = 0 as Direction;
  color = Color.PHOTOSYNTHESIS;
  numberofTurns = 0;
  immune = true;
  whoWasEaten: number | null = null;

  constructor(x: number, y: number, genome: Genome, energy?: number, idParent?: number) {
    this.x = x;
    this.y = y;
    this.genome = genome;
    this.id = newId();
    if (energy != undefined) this.energy = energy;
    // console.log(
    //   "New organism created. x = " + x + " y = " + y + " idParent = " + idParent
    // );
    add1Organism(this);
  }

  getNextGene() {
    if (this.gCounter + 1 === 64) {
      return this.genome[0];
    } else return this.genome[this.gCounter + 1];
  }

  move(x: number, y: number, direction: Direction) {
    const newCoords = getCoordsOfDirection(x, y, direction);

    // проверяем свободна ли клетка, куда хочет переместиться организм или что там находится
    const a = cellIsTaken(newCoords);
    if (a > 2) {
      // Если органика - 4, организм - 5, родня - 6, спора - 7, пусто - 2.
      // gCounter увеличивается на значение, которое записано в этом гене.
      // определить концепцию "родня". Несовпадение кол-ва ген? Ген коллективизация/одиночка.
      // Наследственная передача родственной связи.
      return a;
    } else {
      clearCell([x, y]);
      reserveMatrixCell(newCoords[0], newCoords[1], this.id, this.immune);
      this.x = newCoords[0];
      this.y = newCoords[1];
      return a;
    }
  }

  look(x: number, y: number, direction: Direction) {
    const newCoords = getCoordsOfDirection(x, y, direction);
    return cellIsTaken(newCoords);
  }

  fission(x: number, y: number, direction: Direction): 0 | 1 | 2 {
    const newXY = getCoordsOfDirection(x, y, direction);

    if (![0, 1, 2, 3, 4, 5, 6, 7].includes(direction)) {
      console.log(
        "FISSION direction =" +
          direction +
          " id =" +
          this.id +
          " genome = " +
          this.genome +
          " x = " +
          x +
          " y = " +
          y
      );
    }

    if (cellIsTaken(newXY) > 2) {
      // клетка была занята

      const freeXY = getFreeCell([x, y], direction);
      if (freeXY != null) {
        const id = new Organism(freeXY[0], freeXY[1], Organism.genomeMutation(this.genome)).id;

        reserveMatrixCell(freeXY[0], freeXY[1], id, true);
        // организм лежит в новом массиве организмов и во взаимодействии не участвует. Съесть и удалить его невозможно.
        // соответственно зарезервированный организм в матрице должен восприниматься как неуязвимый
        // можно ввести условие, что молодые организмы есть нельзя. Тогда в объекте организма в матрице появится новое поле -
        // возвраст, которое нужно будет перезаписывать каждый цикл
        return 1;
      } else {
        return 0;
      }
      // баг в том, что можно съесть организм с матрицы, но это не удаляет организм из массива
    } else {
      // клетка свободна
      // рождает в клетку по направлению

      const id = new Organism(newXY[0], newXY[1], Organism.genomeMutation(this.genome)).id;
      reserveMatrixCell(newXY[0], newXY[1], id, true);
      return 1;
    }
  }

  eat(direction: Direction): [number, number | null] {
    // if (direction > 7 || direction < 0)
    //   console.log(
    //     "direction =" +
    //       direction +
    //       " id =" +
    //       this.id +
    //       " genome = " +
    //       this.genome
    //   );

    let newCoords = getCoordsOfDirection(this.x, this.y, direction);
    const cellStatus = cellIsTaken(newCoords);
    // console.log(cellStatus + " " + this.id);

    switch (cellStatus) {
      case 4: // органика
        // console.log(cellStatus + " " + this.id + " case 4");
        try {
          clearCell(newCoords);
          return [30, null];
        } catch (e) {
          throw new Error(`Ошибка поедания организмом ${this.id}` + e);
        }

      case 5: // живой организм
        // console.log(cellStatus + " id = " + this.id + " case 5");
        try {
          const id = clearCell(newCoords);
          deleteOrganism(id);
          return [45, id];
        } catch (e) {
          throw new Error(`Ошибка поедания организмом ${this.id}` + e);
        }

      case 6: // родня
        return [0, null]; // родственников не едим

      default:
        // console.log(cellStatus + " " + this.id + " case default");
        return [0, null];
    }
  }

  exec(): [GridCell, number | null] {
    this.numberofTurns++;
    if (this.immune === true) this.immune = false;
    if (this.whoWasEaten !== null) this.whoWasEaten === null;
    // console.log(
    // "genome code = " +
    //   this.genome[this.gCounter] +
    // " id = " + this.id
    // " counter = " +
    // this.gCounter +
    // " E = " +
    // this.energy +
    // " direction = " +
    // this.direction
    // );
    let endofTurn = false;
    for (let i = 0; i < initialProperties.numberOfCommand && !endofTurn; i++) {
      endofTurn = this.runGenome();
    }

    if (this.gCounter > 63) this.gCounter = this.gCounter - 64;

    this.minerals += getMineralsEnergy(this.y);

    // блок исправления ошибок
    if (![0, 1, 2, 3, 4, 5, 6, 7].includes(this.direction)) {
      console.log(`исправлена ошибка направления direction=${this.direction} у ${this.toText()}`);

      this.direction = 0;
    }

    // 👶
    // деление возможно только при определенном кол-ве энергии. Кол-во детей зависит от кол-ва энергии
    if (this.energy > 110) {
      const result = this.fission(this.x, this.y, this.direction);

      if (result === 0) {
        // размножится не получилось, нет свободного места
        // console.log("размножится не получилось, нет свободного места");
        this.energy = this.energy - 5;
      }
      if (result === 1) {
        // получилось одно деление
        // console.log("один ребенок");
        this.energy = this.energy - 70;
      }
    }

    if (this.numberofTurns > 80) {
      this.isDead = true;
      this.color = Color.DEAD;
      this.id = -1;
      this.energy = 0;
    }

    if (this.energy > 400) {
      this.isDead = true;
      this.color = Color.DEAD;
      this.id = -1;
      this.energy = 0;
    }

    return [
      {
        x: this.x,
        y: this.y,
        isEmpty: false,
        organismId: this.id,
        isDead: this.isDead,
        color: this.color,
        energy: this.energy,
        immune: this.immune,
      },
      this.whoWasEaten,
    ];
  }

  runGenome() {
    if (this.gCounter > 63) this.gCounter = this.gCounter - 64;

    if (this.energy < 1) {
      this.isDead = true;
      this.color = Color.DEAD;
      this.id = -1;
      this.energy = 0;
      return true;
    }

    switch (this.genome[this.gCounter]) {
      case 23: // 🧭
        this.direction = (this.getNextGene() % 8) as Direction; // defines move direction
        // ошибка возникает, когда эта функция вызывается в конце массива ( в 63 гене)
        this.gCounter = this.gCounter + 2;
        this.energy--;
        // console.log("🧭");
        break;

      case 24: // 🧭
        this.direction = (this.direction + (this.getNextGene() % 8)) as Direction; // defines move direction
        if (this.direction > 7) this.direction = (this.direction - 8) as Direction;
        this.gCounter = this.gCounter + 2;
        this.energy--;
        break;

      case 25: //  🌞
        this.gCounter++;
        this.energy += getLightEnergy(this.y);
        this.energy--;
        // console.log("🌞");
        return true;

      case 26: //  🏃‍♀️
        try {
          this.direction = (this.getNextGene() % 8) as Direction;
          const counterShift = this.move(this.x, this.y, this.direction);
          this.gCounter += this.genome[this.gCounter + counterShift];
          // увеличиваем на значение гена на значение через counterShift
        } catch (e) {
          console.log(`case 26 direction =${this.direction} e = ${e}`);
        }
        this.energy = this.energy - 2;
        return true;

      case 27: //  🏃‍♀️
        try {
          const counterShift = this.move(this.x, this.y, this.direction);
          this.gCounter += this.genome[this.gCounter + counterShift]; // увеличиваем на значение гена на значение через counterShift
        } catch (e) {
          console.log(`case 27 direction =${this.direction} e = ${e}`);
        }
        this.energy = this.energy - 2;
        return true;

      case 28: // 🍴
        this.direction = (this.getNextGene() % 8) as Direction;
        try {
          const [energy, whoWasEaten] = this.eat(this.direction);
          this.energy += energy;
          this.whoWasEaten = whoWasEaten;
        } catch (e) {
          console.log(`case 28 direction =${this.direction} e = ${e}`);
        }
        this.gCounter++;
        return true;

      case 29: // 🍴
        try {
          const [e, id] = this.eat(this.direction);
          this.energy += e;
          this.whoWasEaten = id;
        } catch (e) {
          console.log(`case 29 direction =${this.direction} e = ${e}`);
        }
        this.gCounter++;
        return true;

      case 30: // 👀
        this.direction = (this.getNextGene() % 8) as Direction;
        try {
          const counterShift = this.look(this.x, this.y, this.direction);
          this.gCounter += this.genome[this.gCounter + counterShift]; // увеличиваем на значение гена на значение через counterShift
        } catch (e) {
          console.log(`case 30 direction =${this.direction} e = ${e}`);
        }
        this.energy--;
        break;

      case 31: // 👀
        try {
          const counterShift = this.look(this.x, this.y, this.direction);
          this.gCounter += this.genome[this.gCounter + counterShift]; // увеличиваем на значение гена на значение через counterShift
        } catch (e) {
          console.log(`case 31 direction =${this.direction} e = ${e}`);
        }
        this.energy--;
        break;

      // case 32:

      // break;

      case 47: // переработка минералов в энергию
        if (this.getNextGene() * 15 > this.energy) {
          this.gCounter = this.genome[this.gCounter + 2];
        } else {
          this.gCounter = this.genome[this.gCounter + 3];
        }
        this.energy += this.minerals;
        this.minerals = 0;
        return true;

      default:
        this.gCounter += this.genome[this.gCounter];
        // если ген стал равен 0, здесь превращаем его в фотосинтез
        if (this.genome[this.gCounter] == 0) this.genome[this.gCounter] = 25;
        // console.log("default option " + this.gCounter + " id = " + this.id);
        break;
    }

    // console.log("this.energy = " + this.energy);

    // налог на жизнь
    this.energy--;

    // console.log("Организм продолжает жить");

    return false;
  }

  toText() {
    return `id=${this.id} x=${this.x} y=${this.y} isDead=${this.isDead} genome=${this.genome} gCounter=${this.gCounter} E=${this.energy} minerals=${this.minerals} age=${this.numberofTurns}`;
  }
}

export default Organism;
// export Organism.getCoordsOfDirection
// export type Organism = typeof Organism;

// Мы создаем организм. Далее организм должен попасть в базу с организмами: последовательный массив.
// Далее мы будем итерироваться по массиву и выполнять действия каждого организма согласно геному.
// В конце каждого действия организм будет записывать новые данные в матрицу Playground.
// Так же в будущем организм должен будет получить данные из матрицы об источнике энергии и о расположении соседних организмов.
//
//
// 23 - изменить направление абсолютно
// 24 - изменить направление относительно
// 25 - фотосинтез
// 26 - перемещение в новом направлении
// 27 - перемещение согласно текущему направлению
// 28 - скушать в новом направлении
// 29 - скашать в текущем направлении
// 30 - посмотреть в новом направлении
// 31 - посмотреть в текущем направлении
// 32 - делиться энергией в новом направлении
// 33 - делиться энергией в текущем направлении
// 47 - узнать сколько энергии и сравнить с параметром. От результата зависит смещение gCounter. Преобразовывает минералы в энергию, если мало.
//
//
//
//
//
//
//
//
