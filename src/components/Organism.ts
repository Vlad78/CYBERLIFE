import {
  add1Organism,
  deleteOrganism,
  getOrganismsArray,
} from "../state/organismsArray";
import Color from "../properties/Color";
import newId from "./Id";
import GridCell from "./GridCell";
import {
  cellIsTaken,
  clearCell,
  getFreeCell,
  getLightEnergy,
  getMineralsEnergy,
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
  static genomeMutation = (genome: Genome) => {
    if (Math.floor(Math.random() * 4) === 0) {
      let geneIndex = Math.floor(Math.random() * 64);
      let geneValue = Math.floor(Math.random() * 64);
      genome[geneIndex] = geneValue;
      return genome;
    } else {
      return genome;
    }
  };

  id = newId();
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

  constructor(x: number, y: number, genome: Genome, energy?: number) {
    this.x = x;
    this.y = y;
    this.genome = genome;
    if (energy != undefined) this.energy = energy;
    console.log("New organism created. x = " + x + " y = " + y);
    add1Organism(this);
  }

  getNextGene() {
    return this.genome[this.gCounter + 1];
  }

  static getCoordsOfDirection(
    x: number,
    y: number,
    direction: Direction
  ): [number, number] {
    let newCoords: [number, number] | null = null;
    // prettier-ignore
    switch(direction) {
      case 0: newCoords = [x, y-1]; break
      case 1: newCoords = [x+1, y-1]; break
      case 2: newCoords = [x+1, y]; break
      case 3: newCoords = [x+1, y+1]; break
      case 4: newCoords = [x, y+1]; break
      case 5: newCoords = [x-1, y+1]; break
      case 6: newCoords = [x-1, y]; break
      case 7: newCoords = [x-1, y-1]; break
    } // prettier-ignore-end

    // проверяем выход организма за пределы матрицы. Поле сквозное
    if (newCoords[0] < 0) {
      newCoords[0] = getInitProps().matrixSize[0] + newCoords[0];
    }

    if (newCoords[1] < 0) {
      newCoords[1] = getInitProps().matrixSize[1] + newCoords[1];
    }

    if (newCoords[0] == getInitProps().matrixSize[0]) {
      newCoords[0] = 0;
    }

    if (newCoords[1] == getInitProps().matrixSize[1]) {
      newCoords[1] = 0;
    }

    return newCoords;
  }

  move(x: number, y: number, direction: Direction) {
    const newCoords = Organism.getCoordsOfDirection(x, y, direction);

    // проверяем свободна ли клетка, куда хочет переместиться организм или что там находится
    const a = cellIsTaken(newCoords);
    if (a > 2) {
      // Если органика - 4, организм - 5, родня - 6, пусто - 2.
      // gCounter увеличивается на значение, которое записано в этом гене.
      // определить концепцию "родня". Несовпадение кол-ва ген? Ген коллективизация/одиночка.
      // Наследственная передача родственной связи.
      return a;
    } else {
      clearCell([x, y]);
      this.x = newCoords[0];
      this.y = newCoords[1];
      return a;
    }
  }

  look(x: number, y: number, direction: Direction) {
    const newCoords = Organism.getCoordsOfDirection(x, y, direction);
    return cellIsTaken(newCoords);
  }

  fission(x: number, y: number, direction: Direction): 0 | 1 | 2 {
    const newCoords = Organism.getCoordsOfDirection(x, y, direction);
    const a = cellIsTaken(newCoords);
    if (a > 2) {
      const freeCoord = getFreeCell([x, y], direction);
      if (freeCoord != null) {
        new Organism(
          freeCoord[0],
          freeCoord[1],
          Organism.genomeMutation(this.genome)
        );
        return 1;
      } else return 0;
      // нужно нарисовать организм в матрице
    } else {
      new Organism(
        newCoords[0],
        newCoords[1],
        Organism.genomeMutation(this.genome)
      );
      // нужно нарисовать организм в матрице
      return 1;
    }
  }

  eat(direction: Direction) {
    // 1. получить информацию из клетки по направлению
    let newCoords = Organism.getCoordsOfDirection(this.x, this.y, direction);
    const cellStatus = cellIsTaken(newCoords);
    if (cellStatus > 2) {
      if (cellStatus === 4) {
        clearCell(newCoords); // удаляем из матрицы
        return 30;
      }
      if (cellStatus === 5) {
        const id = clearCell(newCoords);
        deleteOrganism(id);
        return 45;
      }
      if (cellStatus === 6) {
        return 0;
      } // пока что родственников не едим
    } else {
      return 0;
    }
    return 0;
  }

  exec() {
    this.numberofTurns++;
    console.log(
      "genome code = " + this.genome[this.gCounter] + " id = " + this.id
    );
    let endofTurn = false;
    for (let i = 0; i < initialProperties.numberOfCommand && !endofTurn; i++) {
      endofTurn = this.runGenome();
      // console.log("endofTurn = " + endofTurn + i);
    }

    this.minerals += getMineralsEnergy(this.y);

    // 👶
    // деление возможно только при определенном кол-ве энергии. Кол-во детей зависит от кол-ва энергии
    if (this.energy > 100) {
      const result = this.fission(this.x, this.y, this.direction);
      console.log("результат деления: " + result);

      if (result === 0) {
        // размножится не получилось, нет свободного места
        this.energy = this.energy - 8;
      }
      if (result === 1) {
        // получилось одно деление
        this.energy = this.energy - 70;
      }
    }

    return {
      x: this.x,
      y: this.y,
      isEmpty: false,
      organismId: this.id,
      isDead: this.isDead,
      color: this.color,
    } as GridCell;
  }

  runGenome() {
    // console.log("counter = " + this.gCounter);

    switch (this.genome[this.gCounter]) {
      case 23: // 🧭
        this.direction = (this.getNextGene() % 8) as Direction; // defines move direction
        this.gCounter = this.gCounter + 2;
        this.energy--;
        break;

      case 24: // 🧭
        this.direction = (this.direction +
          (this.getNextGene() % 8)) as Direction; // defines move direction
        if (this.direction > 8)
          this.direction = (this.direction - 8) as Direction;
        this.gCounter = this.gCounter + 2;
        this.energy--;
        break;

      case 25: //  🌞
        this.gCounter++;
        this.energy += getLightEnergy(this.y);
        // console.log("PHSys");
        return true;

      case 26: //  🏃‍♀️
        this.direction = (this.getNextGene() % 8) as Direction;
        const counterShift0 = this.move(this.x, this.y, this.direction);
        this.gCounter += this.genome[this.gCounter + counterShift0]; // увеличиваем на значение гена на значение через counterShift
        this.energy--;
        return true;

      case 27: //  🏃‍♀️
        const counterShift1 = this.move(this.x, this.y, this.direction);
        this.gCounter += this.genome[this.gCounter + counterShift1]; // увеличиваем на значение гена на значение через counterShift
        this.energy--;
        return true;

      case 28: // 🍴
        this.direction = (this.getNextGene() % 8) as Direction;
        const energy = this.eat(this.direction);
        this.energy += energy;
        this.gCounter++;
        return true;

      case 29: // 🍴
        const energy1 = this.eat(this.direction);
        this.energy += energy1;
        this.gCounter++;
        return true;

      case 30: // 👀
        this.direction = (this.getNextGene() % 8) as Direction;
        const counterShift2 = this.look(this.x, this.y, this.direction);
        this.gCounter += this.genome[this.gCounter + counterShift2]; // увеличиваем на значение гена на значение через counterShift
        this.energy--;
        break;

      case 31: // 👀
        const counterShift3 = this.look(this.x, this.y, this.direction);
        this.gCounter += this.genome[this.gCounter + counterShift3]; // увеличиваем на значение гена на значение через counterShift
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
        break;

      default:
        this.gCounter += this.genome[this.gCounter];
        console.log("default option " + this.gCounter);
        break;
    }

    if (this.gCounter > 63) {
      this.gCounter = this.gCounter - 64;
    }

    // console.log("this.energy = " + this.energy);

    if (this.energy < 1) {
      // организм умирает
      // console.log("организм умирает");
      this.isDead = true;
      this.color = Color.DEAD;
      this.id = -1;
      return true;
    } else {
      // налог на жизнь
      this.energy--;
    }

    // console.log("Организм продолжает жить");

    return false;
  }
}

export default Organism;
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
