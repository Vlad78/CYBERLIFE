import GridCell from '../components/GridCell'
import { deleteOrganism, getOrganismsArray } from '../state/organismsArray'
import { setMatrixCellDead, setMatrixCell } from '../state/playgroundMatrix'

const iteration = () => {
  const organisms = getOrganismsArray()
  const eatenCells: (number | null)[] = []

  for (let i = organisms.length - 1; i >= 0; i--) {
    if (!eatenCells.includes(organisms[i].id)) {
      const [gridCell, whoWasEaten] = organisms[i].exec()
      eatenCells.push(whoWasEaten)

      if (gridCell.isDead) {
        setMatrixCellDead(gridCell)
        deleteOrganism(gridCell.organismId)
      } else {
        setMatrixCell(gridCell)
      }
    }
  }
  return 1
}

export default iteration
