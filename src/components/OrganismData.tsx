import Organism from './Organism'

const OrganismData = ({ organism }: { organism: Organism }) => {
  return (
    <>
      <div>id: {organism.id}</div>
      <div>direction: {organism.direction}</div>
      <div>energy: {organism.energy}</div>
      <div>dead: {organism.isDead ? 'Yes' : 'No'}</div>
      <div>minerals: {organism.minerals}</div>
      <div>gCounter: {organism.gCounter}</div>
      <div>age: {organism.numberofTurns}</div>
      <div>color: {`${organism.colorCode.r} ${organism.colorCode.g} ${organism.colorCode.b}`}</div>
    </>
  )
}

export default OrganismData
