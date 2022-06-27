import initValues from '../functions/initialValueForPlayground'
import { initiatePlaygroundMatrix } from './playgroundMatrix'

const initialProperties = {
  speed: 1,
  colonies: 1,
  radiation: 18,
  minerals: 15,
  numberOfCommand: 6,
  matrixSize: [105, 60] as [number, number],
  initialPlayground: initValues([105, 60]),
  firstRun: true,
  init: false,
}

export function initialize() {
  initialProperties.init = true
}

export function getInitProps() {
  return initialProperties
}

export function endInitializing() {
  initialProperties.firstRun = false
  initiatePlaygroundMatrix(initialProperties.initialPlayground, initialProperties.matrixSize)
}

export default initialProperties
