import Organism from '../components/Organism'

const organismsArray: Organism[] = []

export const getOrganismsArray = () => {
  return [...organismsArray]
}

export const add1Organism = (o: Organism) => {
  organismsArray.unshift(o)
}

export const deleteOrganism = (id: number) => {
  let mutex = true
  for (let i = 0; i < organismsArray.length && mutex; i++) {
    if (organismsArray[i].id === id) {
      organismsArray.splice(i, 1)
      mutex = false
      break
    }
  }

  if (mutex) throw new Error(`ошибка удаления организма ${id} из массива`)
}

export const getOrganism = (id: number | string | null) => {
  if (id === -1) return null
  if (id === '-1') return null
  if (id === '') return null
  if (id === null) return null
  if (id === undefined) return null

  let id_: number

  typeof id === 'string' ? (id_ = Number(id)) : (id_ = id)

  for (let i = 0; i < organismsArray.length; i++) {
    if (organismsArray[i].id === id_) {
      return organismsArray[i]
    }
  }

  throw new Error(
    `Организм ${id} не был найден в массиве, возможно, организм уже умер. id=${id}, typeof id=${typeof id}`,
  )
}
