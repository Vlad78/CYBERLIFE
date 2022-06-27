import { add1Organism, deleteOrganism } from '../state/organismsArray'
import Color from '../properties/Color'
import newId from './Id'
import GridCell from './GridCell'
import {
  cellIsTaken,
  clearCell,
  getCoordsOfDirection,
  getFreeCell,
  getLightEnergy,
  getMineralsEnergy,
  reserveMatrixCell,
} from '../state/playgroundMatrix'
import initialProperties from '../state/initialProperties'

export type Direction = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export type Genome = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
]
export type colorCode = { r: number; g: number; b: number }

class Organism {
  static genomeMutation = (g: Genome): Genome => {
    const genome = [...g]
    if (Math.floor(Math.random() * 4) === 0) {
      let geneIndex = Math.floor(Math.random() * 64)
      let geneValue = Math.floor(Math.random() * 64)
      genome[geneIndex] = geneValue

      return genome as Genome
    } else {
      return genome as Genome
    }
  }

  id
  x
  y
  isDead = false
  genome: Genome
  gCounter = 0
  energy = 50
  minerals = 50
  direction = 0 as Direction
  color = Color.IMMUNE
  colorCode: colorCode
  numberofTurns = 0
  immune = true
  whoWasEaten: number | null = null

  constructor(x: number, y: number, genome: Genome, colorCode: colorCode, energy?: number, idParent?: number) {
    this.x = x
    this.y = y
    this.genome = genome
    this.id = newId()
    if (energy != undefined) this.energy = energy
    this.colorCode = colorCode

    add1Organism(this)
  }

  getColor(code: colorCode) {
    const r = code.r
    const g = code.g
    const b = code.b

    let sum = r + g + b
    let r_ = Math.round(Number((r / sum).toFixed(2)) * 100)
    let g_ = Math.round(Number((g / sum).toFixed(2)) * 100)
    let b_ = Math.round(Number((b / sum).toFixed(2)) * 100)

    let sumFractions = r_ + g_ + b_
    if (sumFractions === 99) {
      if (r_ >= g_ && r_ >= b_) {
        r_++
      } else if (g_ >= r_ && g_ >= b_) {
        g_++
      } else if (b_ >= g_ && b_ >= r_) {
        b_++
      }
    }
    if (sumFractions === 101) {
      if (r_ >= g_ && r_ >= b_) {
        r_--
      } else if (g_ >= r_ && g_ >= b_) {
        g_--
      } else if (b_ >= g_ && b_ >= r_) {
        b_--
      }
    }

    if (sumFractions > 101)
      throw new Error(
        `getColor: сумма долей больше их целого числа (100) id=${this.id}, sumFractions=${sumFractions} r=${r} g=${g} b=${b} r_=${r_} g_=${g_} b_=${b_}`,
      )

    const arr = []
    let count = 0
    label: while (arr.length < 5) {
      count++
      if (r_ - 20 > 0) {
        r_ = r_ - 20
        arr.push('r')
      }
      if (g_ - 20 > 0) {
        g_ = g_ - 20
        arr.push('g')
      }
      if (b_ - 20 > 0) {
        b_ = b_ - 20
        arr.push('b')
      }
      if (r_ + g_ + b_ <= 40) {
        if (r_ > g_ && r_ > b_) {
          r_ = r_ - 20
          arr.push('r')
          continue label
        }
        if (g_ > r_ && g_ > b_) {
          g_ = g_ - 20
          arr.push('g')
          continue label
        }
        if (b_ > g_ && b_ > r_) {
          b_ = b_ - 20
          arr.push('b')
          continue label
        }

        if (r_ === g_) arr.push('r')
        if (r_ === b_) arr.push('b')
        if (b_ === g_) arr.push('g')
        continue label
      }
      if (r_ === g_ && r_ === b_ && g_ === b_) {
        arr.push('r', 'g', 'b')
      }

      if (count > 10)
        throw new Error(
          `прерывание бесконечного цикла у ${this.id}, sumFractions=${sumFractions} r=${r} g=${g} b=${b} r_=${r_} g_=${g_} b_=${b_} arr=${arr}`,
        )
    }

    arr.sort()
    switch (arr.toString()) {
      case 'b,b,b,b,b':
        return Color.BBBBB
      case 'b,b,b,b,g':
        return Color.BBBBG
      case 'b,b,b,g,g':
        return Color.BBBGG
      case 'b,b,g,g,g':
        return Color.BBGGG
      case 'b,g,g,g,g':
        return Color.BGGGG
      case 'g,g,g,g,g':
        return Color.GGGGG
      case 'g,g,g,g,r':
        return Color.GGGGR
      case 'g,g,g,r,r':
        return Color.GGGRR
      case 'g,g,r,r,r':
        return Color.GGRRR
      case 'g,r,r,r,r':
        return Color.GRRRR
      case 'r,r,r,r,r':
        return Color.RRRRR
      case 'b,b,b,b,r':
        return Color.BBBBR
      case 'b,b,b,r,r':
        return Color.BBBRR
      case 'b,b,r,r,r':
        return Color.BBRRR
      case 'b,r,r,r,r':
        return Color.BRRRR

      case 'b,b,b,g,r':
        return Color.BBBGR
      case 'b,b,g,r,r':
        return Color.BBGRR
      case 'b,g,r,r,r':
        return Color.BGRRR

      case 'b,b,g,g,r':
        return Color.BBGGR
      case 'b,g,g,r,r':
        return Color.BGGRR

      case 'b,g,g,g,r':
        return Color.BGGGR
      default:
        throw new Error(
          `ошибка определения цвета у ${
            this.id
          }, sumFractions=${sumFractions} r=${r} g=${g} b=${b} r_=${r_} g_=${g_} b_=${b_} arr=${arr.toString()}`,
        )
    }
  }

  getNextGene() {
    if (this.gCounter + 1 === 64) {
      return this.genome[0]
    } else return this.genome[this.gCounter + 1]
  }

  move(x: number, y: number, direction: Direction) {
    const newCoords = getCoordsOfDirection(x, y, direction)

    const a = cellIsTaken(newCoords)
    if (a > 2) {
      return a
    } else {
      clearCell([x, y])
      reserveMatrixCell(newCoords[0], newCoords[1], this.id, this.immune)
      this.x = newCoords[0]
      this.y = newCoords[1]
      return a
    }
  }

  look(x: number, y: number, direction: Direction) {
    const newCoords = getCoordsOfDirection(x, y, direction)
    return cellIsTaken(newCoords)
  }

  fission(x: number, y: number, direction: Direction, colorCode: colorCode): 0 | 1 | 2 {
    const newXY = getCoordsOfDirection(x, y, direction)

    if (![0, 1, 2, 3, 4, 5, 6, 7].includes(direction)) {
      throw new Error(
        'FISSION direction =' + direction + ' id =' + this.id + ' genome = ' + this.genome + ' x = ' + x + ' y = ' + y,
      )
    }

    if (cellIsTaken(newXY) > 2) {
      const freeXY = getFreeCell([x, y], direction)
      if (freeXY != null) {
        const id = new Organism(freeXY[0], freeXY[1], Organism.genomeMutation(this.genome), {
          ...colorCode,
        }).id

        reserveMatrixCell(freeXY[0], freeXY[1], id, true)
        return 1
      } else {
        return 0
      }
    } else {
      const id = new Organism(newXY[0], newXY[1], Organism.genomeMutation(this.genome), {
        ...colorCode,
      }).id
      reserveMatrixCell(newXY[0], newXY[1], id, true)
      return 1
    }
  }

  eat(direction: Direction): [number, number | null] {
    let newCoords = getCoordsOfDirection(this.x, this.y, direction)
    const cellStatus = cellIsTaken(newCoords)

    switch (cellStatus) {
      case 4:
        try {
          clearCell(newCoords)
          return [30, null]
        } catch (e) {
          throw new Error(`Ошибка поедания организмом ${this.id}` + e)
        }

      case 5:
        try {
          const id = clearCell(newCoords)
          deleteOrganism(id)
          return [35, id]
        } catch (e) {
          throw new Error(`Ошибка поедания организмом ${this.id}` + e)
        }

      case 6:
        return [0, null]

      default:
        return [0, null]
    }
  }

  exec(): [GridCell, number | null] {
    this.numberofTurns++
    if (this.immune === true) this.immune = false
    if (this.whoWasEaten !== null) this.whoWasEaten === null

    let endofTurn = false
    for (let i = 0; i < initialProperties.numberOfCommand && !endofTurn; i++) {
      endofTurn = this.runGenome()
    }

    if (this.gCounter > 63) this.gCounter = this.gCounter - 64

    this.minerals += getMineralsEnergy(this.y)

    this.color = this.getColor(this.colorCode)

    if (this.energy > 150) {
      const result = this.fission(this.x, this.y, this.direction, this.colorCode)

      if (result === 0) {
        this.energy = this.energy - 6
      }
      if (result === 1) {
        this.energy = this.energy - 90
      }
    }

    if (this.numberofTurns > 110) {
      this.isDead = true
      this.color = Color.DEAD
      this.id = -1
      this.energy = 0
    }

    if (this.energy > 325 || this.energy < 1) {
      this.isDead = true
      this.color = Color.DEAD
      this.id = -1
      this.energy = 0
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
    ]
  }

  runGenome() {
    if (this.gCounter > 63) this.gCounter = this.gCounter - 64

    if (this.energy < 1) {
      return true
    }

    switch (this.genome[this.gCounter]) {
      case 23:
        this.direction = (this.getNextGene() % 8) as Direction
        this.gCounter = this.gCounter + 2
        this.energy--
        break

      case 24:
        this.direction = (this.direction + (this.getNextGene() % 8)) as Direction
        if (this.direction > 7) this.direction = (this.direction - 8) as Direction
        this.gCounter = this.gCounter + 2
        this.energy--
        break

      case 25:
        this.gCounter++
        this.energy += getLightEnergy(this.y)
        this.energy--
        this.colorCode.b > 0 ? this.colorCode.b-- : false
        this.colorCode.r > 0 ? this.colorCode.r-- : false
        this.colorCode.g <= 98 ? (this.colorCode.g = this.colorCode.g + 2) : false
        return true

      case 26:
        try {
          this.direction = (this.getNextGene() % 8) as Direction
          const counterShift = this.move(this.x, this.y, this.direction)
          this.gCounter += this.genome[this.gCounter + counterShift]
        } catch (e) {
          console.log(`case 26 direction =${this.direction} e = ${e}`)
        }
        this.energy = this.energy - 2
        return true

      case 27:
        try {
          const counterShift = this.move(this.x, this.y, this.direction)
          this.gCounter += this.genome[this.gCounter + counterShift]
        } catch (e) {
          console.log(`case 27 direction =${this.direction} e = ${e}`)
        }
        this.energy = this.energy - 2
        return true

      case 28:
        this.direction = (this.getNextGene() % 8) as Direction
        try {
          const [energy, whoWasEaten] = this.eat(this.direction)
          this.energy += energy
          this.whoWasEaten = whoWasEaten
          this.colorCode.g > 0 ? this.colorCode.g-- : false
          this.colorCode.b > 0 ? this.colorCode.b-- : false
          this.colorCode.r <= 98 ? (this.colorCode.r = this.colorCode.r + 2) : false
        } catch (e) {
          console.log(`case 28 direction =${this.direction} e = ${e}`)
        }
        this.gCounter++
        return true

      case 29:
        try {
          const [e, id] = this.eat(this.direction)
          this.energy += e
          this.whoWasEaten = id
          this.colorCode.g > 0 ? this.colorCode.g-- : false
          this.colorCode.b > 0 ? this.colorCode.b-- : false
          this.colorCode.r <= 98 ? (this.colorCode.r = this.colorCode.r + 2) : false
        } catch (e) {
          console.log(`case 29 direction =${this.direction} e = ${e}`)
        }
        this.gCounter++
        return true

      case 30:
        this.direction = (this.getNextGene() % 8) as Direction
        try {
          const counterShift = this.look(this.x, this.y, this.direction)
          this.gCounter += this.genome[this.gCounter + counterShift]
        } catch (e) {
          console.log(`case 30 direction =${this.direction} e = ${e}`)
        }
        this.energy--
        break

      case 31:
        try {
          const counterShift = this.look(this.x, this.y, this.direction)
          this.gCounter += this.genome[this.gCounter + counterShift]
        } catch (e) {
          console.log(`case 31 direction =${this.direction} e = ${e}`)
        }
        this.energy--
        break

      case 47:
        if (this.getNextGene() * 10 > this.energy) {
          this.gCounter = this.genome[this.gCounter + 2]
        } else {
          this.gCounter = this.genome[this.gCounter + 3]
        }
        this.energy += this.minerals
        this.minerals = 0
        this.colorCode.g > 0 ? this.colorCode.g-- : false
        this.colorCode.r > 0 ? this.colorCode.r-- : false
        this.colorCode.b <= 98 ? (this.colorCode.b = this.colorCode.b + 2) : false
        return true

      default:
        this.gCounter += this.genome[this.gCounter]
        if (this.genome[this.gCounter] == 0) this.genome[this.gCounter] = 25
        break
    }

    this.energy = this.energy - 2

    return false
  }

  toText() {
    return `id=${this.id} x=${this.x} y=${this.y} isDead=${this.isDead} genome=${this.genome} gCounter=${this.gCounter} E=${this.energy} minerals=${this.minerals} age=${this.numberofTurns}`
  }
}

export default Organism
