import { PlumberStores } from './Context'
import { PlumberGameStore } from './PlumberGameStore'
import { ResourceStore } from './ResourceStore'

const plumberImages = [
  '╋.jpg',
  '┫.jpg',
  '┣.jpg',
  '┻.jpg',
  '┳.jpg',
  '╹.jpg',
  '╺.jpg',
  '╻.jpg',
  '╸.jpg',
  '┓.jpg',
  '┏.jpg',
  '┗.jpg',
  '┛.jpg',
  '━.jpg',
  '┃.jpg']

export const CreatePlumberStores = (socketUrl: string) : PlumberStores => {
  const gameStore = new PlumberGameStore(socketUrl)
  const resourceStore = new ResourceStore(plumberImages)

  return {
    gameStore,
    resourceStore
  }
}
