import GridCell from '../components/GridCell'
import Color from '../properties/Color'

const initValues = (pair: [number, number], colonies = 4) => {
  console.log('initializing of matrix')

  let initialValue: GridCell[][] = []
  let column: GridCell[] = []
  let id = 0
  for (let iX = 0; iX < pair[0]; iX++) {
    for (let iY = 0; iY < pair[1]; iY++) {
      column.push({
        id: id++,
        x: iX,
        y: iY,
        isEmpty: true,
        isDead: false,
        color: Color.EMPTY,
        organismId: -1,
        immune: false,
      })
    }
    initialValue.push(column)
    column = []
  }

  return initialValue
}

export default initValues
