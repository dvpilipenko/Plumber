import { GameCommand } from './Stores/PlumberGameStore'

interface MessageResult {command: GameCommand, result: string[]}
export interface ImageParams {
  onLoad: () => void,
  width: number,
  height: number,
  url: string
}

export const parseGameMessage = (input: string): MessageResult => {
  const arr = input.split(':')
  return { command: arr[0] as GameCommand, result: arr.slice(1).map(item => item.trim()) }
}

export const createImage = (params:ImageParams): HTMLImageElement => {
  const image = new Image(params.width, params.height)
  image.src = `./assets/${params.url}`
  image.onload = params.onLoad
  return image
}

export const checkMarginMinMax = (currentMargin: number, min: number, max: number):number => {
  return currentMargin < min ? min : currentMargin > max ? max : currentMargin
}
