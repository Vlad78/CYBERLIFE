import { useEffect, useState } from 'react'
import { coloniesInit } from '../functions/coloniesInit'
import iteration from '../functions/iteration'
import { endInitializing, getInitProps, initialize } from '../state/initialProperties'
import style from './Playground.module.scss'
import { getLightEnergy, getPGMatrix } from '../state/playgroundMatrix'
import { getOrganism } from '../state/organismsArray'
import OrganismGenes from './OrganismGenes'
import Organism from './Organism'
import Matrix from './Matrix'
import OrganismData from './OrganismData'

let mutex = false

function Playground() {
  let tsStart = new Date()
  let tsEnd = new Date()
  initialize()
  const initProps = getInitProps()
  if (initProps.firstRun) {
    coloniesInit(initProps.colonies, initProps.matrixSize)
    endInitializing()
    iteration()
  }

  const [nTurns, setnTurns] = useState({ turns: 0, time: new Date().getTime(), deltaTime: 0 })
  const playground = getPGMatrix()
  const [orgamismOnScreen, setOrgamismOnScreen] = useState<[Organism | undefined | null, HTMLDivElement | undefined]>([
    null,
    undefined,
  ])

  const aTurn = () => {
    tsStart = new Date()
    iteration()
    tsEnd = new Date()
    setnTurns((pr) => {
      const currentT = new Date().getTime()
      return { time: currentT, turns: pr.turns + 1, deltaTime: currentT - pr.time }
    })
  }

  const selectCell = (e: React.MouseEvent<HTMLElement>) => {
    const element = e.target as HTMLDivElement

    let organism = getOrganism(element.getAttribute('data-organism-id'))

    if (orgamismOnScreen[1] !== undefined) {
      orgamismOnScreen[1].classList.remove(style.isActive)
    }

    if (element.getAttribute('data-organism-id') !== '-1') element.classList.add(style.isActive)

    organism !== null ? setOrgamismOnScreen([organism, element]) : ''
  }

  const play = () => {
    mutex = true
    setnTurns((pr) => {
      const currentT = new Date().getTime()
      return { time: currentT, turns: pr.turns + 1, deltaTime: currentT - pr.time }
    })
  }
  const stop_ = () => (mutex = false)
  useEffect(() => {
    if (mutex) {
      var refreshId = setInterval(() => {
        tsStart = new Date()
        iteration()
        tsEnd = new Date()
        setnTurns((pr) => {
          const currentT = new Date().getTime()
          return { time: currentT, turns: pr.turns + 1, deltaTime: currentT - pr.time }
        })
      }, initProps.speed)
      return () => {
        clearInterval(refreshId)
      }
    }
  }, [nTurns])

  const gridSize = {
    gridTemplate: `repeat(${initProps.matrixSize[1]}, max(11px)) / repeat(${initProps.matrixSize[0]}, max(11px))`,
    width: `${11 * initProps.matrixSize[0]}px`,
    height: `${11 * initProps.matrixSize[1]}px`,
    gridAutoFlow: 'column',
  }

  return (
    <>
      <button onClick={aTurn}>Next turn</button>
      <button onClick={play}>Play</button>
      <button onClick={stop_}>Stop</button>
      <div style={{ display: 'inline-block' }}>
        {'  '}Number of turns: {nTurns.turns}
      </div>
      <div style={{ display: 'inline-block' }}>
        {'  '}Time to render: {nTurns.deltaTime}
      </div>
      <div style={{ display: 'inline-block' }}>
        {'  '}Time of calculation: {tsEnd!.getTime() - tsStart.getTime() + ' ms'}
      </div>
      <div className={style.body}>
        <div className={style.playground} style={gridSize}>
          <Matrix playground={playground} selectCell={selectCell} />
        </div>

        <div className={style.gene}>
          {orgamismOnScreen[0] != null ? <OrganismGenes organism={orgamismOnScreen[0]} /> : ''}
        </div>

        <div className={style.data}>
          {orgamismOnScreen[0] != null ? <OrganismData organism={orgamismOnScreen[0]} /> : ''}
        </div>
      </div>
      {}
    </>
  )
}

export default Playground
