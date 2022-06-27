import Organism, { Genome } from './Organism'
import style from './Playground.module.scss'

const OrganismGenes = ({ organism }: { organism: Organism | null | undefined }) => {
  if (organism === null || organism === undefined) return <div></div>

  const genome = organism.genome

  return (
    <>
      {genome.map((e, i) => (
        <div className={style.gene__gridElement} key={i} style={organism.gCounter === i ? { background: 'white' } : {}}>
          {genome[i]}
        </div>
      ))}
    </>
  )
}

export default OrganismGenes
